import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import Axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentSorter from "../../../../components/CommentSorter";
import PostInfoCard from "../../../../components/PostInfoCard";
import { Post, Comment } from "../../../../types";
import Sidebar from "../../../../components/Sidebar";
import { useAuthState } from "../../../../context/auth";
import { useEffect, useState } from "react";
import CommentFeed from "../../../../components/CommentFeed";
import CommentSubmissionForm from "../../../../components/CommentSubmissionForm";

dayjs.extend(relativeTime);

export default function PostPage() {
  // Local state
  const [description, setDescription] = useState("");
  const [sortBy, setSortBy] = useState("top");
  const [isOp, setIsOp] = useState(false);
  // Global state
  const { authenticated } = useAuthState();

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
                <div className="w-8 h-8 mr-2 overflow-hidden bg-white border-2 border-gray-200 rounded-full">
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
                <PostInfoCard vote={vote} post={post} />
                {/* Comment Input Area */}
                <CommentSubmissionForm
                  commentMutate={commentMutate}
                  post={post}
                />
                {/* Comment Sorter */}
                <CommentSorter sortBy={sortBy} setSortBy={setSortBy} />
                <hr />
                {/* Comments feed */}
                <CommentFeed comments={comments} vote={vote} />
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
