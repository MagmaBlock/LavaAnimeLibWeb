/**
 * 此接口描述了一种通过加密和解密验证身份的方式。
 */
export interface Authentication {
  /**
   * 提供资源，将签发一个 token
   * @param userId
   */
  sign(resource: any): string | null;

  /**
   * 验证一个 token，取得其对应的资源
   * @param token
   */
  verify(token: string): any | null;
}
