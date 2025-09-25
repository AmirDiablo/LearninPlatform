const { createClient } = require('redis');
const { Repository } = require('redis-om');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PW,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

// مدیریت خطاهای اتصال
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// اتصال به Redis
(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();


module.exports = {redisClient}