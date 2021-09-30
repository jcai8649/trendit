import React, { createRef, ChangeEvent } from "react";
import SubBanner from "./SubBanner";
import SubInfo from "./SubInfo";
import { Sub } from "../types";
import { MutatorCallback } from "swr/dist/types";
import { useAuthDispatch } from "../context/auth";
import Axios from "axios";

interface SubHeaderProps {
  sub: Sub;
  ownSub: boolean;
  mutate: (
    data?: Sub | Promise<Sub> | MutatorCallback<Sub>,
    shouldRevalidate?: boolean
  ) => Promise<Sub>;
}

export default function SubHeader({ sub, ownSub, mutate }: SubHeaderProps) {
  const dispatch = useAuthDispatch();

  const fileInputRef = createRef<HTMLInputElement>();

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      mutate();
      dispatch("OPEN_MESSAGE", "Successfully updated sub");
    } catch (err) {
      if (err.message === "Request failed with status code 500") {
        dispatch(
          "ERROR_MESSAGE",
          "Image must be a .jpg or .png and less than 1MB"
        );
      } else {
        dispatch("ERROR_MESSAGE");
      }
    }
  };
  return (
    <>
      <input
        type="file"
        hidden={true}
        ref={fileInputRef}
        onChange={uploadImage}
      />
      <div>
        {/* Banner image */}
        <SubBanner sub={sub} ownSub={ownSub} openFileInput={openFileInput} />
        {/* Sub meta data */}
        <SubInfo
          sub={sub}
          mutate={mutate}
          ownSub={ownSub}
          openFileInput={openFileInput}
        />
      </div>
    </>
  );
}
