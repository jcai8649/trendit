import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CreatePostLink({ user, sub }) {
  return (
    <div className="flex flex-row py-1 mx-4 mb-4 bg-white rounded md:mx-0">
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
      <Link href={`/r/${sub.name}/submit`}>
        <input
          type="text"
          className="w-full pl-2 m-2 text-sm bg-gray-100 rounded"
          placeholder="Create Post"
        />
      </Link>
      <Link href={`/r/${sub.name}/submit?url`}>
        <div className="px-3 py-2 my-auto mr-2 rounded cursor-pointer hover:bg-gray-200">
          <i className="text-gray-400 fas fa-link" />
        </div>
      </Link>
    </div>
  );
}
