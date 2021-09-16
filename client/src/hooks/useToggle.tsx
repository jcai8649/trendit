import { useState, useCallback } from "react";
export default function useToggle(
  initialValue: boolean = false
): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);
  console.log("toggled", value);
  return [value, toggle];
}
