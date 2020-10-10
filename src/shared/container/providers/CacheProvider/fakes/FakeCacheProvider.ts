import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
   [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
   private cache: ICacheData = {};

   public async save(key: string, value: any): Promise<void> {
      this.cache[key] = value;
   }

   public async recover<T>(key: string): Promise<T | null> {
      const cache = this.cache[key];

      return cache ? JSON.parse(cache) : null;
   }

   public async invalidate(key: string): Promise<void> {
      delete this.cache[key];
   }

   public async invalidatePrefix(prefix: string): Promise<void> {
      const keys = Object.keys(this.cache);

      keys.forEach(key => {
         if (key.startsWith(`${prefix}:`)) {
            delete this.cache[key];
         }
      });
   }
}
