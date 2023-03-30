import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

import Login from "./auth/Login";
import Logged from "./auth/Logged";

export default async function Nav() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex items-center justify-between py-8">
      <Link href="/">
        <h1 className="text-lg font-bold">Send it.</h1>
      </Link>
      <ul className="flex items-center gap-6">
        {!session?.user && <Login />}
        {session?.user && (
          <Logged
            name={session.user.name ?? ""}
            image={session.user.image ?? ""}
          />
        )}
      </ul>
    </nav>
  );
}
