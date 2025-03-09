require('dotenv').config();
const { app, server } = require('./server');

const PORT = process.env.PORT || 8443;

server.listen(PORT, () => {
  console.log(`HTTPS server is running on https://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
