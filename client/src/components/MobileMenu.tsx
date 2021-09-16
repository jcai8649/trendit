import React, { useState, useRef, useCallback } from "react";
import classNames from "classnames";
import Link from "next/link";
import useToggle from "../hooks/useToggle";
import useOnClickOutside from "../hooks/useOnClickOutside";

export default function Mobileis() {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(
    ref,
    useCallback(() => setIsOpen(false), [isOpen])
  );
  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => setIsOpen((isOpen) => !isOpen)}
        className={classNames("border border-white rounded px-2", {
          "border-gray-200": isOpen === true,
        })}
      >
        <i className="text-2xl fas fa-bars" />
      </button>
      <div
        className={classNames(
          "block absolute w-30 right-1 z-10 p-1 bg-white border border-gray-100 rounded shadow-md",
          { hidden: isOpen === false }
        )}
      >
        <Link href="/login">
          <a className="w-20 py-1 m-2 leading-5 hollow blue button ">Login</a>
        </Link>
        <Link href="/register">
          <a className="w-20 py-1 m-2 leading-5 blue button">sign up</a>
        </Link>
      </div>
    </div>
  );
}
