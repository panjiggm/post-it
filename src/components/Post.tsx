import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { RouterOutputs } from "~/utils/api";

type PostType = RouterOutputs["post"]["getAll"][0];

export const Post: FC<{ post: PostType }> = ({ post }) => {
  const { data: session } = useSession();

  return (
    <div className="my-3 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full"
          alt={post.title}
          src={post.user?.image ?? ""}
          width={28}
          height={28}
        />
        <h3 className="font-bold text-gray-700">{post.user?.name}</h3>
      </div>
      <div className="my-5">
        <div className="break-all text-xs text-gray-800">{post.title}</div>
      </div>
      <div className="flex cursor-pointer items-center gap-4">
        <Link href={`/post/${post.id}`}>
          <p className="text-xs font-bold text-gray-700">
            {post.comments.length} Comments
          </p>
        </Link>
        {session?.user.id === post.userId && (
          <button className="text-xs font-bold text-red-600">Delete</button>
        )}
      </div>
    </div>
  );
};
