module.exports = {
  overrides: [
    {
      files: ["*.wxss"],
      options: {
        parser: "css",
      },
    },
    {
      files: ["*.wxml"],
      options: {
        parser: "html",
      },
    },
    {
      files: ["*.wxs"],
      options: {
        parser: "babel",
      },
    },
  ],
};
