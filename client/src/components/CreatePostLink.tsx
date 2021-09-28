import React from "react";
import { User, Sub } from "../types";
import Link from "next/link";
import Image from "next/image";

interface CreatePostLinkProps {
  user: User;
  sub?: Sub;
}

export default function CreatePostLink({
  user,
  sub = null,
}: CreatePostLinkProps) {
  return (
    <div className="flex flex-row p-1 mx-4 mb-4 bg-white rounded md:mx-0">
      <Link href={`/u/${user.username}`}>
        <a className="m-2 cursor-pointer">
          <Image
            src={user.imageUrl}
            className="rounded-full"
            alt="User"
            height={(6 * 16) / 2.5}
            width={(6 * 16) / 2.5}
          />
        </a>
      </Link>
      <Link href={sub ? `/r/${sub.name}/submit` : "/submit"}>
        <input
          type="text"
          className="w-full pl-2 my-2 text-sm bg-gray-100 rounded"
          placeholder="Create Post"
        />
      </Link>
      <Link href={sub ? `/r/${sub.name}/submit?url` : "/submit?url"}>
        <div className="px-3 py-2 my-auto ml-1 rounded cursor-pointer hover:bg-gray-200">
          <i className="text-gray-400 fas fa-link" />
        </div>
      </Link>
    </div>
  );
}
