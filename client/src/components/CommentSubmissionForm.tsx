import React, { useState, FormEvent } from "react";
import Link from "next/link";
import Axios from "axios";
import { useAuthState } from "../context/auth";

export default function CommentSubmissionForm({ commentMutate, post }) {
  // Local state
  const [newComment, setNewComment] = useState("");
  // Global state
  const { authenticated, user } = useAuthState();

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === "") return;

    try {
      await Axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: newComment,
      });

      setNewComment("");
      commentMutate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="pl-10 pr-6 mb-4">
      {authenticated ? (
        <div>
          <p className="mb-1 text-xs">
            Comment as{" "}
            <Link href={`/u/${user.username}`}>
              <a className="font-semibold text-blue-500">{user.username}</a>
            </Link>
          </p>
          <form onSubmit={submitComment}>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                disabled={newComment.trim() === ""}
              >
                Comment
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
          <p className="font-semibold text-gray-400">
            Log in or sign up to leave a comment
          </p>
          <div>
            <Link href="/login">
              <a className="px-4 py-1 mb-1 mr-4 hollow blue button">Log In</a>
            </Link>
            <Link href="/register">
              <a className="px-4 py-1 blue button">Sign Up</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
