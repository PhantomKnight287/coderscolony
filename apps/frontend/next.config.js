const { join } = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "top-right",
  },
  sassOptions: {
    includePaths: [join(__dirname, "styles"), join(__dirname, "components")],
  },
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: `${process.env.API_URL}/:slug*`,
      },
    ];
  },
};
