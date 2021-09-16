import React, { useState, useRef, useCallback } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import classNames from "classnames";

function PostSorter({ sortBy, setSortBy }) {
  const [toggle, setToggle] = useState(false);

  // Create a ref that we add to the element for which we want to detect outside clicks
  const ref = useRef();
  // Call hook passing in the ref and a function to call on outside click
  useOnClickOutside(
    ref,
    useCallback(() => setToggle(false), [toggle])
  );

  const handleToggle = () => setToggle(!toggle);

  const handleOnClick = (sort) => {
    setSortBy(sort);
    handleToggle();
  };

  return (
    <div ref={ref} className="relative p-1 ml-8 text-xs">
      <button
        className="font-bold text-blue-400 capitalize"
        onClick={handleToggle}
      >
        Sort By: {sortBy}
        <i className="mb-1 ml-1 text-sm text-gray-500 fas fa-sort-down" />
      </button>
      <div
        className={classNames(
          "block absolute w-20 z-10 p-1 ml-2 bg-white border border-gray-100 rounded shadow-md",
          { hidden: toggle === false }
        )}
      >
        <ul className="flex flex-col">
          <button
            className={classNames(
              "capitalize font-bold p-2 text-left text-gray-400",
              {
                "text-blue-400": sortBy === "top",
              }
            )}
            onClick={() => handleOnClick("top")}
          >
            <li>top</li>
          </button>
          <button
            className={classNames(
              " capitalize font-bold p-2 text-left text-gray-400",
              {
                "text-blue-400": sortBy === "new",
              }
            )}
            onClick={() => handleOnClick("new")}
          >
            <li>new</li>
          </button>
          <button
            className={classNames(
              "capitalize font-bold p-2 text-left text-gray-400",
              {
                "text-blue-400": sortBy === "old",
              }
            )}
            onClick={() => handleOnClick("old")}
          >
            <li>old</li>
          </button>
        </ul>
      </div>
    </div>
  );
}

export default PostSorter;
