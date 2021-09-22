import Head from "next/head";
import PageIndicator from "../components/PageIndicator";
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
          <PageIndicator />
        </div>
      </div>
      <footer>
        <TopButton />
      </footer>
    </>
  );
}
