import type { inferAsyncReturnType } from "@trpc/server";
import type { H3Event } from "h3";
import { App } from "../services/app";
import { UserService } from "../services/user/service";
import { prisma } from "../src/context/prisma";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(_event: H3Event) {
  /**
   * Add any trpc-request context here. E.g., you could add `prisma` like this (if you've added it via sidebase):
   * ```ts
   * return { prisma: _event.context.prisma }
   * ```
   */

  const authHeader = _event.headers.get("Authorization");
  let user = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const userService = App.instance.services.getService(UserService);
    const payload = userService.readTokenPayload(token);
    if (payload) {
      user = await prisma.user.findFirst({
        where: {
          id: payload.id,
        },
      });
    }
  }

  return {
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
