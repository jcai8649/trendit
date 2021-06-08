import { useState, FormEvent } from "react";
import Head from "next/head";
import Link from "next/Link";
import Axios from "axios";
import InputGroup from "../components/InputGroup";
import { useRouter } from "next/router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await Axios.post("/auth/login", {
        username,
        password,
      });

      router.push("/");
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/ocean.jpg')" }}
      ></div>
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
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border rounded borde-blue-500">
              {" "}
              Login
            </button>
          </form>
          <small>
            New to Trendit?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log in</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
