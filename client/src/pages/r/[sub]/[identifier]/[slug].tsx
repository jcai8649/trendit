import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import Axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentSorter from "../../../../components/CommentSorter";
import classNames from "classnames";

import parse from "html-react-parser";
import { Post, Comment } from "../../../../types";
import Sidebar from "../../../../components/Sidebar";
import { useAuthState } from "../../../../context/auth";
import ActionButton from "../../../../components/ActionButton";
import { FormEvent, useEffect, useState } from "react";
import LinkConverter from "../../../../components/LinkConverter";
import CommentFeed from "../../../../components/CommentFeed";

dayjs.extend(relativeTime);

export default function PostPage() {
  // Local state
  const [newComment, setNewComment] = useState("");
  const [description, setDescription] = useState("");
  const [sortBy, setSortBy] = useState("top");
  // Global state
  const { authenticated, user } = useAuthState();

  // Utils
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error, mutate: postMutate } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  const { data: comments, mutate: commentMutate } = useSWR<Comment[]>(
    identifier && slug
      ? `/posts/${identifier}/${slug}/comments?sort=${sortBy}`
      : null
  );

  const vote = async (value: number, comment?: Comment) => {
    // If not logged in go to login
    if (!authenticated) router.push("/login");

    // If vote is the same reset vote
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;

    try {
      await Axios.post("/misc/vote", {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      if (comment) commentMutate();
      else postMutate();
    } catch (err) {
      console.log(err);
    }
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;

    try {
      await Axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: newComment,
      });

      setNewComment("");
      commentMutate();
    } catch (err) {
      console.log(err);
    }
  };

  if (error) router.push("/");

  useEffect(() => {
    if (!post) return;
    let desc = post.body || post.title;
    desc = desc.substring(0, 158).concat(".."); // Hello world..
    setDescription(desc);
  }, [post]);

  return (
    <>
      <Head>
        <title>{post?.title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:description" content={description} />
        <meta property="og:title" content={post?.title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={post?.title} />
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                    alt="sub image"
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  {/* Vote section */}
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                    {/* Upvote */}
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1)}
                    >
                      <i
                        className={classNames("icon-arrow-up", {
                          "text-red-500": post.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold">{post.voteScore}</p>
                    {/* Downvote */}
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                      onClick={() => vote(-1)}
                    >
                      <i
                        className={classNames("icon-arrow-down", {
                          "text-blue-600": post.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  <div className="flex-1 py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={post.url}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* Post title */}
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    {/* Post body */}
                    {post.body && (
                      <div className="my-3 text-sm ck-content">
                        {post.inputType === "post" ? (
                          parse(post.body)
                        ) : (
                          <LinkConverter url={post.body} />
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex">
                      <Link href={post.url}>
                        <a>
                          <ActionButton>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">
                              {post.commentCount} Comments
                            </span>
                          </ActionButton>
                        </a>
                      </Link>
                      <ActionButton>
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                      </ActionButton>
                      <ActionButton>
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>
                {/* Comment Input Area */}
                <div className="pl-10 pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{" "}
                        <Link href={`/u/${user.username}`}>
                          <a className="font-semibold text-blue-500">
                            {user.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                          onChange={(e) => setNewComment(e.target.value)}
                          value={newComment}
                        ></textarea>
                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 blue button"
                            disabled={newComment.trim() === ""}
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                      <p className="font-semibold text-gray-400">
                        Log in or sign up to leave a comment
                      </p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mb-1 mr-4 hollow blue button">
                            Log In
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">Sign Up</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {/* Comment Sorter */}
                <CommentSorter sortBy={sortBy} setSortBy={setSortBy} />
                <hr />
                {/* Comments feed */}
                <CommentFeed dayjs={dayjs} comments={comments} vote={vote} />
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
