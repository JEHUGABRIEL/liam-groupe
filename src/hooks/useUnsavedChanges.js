import { useEffect } from "react";

export default function useUnsavedChanges(isDirty) {
  // Browser beforeunload warning for dirty forms
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Static blocker (Next.js App Router doesn't support useBlocker from react-router-dom)
  return { blocker: { state: "unblocked", reset: () => {}, proceed: () => {} } };
}
