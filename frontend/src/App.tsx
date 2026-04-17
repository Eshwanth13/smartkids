import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorldMap from './pages/WorldMap';
import GamePage from './pages/Game';
import Login from './pages/Login';
import ParentDashboard from './pages/ParentDashboard';
import AddChild from './pages/AddChild';
import Signup from './pages/Signup';
import SubjectSelection from './pages/SubjectSelection';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/subjects" element={<SubjectSelection />} />
        <Route path="/world-map/:subject" element={<WorldMap />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/add-child" element={<AddChild />} />
        <Route path="/game/:levelId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
