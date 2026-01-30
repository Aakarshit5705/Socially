import { getProfileByuserName, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({params}:{params:{userName:string}}){
  const user=await getProfileByuserName(params.userName);

  if(!user)return;

  return{
    title:`${user.name??user.userName}`,
    description:user.bio||`Check out ${user.userName}'s profile`
  }
}



async function ProfilePageServer({params}:{params:{userName:string}}) {
   const user=await getProfileByuserName(params.userName);

   if(!user) notFound();

   const[posts,likedPosts,isCurrentUserFollowing]=await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id)
   ])

  return (
    <div>
      <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
      />
    </div>
  )
}

export default ProfilePageServer
