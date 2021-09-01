import React from "react";
import Image from "next/image";
import classNames from "classnames";

export default function SubInfo({ sub, ownSub, openFileInput }) {
  return (
    <div className="pb-2 bg-white sm:h-20 sm:pb-0">
      <div className="container relative flex">
        <div
          className="absolute border-4 border-white rounded-full"
          style={{ top: -15 }}
        >
          <Image
            src={sub.imageUrl}
            alt="Sub Image"
            className={classNames("rounded-full bg-white ", {
              "cursor-point": ownSub,
            })}
            width={70}
            height={70}
          />
          <div
            className={classNames(
              "cursor-default opacity-0 rounded-full pt-3 text-center absolute bg-black w-18 h-18 text-white",
              {
                "cursor-pointer block hover:opacity-70": ownSub,
              }
            )}
            style={{ top: -1, left: 0 }}
            onClick={() => openFileInput("image")}
          >
            Update Icon
          </div>
        </div>
        <div className="pt-1 pl-24">
          <div className="flex items-center">
            <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
          </div>
          <div className="flex text-sm font-bold text-gray-500">
            /r/{sub.name}{" "}
            {ownSub ? (
              <p className="w-24 ml-2 text-xs text-center text-blue-500 border-2 border-blue-500 rounded-full">
                sub moderator
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
