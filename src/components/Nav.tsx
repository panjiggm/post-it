import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between py-8">
      <Link href="/">
        <h1 className="text-lg font-bold">Post a Chuaks</h1>
      </Link>
      <ul className="flex items-center gap-6">
        {!session?.user && (
          <li className="list-none">
            <button
              className="rounded-lg bg-gray-700 px-6 py-2 text-sm text-white disabled:opacity-25"
              onClick={() => signIn()}
            >
              Sign In
            </button>
          </li>
        )}
        {session?.user && (
          <li className="flex items-center gap-4">
            <button
              className="rounded-lg bg-gray-700 px-6 py-2 text-sm text-white disabled:opacity-25"
              onClick={() => signOut()}
            >
              Sign out
            </button>
            <Link href={"/dashboard"}>
              <Image
                alt={session?.user.name ?? ""}
                src={session?.user.image ?? ""}
                width={64}
                height={64}
                className="w-10 rounded-full"
                priority
              />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
