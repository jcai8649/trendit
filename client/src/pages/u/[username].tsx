import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import UserFeed from "../../components/UserFeed";
import TopButton from "../../components/TopButton";
import UserSidebar from "../../components/UserSidebar";

export default function UserProfile() {
  // Utils
  const router = useRouter();
  const username = router.query.username;

  const { data, error, mutate } = useSWR<any>(
    username ? `/users/${username}` : null
  );

  if (error) router.push("/");

  return (
    <>
      <Head>
        <title>
          {data
            ? `${data.user.username} (u/${data.user.username}) - Trendit`
            : "Loading"}
        </title>
      </Head>
      {data && (
        <div className="container flex pt-5">
          <UserFeed data={data} mutate={mutate} />
          <UserSidebar data={data} mutate={mutate} />
        </div>
      )}
      <footer>
        <TopButton />
      </footer>
    </>
  );
}
