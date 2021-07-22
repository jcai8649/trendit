import React from "react";

export default function TopButton() {
  const topFunction = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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
