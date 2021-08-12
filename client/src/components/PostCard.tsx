import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Axios from "axios";
import { Post } from "../types";
import classNames from "classnames";
import ActionButton from "./ActionButton";
import LinkConverter from "./LinkConverter";
import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";
import parse from "html-react-parser";

interface PostCardProps {
  post: Post;
  mutate?: Function;
}

dayjs.extend(relativeTime);

export default function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    inputType,
    subName,
    createdAt,
    voteScore,
    userVote,
    username,
    commentCount,
    url,
    sub,
  },
  mutate,
}: PostCardProps) {
  const { authenticated } = useAuthState();

  const router = useRouter();

  const isInSubPage = router.pathname === "/r/[sub]"; // /r/[sub]

  const vote = async (value) => {
    if (!authenticated) router.push("/login");

    if (value === userVote) value = 0;
    try {
      await Axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });

      if (mutate) mutate();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      key={identifier}
      className="flex mb-4 overflow-auto bg-white rounded"
      id={identifier}
    >
      {/* Vote Section */}
      <div className="w-10 py-3 text-center bg-gray-100 rounded-l">
        {/* Upvote */}
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": userVote === 1,
            })}
            onClick={() => vote(1)}
          ></i>
        </div>
        <p className="text-xs font-bold">
          {voteScore === 0 ? "Vote" : voteScore}
        </p>
        {/* Downvote */}
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600">
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-600": userVote === -1,
            })}
            onClick={() => vote(-1)}
          ></i>
        </div>
      </div>
      {/* Post data Section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <>
              <Link href={`/r/${subName}`}>
                <a>
                  <Image
                    src={sub.imageUrl}
                    className="w-6 h-6 rounded-full cursor-pointer"
                    alt="default avatar"
                    width={24}
                    height={24}
                  />
                </a>
              </Link>
              <Link href={`/r/${subName}`}>
                <a className="ml-1 text-xs font-bold cursor-pointer hover:underline">
                  /r/{subName}
                </a>
              </Link>
              <span className="mx-1 text-xs text-gray-500">•</span>
            </>
          )}
          <p className="text-xs text-gray-500">
            Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && (
          <div className="my-1 text-sm ck-content">
            {inputType === "post" ? parse(body) : <LinkConverter url={body} />}
          </div>
        )}

        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} Comments</span>
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
  );
}
