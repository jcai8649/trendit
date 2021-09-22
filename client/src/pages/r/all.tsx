import Head from "next/head";
import PostFeed from "../../components/PostFeed";
import TopButton from "../../components/TopButton";
import { useAuthState } from "../../context/auth";
import Link from "next/link";

import TopCommunitiesSidebar from "../../components/TopCommunitiesSidebar";

export default function AllSubPage() {
  const { authenticated } = useAuthState();
  return (
    <>
      <Head>
        <title>r/all</title>
      </Head>
      <div className="container flex pt-4">
        <div className="w-full md:w-160 md:p-0">
          <PostFeed />
        </div>
        <div className="hidden ml-6 md:block w-80">
          <TopCommunitiesSidebar />
          {authenticated && (
            <div className="mt-4 bg-white rounded">
              <div className="p-4 bg-blue-500 border-b-2 rounded-t"></div>
              <p className="my-2 ml-4 text-lg text-left text-black py-">
                r/all
              </p>
              <p className="px-4 text-sm">
                The most active posts from all of Trendit. Come here to see new
                posts rising and be a part of the conversation.
              </p>
              <div className="p-4">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-2 blue hollow button">
                    Create Community
                  </a>
                </Link>
                <Link href="/submit">
                  <a className="w-full px-2 py-2 my-2 blue button">
                    Create Post
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer>
        <TopButton />
      </footer>
    </>
  );
}
