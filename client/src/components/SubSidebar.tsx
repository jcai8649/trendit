import dayjs from "dayjs";
import { Sub } from "../types";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth";
import useSWR from "swr";
import Link from "next/link";

export default function SubSidebar() {
  // Global state
  const { authenticated } = useAuthState();

  // Utils
  const router = useRouter();
  const { sub: subName } = router.query;

  const { data: sub } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  return (
    <div className="mb-4 bg-white rounded">
      <div className="p-3 bg-blue-500 rounded-t">
        <p className="font-semibold text-white">About Community</p>
      </div>
      {sub && (
        <div className="p-3">
          <p className="mb-3 break-words text-md">{sub.description}</p>
          <div className="flex justify-center mb-3 text-sm font-medium">
            <div className="text-center">
              <p>{sub.joinedUsers.length}</p>
              <p>members</p>
            </div>
          </div>
          <hr />
          <p className="my-3 text-center">
            <i className="mr-2 fas fa-birthday-cake" />
            Created {dayjs(sub.createdAt).format("D MMM YYYY")}
          </p>
          {authenticated && router.asPath !== `/r/${sub.name}/submit` && (
            <Link href={`/r/${sub.name}/submit`}>
              <a className="w-full py-1 text-sm blue button">Create Post</a>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
