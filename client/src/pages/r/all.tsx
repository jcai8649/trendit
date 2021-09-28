import Head from "next/head";
import PostFeed from "../../components/PostFeed";
import TopButton from "../../components/TopButton";
import PageIndicator from "../../components/PageIndicator";

import TopCommunitiesSidebar from "../../components/TopCommunitiesSidebar";

export default function AllSubPage() {
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
          <PageIndicator />
        </div>
      </div>
      <footer>
        <TopButton />
      </footer>
    </>
  );
}
