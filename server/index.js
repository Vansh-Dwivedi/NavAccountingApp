require('dotenv').config();
const { app, server, httpsServer } = require('./server');

const PORT = 5000;
const HTTPS_PORT = 8443;

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server is running on https://ec2-13-52-123-244.us-west-1.compute.amazonaws.com:8443`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
