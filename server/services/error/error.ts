/**
 * 含状态码的错误接口
 */
export interface ErrorWithStatus {
  statusCode: number;
  getStatusCode(): number;
}
/**
 * 400 系客户端错误
 */
export class ClientError extends Error implements ErrorWithStatus {
  statusCode: number = 400;
  getStatusCode() {
    return this.statusCode;
  }
}
/**
 * 500 系服务端错误
 */
export class ServerError extends Error implements ErrorWithStatus {
  statusCode: number = 500;
  getStatusCode() {
    return this.statusCode;
  }
}

// 客户端错误相关实现

/**
 * 400 BadRequest 请求格式错误, 一般用于非法参数
 */
export class BadRequestError extends ClientError {
  override statusCode = 400;
}
/**
 * 401 Unauthorized 身份验证失败, 用户未登录 / 凭据异常
 */
export class UnauthorizedError extends ClientError {
  override statusCode = 401;
}
/**
 * 403 Forbidden 服务端理解请求, 但拒绝操作
 * 一般用于用户无权限等情况.
 */
export class ForbiddenError extends ClientError {
  override statusCode = 403;
}
/*
 * 404 NotFound 服务器无法根据客户端的请求找到资源
 */
export class NotFoundError extends ClientError {
  override statusCode = 404;
}
/*
 * 409 Conflict 请求与当前服务端目标资源的状态有冲突
 */
export class ConflictError extends ClientError {
  override statusCode = 409;
}
/*
 * 410 Gone 客户端请求的资源已经不存在
 */
export class GoneError extends ClientError {
  override statusCode = 410;
}

export class UserEmailBadError extends BadRequestError {}
export class UserNameBadError extends BadRequestError {}
export class UserPasswordBadError extends BadRequestError {}

export class UserEmailConflictError extends ConflictError {}
export class UserNameConflictError extends ConflictError {}
export class InviteCodeConflictError extends ConflictError {}

export class UserPasswordError extends ForbiddenError {}
export class UserNotFoundError extends NotFoundError {}
export class InviteCodeNotFoundError extends NotFoundError {}

// 服务端错误相关实现

/**
 * 500 InternalServerError 服务器内部错误
 */
export class InternalServerError extends ServerError {
  override statusCode = 500;
}

/**
 * 503 ServiceUnavailableError 服务不可用
 */
export class ServiceUnavailableError extends ServerError {
  override statusCode = 503;
}

export class LibraryNotConfiguredError extends InternalServerError {}
