import Axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Editor from "../../../components/Editor";
import { FormEvent, useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";
import Sidebar from "../../../components/Sidebar";
import { Post, Sub } from "../../../types";
import { GetServerSideProps } from "next";

export default function Submit() {
  const [title, setTitle] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);

  const [body, setBody] = useState("");

  const router = useRouter();
  const { sub: subName } = router.query;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  if (error) router.push("/");

  const handleCancel = () => {
    router.back();
  };

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === "") return;

    try {
      const { data: post } = await Axios.post<Post>("/posts", {
        title: title.trim(),
        body: body.trim(),
        sub: sub.name,
      });

      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Trendit</title>
      </Head>

      <div className="flex flex-col ">
        <h1 className="mb-3 text-lg">Create a post</h1>
        <hr className="border-white" />
        {sub && (
          <div className="flex items-center px-4 py-3 ">
            <Image
              src={sub.imageUrl}
              className="rounded-full"
              alt="Sub Image"
              height={(8 * 16) / 4}
              width={(8 * 16) / 4}
            />
            <h2 className="m-3">/r/{subName}</h2>
          </div>
        )}

        <div className="w-160">
          <div className="p-1 bg-white rounded">
            <div className="m-1 overflow-auto">
              <div className="flex flex-row items-center">
                <button className="items-center flex-1 px-12 py-6 font-medium text-gray-400 border-b border-r cursor-pointer ">
                  <i className="mr-2 fas fa-edit" />
                  Post
                </button>
                <button className="items-center flex-1 px-12 py-6 font-medium text-gray-400 border-b cursor-pointer">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
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
                <Editor
                  value=""
                  name="body"
                  onChange={(data) => {
                    setBody(data);
                    console.log(data);
                  }}
                  editorLoaded={editorLoaded}
                />
                {/* <textarea
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Text (optional)"
                rows={4}
              /> */}
                <div className="flex justify-end">
                  <button
                    className="px-3 py-1 mr-4 hollow button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 blue button"
                    type="submit"
                    disabled={title.trim().length === 0}
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {sub && <Sidebar sub={sub} />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("Missing auth token cookie");

    await Axios.get("/auth/me", { headers: { cookie } });

    return { props: {} };
  } catch (err) {
    res.writeHead(307, { Location: "/login" }).end();
  }
};
