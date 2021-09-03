import React, { createRef, ChangeEvent } from "react";
import SubBanner from "./SubBanner";
import SubInfo from "./SubInfo";
import { Sub } from "../types";
import Axios from "axios";

export default function SubHeader({ sub, ownSub, mutate }) {
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
    } catch (err) {
      console.log(err);
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
        <SubInfo sub={sub} ownSub={ownSub} openFileInput={openFileInput} />
      </div>
    </>
  );
}
