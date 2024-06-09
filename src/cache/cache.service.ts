import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CacheService implements OnModuleInit {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const storeType = this.configService.get<string>('envConfig.redis_host')
      ? 'Redis'
      : 'InMemory';
    this.logger.debug(
      `Cache Manager using: ${storeType}`,
      `${CacheService.name}`,
    );
    this.logger.log('CacheService is ready', `${CacheService.name}`);
  }

  async getCache<T = any>(key: string): Promise<T> {
    return this.cacheManager.get<T>(key);
  }

  async setCache<T = any>(key: string, value: T, ttl = 60000): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async delCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async resetCache(): Promise<void> {
    await this.cacheManager.reset();
  }

  async invalidateCache(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.cacheManager.del(key);
    }
  }

  async getCacheStore() {
    return this.cacheManager.store;
  }

  async getCacheKeys(pattern = '*') {
    return this.cacheManager.store.keys(pattern);
  }

  async getCacheTtl(key: string) {
    return this.cacheManager.store.ttl(key);
  }
}
