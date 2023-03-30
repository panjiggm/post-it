"use client";

import { useState } from "react";

export default function CreatePost() {
  const [title, setTilte] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  return (
    <form>
      <div className="my-4 flex flex-col">
        <textarea
          name="title"
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => setTilte(e.target.value)}
          className="my-2 w-full rounded-md border border-gray-500 bg-gray-100 p-2 text-lg text-gray-600 outline-none"
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          disabled={isDisabled}
          type="submit"
          className="rounded-lg bg-teal-600 px-6 py-2 text-sm text-white"
        >
          Create a post
        </button>
      </div>
    </form>
  );
}
