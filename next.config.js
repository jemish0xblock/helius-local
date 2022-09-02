// /** @type {import('next').NextConfig} */

const withAntdLess = require("next-plugin-antd-less");
const isProd = process.env.NODE_ENV === "production";
const withImages = require("next-images");
const { createSecureHeaders } = require("next-secure-headers");

const getRedirectUrl = (path) => {
  switch (process.env.NODE_ENV) {
    case "production":
      return `http:/app.helius.work${path}`;
    case "development":
      return `http://localhost:3000${path}`;
    // return `https://app.0xblock.co${path}`;
    default:
      return `http://localhost:3000${path}`;
  }
};

const nextConfig = withAntdLess(
  withImages({
    // async redirects() {
    //   return [
    //     {
    //       source: "/",
    //       destination: getRedirectUrl("/account-security/login"),
    //       permanent: true,
    //     },
    //   ];
    // },

    // async headers() {
    //   return [
    //     {
    //       source: "/(.*)",
    //       headers: createSecureHeaders({
    //         frameGuard: "sameorigin",
    //         xssProtection: "block-rendering",
    //         // contentSecurityPolicy: {
    //         //   directives: {
    //         //     defaultSrc: "'self'",
    //         //     styleSrc: ["'self'", "https://www.helius.com"],
    //         //   },
    //         // },
    //         forceHTTPSRedirect: true,
    //       }),
    //     },
    //   ];
    // },
    reactStrictMode: false, //true

    optimization: {
      runtimeChunk: "single",
    },

    lessVarsFilePath: "./styles/variables.less",

    lessVarsFilePathAppendToEndOfContent: false,

    // Use the CDN in production and localhost for development.
    assetPrefix: isProd ? "" : "",

    images: {
      domains: ["localhost", "app.helius.work"],
      loader: "custom",
    },

    webpack(config) {
      return config;
    },

    future: {
      webpack5: true,
    },
  })
);

module.exports = nextConfig;
