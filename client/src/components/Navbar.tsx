import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../images/red_icon.svg";
import { useAuthState } from "../context/auth";
import useWindowSize from "../hooks/useWindowSize";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";
import PageDropdown from "./PageDropdown";

const Navbar: React.FC = () => {
  const { authenticated, user, loading, toggleRender } = useAuthState();
  const { width } = useWindowSize();

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white">
      {/* Logo and title */}
      <div className="flex items-center">
        <Link href="/">
          <a>
            <Logo className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="hidden text-2xl font-semibold lg:block">
          <Link href="/">trendit</Link>
        </span>
        <PageDropdown />
      </div>
      {/* Search Input */}
      <SearchBar />
      {/* Auth buttons */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            // Show user and logout
            <UserMenu user={user} />
          ) : //if less than the smallest(640px) resolution for tailwind
          width <= 639 ? (
            <MobileMenu />
          ) : (
            <>
              <Link href="/login">
                <a className="hidden w-20 py-1 mr-2 leading-5 sm:block lg:w-32 hollow blue button ">
                  Login
                </a>
              </Link>
              <Link href="/register">
                <a className="hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button">
                  sign up
                </a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
