import dayjs from "dayjs";

import { Sub } from "../types";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth";
import useSWR from "swr";
import Link from "next/link";

export default function SubSidebar() {
  const { authenticated } = useAuthState();
  const router = useRouter();
  const { sub: subName } = router.query;

  const { data: sub } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  return (
    <div className="hidden ml-6 lg:block w-80">
      <div className="bg-white rounded">
        <div className="p-3 bg-blue-500 rounded-t">
          <p className="font-semibold text-white">About Community</p>
        </div>
        <div className="p-3">
          <p className="mb-3 text-center break-words text-md">
            {sub.description}
          </p>
          <div className="flex justify-center mb-3 text-sm font-medium">
            <div>
              <p className="text-center">{sub.joinUsers.length}</p>
              <p>members</p>
            </div>
          </div>
          <hr />
          <p className="my-3 text-center">
            <i className="mr-2 fas fa-birthday-cake" />
            Created {dayjs(sub.createdAt).format("D MMM YYYY")}
          </p>
          {authenticated && (
            <Link href={`/r/${sub.name}/submit`}>
              <a className="w-full py-1 text-sm blue button">Create Post</a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
