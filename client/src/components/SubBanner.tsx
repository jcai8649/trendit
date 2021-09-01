import React from "react";
import classNames from "classnames";

export default function SubBanner({ sub, ownSub, openFileInput }) {
  return (
    <div
      className={classNames("bg-blue-500 relative", {
        "cursor-pointer": ownSub,
      })}
    >
      <div
        className={classNames(
          "cursor-default opacity-0 pt-3 text-center absolute bg-black w-full h-full text-white",
          {
            "cursor-pointer block hover:opacity-70": ownSub,
          }
        )}
        style={{ top: -1, left: 0 }}
        onClick={() => openFileInput("banner")}
      >
        Update Banner
      </div>
      {sub.bannerUrl ? (
        <div
          className="h-56 bg-blue-500 "
          style={{
            backgroundImage: `url(${sub.bannerUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      ) : (
        <div className="h-20 bg-blue-500"></div>
      )}
    </div>
  );
}
