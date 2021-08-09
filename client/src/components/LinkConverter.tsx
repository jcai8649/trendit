import React from "react";

interface LinkProps {
  url: string;
}

export default function LinkConverter({ url }: LinkProps) {
  const vidLink = "youtube.com/";
  const imageTypeList = [".png", ".jpg", ".gif"];
  const IMAGE_TYPE = url.slice(-4);

  function renderLink(url: string) {
    if (url.includes(vidLink)) {
      const VIDEO_ID = url.slice(-11);
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
