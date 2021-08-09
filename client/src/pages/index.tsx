import Head from "next/head";
import { useEffect, useState, useMemo, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR, { useSWRInfinite } from "swr";
import Image from "next/image";
import Link from "next/link";

import PostSorter from "../components/PostSorter";
import PostCard from "../components/PostCard";
import TopButton from "../components/TopButton";

import { Sub, Post } from "../types";
import { useAuthState } from "../context/auth";

dayjs.extend(relativeTime);

export default function Home() {
  const [observedPost, setObservedPost] = useState("");

  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  const description =
    "Trendit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!";
  const title = "Trendit: Dive into the trends";

  const { authenticated } = useAuthState();

  const {
    data,
    error,
    size: page,
    setSize: setPage,

    mutate,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`);

  const isInitialLoading = !data && !error;

  const posts: Post[] = useMemo(() => (data ? [].concat(...data) : []), [data]);

  useEffect(() => {
    const observerElement = (element: HTMLElement) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting === true) {
            setPage(page + 1);
            observer.unobserve(element);
          }
        },
        { threshold: 1 }
      );
      observer.observe(element);
    };

    if (!posts || posts.length === 0) {
      return;
    }
    const id = posts[posts.length - 1].identifier;

    if (id !== observedPost) {
      setObservedPost(id);
      observerElement(document.getElementById(id));
    }

    return () => {
      const observerElement = (element: HTMLElement) => {
        if (!element) return;

        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting === true) {
              setPage(page + 1);
              observer.unobserve(element);
            }
          },
          { threshold: 1 }
        );
        observer.observe(element);
      };

      if (!posts || posts.length === 0) {
        return;
      }
      const id = posts[posts.length - 1].identifier;

      if (id !== observedPost) {
        setObservedPost(id);
        observerElement(document.getElementById(id));
      }
    };
  }, [page, setPage, posts, observedPost]);

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
        <div className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && <p className="loader">Loading..</p>}
          <PostSorter />
          {posts.map((post) => (
            <PostCard post={post} key={post.identifier} mutate={mutate} />
          ))}
        </div>
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
                  <a className="w-full px-2 py-1 blue button">
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
