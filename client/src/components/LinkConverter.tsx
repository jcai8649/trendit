import React from "react";

interface LinkProps {
  url: string;
}

export default function LinkConverter({ url }: LinkProps) {
  let searchTerm: string | undefined;

  if (url.includes("youtube.com")) {
    searchTerm = "watch?v=";
  } else if (url.includes("youtu.be")) {
    searchTerm = "youtu.be/";
  }

  const imageTypeList = [".png", ".jpg", ".gif"];
  const IMAGE_TYPE = url.slice(-4);

  function renderLink(url: string) {
    if (searchTerm) {
      const VIDEO_ID_START_INDEX = url.indexOf(searchTerm) + searchTerm.length;
      const VIDEO_ID = url.slice(
        VIDEO_ID_START_INDEX,
        //length of the video id
        VIDEO_ID_START_INDEX + 11
      );
      return (
        <iframe
          className="w-full mx-auto md:h-80"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
          allow="fullscreen"
        />
      );
    } else if (imageTypeList.includes(IMAGE_TYPE)) {
      return <img className="mx-auto" src={url} alt="post image" />;
    }
    return (
      <a href={url} target="_blank" rel="noreferrer noopener">
        {url}
      </a>
    );
  }

  return <>{renderLink(url)}</>;
}
