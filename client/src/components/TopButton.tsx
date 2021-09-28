import React, { useState, useEffect } from "react";
import classNames from "classnames";

export default function TopButton() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const isScrollable = function(ele) {
      // Compare the height to see if the element has scrollable content
      const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

      // It's not enough because the element's `overflow-y` style can be set as
      // * `hidden`
      // * `hidden !important`
      // In those cases, the scrollbar isn't shown
      const overflowYStyle = window.getComputedStyle(ele).overflowY;
      const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1;

      return hasScrollableContent && !isOverflowHidden;
    };
    setIsHidden(!isScrollable(document.documentElement));
  });

  const topFunction = () => {
    if (document) {
      let rootElement = document.documentElement;
      rootElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div
        className={classNames("flex justify-center mb-10", {
          hidden: isHidden,
        })}
      >
        <button
          onClick={topFunction}
          className="py-1 leading-5 w-36 sm:block lg:w-32 blue button"
        >
          Back to the Top
        </button>
      </div>
    </>
  );
}
