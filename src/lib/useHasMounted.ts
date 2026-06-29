"use client";

import { useEffect, useState } from "react";

/** True only after the first client render — guards persisted (localStorage) UI from hydration mismatch. */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
