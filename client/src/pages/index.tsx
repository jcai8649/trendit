import Head from "next/head";
import Axios from "axios";
import { useEffect, useState, Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR from "swr";

import PostCard from "../components/PostCard";

import { Post } from "../types";

dayjs.extend(relativeTime);

export default function Home() {
  const { data: posts } = useSWR("/posts");

  return (
    <Fragment>
      <Head>
        <title>trendit: the front page of the internet trends</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts Feed */}
        <div className="w-160">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </Fragment>
  );
}
