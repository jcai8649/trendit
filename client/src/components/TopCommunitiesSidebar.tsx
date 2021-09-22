import React from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Sub } from "../types";
import { useAuthState } from "../context/auth";

export default function TopCommunitiesSidebar() {
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");
  const { authenticated } = useAuthState();

  return (
    <div className="bg-white rounded">
      <div className="p-4 bg-blue-500 border-b-2 rounded-t">
        <p className="text-lg font-semibold text-center text-white">
          Top Communities
        </p>
      </div>
      <div>
        {topSubs?.map((sub, idx) => (
          <div
            key={sub.name}
            className="flex items-center px-4 py-2 text-xs border-b"
          >
            <p className="mr-2 font-bold">{idx + 1}.</p>
            <Link passHref href={`/r/${sub.name}`}>
              <a>
                <Image
                  src={sub.imageUrl}
                  alt="Sub"
                  className="overflow-hidden rounded-full cursor-pointer"
                  width={(6 * 16) / 4}
                  height={(6 * 16) / 4}
                />
              </a>
            </Link>
            <Link href={`/r/${sub.name}`}>
              <a className="ml-2 font-bold hover:cursor-pointer">
                /r/{sub.name}
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
