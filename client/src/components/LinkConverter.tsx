import React from "react";

interface LinkProps {
  url: string;
}

export default function LinkConverter({ url }: LinkProps) {
  const vidLink = "youtube.com/";
  const imageTypeList = [".png", ".jpg", ".gif"];
  const IMAGE_TYPE = url.slice(-4);

  function renderLink(url) {
    if (url.includes(vidLink)) {
      const VIDEO_ID = url.slice(-11);
      return (
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_ID}`}
          width="560"
          height="315"
          allow="fullscreen"
        />
      );
    }
    if (imageTypeList.includes(IMAGE_TYPE)) {
      return <img src={url} alt="post image" />;
    }
    return (
      <a href={url} target="_blank" rel="noreferrer noopener">
        {url}
      </a>
    );
  }

  return <>{renderLink(url)}</>;
}
