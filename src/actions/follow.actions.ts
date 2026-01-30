"use server";

import prisma from "@/lib/prisma";
import { getdbUserId } from "./user.actions";
import { revalidatePath } from "next/cache";

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getdbUserId();

    // 🔐 AUTH GUARD (minimal & required)
    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (userId === targetUserId) {
      throw new Error("You can't follow yourself!");
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: userId,
          },
        }),
      ]);
    }
    revalidatePath('/');
    return { success: true };
  } catch (error) {

    console.error("toggleFollow error:", error);
    return { success: false };
  }
}
