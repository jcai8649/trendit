import React from "react";
import Head from "next/head";
import LoginForm from "../components/LoginForm";

export default function Register() {
  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/images/ocean.jpg)`,
        }}
      />
      <LoginForm />
    </div>
  );
}
