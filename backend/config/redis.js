const Redis = require('ioredis');

let redisClient = null;

const getRedisClient = () => {
    if (!redisClient) {
        redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            retryStrategy: (times) => {
                // Retry up to 3 times, then give up
                if (times > 3) {
                    console.warn('⚠️  Redis connection failed after 3 retries. Running without cache.');
                    return null; // stop retrying
                }
                return Math.min(times * 100, 2000);
            },
            enableOfflineQueue: false,
            lazyConnect: true,
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis Connected');
        });

        redisClient.on('error', (err) => {
            console.warn(`⚠️  Redis Error: ${err.message} — cache disabled for this request`);
        });

        redisClient.connect().catch(() => {
            console.warn('⚠️  Could not connect to Redis. Cache will be bypassed.');
        });
    }
    return redisClient;
};

module.exports = { getRedisClient };
