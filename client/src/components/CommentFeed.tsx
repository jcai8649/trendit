import React from "react";
import CommentCard from "./CommentCard";

export default function CommentFeed({ comments, vote }) {
  return (
    <>
      <hr />
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard comment={comment} key={comment.identifier} vote={vote} />
        ))
      ) : (
        <div className="p-20 mt-4 text-center text-gray-400">
          <i className="h-10 text-blue-300 fa-2x far fa-comments" />
          <br />
          No Comments Yet
          <p className="text-sm">Be the first to share what you think!</p>
        </div>
      )}
    </>
  );
}
