import { z } from "zod";

const envSchema = z.object({
  // Public environment variables
  NEXT_PUBLIC_CELO_RPC_URL: z.string().url(),
  NEXT_PUBLIC_CHAIN_ID: z.string(),
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_SELF_PROTOCOL_APP_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_GOODDOLLAR_ENV: z.enum(["development", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_CUSD_TOKEN_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Server-side only variables
  DATABASE_URL: z.string().optional(),
  THIRDWEB_SECRET_KEY: z.string().optional(),
  SELF_PROTOCOL_SECRET: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    // Public vars
    NEXT_PUBLIC_CELO_RPC_URL: process.env.NEXT_PUBLIC_CELO_RPC_URL,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    NEXT_PUBLIC_SELF_PROTOCOL_APP_ID: process.env.NEXT_PUBLIC_SELF_PROTOCOL_APP_ID,
    NEXT_PUBLIC_GOODDOLLAR_ENV: process.env.NEXT_PUBLIC_GOODDOLLAR_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_BENEFITS_POOL_CONTRACT_ADDRESS,
    NEXT_PUBLIC_CUSD_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_CUSD_TOKEN_ADDRESS,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Server vars
    DATABASE_URL: process.env.DATABASE_URL,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    SELF_PROTOCOL_SECRET: process.env.SELF_PROTOCOL_SECRET,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv();
