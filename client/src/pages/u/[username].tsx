import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { User } from "../../types";
import Axios from "axios";
import { Post, Comment } from "../../types";
import classNames from "classnames";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import { ChangeEvent, createRef, useState, useEffect } from "react";

export default function UserProfile() {
  // Local state
  const [ownUserProfile, setOwnUserProfile] = useState(false);

  // Global state
  const { authenticated, user } = useAuthState();
  const dispatch = useAuthDispatch();
  // Utils

  const router = useRouter();
  const username = router.query.username;
  const fileInputRef = createRef<HTMLInputElement>();

  const { data, error, revalidate } = useSWR<any>(
    username ? `/users/${username}` : null
  );

  useEffect(() => {
    if (!user) return;
    setOwnUserProfile(authenticated && user.username === username);
  }, [authenticated, user]);

  const openFileInput = (type: string) => {
    if (!ownUserProfile) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await Axios.post<User>(`/users/${user.username}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      revalidate();
      dispatch("RERENDER", true);
    } catch (err) {
      console.log(err);
    }
  };

  if (error) router.push("/");

  return (
    <>
      <Head>
        <title>
          {data
            ? `${data.user.username} (u/${data.user.username}) - Trendit`
            : "Loading"}
        </title>
      </Head>
      {data && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.submissions.map((submission: any) => {
              if (submission.type === "Post") {
                const post: Post = submission;
                return (
                  <PostCard
                    key={post.identifier}
                    post={post}
                    revalidate={revalidate}
                  />
                );
              } else {
                const comment: Comment = submission;
                return (
                  <div
                    key={comment.identifier}
                    className="flex my-4 bg-white rounded"
                  >
                    <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
                      <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
                    </div>
                    <div className="w-full p-2">
                      <p className="mb-2 text-xs text-gray-500">
                        {comment.username}

                        <span> commented on </span>
                        <Link href={comment.post.url}>
                          <a className="font-semibold cursor-pointer hover:underline">
                            {comment.post.title}
                          </a>
                        </Link>
                        <span className="mx-1">•</span>
                        <Link href={`/r/${comment.post.subName}`}>
                          <a className="text-black cursor-pointer hover:underline">
                            /r/{comment.post.subName}
                          </a>
                        </Link>
                      </p>
                      <hr />
                      <p>{comment.body}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="hidden ml-6 sm:block w-80">
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            />
            <div className="bg-white rounded">
              <div className="p-3 mx-auto bg-blue-500 rounded-t">
                <div className="w-16 h-16 mx-auto border-4 border-white rounded-full ">
                  <Image
                    src={data.user.imageUrl}
                    alt="user profile"
                    className="rounded-full"
                    width="60"
                    height="60"
                  />
                </div>
                {ownUserProfile && (
                  <div className="m-3 text-center">
                    <button
                      className="p-2 text-sm text-white rounded-full bg-gradient-to-r from-red-500 to-yellow-400"
                      onClick={() => openFileInput("image")}
                    >
                      Update Profile
                    </button>
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <h1 className="mb-3 text-xl">u/{data.user.username}</h1>
                <hr />
                <p className="mt-3">
                  <i className="mr-2 fas fa-birthday-cake"></i>
                  Joined {dayjs(data.user.createdAt).format("MMM YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
