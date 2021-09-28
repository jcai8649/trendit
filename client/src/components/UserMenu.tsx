import React, { useEffect, useState, useRef, useCallback } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useRouter } from "next/router";
import { useAuthDispatch } from "../context/auth";
import Image from "next/image";
import Axios from "axios";
import Link from "next/link";
import useToggle from "../hooks/useToggle";
import classNames from "classnames";
import { User } from "../types";

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  // Local state
  const [isOpen, toggleIsOpen] = useToggle();

  // Global state
  const dispatch = useAuthDispatch();
  // Utils
  const router = useRouter();
  const ref = useRef();

  useOnClickOutside(
    ref,
    useCallback(() => toggleIsOpen(false), [isOpen])
  );

  const logoutHandler = () => {
    Axios.get("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        dispatch("RERENDER");
        router.replace("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div ref={ref} className="relative flex flex-row w-max">
      <div
        onClick={() => toggleIsOpen()}
        className="p-2 py-1 mr-2 leading-5 border border-white rounded cursor-pointer hover:border-gray-200 sm:flex sm:space-x-0"
      >
        <Image
          src={user.imageUrl}
          className="rounded-full "
          alt="User"
          height={(6 * 16) / 4}
          width={(6 * 16) / 4}
        />

        <p className="hidden pl-2 lg:block">u/{user.username}</p>
        <i className="px-1 md:my-auto md:px-2 fas fa-angle-down" />
      </div>
      <div
        className={classNames(
          "absolute w-32 md:w-30 p-1 right-2 top-8 z-10 flex flex-col bg-white border border-gray-100 rounded shadow-md",
          { hidden: isOpen === false }
        )}
      >
        <Link href={`/u/${user.username}`}>
          <button className="p-2 wy-auto hover:bg-blue-400 hover:text-white">
            <i className="mr-2 far fa-user-circle" />
            Profile
          </button>
        </Link>
        <button
          className="p-2 wy-auto hover:bg-blue-400 hover:text-white"
          onClick={logoutHandler}
        >
          <i className="mr-2 fas fa-sign-out-alt " />
          Logout
        </button>
      </div>
    </div>
  );
}
