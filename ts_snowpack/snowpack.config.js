// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url:'/' },
    src: { url: '/dist' },
    assets: { url: '/assets' },
  },
  plugins: [
  ],
  packageOptions: {
  },
  devOptions: {
  },
  buildOptions: {
  },
  alias: {
   }
};
