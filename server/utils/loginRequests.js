// Simple in-memory store for pending login requests
// requestId -> { user, token, timestamp, socketId (filled later) }
const loginRequests = new Map();

module.exports = loginRequests;
