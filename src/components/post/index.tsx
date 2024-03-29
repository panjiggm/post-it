import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo, useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import toast from "react-hot-toast";
import { formatDistance } from "date-fns";

// Icons
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { Toggle } from "../Toggle";
import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { Attachments } from "./Attachments";

interface PostType {
  post: RouterOutputs["post"]["getAll"]["posts"][number];
  client?: QueryClient;
}

function updateCache({
  client,
  variables,
  data,
  action,
}: {
  client: QueryClient | undefined;
  variables: { postId: string };
  data: { userId: string | null };
  action: "like" | "unlike";
}) {
  client?.setQueryData(
    [
      ["post", "getAll"],
      {
        input: {
          limit: 5,
        },
        type: "infinite",
      },
    ],
    (oldPosts) => {
      const newData = oldPosts as InfiniteData<RouterOutputs["post"]["getAll"]>;
      const newPosts = newData.pages.map((page) => {
        return {
          posts: page.posts.map((post) => {
            if (post.id === variables.postId) {
              return {
                ...post,
                likes: action === "like" ? [{ userId: data.userId }] : [],
              };
            }

            return post;
          }),
        };
      });

      return {
        ...newData,
        pages: newPosts,
      };
    }
  );
}

export const Post: FC<PostType> = ({ post, client }) => {
  const { data: session } = useSession();
  const utils = api.useContext();
  const hasLike = post.likes.length > 0;
  const userId = session?.user?.id;

  // State
  const [toggle, setToggle] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [likeDisabled, setLikeDisabled] = useState<boolean>(false);

  const userLike = useMemo(() => {
    return post.likes?.some((like) => like.userId === userId);
  }, [post]);

  // Delete Mutation
  const { mutate: deletePost } = api.post.delete.useMutation({
    onSuccess: () => {
      setToggle(false);
      toast.success("Delete post succesfully 🔥");
      utils.post.getAll.invalidate();
      setIsDisabled(false);
    },
    onError: () => {
      toast.error("Error deleting a post");
    },
  });

  // Like Mutation
  const { mutate: likePost } = api.post.like.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "like" });
      // utils.post.getAll.invalidate();
      toast.success("You liked the post ❤️");
      setLikeDisabled(false);
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        if (error.data.httpStatus === 401) {
          toast.error("Please Sign In Bestie 🤪");
        }
      }
    },
  });

  // Unlike Mutation
  const { mutate: unlikePost } = api.post.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, action: "unlike" });
      // utils.post.getAll.invalidate();
      setLikeDisabled(false);
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        if (error.data.httpStatus === 401) {
          toast.error("Please Sign In Bestie 🤪");
        }
      }
    },
  });

  const handleDeletePost = () => {
    setIsDisabled(true);
    deletePost({ id: post.id });
  };

  const handleLikePost = () => {
    setLikeDisabled(true);

    if (hasLike) {
      unlikePost({ postId: post.id });
      return;
    }

    likePost({ postId: post.id });
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
      {post.images && (
        <div className="mb-5">
          <Attachments attachments={post.images} />
        </div>
      )}
      <div className="flex cursor-pointer items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href={`/post/${post.id}`} className="flex items-center gap-1">
            <BiCommentDetail className="text-blue-800" />
            <p className="text-xs font-bold text-gray-700">
              {post.comments.length} Comments
            </p>
          </Link>

          <button
            className="flex items-center gap-1 disabled:opacity-50"
            disabled={likeDisabled}
            onClick={handleLikePost}
          >
            <AiFillHeart
              className={`${userLike ? "text-red-600" : "text-gray-500"}`}
            />
            <p className="text-xs font-bold text-gray-700">
              {post.likes.length} Likes
            </p>
          </button>
        </div>
        {session?.user.id === post.userId && (
          <button
            className="flex gap-0.5 text-xs font-bold text-red-600"
            onClick={() => setToggle(true)}
          >
            <MdDelete className="text-sm" />
            <span>Delete</span>
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
