import { getRandomUsers } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";

async function WhoToFollow() {
  const authUser = await currentUser();

  // 🔐 NOT LOGGED IN → show appealing info card
  if (!authUser) {
    return (
      <Card className="bg-muted/40 border-dashed">
        <CardHeader>
          <CardTitle className="text-base">
            Discover people on the platform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Follow creators, developers, and thinkers to personalize your feed.
          </p>
          <p className="text-xs text-muted-foreground italic">
            Sign in to start building your network ✨
          </p>
        </CardContent>
      </Card>
    );
  }

  // ✅ LOGGED IN → normal Who to follow
  const users = await getRandomUsers();
  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-2 items-center justify-between"
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.userName}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  <Link
                    href={`/profile/${user.userName}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">
                    @{user.userName}
                  </p>
                  <p className="text-muted-foreground">
                    {user._count.followers} followers
                  </p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default WhoToFollow;
