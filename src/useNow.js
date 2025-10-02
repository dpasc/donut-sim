import { useEffect, useState } from "react";

/**
 * Custom hook to provide the current timestamp, updating every second.
 * @returns {number} - Current time in ms since epoch.
 */
export default function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  return now;
}
