"use client";

import { signOut } from "next-auth/react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface LoggedProps {
  name: string;
  image: string | StaticImageData;
}

export default function Logged({ name, image }: LoggedProps) {
  return (
    <li className="flex items-center gap-4">
      <button
        className="rounded-lg bg-gray-700 px-6 py-2 text-sm text-white disabled:opacity-25"
        onClick={() => signOut()}
      >
        Sign out
      </button>
      <Link href={"/dashboard"}>
        <Image
          alt={name}
          src={image}
          width={64}
          height={64}
          className="w-10 rounded-full"
          priority
        />
      </Link>
    </li>
  );
}
