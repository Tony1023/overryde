module.exports = {
  apps : [
      {
        name: "overryde",
        script: "./app.js",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}