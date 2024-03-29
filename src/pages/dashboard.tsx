import { NextApiRequest, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { Layout, Post } from "~/components";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const { data } = api.post.getMyPost.useQuery();

  return (
    <main>
      <Head>
        <title>Chuaks Profile</title>
        <meta
          name="description"
          content="Chuaks is an application to write funny sentences and other users can comment and like on them."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <h1 className="text-2xl font-bold">
          Welcome back {session?.user.name}
        </h1>
        <div className="mt-8">
          <h3 className="my-3 text-gray-800">My Posts</h3>
          {data?.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </Layout>
    </main>
  );
};

export default Dashboard;

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
