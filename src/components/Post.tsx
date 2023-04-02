import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import toast from "react-hot-toast";

import { Toggle } from "./Toggle";
import { formatDistance } from "date-fns";

interface PostType {
  post: RouterOutputs["post"]["getAll"][0];
}

export const Post: FC<PostType> = ({ post }) => {
  const { data: session } = useSession();
  const utils = api.useContext();

  // State
  const [toggle, setToggle] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { mutate: deletePost } = api.post.delete.useMutation({
    onSuccess: () => {
      setToggle(false);
      toast.success("Delete post succesfully 🔥");
      utils.post.getAll.invalidate();
      setIsDisabled(false);
    },
    onError: () => {
      toast.success("Error deleting a post");
    },
  });

  const handleDeletePost = () => {
    setIsDisabled(true);
    deletePost({ id: post.id });
  };

  return (
    <div className="my-3 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full"
          alt="avatar"
          src={post.user?.image ?? ""}
          width={28}
          height={28}
        />
        <div>
          <h3 className="font-bold text-gray-700">{post.user?.name}</h3>
          <p className="text-xs text-gray-500">
            {formatDistance(post.updatedAt, new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="my-5">
        <div className="break-all text-sm text-gray-800">{post.title}</div>
      </div>
      <div className="flex cursor-pointer items-center gap-4">
        <Link href={`/post/${post.id}`}>
          <p className="text-xs font-bold text-gray-700">
            {post.comments.length} Comments
          </p>
        </Link>
        {session?.user.id === post.userId && (
          <button
            className="text-xs font-bold text-red-600"
            onClick={() => setToggle(true)}
          >
            Delete
          </button>
        )}
      </div>
      {toggle && (
        <Toggle
          origin="post"
          onDelete={handleDeletePost}
          isDisabled={isDisabled}
          onToggle={setToggle}
        />
      )}
    </div>
  );
};
