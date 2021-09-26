import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ModSiderbar({ moddedSubs }) {
  console.log(moddedSubs);
  return (
    <div className="hidden p-3 mt-3 overflow-auto bg-white rounded md:max-h-80 md:block">
      <span className="text-md">You're a moderator of these communities</span>
      {moddedSubs &&
        moddedSubs.length > 0 &&
        moddedSubs.map((sub, idx) => {
          return (
            <Link key={idx} href={`/r/${sub.name}`}>
              <a className="flex m-2">
                <Image
                  src={sub.imageUrl}
                  className="rounded-full"
                  alt="sub name"
                  height={(6 * 16) / 3}
                  width={(6 * 16) / 3}
                ></Image>
                <p className="ml-2">r/{sub.name}</p>
              </a>
            </Link>
          );
        })}
    </div>
  );
}
