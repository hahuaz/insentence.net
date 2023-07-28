/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://insentence.net",
  outDir: "dist",
  changefreq: "monthly",
  autoLastmod: false,
};
