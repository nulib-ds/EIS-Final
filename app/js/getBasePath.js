// Ensures
export function getBasePath() {
  if (typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/EIS-Final")) {
      return "/EIS-Final";
    }
  }
  return "";
}