/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Garante que o build standalone (Docker/Coolify) trace a partir desta pasta,
  // e não de um diretório-pai com outro lockfile.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
