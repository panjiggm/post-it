import { FormEvent, useRef, useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import { nanoid } from "nanoid";

import { supabase, CDNURL } from "~/utils/supabase";
import { AttachmentType, Attachments } from "./Attachments";

// Icons
import { RiImageAddFill } from "react-icons/ri";

export const CreatePost = () => {
  const utils = api.useContext();
  const toasPostId = useRef<string>("");
  const toasImageId = useRef<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTilte] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<
    { url: string; postId: string }[]
  >([]);

  const { mutate: mutatePost } = api.post.create.useMutation({
    onSuccess: ({ id }) => {
      if (attachments.length > 0) {
        const images = attachments.map((attachment) => ({
          ...attachment,
          postId: id,
        }));
        // mutate th images
        mutateImage({ images });
      } else {
        setTilte("");
        setIsDisabled(false);
        toast.success("Create post succesfully 🔥", { id: toasPostId.current });
        utils.post.getAll.invalidate();
      }
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        toast.error(`${error.message}`, { id: toasPostId.current });
      }
      setIsDisabled(false);
    },
  });

  const { mutate: mutateImage } = api.image.create.useMutation({
    onSuccess: () => {
      setTilte("");
      setAttachments([]);
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
    mutatePost({ title });
  };

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let imgData = [];

    toasImageId.current = toast.loading("Uploading images...");

    if ((e.target.files?.length as number) > 4) {
      toast.error("4 pictures only", { id: toasImageId.current });
    } else if (e.target.files) {
      for (const file of e.target.files) {
        const ext = file.name?.split(".").pop() as string;
        const { error, data } = await supabase.storage
          .from("images")
          .upload(`${nanoid()}.${ext}`, file);

        if (error) {
          toast.error(`${error.message}`, { id: toasImageId.current });
          console.log("Error upload", error);
        }

        if (data) {
          toast.success("Image uploaded ✔️", { id: toasImageId.current });
          imgData.push(data);
        }
      }
    }

    const responseImgs = imgData?.map((img) => {
      return {
        url: `${CDNURL}${img?.path}`,
        postId: "",
      };
    });

    setAttachments([...attachments, ...responseImgs]);
  };

  const handleRemoveAttachments = async (attachment: AttachmentType) => {
    toasImageId.current = toast.loading("Uploading images...");

    const img = attachment.url.split("/")[8] as string;
    const { error, data } = await supabase.storage.from("images").remove([img]);

    if (error) {
      toast.error(`${error.message}`, { id: toasImageId.current });
      console.log("Error upload", error);
    }

    if (data) {
      toast.success("Image removed ✔️", { id: toasImageId.current });

      const newAttachments = attachments.filter(
        (p) => p.url !== attachment.url
      );
      setAttachments(newAttachments);
    }
  };

  return (
    <form onSubmit={handleCreatePost} className="mb-8">
      <div className="my-4 flex flex-col">
        <textarea
          name="title"
          placeholder="What's on your mind?"
          value={title}
          // rows={1}
          onChange={(e) => setTilte(e.target.value)}
          className="w-full rounded-md border border-gray-500 bg-gray-100 p-2 text-sm text-gray-600 outline-none"
        ></textarea>
      </div>

      {/* Attachments */}
      {attachments && (
        <div className="mb-5 grid gap-2">
          <Attachments
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachments}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <div
            className="cursor-pointer rounded-full p-2 hover:bg-teal-50"
            onClick={() => inputRef.current?.click()}
          >
            <RiImageAddFill className="text-xl text-teal-700" />
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              multiple
              onChange={handleFilesChange}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
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
      </div>
    </form>
  );
};
