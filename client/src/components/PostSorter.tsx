import React, { useEffect, useState } from "react";
import classNames from "classnames";

export default function PostSorter({ sortBy, setSortBy }) {
  return (
    <div className="flex flex-row content-center w-full px-1 py-2 mb-4 bg-white rounded ">
      <button
        className={classNames("px-4 py-2 mx-2 rounded-full hover:bg-gray-100", {
          "text-blue-500 bg-gray-100": sortBy === "top",
        })}
        onClick={(e) => setSortBy("top")}
      >
        <i className="fas fa-medal" /> Top
      </button>
      <button
        className={classNames("px-4 py-2 mr-2 rounded-full hover:bg-gray-100", {
          "text-blue-500 bg-gray-100": sortBy === "new",
        })}
        onClick={(e) => setSortBy("new")}
      >
        <i className="far fa-newspaper" /> New
      </button>
      <button
        className={classNames("px-4 py-2 mr-2 rounded-full hover:bg-gray-100", {
          "text-blue-500 bg-gray-100": sortBy === "hot",
        })}
        onClick={(e) => setSortBy("hot")}
      >
        <i className="fas fa-burn" /> Hot
      </button>
    </div>
  );
}
