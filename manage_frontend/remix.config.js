/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "netlify",
  server: "./server/netlify.js",
  ignoredRouteFiles: ["**/.*"],
};
