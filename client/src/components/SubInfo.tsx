import React, { useEffect, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import Axios from "axios";
import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";

export default function SubInfo({ sub, ownSub, openFileInput, mutate }) {
  //Local State
  const [joined, setJoined] = useState(false);
  // Global state
  const { authenticated, user } = useAuthState();

  const router = useRouter();
  const subName = router.query.sub;

  const handleJoinClick = async () => {
    try {
      if (joined) {
        await Axios.delete(`/subs/${subName}`);
      } else {
        await Axios.post(`/subs/${subName}`);
      }
      setJoined(!joined);
      //update joinSub to render the join button properly
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (
      authenticated &&
      sub.joinUsers.find((joinUser) => joinUser.username === user.username)
    ) {
      setJoined(true);
    }
  }, [authenticated, user, sub.joinUsers]);

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
            width={65}
            height={65}
          />
          <div
            className={classNames(
              "cursor-default opacity-0 rounded-full py-2 text-center absolute bg-black w-auto h-auto text-white",
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
            <h1 className="mb-1 font-bold text-md sm:text-2xl md:text-3xl">
              {sub.title}
            </h1>
            {authenticated && (
              <button
                className={classNames(
                  "ml-2 sm:ml-6 capitalize group text-xs w-14 sm:text-md font-sans bold button blue sm:h-8 sm:w-24",
                  { hollow: joined }
                )}
                onClick={handleJoinClick}
              >
                {joined ? (
                  <span>
                    <span className="group-hover:hidden">Joined</span>
                    <span className="hidden group-hover:block">Leave</span>
                  </span>
                ) : (
                  "Join"
                )}
              </button>
            )}
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
