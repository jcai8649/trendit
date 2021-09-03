import React from "react";
import Axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import PostSubmissionForm from "../../../components/PostSubmissionForm";
import useSWR from "swr";
import Image from "next/image";
import Sidebar from "../../../components/Sidebar";
import { Sub } from "../../../types";
import { GetServerSideProps } from "next";

export default function Submit() {
  const router = useRouter();
  const { sub: subName } = router.query;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  if (error) router.push("/");

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Trendit</title>
      </Head>

      <div className="flex flex-col ">
        <h1 className="mb-3 text-lg">Create a post</h1>
        <hr className="border-white" />
        {sub && (
          <div className="flex items-center px-4 py-3">
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
        <PostSubmissionForm sub={sub} />
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
