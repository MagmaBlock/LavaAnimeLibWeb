import { Sha256Password } from "./sha256";

/**
 * 本接口描述了一种被非对称加密算法加密的密码
 */
export interface EncryptedPassword {
  /*
   * 加密方法的标识符
   */
  readonly encryptionMethod: string;

  /**
   * 加密密码
   */
  encrypt(password: string): void;

  /**
   * 验证密码
   */
  verify(password: string): boolean;

  /**
   * 序列化为字符串
   */
  serialize(): string;
}

/**
 * 一个工厂函数，根据传入的加密算法类型，返回对应的加密密码实例。
 */
export function encryptedPasswordFactory(
  serialized?: string
): EncryptedPassword {
  if (serialized) {
    const [method] = serialized.split(":");
    switch (method) {
      case "sha256":
        return Sha256Password.deserialize(serialized);
      // 可以在这里添加其他加密方法的支持
      default:
        throw new Error("Unsupported encryption method");
    }
  }
  return new Sha256Password();
}
