import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="mt-10 mb-4 text-5xl text-gray-800">Page Not Found</h1>
        <Image
          src="https://i.imgur.com/A040Lxr.png"
          alt="404 image"
          width={600}
          height={600}
        />
        <Link href="/">
          <a className="px-4 py-2 blue button">Home</a>
        </Link>
      </div>
    </div>
  );
}
