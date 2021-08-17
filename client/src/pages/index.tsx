import Head from "next/head";

import PostFeed from "../components/PostFeed";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

import TopButton from "../components/TopButton";

import { Sub } from "../types";
import { useAuthState } from "../context/auth";

dayjs.extend(relativeTime);

export default function Home() {
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  const description =
    "Trendit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";
  const title = "Trendit: Dive into the trends";

  const { authenticated } = useAuthState();

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
        {/* Posts Feed */}
        <PostFeed />
        {/* Sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 bg-blue-500 border-b-2 rounded-t">
              <p className="text-lg font-semibold text-center text-white">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub, idx) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <p className="mr-2 font-bold">{idx + 1}.</p>
                  <Link passHref href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        className="overflow-hidden rounded-full cursor-pointer"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </a>
                  </Link>
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-2 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer>
        <TopButton />
      </footer>
    </>
  );
}
