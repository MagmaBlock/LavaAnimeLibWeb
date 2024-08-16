import { Prisma, type User } from "@prisma/client";
import type { TokenPayload } from "~/server/types/token";
import type { LoginSuccessResult } from "~/server/types/user";
import { App } from "../app";
import { UserNotFoundError, UserPasswordBadError } from "../error/error";
import { encryptedPasswordFactory } from "./password/interface";
import { Sha256Password } from "./password/sha256";
import type { Token } from "./token/interface";
import { JwtToken } from "./token/jwt";
import { UserValidator } from "./validator/user";
import { H3Event } from "h3";

export class UserService {
  private authentication: Token;
  constructor(jwtSecret: string) {
    this.authentication = new JwtToken(jwtSecret);
  }

  /**
   * 注册新用户
   * @param email
   * @param name
   * @param password
   * @param inviteCode
   * @returns 创建完成的 User Prisma 对象
   */
  async register(
    email: string,
    name: string,
    password: string,
    inviteCode: string
  ): Promise<User> {
    if (!UserValidator.isEmail(email)) {
      throw createError({
        statusCode: 400,
        message: "邮箱不合法",
      });
    }
    if (!UserValidator.isVaildName(name)) {
      throw createError({
        statusCode: 400,
        message: "用户名不能为空或过长",
      });
    }
    if (!UserValidator.isSecurePassword(password)) {
      throw createError({
        statusCode: 400,
        message: "密码至少包含字母, 且长度为 7-64",
      });
    }
    if (!inviteCode) {
      throw createError({
        statusCode: 400,
        message: "邀请码不存在",
      });
    }

    // 密码加密
    const encryptedPassword = new Sha256Password();
    encryptedPassword.encrypt(password);

    try {
      const create = await App.instance.prisma.user.create({
        data: {
          email,
          name,
          password: encryptedPassword.serialize(),
          inviteBy: {
            connect: {
              code: inviteCode,
              usedBy: null,
              OR: [
                {
                  expiredAt: {
                    gt: new Date(),
                  },
                },
                {
                  expiredAt: null,
                },
              ],
            },
          },
        },
        include: {
          inviteBy: true,
        },
      });

      return create;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          if (error.meta?.target === "User_email_key") {
            throw createError({
              statusCode: 409,
              message: "邮箱已被注册",
            });
          }
          if (error.meta?.target === "User_name_key") {
            throw createError({
              statusCode: 409,
              message: "用户名已被使用",
            });
          }
        }
        if (error.code === "P2025") {
          throw createError({
            statusCode: 403,
            message: "邀请码无效",
          });
        }
      }
      throw error;
    }
  }

  /**
   * 登录用户
   * @param account 邮箱或用户名
   * @param password 明文密码
   * @returns 返回一个 JWT Token
   */
  async login(account: string, password: string): Promise<LoginSuccessResult> {
    let user = await App.instance.prisma.user.findFirst({
      where: {
        OR: [{ email: account }, { name: account }],
      },
    });
    if (user === null) {
      throw createError({
        statusCode: 400,
        message: "用户名或密码错误",
      });
    }

    let encryptedPassword = encryptedPasswordFactory(user.password);
    if (encryptedPassword.verify(password)) {
      return <LoginSuccessResult>{
        token: this.signTokenByUserId(user.id),
        user,
      };
    } else {
      throw createError({
        statusCode: 400,
        message: "用户名或密码错误",
      });
    }
  }

  /**
   * 更改用户密码
   */
  async changePassword(userId: number, newPassword: string): Promise<User> {
    if (UserValidator.isSecurePassword(newPassword) === false) {
      throw createError({
        statusCode: 400,
        message: "密码至少包含字母, 且长度为 7-64",
      });
    }

    const encryptedPassword = new Sha256Password();
    encryptedPassword.encrypt(newPassword);

    try {
      return await App.instance.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: encryptedPassword.serialize(),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw createError({
            statusCode: 404,
            message: "找不到用户",
          });
        }
      }
      throw error;
    }
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
   * 根据用户 ID 生成一个新的 Token
   * @param userId
   * @returns
   */
  signTokenByUserId(userId: number): string {
    return this.signToken({
      id: userId,
    });
  }

  /**
   * 传入有效 Token，获取相同 Payload 但续期的 Token
   * @param token
   * @deprecated 好像没用
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

  /**
   * 根据 H3Event 获取用户数据
   *
   * @param event H3Event类型的事件对象，包含了HTTP请求的相关信息
   * @returns 返回一个Promise，解析为User对象或null如果用户验证失败或不存在
   */
  async getUser(event: H3Event): Promise<User | null> {
    // 获取请求中的Authorization头部信息
    const authorizationHeader = getHeader(event, "Authorization");
    if (authorizationHeader) {
      // 移除Bearer关键字，获取纯令牌字符串
      const token = authorizationHeader.replace(/^Bearer /i, "");
      // 使用UserService读取令牌载荷
      const payload = App.instance.services
        .getService(UserService)
        .readTokenPayload(token);
      if (payload?.id) {
        // 根据令牌载荷中的id查找用户
        const user = await App.instance.prisma.user.findFirst({
          where: { id: payload.id },
        });
        // 返回查找到的用户对象
        return user;
      }
    }
    // 如果Authorization头部不存在或令牌验证失败，返回null
    return null;
  }

  /**
   * 断言用户
   *
   * @param event 请求事件对象，包含请求的相关信息
   * @throws 如果用户未登录，则抛出一个包含状态码和状态信息的错误
   * @returns 如果用户已登录，则返回用户信息
   */
  async assertUser(event: H3Event): Promise<User> {
    const user = await this.getUser(event);
    if (user === null) {
      throw createError({
        statusCode: 401,
        message: "未登录",
      });
    }
    return user;
  }

  /**
   * 读取请求来源是否为一个管理员
   * 如果凭据无效，将会掷出 UnauthorizedError
   * 如果不是管理，将会掷出 ForbiddenError
   * @param event
   * @throws {UnauthorizedError | ForbiddenError}
   * @returns
   */
  async assertAdmin(event: H3Event): Promise<User> {
    const user = await this.getUser(event);

    if (user?.role === "Admin") {
      return user;
    }
    throw createError({
      statusCode: 403,
      message: "权限不足",
    });
  }
}
