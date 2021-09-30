import React, { useState, useEffect } from "react";
import Axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import PostSubmissionForm from "../components/PostSubmissionForm";
import Image from "next/image";
import { Sub } from "../types";
import { GetServerSideProps } from "next";
import SubmissionRules from "../components/SubmissionRules";
import { useAuthDispatch } from "../context/auth";

export default function Submit() {
  // Local state
  const [subToSubmit, setSubToSubmit] = useState("");
  const [subs, setSubs] = useState<Sub[]>([]);
  const [timer, setTimer] = useState(null);

  // Global state
  const dispatch = useAuthDispatch();

  // Utils
  const router = useRouter();

  const searchSubs = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await Axios.get(`/subs/search/${subToSubmit}`);
          setSubs(data);
        } catch (err) {
          dispatch("ERROR_MESSAGE");
        }
      }, 250)
    );
  };

  useEffect(() => {
    if (subToSubmit.trim() === "") {
      clearTimeout(timer);
      setSubs([]);
      return;
    }
    searchSubs();
  }, [subToSubmit]);

  const goToSub = (subName: string) => {
    router.replace(`/r/${subName}/submit`);
    setSubToSubmit("");
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Trendit</title>
      </Head>

      <div className="flex flex-col w-full md:w-11/12 ">
        <h1 className="mb-3 text-lg">Create a post</h1>
        <hr className="border-white" />

        <div className="relative flex items-center my-4 bg-white border rounded w-72 hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
          <input
            type="text"
            className="w-full py-1 pr-3 bg-transparent rounded focus:outline-none"
            placeholder="Search communities to post"
            value={subToSubmit}
            onChange={(e) => setSubToSubmit(e.target.value)}
          />
          <div
            className="absolute left-0 right-0 z-10 bg-white shadow-lg"
            style={{ top: "100%" }}
          >
            {subs?.map((sub) => (
              <div
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                key={sub.name}
                onClick={() => goToSub(sub.name)}
              >
                <Image
                  src={sub.imageUrl}
                  className="rounded-full"
                  alt="Sub Image"
                  height={(8 * 16) / 4}
                  width={(8 * 16) / 4}
                />
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-gray-600">{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PostSubmissionForm />
      </div>
      <div className="hidden w-2/6 ml-6 md:block">
        <SubmissionRules />
      </div>
    </div>
  );
}

//Redirect user to login if not login
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
