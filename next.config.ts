import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubActions ? "/react-ci-cd-lab" : "",
  trailingSlash: true,
};

export default nextConfig;
