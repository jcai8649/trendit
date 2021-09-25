import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SWRConfig } from "swr";
import MessageBox from "../components/MessageBox";
import Head from "next/head";
import Axios from "axios";

import { AuthProvider } from "../context/auth";

import "../styles/tailwind.css";
import "../styles/icons.css";
import "../styles/revert.css";
import "../styles/loader.css";

import Navbar from "../components/Navbar";

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <>
      <Head>
        <title>Trendit</title>
      </Head>
      <SWRConfig
        value={{
          fetcher,
          dedupingInterval: 5000,
        }}
      >
        <AuthProvider>
          {!authRoute && <Navbar />}
          <div className={authRoute ? "" : "pt-12"}>
            <Component {...pageProps} />
            <MessageBox />
          </div>
        </AuthProvider>
      </SWRConfig>
    </>
  );
}

export default App;
