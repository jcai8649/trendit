import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, createRef, useEffect, useState } from "react";
import useSWR from "swr";

import PostFeed from "../../components/PostFeed";
import TopButton from "../../components/TopButton";
import SubInfo from "../../components/SubInfo";
import CreatePostLink from "../../components/CreatePostLink";
import SubBanner from "../../components/SubBanner";

import { Sub } from "../../types";
import { useAuthState } from "../../context/auth";
import Axios from "axios";
import Sidebar from "../../components/Sidebar";

export default function SubPage() {
  // Local state
  const [ownSub, setOwnSub] = useState(false);
  // Global state
  const { authenticated, user } = useAuthState();
  // Utils
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();

  const subName = router.query.sub;

  const { data: sub, error, mutate } = useSWR<Sub>(
    subName ? `/subs/${subName}` : null
  );

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub, authenticated, user]);

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  if (error) router.push("/");

  return (
    <>
      <div>
        <Head>
          <title>{sub?.title}</title>
        </Head>

        {sub && (
          <>
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            />
            {/* Sub info and images */}
            <div>
              {/* Banner image */}
              <SubBanner
                sub={sub}
                ownSub={ownSub}
                openFileInput={openFileInput}
              />
              {/* Sub meta data */}
              <SubInfo
                sub={sub}
                ownSub={ownSub}
                openFileInput={openFileInput}
              />
            </div>
            <div className="container flex pt-4">
              <div className="w-full md:w-160 md:p-0">
                {/* Create Post */}
                {authenticated && <CreatePostLink user={user} sub={sub} />}
                {/* PostFeed */}
                <PostFeed />
              </div>
              {/* Sidebar */}
              <Sidebar sub={sub} />
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
