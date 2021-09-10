import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

import PostFeed from "../../components/PostFeed";
import TopButton from "../../components/TopButton";
import CreatePostLink from "../../components/CreatePostLink";

import { Sub } from "../../types";
import { useAuthState } from "../../context/auth";
import SubSidebar from "../../components/SubSidebar";
import SubHeader from "../../components/SubHeader";

export default function SubPage() {
  // Local state
  const [ownSub, setOwnSub] = useState(false);
  // Global state
  const { authenticated, user } = useAuthState();
  // Utils
  const router = useRouter();

  const subName = router.query.sub;

  const { data: sub, error, mutate } = useSWR<Sub>(
    subName ? `/subs/${subName}` : null
  );

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub, authenticated, user]);

  if (error) router.push("/");

  return (
    <>
      <div>
        <Head>
          <title>{sub?.title}</title>
        </Head>
        {sub && (
          <>
            <SubHeader sub={sub} ownSub={ownSub} mutate={mutate} />
            <div className="container flex pt-4">
              <div className="w-full md:w-160 md:p-0">
                {authenticated && <CreatePostLink user={user} sub={sub} />}
                <PostFeed />
              </div>
              <SubSidebar />
            </div>
          </>
        )}
      </div>
      <footer>
        <TopButton />
      </footer>
    </>
  );
}
