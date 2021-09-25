import React, { useState, useEffect } from "react";
import { useAuthState, useAuthDispatch } from "../context/auth";
import className from "classnames";

export default function MessageBox() {
  const dispatch = useAuthDispatch();
  const {
    messageBox: { isOpen, action, error },
  } = useAuthState();

  const closeTimer = () => {
    setTimeout(() => dispatch("CLOSE_MESSAGE"), 2500);
  };

  useEffect(() => {
    if (isOpen) {
      closeTimer();
    }
  }, [isOpen]);

  return (
    <div
      className={className(
        "block fixed py-2 animate-fade-in-up px-4 text-left inset-x-8 md:inset-x-72 lg:inset-x-1/3 bottom-10 bg-white border border-l-8 rounded shadow-md",
        {
          "border-red-500": error,
          "border-blue-500": action,
          hidden: isOpen === false,
        }
      )}
    >
      {error ? (
        <p>
          <i className="mr-2 text-red-600 fas fa-times"></i> Something went
          wrong
        </p>
      ) : (
        <p>
          <i className="mr-2 text-green-500 fas fa-check"></i> Successfully{" "}
          {action}
        </p>
      )}
    </div>
  );
}
