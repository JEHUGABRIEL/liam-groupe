import { useEffect, useState, useCallback } from "react";

export default function useUnsavedChanges(isDirty) {
  const [blocked, setBlocked] = useState(false);

  // Browser beforeunload warning
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Simple blocker for custom navigation blocking in modals
  const blocker = {
    state: blocked ? "blocked" : "unblocked",
    reset: useCallback(() => setBlocked(false), []),
    proceed: useCallback(() => setBlocked(true), []),
  };

  return { blocker };
}
