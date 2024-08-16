/**
 * 此接口描述了一种对数据进行可信签名并可验证内容是否被窜改的验证算法。
 */
export interface Token {
  /**
   * 提供资源，将签发一个 token
   * @param userId
   */
  sign(resource: any): string;

  /**
   * 验证一个 token，取得其对应的资源
   * @param token
   */
  verify(token: string): any | null;
}
