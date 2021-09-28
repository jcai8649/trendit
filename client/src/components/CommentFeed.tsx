import React, { Dispatch, SetStateAction } from "react";
import CommentSorter from "../components/CommentSorter";
import { Comment } from "../types";
import CommentCard from "./CommentCard";

interface CommentFeedProps {
  comments?: Array<Comment>;
  vote: (value: number, comment: Comment) => void;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  postUser: string;
}

export default function CommentFeed({
  comments,
  vote,
  sortBy,
  setSortBy,
  postUser,
}: CommentFeedProps) {
  return (
    <>
      <CommentSorter sortBy={sortBy} setSortBy={setSortBy} />
      <hr />
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard
            comment={comment}
            key={comment.identifier}
            vote={vote}
            isOp={postUser === comment.username}
          />
        ))
      ) : (
        <div className="p-20 my-4 text-center text-gray-400">
          <i className="h-10 text-blue-300 fa-2x far fa-comments" />
          <br />
          No Comments Yet
          <p className="text-sm">Be the first to share what you think!</p>
        </div>
      )}
    </>
  );
}
