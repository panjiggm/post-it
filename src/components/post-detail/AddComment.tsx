import { TRPCClientError } from "@trpc/client";
import { FC, FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

interface AddCommentProps {
  postId: string;
}

const AddComment: FC<AddCommentProps> = ({ postId }) => {
  const utils = api.useContext();
  const toastCommentId = useRef<string>("");

  const [comment, setComment] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { mutate } = api.comment.create.useMutation({
    onSuccess: () => {
      setComment("");
      setIsDisabled(false);
      toast.success("Add comment succesfully 🔥", {
        id: toastCommentId.current,
      });
      utils.post.postDetail.invalidate();
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        toast.error(`${error.message}`, { id: toastCommentId.current });
        console.log("err ad", error.message);
      }
      setIsDisabled(false);
    },
  });

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    toastCommentId.current = toast.loading("Adding your comment...");
    setIsDisabled(true);
    mutate({ comment, postId });
  };

  return (
    <form className="my-8" onSubmit={handleAddComment}>
      <h3 className="text-xs font-semibold text-gray-800">Add a comment</h3>
      <div className="mb-1 flex flex-col">
        <input
          type="text"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="my-2 rounded-md border border-gray-500 p-4 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={isDisabled}
          type="submit"
          className="cursor-pointer rounded-lg bg-teal-600 px-6 py-2 text-sm text-white hover:bg-teal-700 disabled:bg-teal-400"
        >
          {isDisabled ? "Adding..." : "Add comment 🚀"}
        </button>
        <p
          className={`text-sm font-bold ${
            comment.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${comment.length}/300`}</p>
      </div>
    </form>
  );
};

export default AddComment;
