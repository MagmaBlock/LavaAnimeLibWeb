import type { TokenPayload } from "~/server/types/token";
import type { Authentication } from "./authentication/interface";
import { JwtAuthentication } from "./authentication/jwt";

export class TokenService {
  private authentication: Authentication;
  constructor(jwtSecret: string) {
    this.authentication = new JwtAuthentication(jwtSecret);
  }

  /**
   * 签发一个新的 Token
   * @param payload 被签名的内容
   * @returns
   */
  signToken(payload: TokenPayload): string {
    return this.authentication.sign(payload);
  }

  /**
   * 传入有效 Token，获取相同 Payload 但续期的 Token
   * @param token
   * @returns
   */
  renewToken(token: string): string | null {
    let payload = this.authentication.verify(token);

    // 如果 token 已过期
    if (payload === null) {
      return null;
    }

    // 续期的 token
    let newToken = this.authentication.sign(payload);
    return newToken;
  }

  /**
   * 此方法判断 Token 有效性并返回有类型的 Payload
   * @param token
   * @returns
   */
  readTokenPayload(token: string): TokenPayload | null {
    let payload = this.authentication.verify(token);
    if (payload === null) return null;
    else {
      return <TokenPayload>payload;
    }
  }
}
