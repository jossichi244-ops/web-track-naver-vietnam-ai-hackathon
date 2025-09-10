module.exports = {
  plugins: [
    require("postcss-remove-rules")({
      rules: ["@charset"]
    })
  ]
}
