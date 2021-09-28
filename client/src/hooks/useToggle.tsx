import React, { useState } from "react";
export default function useToggle(initialValue: any = false) {
  const [value, setValue] = useState(initialValue);

  function toggleValue(value: any) {
    setValue((currentValue) =>
      typeof value === "boolean" ? value : !currentValue
    );
  }
  return [value, toggleValue];
}
