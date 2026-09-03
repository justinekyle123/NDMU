import { promisify } from "node:util";
import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const DUMMY_SALT = "ndmu-login-dummy-salt";
const DUMMY_KEY = Buffer.alloc(KEY_LENGTH);

function parsePasswordHash(passwordHash: string | null) {
  if (!passwordHash) {
    return null;
  }

  const [algorithm, salt, keyHex] = passwordHash.split(":");
  if (algorithm !== "scrypt" || !salt || !keyHex || !/^[a-f0-9]+$/i.test(keyHex)) {
    return null;
  }

  const storedKey = Buffer.from(keyHex, "hex");
  return storedKey.length === KEY_LENGTH ? { salt, storedKey } : null;
}

export async function verifyPassword(
  password: string,
  passwordHash: string | null,
) {
  const parsedHash = parsePasswordHash(passwordHash);
  const derivedKey = (await scrypt(
    password,
    parsedHash?.salt ?? DUMMY_SALT,
    KEY_LENGTH,
  )) as Buffer;
  const expectedKey = parsedHash?.storedKey ?? DUMMY_KEY;

  return timingSafeEqual(derivedKey, expectedKey) && parsedHash !== null;
}
