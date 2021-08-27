import React, { useState, FormEvent } from "react";
import Link from "next/link";
import Axios from "axios";
import InputGroup from "../components/InputGroup";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../context/auth";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAuthDispatch();
  const [errors, setErrors] = useState<any>({});

  const { authenticated } = useAuthState();

  const router = useRouter();
  if (authenticated) router.push("/");

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await Axios.post("/auth/register", {
        email,
        password,
        username,
      });

      const res = await Axios.post("/auth/login", {
        username,
        password,
      });

      dispatch("LOGIN", res.data);

      router.back();
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex flex-col justify-center pl-6">
      <div className="w-70">
        <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
        <p className="mb-10 text-xs">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>
        <form onSubmit={submitForm}>
          <InputGroup
            className="mb-2"
            value={email}
            type="email"
            setValue={setEmail}
            placeholder="Email"
            error={errors.email}
          />
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
          <button className="w-full py-3 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded-full">
            Sign up
          </button>
        </form>
        <small>
          Already a trenditor?
          <Link href="/login">
            <a className="ml-1 text-blue-500 uppercase">Log In</a>
          </Link>
        </small>
      </div>
    </div>
  );
}
