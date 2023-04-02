import Image from "next/image";
import { FC, useRef, useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { formatDistance } from "date-fns";
import { useSession } from "next-auth/react";
import { Toggle } from "./Toggle";
import { toast } from "react-hot-toast";

interface CommentType {
  comment: RouterOutputs["comment"]["getAll"][0];
}

export const Comment: FC<CommentType> = ({ comment }) => {
  const { data: session } = useSession();
  const utils = api.useContext();
  const toastDeleteCommentId = useRef<string>("");

  // State
  const [toggle, setToggle] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { mutate: deleteComment } = api.comment.delete.useMutation({
    onSuccess: () => {
      setToggle(false);
      toast.success("Delete comment succesfully 🔥", {
        id: toastDeleteCommentId.current,
      });
      utils.post.postDetail.invalidate();
      setIsDisabled(false);
    },
    onError: () => {
      toast.success("Error deleting a comment", {
        id: toastDeleteCommentId.current,
      });
    },
  });

  const handleDeleteComment = () => {
    setIsDisabled(true);
    toastDeleteCommentId.current = toast.loading("Deleting your comment...");
    deleteComment({ id: comment.id });
  };

  return (
    <div className="my-3 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full"
          alt="avatar"
          src={comment.user?.image ?? ""}
          width={24}
          height={24}
        />
        <h3 className="text-sm font-bold text-gray-700">
          {comment.user?.name}
        </h3>
        <h2 className="text-xs text-gray-500">
          {formatDistance(comment.createdAt, new Date(), { addSuffix: true })}
        </h2>
      </div>
      <div className="my-5">
        <div className="break-all text-xs text-gray-800">{comment.message}</div>
      </div>
      <div>
        {session?.user.id === comment.userId && (
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
          origin="comment"
          onDelete={handleDeleteComment}
          isDisabled={isDisabled}
          onToggle={setToggle}
        />
      )}
    </div>
  );
};
