import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import Image from "next/image";
import useSWR from "swr";
import { useAuthState } from "../context/auth";
import { Sub } from "../types";
import useToggle from "../hooks/useToggle";
import useOnClickOutside from "../hooks/useOnClickOutside";

export default function PageDropdown() {
  // Local state
  const [selectedPage, setSelectedPage] = useState("Home");
  const [isOpen, toggleIsOpen] = useToggle();

  // Global state
  const { authenticated, user } = useAuthState();

  // Utils
  const router = useRouter();
  const subName = router.query.sub;
  const ref = useRef();

  useOnClickOutside(
    ref,
    useCallback(() => toggleIsOpen(false), [isOpen])
  );

  const { data: sub } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (router.pathname === "/") {
      setSelectedPage("Home");
    } else if (router.pathname === "/r/all") {
      setSelectedPage("All");
    } else if (router.pathname === "/subs/create") {
      setSelectedPage("Create Community");
    } else if (
      router.pathname === "/submit" ||
      router.pathname === "/r/[sub]/submit"
    ) {
      setSelectedPage("Create Post");
    } else {
      //either sub or user profile page
      setSelectedPage(subName ? `r/${subName}` : `r/${router.query.username}`);
    }
  }, [router]);

  const handleToggleClick = (name: string) => {
    toggleIsOpen();
    setSelectedPage(name);
  };

  return (
    <>
      {authenticated && (
        <div ref={ref} className="relative hidden sm:w-24 sm:block lg:w-60">
          <div
            onClick={() => toggleIsOpen((toggle: boolean) => !toggle)}
            className="px-2 py-1 ml-6 border border-white rounded sm:flex sm:space-x-0 hover:border-gray-200"
          >
            {selectedPage === "Home" ? (
              <i className="mr-2 lg:mt-1 fas fa-home"></i>
            ) : selectedPage === "All" ? (
              <i className="mr-2 lg:mt-1 fas fa-globe-americas"></i>
            ) : selectedPage === "Create Community" ||
              selectedPage === "Create Post" ? (
              <i className="mr-2 lg:mt-1 fas fa-plus"></i>
            ) : router.pathname === "/u/[username]" ? (
              <Image
                src={user.imageUrl}
                className="rounded-full"
                alt="sub name"
                height={(6 * 16) / 3}
                width={(6 * 16) / 3}
              ></Image>
            ) : (
              sub && (
                <Image
                  src={sub.imageUrl}
                  className="rounded-full"
                  alt="sub name"
                  height={(6 * 16) / 3}
                  width={(6 * 16) / 3}
                ></Image>
              )
            )}
            <p className="hidden w-full px-1 ml-2 overflow-hidden lg:block ">
              {selectedPage}
            </p>
            <i className="px-2 my-auto fas fa-angle-down"></i>
          </div>
          <div
            className={classNames("absolute left-6 ", {
              hidden: isOpen === false,
            })}
          >
            <div className="py-4 overflow-auto bg-white rounded shadow-md w-60">
              <div className="flex flex-col">
                {user && user.moddedSubs.length > 0 && (
                  <>
                    <p className="px-4 py-1 text-xs text-gray-400">
                      Moderating
                    </p>
                    {user.moddedSubs.map(({ name, imageUrl }, idx) => {
                      return (
                        <Link key={idx} href={`/r/${name}`}>
                          <a
                            className="flex flex-row px-4 py-1 hover:bg-gray-200"
                            onClick={() => handleToggleClick(`r/${name}`)}
                          >
                            <Image
                              src={imageUrl}
                              className="rounded-full"
                              alt="User"
                              height={(6 * 16) / 4}
                              width={(6 * 16) / 4}
                            ></Image>
                            <p className="ml-2"> r/{name}</p>
                          </a>
                        </Link>
                      );
                    })}
                  </>
                )}
                {user && user.joinedSubs.length > 0 && (
                  <>
                    <p className="px-4 py-1 text-xs text-gray-400">
                      My Communities
                    </p>
                    <Link href="/subs/create">
                      <a
                        onClick={() => handleToggleClick("Creat Community")}
                        className="px-4 py-1 hover:bg-gray-200"
                      >
                        <i className="mr-2 fas fa-plus"></i>
                        Create Community
                      </a>
                    </Link>
                    {user.joinedSubs.map(({ name, imageUrl }, idx) => {
                      return (
                        <Link key={idx} href={`/r/${name}`}>
                          <a
                            className="flex flex-row px-4 py-1 hover:bg-gray-200"
                            onClick={() => handleToggleClick(`r/${name}`)}
                          >
                            <Image
                              src={imageUrl}
                              className="rounded-full"
                              alt="User"
                              height={(6 * 16) / 4}
                              width={(6 * 16) / 4}
                            ></Image>
                            <p className="ml-2"> r/{name}</p>
                          </a>
                        </Link>
                      );
                    })}
                  </>
                )}
                <p className="px-4 py-1 text-xs text-gray-400">Feeds</p>
                <Link href="/">
                  <a
                    className="px-4 py-1 hover:bg-gray-200"
                    onClick={() => handleToggleClick("Home")}
                  >
                    <i className="mr-2 fas fa-home"></i>Home
                  </a>
                </Link>
                <Link href="/r/all">
                  <a
                    className="px-4 py-1 hover:bg-gray-200"
                    onClick={() => handleToggleClick("All")}
                  >
                    <i className="mr-2 fas fa-globe-americas"></i>All
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
