import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import { useAuthState } from "../context/auth";
import useOnClickOutside from "../hooks/useOnClickOutside";

export default function PageDropdown() {
  //local state
  const [selectedPage, setSelectedPage] = useState("Home");
  const [toggle, setToggle] = useState(false);
  //global state
  const { authenticated, user } = useAuthState();

  const router = useRouter();
  const ref = useRef();

  useOnClickOutside(
    ref,
    useCallback(() => setToggle(false), [toggle])
  );

  useEffect(() => {
    if (router.pathname === "/") {
      setSelectedPage("Home");
    } else if (router.pathname === "/r/all") {
      setSelectedPage("All");
    } else {
      setSelectedPage(router.asPath.slice(1));
    }
  }, [router]);

  return (
    <>
      {authenticated && (
        <div ref={ref} className="relative hidden sm:w-20 sm:block lg:w-40">
          <div
            onClick={() => setToggle((toggle) => !toggle)}
            className="px-2 py-1 ml-6 border border-white rounded md:flex sm:space-x-0 hover:border-gray-200"
          >
            {selectedPage === "Home" ? (
              <i className="mr-2 lg:mt-1 fas fa-home"></i>
            ) : selectedPage === "All" ? (
              <i className="mr-2 lg:mt-1 fas fa-globe-americas"></i>
            ) : (
              ""
            )}
            <div className="hidden w-full overflow-hidden lg:block ">
              {selectedPage}
            </div>
            <i className="my-auto ml-4 fas fa-angle-down"></i>
          </div>
          <div
            className={classNames("absolute left-6 ", {
              hidden: toggle === false,
            })}
          >
            <div className="w-40 py-4 overflow-auto bg-white rounded shadow-md">
              <div className="flex flex-col">
                <p className="px-4 py-1 text-xs text-gray-400">Feeds</p>
                <Link href="/">
                  <a
                    className="px-4 py-1 hover:bg-gray-200"
                    onClick={() => setSelectedPage("Home")}
                  >
                    <i className="mr-2 fas fa-home"></i>Home
                  </a>
                </Link>
                <Link href="/r/all">
                  <a
                    className="px-4 py-1 hover:bg-gray-200"
                    onClick={() => setSelectedPage("All")}
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
