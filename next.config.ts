import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "playwright",
    "playwright-core",
    "@sparticuz/chromium",
  ],

  outputFileTracingIncludes: {
    "/*": ["./node_modules/playwright-core/**/*"],
  },
};

export default nextConfig;
