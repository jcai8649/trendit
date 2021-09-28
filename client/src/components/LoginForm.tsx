import React, { useState, FormEvent } from "react";
import Link from "next/link";
import Axios from "axios";
import InputGroup from "../components/InputGroup";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../context/auth";
import { Error } from "../types";

export default function LoginForm() {
  // Local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Error>({});

  // Global state
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  //Utils
  const router = useRouter();
  if (authenticated) router.push("/");

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await Axios.post("/auth/login", {
        username,
        password,
      });

      dispatch("LOGIN", res.data);
      dispatch("OPEN_MESSAGE", "Successfully logged In!");
      router.back();
    } catch (err) {
      setErrors(err.response.data);
    }
  };
  return (
    <div className="flex flex-col justify-center pl-6">
      <div className="w-70">
        <h1 className="mb-2 text-lg font-medium">Login</h1>
        <form onSubmit={submitForm}>
          <InputGroup
            className="mb-2"
            value={username}
            type="text"
            setValue={setUsername}
            placeholder="Username"
            error={errors.username}
          />
          <InputGroup
            className="mb-4"
            value={password}
            type="password"
            setValue={setPassword}
            placeholder="Password"
            error={errors.password}
          />
          <button className="w-full py-3 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border rounded-full borde-blue-500">
            Log In
          </button>
        </form>
        <small>
          New to Trendit?
          <Link href="/register">
            <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
          </Link>
        </small>
      </div>
    </div>
  );
}
