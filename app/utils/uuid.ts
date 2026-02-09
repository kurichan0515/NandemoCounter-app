import { v4 as uuidv4 } from 'uuid';

/**
 * UUID v4を生成する
 */
export function generateUUID(): string {
  return uuidv4();
}
