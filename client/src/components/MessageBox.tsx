import React, { useEffect } from "react";
import { useAuthState, useAuthDispatch } from "../context/auth";
import className from "classnames";

export default function MessageBox() {
  // Global state
  const {
    messageBox: { isOpen, message, error },
  } = useAuthState();
  const dispatch = useAuthDispatch();

  const closeTimer = () => {
    setTimeout(() => dispatch("CLOSE_MESSAGE"), 1500);
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
          "border-blue-500": message,
          hidden: isOpen === false,
        }
      )}
    >
      {error ? (
        message ? (
          <p>
            <i className="mr-2 text-red-600 fas fa-times"></i> {message}
          </p>
        ) : (
          <p>
            <i className="mr-2 text-red-600 fas fa-times"></i> Something went
            wrong
          </p>
        )
      ) : (
        <p>
          <i className="mr-2 text-green-500 fas fa-check"></i>
          {message}
        </p>
      )}
    </div>
  );
}
