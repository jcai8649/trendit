import Head from "next/head";
import Axios from "axios";
import { useEffect, useState, Fragment } from "react";
import defaultAvatar from "../images/defaultAvatar.png";
import Link from "next/link";
import Image from "next/Image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Post } from "../types";

dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    Axios.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="pt-12">
      <Head>
        <title>trendit: the front page of the internet trends</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts Feed */}
        <div className="w-160">
          {posts.map((post) => (
            <div key={post.identifier} className="flex mb-4 bg-white rounded">
              {/* Vote Section */}
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              {/* Post data Section */}
              <div className="w-full p-2">
                <div className="flex items-center">
                  <Link passHref href={`/r/${post.subName}`}>
                    <Fragment>
                      <Image
                        src={defaultAvatar}
                        className="w-6 h-6 rounded-full cursor-pointer"
                        alt="default avatar"
                        width={24}
                        height={24}
                      />
                      <a className="ml-1 text-xs font-bold cursor-pointer hover:underline">
                        /r/{post.subName}
                      </a>
                    </Fragment>
                  </Link>
                  <p className="text-xs text-gray-500">
                    <span className="mx-1">•</span>
                    Posted by
                    <Link href={`/u/${post.username}`}>
                      <a className="mx-1 hover:underline">/u/{post.username}</a>
                    </Link>
                    <Link href={post.url}>
                      <a className="mx-1 hover:underline">
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a className="my-1 text-lg font-medium">{post.title}</a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}

                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className="font-bold">20 Comments</span>
                      </div>
                    </a>
                  </Link>
                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-share fa-xs"></i>
                    <span className="font-bold">Share</span>
                  </div>
                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-bookmark fa-xs"></i>
                    <span className="font-bold">Save</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}
