import { Prisma, type User } from "@prisma/client";
import type { TokenPayload } from "~/server/types/token";
import type { LoginSuccessResult } from "~/server/types/user";
import { App } from "../app";
import {
  InviteCodeNotFoundError,
  UserEmailBadError,
  UserEmailConflictError,
  UserNameBadError,
  UserNameConflictError,
  UserNotFoundError,
  UserPasswordBadError,
  UserPasswordError,
} from "../error/error";
import type { TokenService } from "../token/service";
import { encryptedPasswordFactory } from "./password/interface";
import { Sha256Password } from "./password/sha256";
import { UserValidator } from "./validator/user";

export class UserService {
  private tokenService: TokenService;

  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
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
    if (!UserValidator.isEmail(email))
      throw new UserEmailBadError("邮箱不合法");
    if (!UserValidator.isVaildName(name))
      throw new UserNameBadError("用户名不能为空或过长");
    if (!UserValidator.isSecurePassword(password))
      throw new UserPasswordBadError("密码至少包含字母, 且长度为 7-64");
    if (!inviteCode) throw new InviteCodeNotFoundError("邀请码不存在");

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
            throw new UserEmailConflictError("邮箱已被注册");
          }
          if (error.meta?.target === "User_name_key") {
            throw new UserNameConflictError("用户名已被使用");
          }
        }
        if (error.code === "P2025") {
          throw new InviteCodeNotFoundError("邀请码无效");
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
    try {
      let user = await App.instance.prisma.user.findFirst({
        where: {
          OR: [{ email: account }, { name: account }],
        },
      });
      if (user === null) throw new UserNotFoundError("无法找到此用户");

      let encryptedPassword = encryptedPasswordFactory(user.password);
      if (encryptedPassword.verify(password)) {
        return <LoginSuccessResult>{
          token: this.tokenService.signToken(<TokenPayload>{
            id: user.id,
          }),
          user,
        };
      } else {
        throw new UserPasswordError("密码错误");
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更改用户密码
   */
  async changePassword(userId: number, newPassword: string) {
    if (UserValidator.isSecurePassword(newPassword) === false) {
      throw new UserPasswordBadError("密码至少包含字母, 且长度为 7-64");
    }

    const encryptedPassword = new Sha256Password();
    encryptedPassword.encrypt(newPassword);

    try {
      await App.instance.prisma.user.update({
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
          throw new UserNotFoundError("找不到用户");
        }
      }
    }
  }
}
