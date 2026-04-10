import { cookies } from "next/headers";
import { prisma } from "./db";

const COOKIE = "tcf_user_id";

export async function getOrCreateUserId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  if (existing) {
    const u = await prisma.user.findUnique({ where: { id: existing } });
    if (u) return u.id;
  }
  const user = await prisma.user.create({
    data: {
      profile: {
        create: {},
      },
    },
  });
  jar.set(COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
  return user.id;
}
