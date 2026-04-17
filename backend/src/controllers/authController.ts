import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Register parent
// @route   POST /api/v1/auth/register-parent
export const registerParent = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'parent'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Login parent
// @route   POST /api/v1/auth/login-parent
export const loginParent = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password || ''))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Create child account
// @route   POST /api/v1/auth/create-child
export const createChild = async (req: AuthRequest, res: Response) => {
  const { name, pin } = req.body;

  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  const child = await User.create({
    name,
    pin, // Store plain for simplicity in prototype, or hash if requested
    role: 'child',
    parentId: req.user._id,
    avatar: '/assets/mascot/zappy_happy.png'
  });

  res.status(201).json(child);
};

// @desc    Login child with PIN
// @route   POST /api/v1/auth/login-child
export const loginChild = async (req: Request, res: Response) => {
  const { name, pin } = req.body;

  const child = await User.findOne({ name, pin, role: 'child' });

  if (child) {
    res.json({
      _id: child._id,
      name: child.name,
      role: child.role,
      parentId: child.parentId,
      xp: child.xp,
      coins: child.coins,
      progress: child.progress,
      token: generateToken(child._id.toString()),
    });
  } else {
    res.status(401).json({ message: 'Invalid name or PIN' });
  }
};
