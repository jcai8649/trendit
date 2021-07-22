import React, { useState } from "react";

export default function TopButton() {
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
      <div className="flex justify-center mb-10">
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
