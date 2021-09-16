import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import { Sub } from "../types";
import Image from "next/image";

export default function SearchBar() {
  const [name, setName] = useState("");
  const [subs, setSubs] = useState<Sub[]>([]);
  const [timer, setTimer] = useState(null);

  const router = useRouter();

  const searchSubs = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await Axios.get(`/subs/search/${name}`);
          setSubs(data);
        } catch (err) {
          console.log(err);
        }
      }, 250)
    );
  };

  useEffect(() => {
    if (name.trim() === "") {
      clearTimeout(timer);
      setSubs([]);
      return;
    }
    searchSubs();
  }, [name]);

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setName("");
  };

  return (
    <div className="w-9/12 px-4 sm:max-w-full sm:w-160">
      <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          className="py-1 pr-3 bg-transparent rounded focus:outline-none"
          placeholder="Search"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div
          className="absolute left-0 right-0 bg-white"
          style={{ top: "100%" }}
        >
          {subs?.map((sub) => (
            <div
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
              key={sub.name}
              onClick={() => goToSub(sub.name)}
            >
              <Image
                src={sub.imageUrl}
                className="rounded-full"
                alt="Sub Image"
                height={(8 * 16) / 4}
                width={(8 * 16) / 4}
              />
              <div className="ml-4 text-sm">
                <p className="font-medium">{sub.name}</p>
                <p className="text-gray-600">{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
