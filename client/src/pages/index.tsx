import Head from "next/head";
import Link from "next/link";
import PostFeed from "../components/PostFeed";
import TopCommunitiesSidebar from "../components/TopCommunitiesSidebar";
import TopButton from "../components/TopButton";
import CreatePostLink from "../components/CreatePostLink";
import { useAuthState } from "../context/auth";

export default function Home() {
  const description =
    "Trendit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";
  const title = "Trendit: Dive into the trends";

  const { authenticated, user } = useAuthState();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={title} />
      </Head>
      <div className="container flex pt-4">
        <div className="w-full md:p-0 md:w-160 ">
          {authenticated && <CreatePostLink user={user} />}
          <PostFeed />
        </div>
        <div className="hidden ml-6 md:block w-80">
          <TopCommunitiesSidebar />
          {authenticated && (
            <div className="mt-4 bg-white rounded">
              <div className="p-4 bg-blue-500 border-b-2 rounded-t"></div>
              <p className="my-2 ml-4 text-lg text-left text-black py-">Home</p>
              <p className="px-4 text-sm">
                Your personal Reddit frontpage. Come here to check in with your
                favorite communities.
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
