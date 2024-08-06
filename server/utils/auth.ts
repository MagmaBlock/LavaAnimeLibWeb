import chalk from "chalk";
import { H3Event } from "h3";
import { ForbiddenError, UnauthorizedError } from "../services/error/error";
import { JwtAuthentication } from "../services/token/authentication/jwt";

export const useAuth = new JwtAuthentication(process.env.AUTH_SECRET);

/**
 * 读取请求来源的用户
 * 如果凭据无效，将会掷出 UnauthorizedError
 * @param event
 * @throws {UnauthorizedError}
 * @returns
 */
export const assertUser = async (event: H3Event) => {
  const authorizationHeader = getHeader(event, "Authorization");
  if (authorizationHeader) {
    const token = authorizationHeader.replace(/^Bearer /i, "");
    const user = await getUserByToken(token);
    if (!user) throw new UnauthorizedError("用户未登录");
    return user;
  }
  throw new UnauthorizedError("用户未登录");
};

/**
 * 读取请求来源是否为一个管理员
 * 如果凭据无效，将会掷出 UnauthorizedError
 * 如果不是管理，将会掷出 ForbiddenError
 * @param event
 * @throws {UnauthorizedError | ForbiddenError}
 * @returns
 */
export const assertAdmin = async (event: H3Event) => {
  const user = await assertUser(event);

  if (user.role === "Admin") {
    return user;
  } else {
    throw new ForbiddenError("用户不是一个管理员");
  }
};

/**
 * 内部函数, 支持 cache 读取 user 从 token 中.
 * @private
 */
const getUserByToken = defineCachedFunction(
  async (token: string) => {
    const payload = useAuth.verify(token);
    if (!payload?.id) return null;

    try {
      const user = usePrisma.user.findFirst({
        where: {
          id: payload.id,
        },
        include: {
          infomations: true,
        },
      });

      if (!user) return null;

      return user;
    } catch (error) {
      logger.error(error, chalk.red("[!]"), "readUser error!");
      return null;
    }
  },
  { maxAge: 60 * 5 }
);
