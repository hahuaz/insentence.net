/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/letter',
        destination: '/letter/a',
        permanent: false,
      },
      {
        source: '/sentence',
        destination: '/sentence/lost',
        permanent: false,
      },
    ];
  },
};
