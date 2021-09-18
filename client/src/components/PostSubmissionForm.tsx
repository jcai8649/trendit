import React, { useState, FormEvent, useEffect } from "react";
import { Post } from "../types";
import classNames from "classnames";
import { useRouter } from "next/router";
import Axios from "axios";
import Editor from "./Editor";

export default function PostSubmissionForm({ sub = null }) {
  const [title, setTitle] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("post");
  const [urlError, setUrlError] = useState(false);

  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };

  const handleUrlChange = (value: string) => {
    setUrlError(false);

    setUrl(value);

    if (value.trim().includes(" ")) {
      setUrlError(true);
    }
  };

  console.log(router.query);

  useEffect(() => {
    setEditorLoaded(true);
    if (router.query.hasOwnProperty("url")) {
      setType("link");
    }
  }, []);

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === "") return;

    if (urlError && type === "link") {
      return;
    }
    try {
      const { data: post } = await Axios.post<Post>("/posts", {
        title: title.trim(),
        body: type === "post" ? body.trim() : url.trim(),
        inputType: type,
        sub: sub.name,
      });

      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full md:w-11/12 lg:w-160">
      <div className="p-1 bg-white rounded">
        <div className="m-1 overflow-auto">
          <div className="flex flex-row items-center">
            <button
              className={classNames(
                "items-center flex-1 px-12 py-6 font-medium text-gray-400 border-b-2 border-gray-200 cursor-pointer hover:bg-gray-100",
                {
                  "text-blue-500 border-b-4 border-blue-500": type === "post",
                }
              )}
              onClick={(e) => setType("post")}
            >
              <i className="mr-2 fas fa-edit" />
              Post
            </button>
            <button
              className={classNames(
                "items-center flex-1 px-12 py-6 font-medium text-gray-400 border-b-2 border-gray-200 cursor-pointer hover:bg-gray-100",
                {
                  "text-blue-500 border-b-4 border-blue-500": type === "link",
                }
              )}
              onClick={(e) => setType("link")}
            >
              <i className="mr-2 fas fa-link" />
              Link
            </button>
          </div>
        </div>
        <div className="p-4">
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600"
                style={{ top: 11, right: 10 }}
              >
                {/* e.g. 15/300 */}
                {title.trim().length}/300
              </div>
            </div>
            <div
              className={classNames(
                "block w-full mb-2 border rounded focus-within:border-black focus-within:outline-none",
                { hidden: type === "link" }
              )}
            >
              <Editor
                value=""
                name="body"
                onChange={(data) => {
                  setBody(data);
                }}
                editorLoaded={editorLoaded}
              />
            </div>
            <div className={classNames("block", { hidden: type === "post" })}>
              <input
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                type="text"
                placeholder="Url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                className="px-3 py-1 mr-4 hollow button blue"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={title.trim().length === 0 || urlError || !sub}
              >
                Post
              </button>
            </div>
            {urlError && type === "link" && (
              <p className="mt-1 text-sm text-right text-red-500 ">
                a url is required
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
