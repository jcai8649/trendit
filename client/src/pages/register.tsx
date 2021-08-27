import React from "react";
import Head from "next/head";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/images/ocean.jpg)`,
        }}
      />
      <RegisterForm />
    </div>
  );
}
