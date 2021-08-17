import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useSWRInfinite } from "swr";
import { Post, Sub } from "../types";
import PostSorter from "../components/PostSorter";
import PostCard from "../components/PostCard";

export default function PostFeed() {
  const [observedPost, setObservedPost] = useState("");
  const [paramType, setParamType] = useState("posts");
  const [sortBy, setSortBy] = useState("top");

  const router = useRouter();

  const { data, error, size: page, setSize: setPage, mutate } = useSWRInfinite<
    Post[]
  >((index) => `/${paramType}?page=${index}&sort=${sortBy}`);

  console.log(data);

  const isInitialLoading = !data && !error;

  const posts: Post[] = useMemo(() => (data ? [].concat(...data) : []), [data]);

  useEffect(() => {
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
      <div className="w-full px-4 md:w-160 md:p-0">
        <PostSorter sortBy={sortBy} setSortBy={setSortBy} />
        {isInitialLoading && <p className="loader">Loading..</p>}
        {posts.map((post) => (
          <PostCard post={post} key={post.identifier} mutate={mutate} />
        ))}
      </div>
    </>
  );
}
