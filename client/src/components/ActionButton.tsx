import React, { ReactNode } from "react";

export default function ActionButton({ children }: { children: ReactNode }) {
  return (
    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
}
