import { MongoMemoryServer } from 'mongodb-memory-server';
import { RedisMemoryServer } from 'redis-memory-server';
import * as net from 'net';

async function isPortOpen(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => resolve(false));
  });
}

/**
 * Starts in-memory MongoDB / Redis when local services are not already running.
 * Keeps developer testing unblocked without system installs.
 */
export async function ensureLocalInfra(): Promise<void> {
  // Production / explicit skip: never boot memory Mongo/Redis (needs make/jemalloc).
  if (
    process.env.SKIP_LOCAL_INFRA === 'true' ||
    process.env.NODE_ENV === 'production'
  ) {
    return;
  }

  const mongoUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/property_arena';
  const redisHost = process.env.REDIS_HOST || '127.0.0.1';
  const redisPort = Number(process.env.REDIS_PORT || 6379);

  let mongoReady = false;
  try {
    const hostPort = mongoUrl.replace(/^mongodb:\/\//, '').split('/')[0];
    const [host, portStr] = hostPort.split(':');
    mongoReady = await isPortOpen(host || '127.0.0.1', Number(portStr || 27017));
  } catch {
    mongoReady = false;
  }

  if (!mongoReady) {
    console.log('[local-infra] MongoDB not found — starting mongodb-memory-server…');
    const mongod = await MongoMemoryServer.create({
      instance: { dbName: 'property_arena' },
    });
    process.env.DATABASE_URL = mongod.getUri('property_arena');
    (global as any).__PA_MONGO_MEMORY__ = mongod;
    console.log(`[local-infra] MongoDB memory ready at ${process.env.DATABASE_URL}`);
  } else {
    console.log('[local-infra] Using existing MongoDB');
  }

  const redisReady = await isPortOpen(redisHost, redisPort);
  if (!redisReady) {
    if (process.env.SKIP_REDIS === 'true' || process.platform === 'win32') {
      console.log(
        '[local-infra] Skipping Redis (Windows / SKIP_REDIS). Background queues disabled for local testing.',
      );
      process.env.SKIP_REDIS = 'true';
    } else {
      console.log('[local-infra] Redis not found — starting redis-memory-server…');
      const redis = new RedisMemoryServer({
        instance: { port: redisPort },
      });
      await redis.start();
      const host = await redis.getHost();
      const port = await redis.getPort();
      process.env.REDIS_HOST = host;
      process.env.REDIS_PORT = String(port);
      (global as any).__PA_REDIS_MEMORY__ = redis;
      console.log(`[local-infra] Redis memory ready at ${host}:${port}`);
    }
  } else {
    console.log('[local-infra] Using existing Redis');
  }
}
