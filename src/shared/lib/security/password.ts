/**
 * Password Security Utilities
 * Uses Web Crypto API for hashing (works in both browser and server)
 */

const SALT_LENGTH = 16;
const HASH_ALGORITHM = "SHA-256";
const ITERATIONS = 100000;

/**
 * Generate a cryptographic salt
 */
function generateSalt(): string {
  const salt = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(salt);
  return Array.from(salt, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Derive key using PBKDF2
 */
async function deriveKey(
  password: string,
  salt: string,
  iterations: number = ITERATIONS
): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    256
  );

  // Convert to hex string
  return Array.from(new Uint8Array(derivedBits), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

/**
 * Hash a password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const hash = await deriveKey(password, salt);
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const computedHash = await deriveKey(password, salt);
  return computedHash === hash;
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
