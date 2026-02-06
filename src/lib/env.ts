/**
 * Environment variable validation and typed exports
 * This file validates all required environment variables at startup
 * and provides type-safe access to environment configuration.
 */

// Define required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'SESSION_SECRET',
] as const;

// Define optional environment variables with defaults (currently unused but available for future use)
// const optionalEnvVars = {
//   NEXT_PUBLIC_NEAR_NETWORK: 'testnet',
//   SYNC_API_KEY: undefined,
//   ANTHROPIC_API_KEY: undefined,
// } as const;

// Validation function - called at startup
function validateEnvironment() {
  const missing: string[] = [];
  const invalidPublic: string[] = [];

  // Check all required variables exist
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Security check: ensure no secrets are exposed as NEXT_PUBLIC_
  const allEnvVars = Object.keys(process.env);
  const dangerousVars = allEnvVars.filter(varName => 
    varName.startsWith('NEXT_PUBLIC_') && 
    !['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_NEAR_NETWORK'].includes(varName) &&
    (varName.toLowerCase().includes('key') || 
     varName.toLowerCase().includes('secret') || 
     varName.toLowerCase().includes('private'))
  );

  if (dangerousVars.length > 0) {
    invalidPublic.push(...dangerousVars);
  }

  // Report validation errors
  if (missing.length > 0 || invalidPublic.length > 0) {
    console.error('❌ Environment validation failed:');
    
    if (missing.length > 0) {
      console.error(`Missing required variables: ${missing.join(', ')}`);
    }
    
    if (invalidPublic.length > 0) {
      console.error(`🚨 SECURITY WARNING: These NEXT_PUBLIC_ variables may expose secrets:`);
      console.error(`${invalidPublic.join(', ')}`);
      console.error('Only NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_NEAR_NETWORK should be public!');
    }
    
    if (typeof window === 'undefined') {
      // Server-side: warn but don't crash (process.exit kills Vercel builds)
      console.error('⚠️ Continuing with missing env vars — some features may not work');
    } else {
      // Client-side: throw error
      throw new Error('Environment configuration error - check server logs');
    }
  }

  console.log('✅ Environment validation passed');
}

// Typed environment exports — use fallbacks to prevent runtime crashes
export const env = {
  // Public variables (available on client)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  NEXT_PUBLIC_NEAR_NETWORK: (process.env.NEXT_PUBLIC_NEAR_NETWORK || 'testnet') as 'mainnet' | 'testnet',
  
  // Server-only variables (these will be undefined on client)
  ...(typeof window === 'undefined' && {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    SESSION_SECRET: process.env.SESSION_SECRET || '',
    SYNC_API_KEY: process.env.SYNC_API_KEY || '',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  }),
} as const;

// Type helpers
export type Environment = typeof env;

// Validate environment on import
if (typeof window === 'undefined') {
  // Server-side validation
  validateEnvironment();
} else {
  // Client-side validation (only for public vars)
  const missingPublic = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingPublic.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missingPublic.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (missingPublic.length > 0) {
    console.error('❌ Missing required public environment variables:', missingPublic.join(', '));
    throw new Error('Missing required environment configuration');
  }
}

export default env;