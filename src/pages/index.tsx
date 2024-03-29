import { useQueryClient } from "@tanstack/react-query";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";

import { CreatePost, Layout, Post, RequiredLogin } from "~/components";
import useScrollPosition from "~/hooks/useScrollPosition";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const scrollPosition = useScrollPosition();
  const client = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    api.post.getAll.useInfiniteQuery(
      {
        limit: 5,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, fetchNextPage, hasNextPage, isFetching]);

  return (
    <>
      <Head>
        <title>Chuaks</title>
        <meta
          name="description"
          content="Chuaks is an application to write funny sentences and other users can comment and like on them."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {session ? (
          <CreatePost />
        ) : (
          <RequiredLogin text="Please Sign In to interact with post(s)" />
        )}
        {isLoading && <div>Loading...</div>}
        {posts?.map((post) => (
          <Post key={post.id} post={post} client={client} />
        ))}

        {isFetching && <p>Fetching...</p>}

        {!hasNextPage && (
          <div>
            <p>No more post</p>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Home;
