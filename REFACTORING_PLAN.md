# 服务端架构重构计划

本文档旨在记录并指导服务端代码的重构过程，以解决当前架构存在的过度设计和开发效率问题。

## 1. 背景

当前的服务端架构采用了类似于 Java Spring 的服务容器（Service Container）和依赖注入（DI）模式。每个服务都被封装成一个 Class，在应用启动时被实例化并注册到全局容器中。

这种模式虽然在大型项目中很强大，但对于本项目的当前阶段（单人、业余、开源）而言，存在以下问题：

- **过度设计**: 对于大量无状态的服务，使用 Class 和容器进行管理，增加了不必要的复杂性。
- **样板代码多**: 每增加一个服务，都需要在 `app.ts` 中进行导入和注册，流程繁琐。
- **开发效率低**: 在架构上耗费了过多心神，拖慢了功能迭代的速度。

为了让项目能够快速迭代和上线，我们决定回归简单。

## 2. 核心原则：纯函数与全局单例依赖

我们采用一种更直接、更轻量的模式来组织代码：

- **全局单例依赖 (Global Singleton Dependencies)**: 对于像数据库连接 (`PrismaClient`) 或日志记录器这类需要在整个应用中共享的实例，我们在一个中心化的文件（如 `server/utils/db.ts`）中进行一次性初始化，并作为常量导出。

- **函数即服务 (Function as a Service)**: 放弃将所有东西都包装成 Class。将原本在 Service 类中的方法，全部改造为独立的、可导出的普通函数。这些函数按功能领域划分，存放在不同的文件中（如 `server/services/user.ts`, `server/services/anime.ts`）。

- **直接导入 (Direct Import)**: 当一个函数需要依赖另一个函数或共享实例时，直接使用 ES Module 的 `import` 语句导入即可。

这种模式极大地减少了抽象层次和样板代码，让开发者能更专注于业务逻辑本身。

## 3. 实施步骤

### 步骤一：创建全局依赖实例

在 `server/utils/` 目录下创建一个新文件 `db.ts`，用于存放 `PrismaClient` 的全局实例。

```typescript
// server/utils/db.ts
import { PrismaClient } from "@prisma/client";

// 在这里初始化所有需要全局共享的实例
export const prisma = new PrismaClient();
```

### 步骤二：重构 Service 类为函数

以 `AnimeService` 和 `UserService` 为例，将它们的 Class 结构拆解为独立的函数。

**旧代码 (`server/services/anime/service.ts`)**
```typescript
export class AnimeService {
  async updateAnimesInfo(animeIds: number[]): Promise<void> {
    const animes = await App.instance.prisma.anime.findMany(...);
    // ...
  }
}
```

**新代码 (`server/services/anime.ts`)**
```typescript
import { prisma } from '~/server/utils/db';

// 函数直接放在文件顶层
export async function updateAnimesInfo(animeIds: number[]): Promise<void> {
  // 直接导入并使用 prisma 实例
  const animes = await prisma.anime.findMany(...);
  // ...
}

export async function updateAllAnimeInfoBefore(before: Date): Promise<void> {
  // ...
}
```

对于像 `UserService` 这样包含一些内部状态（如 `jwtSecret`）的类，也可以将其拆分。配置相关的变量可以从 `process.env` 直接读取。

**旧代码 (`server/services/user/service.ts`)**
```typescript
export class UserService {
  private authentication: Token;
  constructor(jwtSecret: string) {
    this.authentication = new JwtToken(jwtSecret);
  }
  async login(...) { ... }
}
```

**新代码 (`server/services/user.ts`)**
```typescript
import { prisma } from '~/server/utils/db';
import { sign } from 'jsonwebtoken'; // 假设使用 jsonwebtoken

// 将配置或密钥直接在函数内部获取
const JWT_SECRET = process.env.AUTH_SECRET ?? 'default-secret';

export async function login(account: string, password: string): Promise<{ token: string; user: User }> {
  const user = await prisma.user.findFirst(...);
  // ...
  const token = sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user };
}

export async function register(...) {
  // 如果需要调用其他服务函数，直接导入
  const isInviteCodeValid = await testInviteCode(inviteCode);
  // ...
}
```

### 步骤三：更新 API 端点

在 Nitro 的 API 路由处理函数中，直接导入并调用重构后的服务函数。

```typescript
// server/api/auth/login.post.ts
import { login } from '~/server/services/user';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const { token, user } = await login(body.account, body.password);
    return { success: true, message: '登录成功', data: { token, user } };
  } catch (error) {
    // ... 错误处理
  }
});
```

### 步骤四：清理旧代码

在所有服务和 API 端点都完成迁移后，安全地删除以下不再需要的文件和目录：
- `server/services/app.ts`
- `server/services/container/`

## 4. 优势与权衡

### 优势
- **简单快速**: 代码结构扁平，易于理解和编写，能极大地提升开发效率。
- **心智负担低**: 无需理解复杂的容器和生命周期管理。
- **易于上手**: 对于新贡献者（或者未来的你）来说，代码更容易读懂。

### 权衡
- **可测试性**: 单元测试变得更困难，因为依赖是硬编码导入的。作为补偿，可以加强**集成测试**，直接对 API 端点进行测试，这在很多场景下更有价值。
- **紧耦合**: 服务函数与全局实例存在耦合。但在单人项目中，这种耦合是可控的，并且其带来的开发效率提升远大于其理论上的缺点。

这个方案是为当前阶段量身定制的，旨在让你摆脱困境，快速前进。