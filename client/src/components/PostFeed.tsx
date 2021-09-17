import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useSWRInfinite } from "swr";
import { useAuthState } from "../context/auth";
import { Post } from "../types";
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
      <div className="w-full px-4 md:w-140 md:p-0 lg:w-160 ">
        <PostSorter sortBy={sortBy} setSortBy={setSortBy} />
        {isInitialLoading ? (
          <p className="loader">Loading..</p>
        ) : (
          <div
            className={classNames("block mt-20 text-center", {
              hidden: posts.length > 0,
            })}
          >
            hmm... there are no posts for this sub yet
          </div>
        )}
        {posts.map((post) => (
          <PostCard post={post} key={post.identifier} mutate={mutate} />
        ))}
      </div>
    </>
  );
}
