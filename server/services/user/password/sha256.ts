import { createHash } from "crypto";
import type { EncryptedPassword } from "./interface";

/**
 * Sha256 密码实现
 */
export class Sha256Password implements EncryptedPassword {
  readonly encryptionMethod: string = "sha256";
  private salt?: string;
  private hashedPassword?: string;

  constructor(salt?: string, hashedPassword?: string) {
    this.salt = salt;
    this.hashedPassword = hashedPassword;
  }

  private generateNewSalt(): string {
    let ts = new Date().getTime();
    let random = Math.random();
    let salt = (ts * random).toString();
    let sha1 = createHash("sha1").update(salt).digest("hex");
    return sha1.slice(0, 16);
  }

  encrypt(password: string): void {
    this.salt = this.generateNewSalt();
    this.hashedPassword = createHash("sha256")
      .update(password + this.salt)
      .digest("hex");
  }

  verify(password: string): boolean {
    if (!this.salt || !this.hashedPassword) {
      return false;
    }
    const hashedPassword = createHash("sha256")
      .update(password + this.salt)
      .digest("hex");
    return this.hashedPassword === hashedPassword;
  }

  serialize(): string {
    if (!this.salt || !this.hashedPassword) {
      throw new Error("Password not set");
    }
    return `${this.encryptionMethod}:${this.salt}:${this.hashedPassword}`;
  }

  static deserialize(serialized: string): EncryptedPassword {
    const [method, salt, hashedPassword] = serialized.split(":");
    if (method !== "sha256" || !salt || !hashedPassword) {
      throw new Error("Invalid serialized string");
    }
    return new Sha256Password(salt, hashedPassword);
  }
}
