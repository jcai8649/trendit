import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useSWRInfinite } from "swr";
import { useAuthState } from "../context/auth";
import { Post } from "../types";
import Link from "next/link";
import classNames from "classnames";
import PostSorter from "../components/PostSorter";
import PostCard from "../components/PostCard";

export default function PostFeed() {
  //Local state
  const [observedPost, setObservedPost] = useState("");
  const [paramType, setParamType] = useState("posts");
  const [sortBy, setSortBy] = useState("top");

  // Global state
  const { authenticated, user } = useAuthState();
  const router = useRouter();

  const { data, error, size: page, setSize: setPage, mutate } = useSWRInfinite<
    Post[]
  >((index) => `/${paramType}?page=${index}&sort=${sortBy}`);

  const isInitialLoading = !data && !error;

  const posts: Post[] = useMemo(() => (data ? [].concat(...data) : []), [data]);

  useEffect(() => {
    //update user postfeed after login
    mutate();
    if (router.query.sub) {
      setParamType(`subs/${router.query.sub}/posts`);
    }
  }, []);

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
      <div className="w-full px-4 md:p-0 lg:w-160 ">
        <PostSorter sortBy={sortBy} setSortBy={setSortBy} />
        {isInitialLoading ? (
          <p className="loader">Loading..</p>
        ) : (
          <div
            className={classNames("relative mb-4", {
              hidden: posts.length > 0,
            })}
          >
            {[...Array(6)].map((x, i) => (
              <div
                key={i}
                className="w-full h-24 bg-gray-200 border border-gray-300"
              >
                <div className="flex flex-col w-10 h-full py-3 space-y-8 text-center rounded-l">
                  <i className="text-gray-400 icon-arrow-up"></i>
                  <i className="text-gray-400 icon-arrow-down"></i>
                </div>
              </div>
            ))}
            <div className="absolute w-auto text-center inset-1/4 md:w-80">
              {authenticated && router.asPath === "/" ? (
                <>
                  <img
                    className="w-20 mx-auto"
                    src="https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/100/000000/external-telescope-interface-kiranshastry-gradient-kiranshastry.png"
                  />
                  <h2 className="my-3 md:w-full ">
                    Trendit gets better when you join communities, so find some
                    that you’ll love!
                  </h2>
                  <Link href="/">
                    <a className="w-40 py-1 text-sm capitalize md:py-2 md:w-56 blue button">
                      Browse Popular Posts
                    </a>
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-lg">There are no posts in this sub</h2>
                  <p className="text-sm">Be the first</p>
                  <Link href="/">
                    <a className="w-40 py-1 mt-3 text-sm capitalize md:py-2 md:w-56 blue button">
                      Add a post
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
        )
        // <div
        //   className={classNames("block mt-20 text-center", {
        //     hidden: posts.length > 0,
        //   })}
        // >
        //   "hmm... there are no posts for this sub yet"
        // </div>
        }
        {posts.map((post) => (
          <PostCard post={post} key={post.identifier} mutate={mutate} />
        ))}
      </div>
    </>
  );
}
