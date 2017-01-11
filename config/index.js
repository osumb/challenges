module.exports = {
  auth: {
    secret: process.env.SECRET || 'notMuchOfASecret'
  },
  server: {
    port: process.env.SERVER_PORT || 3000
  }
};
