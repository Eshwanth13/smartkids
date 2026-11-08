import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

const aiEnvSchema = z.object({
  OPENROUTER_API_KEY: z.string().optional().default(''),
  OPENROUTER_BASE_URL: z.string().url().default('https://openrouter.ai/api/v1'),
  OPENROUTER_MODEL_PRIMARY: z.string().default('nvidia/nemotron-3-ultra-550b-a55b:free'),
  OPENROUTER_MODEL_FALLBACK: z.string().default('nvidia/nemotron-3.5-lightning:free'),
  OPENROUTER_MODEL_LAST_RESORT: z.string().default('openrouter/free'),
  AI_INSIGHTS_CACHE_HOURS: z.coerce.number().positive().default(24),
  AI_INSIGHTS_TIMEOUT_MS: z.coerce.number().positive().default(30000),
});

const parsed = aiEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('⚠️  AI config validation warnings:', parsed.error.flatten().fieldErrors);
}

export const aiConfig = parsed.success ? parsed.data : aiEnvSchema.parse({});

export const hasOpenRouterKey = (): boolean => {
  return !!(aiConfig.OPENROUTER_API_KEY && aiConfig.OPENROUTER_API_KEY.trim().length > 0);
};
