import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth";

export default function PageIndicator() {
  const router = useRouter();

  console.log(router);
  const pageList = {
    "/r/all": {
      name: "r/all",
      desc:
        "The most active posts from all of Trendit. Come here to see new posts rising and be a part of the conversation.",
    },
    "/": {
      name: "Home",
      desc:
        "Your personal Reddit frontpage. Come here to check in with your favorite communities.",
    },
  };

  const { authenticated } = useAuthState();
  return (
    <>
      {authenticated && (
        <div className="mt-4 bg-white rounded">
          <div className="p-4 bg-blue-500 border-b-2 rounded-t"></div>
          <p className="my-2 ml-4 text-lg text-left text-black py-">
            {pageList[router.asPath].name}
          </p>
          <p className="px-4 text-sm">{pageList[router.asPath].desc}</p>
          <div className="p-4">
            <Link href="/submit">
              <a className="w-full px-2 py-2 mb-2 blue button">Create Post</a>
            </Link>
            <Link href="/subs/create">
              <a className="w-full px-2 py-2 blue hollow button">
                Create Community
              </a>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
