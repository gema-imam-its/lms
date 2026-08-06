import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Dev-only: this machine's localhost:3000 is squatted by an unrelated
  // WSL-relayed process, so the dev server gets tested via its LAN address
  // instead — which Next blocks by default (cross-origin dev-resource
  // protection). Without this, the page still server-renders but the client
  // bundle silently fails to hydrate (no console error), so nothing is
  // actually interactive.
  allowedDevOrigins: ["192.168.48.1", "192.168.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
