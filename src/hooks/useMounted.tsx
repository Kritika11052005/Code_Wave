// This file is marked as a client component (needed for React hooks in Next.js)
"use client";

import { useEffect, useState } from "react";

// This is a custom React hook named useMounted
const useMounted = () => {
  // Step 1: Declare a state variable called 'mounted' and set its initial value to false
  const [mounted, setMounted] = useState(false);

  // Step 2: When this hook runs for the first time (component is mounted), do something
  useEffect(() => {
    // Step 3: Set 'mounted' to true (means the component is now mounted on the page)
    setMounted(true);
  }, []); // The empty array means this runs only once (on first render)

  // Step 4: Return the current value of 'mounted'
  return mounted;
};

// Make this hook usable in other files by exporting it
export default useMounted;
