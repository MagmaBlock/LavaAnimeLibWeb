/**
 * 服务器端 tRPC 根配置设置入口点
 *
 * - initTRPC 在每个应用中应只使用一次
 * - 仅导出我们使用的功能，以强制规定应使用哪些基本程序
 *
 * tRPC 相关文档:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "~/server/trpc/context";

// 创建 tRPC 实例
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// 导出路由和中间件
export const router = t.router;
export const middleware = t.middleware;

// 身份验证中间件
const requireAuth = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "需要登录" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// 管理员鉴权中间件
const requireAdmin = middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "Admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "需要管理员权限" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// 导出公共和受保护的程序
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(requireAuth);
export const adminProcedure = protectedProcedure.use(requireAdmin);
