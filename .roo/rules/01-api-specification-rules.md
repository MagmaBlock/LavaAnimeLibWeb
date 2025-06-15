# HTTP API 接口开发规则

在本项目中进行任何服务端 HTTP API 开发时，请严格遵守以下规范。

## 1. API 接口路由和传参约定

- **请求方法**: 所有 API 接口统一使用 `POST` 方法。
- **参数传递**: 请求体 (Request Body) 和响应体 (Response Body) 均使用 JSON 格式。
- **路径命名**: 路由路径必须清晰地描述其功能，采用 `模块名/操作名` 的结构。全部使用 kebab-case。
- **模块命名**: 我们使用 Nitro，因此文件名就是路由路径，结尾使用 .post.ts 表示 POST 方法。

**正确示例:**

- `POST /api/user/get-info`: 放在 `/server/api/user/get-info.post.ts`
- `POST /api/anime/collection/add-item`: 放在 `/server/api/anime/collection/add-item.post.ts`

## 2. 如何编写 API 模块的代码

- **框架**：我们使用 Nuxt(Nitro)。
- **参数校验**: 所有请求的 Body 参数**必须**使用 `zod` 进行校验：

  ```typescript
  import { z } from "zod";

  // 将 bodySchema 放在文件顶部有助于快速看到接口需要传入的参数
  const bodySchema = z.object({
    status: z.nativeEnum(QueryItemEnum).optional(),
    page: z.number().int().min(1).optional().default(1),
    pageSize: z.number().int().min(1).optional().default(20),
  });

  export default defineEventHandler(async (event) => {
    const body = bodySchema.safeParse(await readBody(event));

    if (body.success === false) {
      return {
        success: false,
        message: "请求参数错误", // message 可能用于前端弹窗
        data: null, // 如有必要可以返回错误原因，如参数由用户填写的情况
      };
    }

    // 解构参数
    const { status, page, pageSize } = body.data;

    // ...
  });
  ```

- **鉴权认证**: JWT 通过 `Authorization` 请求头中的 `Bearer Token` 传递。服务端有快捷工具 `/server/utils/auth.ts` 实现了从 H3Event 到 User 对象的读取：

  ```typescript
  async function getUserFromEvent(event: H3Event): Promise<User | null>;
  ```

## 3. 响应规范

- **HTTP 状态码**: 无论业务逻辑成功或失败，HTTP 状态码**必须**始终返回 `200 OK`。
- **响应体结构**: 响应体**必须**是包含以下三个字段的 JSON 对象：
  - `success` (boolean): `true` 表示业务处理成功，`false` 表示业务处理失败。
  - `message` (string): 对本次请求结果的简要描述。失败时应为清晰的错误提示，可能用于前端弹窗。
  - `data` (object | null): 响应数据。
    - **类型约束**: `data` 字段的类型**必须**是一个 JSON 对象 (`{...}`) 或 `null`。**严禁**使用数组 (`[...]`) 或其他原始类型 (如 string, number) 作为 `data` 的直接返回值。
    - **设计原则**: 此约束旨在确保 API 的可扩展性。即使当前没有数据返回，也应使用 `null` 或空对象 `{}`，以便未来可以在不破坏客户端解析逻辑的情况下增加新的字段。
    - **失败情况**: 业务失败时，`data` 字段可以为 `null`，或者是一个包含 `errorCode` 等详细错误信息的对象。
- **成功响应示例**:
  ```json
  {
    "success": true,
    "message": "操作成功",
    "data": {
      "userId": 123,
      "username": "example-user"
    }
  }
  ```
- **成功但无数据返回的示例:**
  ```json
  {
    "success": true,
    "message": "操作已完成",
    "data": null
  }
  ```
- **失败响应示例**
  ```json
  {
    "success": false,
    "message": "用户不存在",
    "data": {
      "errorCode": "USER_NOT_FOUND"
    }
  }
  ```
