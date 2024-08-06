import type { User } from "@prisma/client";

export type LoginSuccessResult = {
  token: string;
  user: User;
};
