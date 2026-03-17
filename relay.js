// relay.js - Your personal decentralized router
const server = require('http').createServer().listen(8765);
const Gun = require('gun');
const gun = Gun({ web: server });

console.log('🟢 Indestructible Local Relay running on http://localhost:8765/gun');