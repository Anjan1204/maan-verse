// This creates a tiny HTTP API that the running server can also serve
// We add this as a route to extract env vars from the running process
// Run: node -e "require('./server_env_reader.js')"

const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/env') {
        const dotenv = require('dotenv');
        dotenv.config();
        const out = {
            MONGO_URI: process.env.MONGO_URI,
            JWT_SECRET: process.env.JWT_SECRET,
            NODE_ENV: process.env.NODE_ENV,
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(out, null, 2));
    }
});
server.listen(5001, () => {
    console.log('Env reader on port 5001');
    const dotenv = require('dotenv');
    dotenv.config();
    console.log('MONGO_URI:', process.env.MONGO_URI);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    server.close();
    process.exit(0);
});
