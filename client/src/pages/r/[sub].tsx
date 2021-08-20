import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, createRef, useEffect, useState } from "react";
import useSWR from "swr";

import PostFeed from "../../components/PostFeed";
import TopButton from "../../components/TopButton";
import PostCard from "../../components/PostCard";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

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
              <div
                className={classNames("bg-blue-500 relative", {
                  "cursor-pointer": ownSub,
                })}
              >
                <div
                  className={classNames(
                    "cursor-default opacity-0 pt-3 text-center absolute bg-black w-full h-full text-white",
                    {
                      "cursor-pointer block hover:opacity-70": ownSub,
                    }
                  )}
                  style={{ top: -1, left: 0 }}
                  onClick={() => openFileInput("banner")}
                >
                  Update Banner
                </div>
                {sub.bannerUrl ? (
                  <div
                    className="h-56 bg-blue-500 "
                    style={{
                      backgroundImage: `url(${sub.bannerUrl})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                ) : (
                  <div className="h-20 bg-blue-500"></div>
                )}
              </div>
              {/* Sub meta data */}
              <div className="pb-2 bg-white sm:h-20 sm:pb-0">
                <div className="container relative flex">
                  <div className="absolute" style={{ top: -15 }}>
                    <Image
                      src={sub.imageUrl}
                      alt="Sub Image"
                      className={classNames(
                        "rounded-full bg-white border-white",
                        {
                          "cursor-point": ownSub,
                        }
                      )}
                      width={70}
                      height={70}
                    />
                    <div
                      className={classNames(
                        "cursor-default opacity-0 rounded-full pt-3 text-center absolute bg-black w-18 h-18 text-white",
                        {
                          "cursor-pointer block hover:opacity-70": ownSub,
                        }
                      )}
                      style={{ top: -1, left: 0 }}
                      onClick={() => openFileInput("image")}
                    >
                      Update Icon
                    </div>
                  </div>
                  <div className="pt-1 pl-24">
                    <div className="flex items-center">
                      <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                    </div>
                    <div className="flex text-sm font-bold text-gray-500">
                      /r/{sub.name}{" "}
                      {ownSub ? (
                        <p className="w-24 ml-2 text-xs text-center text-blue-500 border-2 border-blue-500 rounded-full">
                          sub moderator
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container flex pt-4">
              <div className="w-full px-4 md:w-160 md:p-0">
                {/* Create Post */}
                {authenticated && (
                  <div className="flex flex-row content-center w-full px-1 py-1 mb-4 bg-white rounded">
                    <Link href={`/u/${user.username}`}>
                      <a className="m-2 cursor-pointer">
                        <Image
                          src={user.imageUrl}
                          className="rounded-full"
                          alt="User"
                          height={(6 * 16) / 2.5}
                          width={(6 * 16) / 2.5}
                        />
                      </a>
                    </Link>
                    <Link href={`/r/${sub.name}/submit`}>
                      <input
                        type="text"
                        className="w-full pl-2 m-2 text-sm bg-gray-100 rounded"
                        placeholder="Create Post"
                      />
                    </Link>
                  </div>
                )}
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
