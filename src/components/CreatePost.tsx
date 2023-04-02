import { FormEvent, useRef, useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";

export const CreatePost = () => {
  const utils = api.useContext();
  const toasPostId = useRef<string>("");

  const [title, setTilte] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { mutate } = api.post.create.useMutation({
    onSuccess: () => {
      setTilte("");
      setIsDisabled(false);
      toast.success("Create post succesfully 🔥", { id: toasPostId.current });
      utils.post.getAll.invalidate();
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        toast.error(`${error.message}`, { id: toasPostId.current });
      }
      setIsDisabled(false);
    },
  });

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    toasPostId.current = toast.loading("Creating your post...");
    setIsDisabled(true);
    mutate({ title });
  };

  return (
    <form onSubmit={handleCreatePost} className="mb-8">
      <div className="my-4 flex flex-col">
        <textarea
          name="title"
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTilte(e.target.value)}
          className="my-2 w-full rounded-md border border-gray-500 bg-gray-100 p-2 text-sm text-gray-600 outline-none"
        ></textarea>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={`text-sm font-bold ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${title.length}/300`}</p>
        <button
          disabled={isDisabled}
          type="submit"
          className="cursor-pointer rounded-lg bg-teal-600 px-6 py-2 text-sm text-white hover:bg-teal-700 disabled:bg-teal-400"
        >
          {isDisabled ? "Creating..." : "Create a post"}
        </button>
      </div>
    </form>
  );
};
