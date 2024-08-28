import { Prisma, type InviteCode } from "@prisma/client";
import { createHash } from "node:crypto";
import { App } from "../app";

export class InviteCodeService {
  /**
   * 创建一个邀请码
   * @param params 邀请码参数
   * @returns
   */
  async create(params: {
    code?: string;
    createdById?: number;
    expiredAt?: Date;
  }): Promise<InviteCode> {
    try {
      return await App.instance.prisma.inviteCode.create({
        data: {
          code: params.code ?? this.getRandomInviteCode(),
          createdById: params.createdById,
          expiredAt: params.expiredAt,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("邀请码重复");
        }
        if (error.code === "P2003") {
          throw new Error("邀请码创建者不存在");
        }
      }
      throw error;
    }
  }

  /**
   * 批量创建邀请码
   * @param params 批量创建参数
   */
  async createMany(params: {
    amount: number;
    createdById?: number;
    expiredAt?: Date;
  }): Promise<Prisma.BatchPayload> {
    let codes = [];

    for (let i = 0; i < params.amount; i++) {
      codes.push({
        code: this.getRandomInviteCode(),
        createdById: params.createdById,
        expiredAt: params.expiredAt,
      });
    }

    return await App.instance.prisma.inviteCode.createMany({
      data: codes,
      skipDuplicates: true,
    });
  }

  /**
   * 使用一个邀请码
   * @param code
   * @param usedById
   * @returns
   */
  async use(code: string, usedById: number): Promise<InviteCode> {
    // 首先检查用户是否存在
    const user = await App.instance.prisma.user.findUnique({
      where: { id: usedById },
    });
    if (!user) {
      throw new Error("用户不存在");
    }

    // 然后检查邀请码是否存在且可用
    const inviteCode = await App.instance.prisma.inviteCode.findFirst({
      where: {
        code: code,
        usedBy: null,
        OR: [{ expiredAt: { gt: new Date() } }, { expiredAt: null }],
      },
    });
    if (!inviteCode) {
      throw new Error("邀请码不存在或已失效");
    }

    // 更新邀请码使用状态
    return await App.instance.prisma.inviteCode.update({
      where: { code: code },
      data: {
        usedById,
        usedAt: new Date(),
      },
    });
  }

  /**
   * 测试一个邀请码是否可用
   * @param code
   * @returns
   */
  async test(code: string): Promise<boolean> {
    const find = await App.instance.prisma.inviteCode.findUnique({
      where: {
        code: code,
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
    });
    if (find === null) return false;
    else return true;
  }

  /**
   * 生成随机的邀请码
   */
  getRandomInviteCode(): string {
    let randomNumer = Math.random();
    let inviteCodeLong = createHash("sha1")
      .update(randomNumer.toString())
      .digest("base64url");
    inviteCodeLong = inviteCodeLong.replace(/[^a-zA-Z0-9]/g, "");
    let inviteCode = inviteCodeLong.slice(0, 12).toLocaleUpperCase();
    return inviteCode;
  }
}
