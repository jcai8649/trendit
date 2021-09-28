import Axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import CreateSubForm from "../../components/CreateSubForm";

export default function Create() {
  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a Community</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/images/ocean.jpg)`,
        }}
      />
      <CreateSubForm />
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
