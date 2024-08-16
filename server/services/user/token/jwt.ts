import { createHmac } from "crypto";
import moment from "moment";
import type { Token } from "./interface";

export class JwtToken implements Token {
  private secret: string;
  private header: object;

  constructor(secret: string) {
    this.secret = secret;

    this.header = {
      alg: "HS256",
      typ: "JWT",
    };
  }

  sign(resource: any): string {
    let base64Header = Base64Url.encode(JSON.stringify(this.header));
    let base64Payload = Base64Url.encode(
      JSON.stringify(<JWTAuthPayload>{
        res: resource,
        exp: moment().add(7, "days").unix(),
      })
    );

    let signature = this.signature(base64Header, base64Payload);

    return base64Header + "." + base64Payload + "." + signature;
  }

  /**
   * 校验 jwt 是否有效
   * @param token jwt 字段
   * @returns 如果无效或已过期，此方法返回 null，否则返回携带的资源
   */
  verify(token: string): any | null {
    let parts = token.split(".");
    if (parts.length !== 3) return null;

    let base64Header = parts[0];
    let base64Payload = parts[1];
    let signatureNeedVerify = parts[2];

    // 如果此 JWT 的签名不正确
    if (this.signature(base64Header, base64Payload) !== signatureNeedVerify) {
      return null;
    }

    try {
      let payloadContent: JWTAuthPayload = JSON.parse(
        Base64Url.decode(base64Payload)
      );
      // 如果此 JWT 过期
      if (moment.unix(payloadContent.exp).isBefore(moment())) {
        return null;
      }
      // 校验成功, 返回 resource
      return payloadContent.res;
    } catch (error) {
      return null;
    }
  }

  /**
   * 对已经 base64 的 Header 和 Payload 进行签名
   * @param base64Header
   * @param base64Payload
   * @returns
   */
  private signature(base64Header: string, base64Payload: string) {
    return createHmac("sha256", this.secret)
      .update(base64Header + "." + base64Payload)
      .digest("base64url");
  }
}

class Base64Url {
  static encode(str: string) {
    return Buffer.from(str).toString("base64url");
  }

  static decode(str: string) {
    return Buffer.from(str, "base64url").toString();
  }
}

type JWTAuthPayload = {
  res: any;
  exp: number;
};
