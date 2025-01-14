module.exports = {
  require: ["ts-node/register", "source-map-support/register"],
  extension: ["ts"],
  spec: "test/**/*.test.ts",
  recursive: true,
};
