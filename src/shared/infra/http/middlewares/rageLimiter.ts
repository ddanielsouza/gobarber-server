import { NextFunction, Request, Response } from 'express';
import redis from 'redis';

import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
   host: process.env.REDIS_HOST,
   port: Number(process.env.REDIS_PORT),
   password: process.env.REDIS_PASS || undefined,
   enable_offline_queue: false,
});

const rateLimiterRedis = new RateLimiterRedis({
   storeClient: redisClient,
   keyPrefix: 'ratelimit',
   points: 5,
   duration: 1,
});

export default async function rateLimiter(
   request: Request,
   _response: Response,
   next: NextFunction,
): Promise<void> {
   try {
      await rateLimiterRedis.consume(request.ip);
      return next();
   } catch (err) {
      if (err instanceof RateLimiterRes) {
         throw new AppError('Too Many Requests', 429);
      } else {
         console.log(err);
         return next();
      }
   }
}
