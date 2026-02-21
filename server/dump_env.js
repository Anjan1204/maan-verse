// Dump relevant env vars to a file
const fs = require('fs');
const out = [
    `PORT=${process.env.PORT}`,
    `MONGO_URI=${process.env.MONGO_URI}`,
    `JWT_SECRET=${process.env.JWT_SECRET}`,
    `NODE_ENV=${process.env.NODE_ENV}`,
    `EMAIL_USER=${process.env.EMAIL_USER || ''}`,
    `EMAIL_PASS=${process.env.EMAIL_PASS || ''}`,
].join('\n');
fs.writeFileSync('env_dump.txt', out);
console.log('Dumped to env_dump.txt');
console.log(out);
