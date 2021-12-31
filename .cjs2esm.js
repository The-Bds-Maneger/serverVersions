module.exports = {
  input: ["src/cjs"],
  output: "src/esm",
  forceDirectory: null,
  modules: [],
  extension: {
    use: "js",
    ignore: [],
  },
  addModuleEntry: false,
  addPackageJson: false,
  filesWithShebang: [],
};