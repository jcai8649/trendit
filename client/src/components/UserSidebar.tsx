import React, { useEffect, useState, createRef, ChangeEvent } from "react";
import { User } from "../types";
import Axios from "axios";
import { useAuthDispatch, useAuthState } from "../context/auth";
import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import dayjs from "dayjs";

export default function UserSidebar({ data, mutate }) {
  // Local state
  const [ownUserProfile, setOwnUserProfile] = useState(false);

  // Global state
  const { authenticated, user } = useAuthState();
  const dispatch = useAuthDispatch();

  // Utils
  const router = useRouter();
  const username = router.query.username;
  const fileInputRef = createRef<HTMLInputElement>();

  //   const { data, mutate } = useSWR<any>(username ? `/users/${username}` : null);

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

      mutate();
      dispatch("RERENDER");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="hidden ml-6 sm:block w-80">
      <input
        type="file"
        hidden={true}
        ref={fileInputRef}
        onChange={uploadImage}
      />
      <div className="bg-white rounded">
        <div className="p-3 mx-auto bg-blue-500 rounded-t">
          <div className="w-16 h-16 mx-auto bg-white border-4 border-white rounded-full ">
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
  );
}
