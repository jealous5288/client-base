package net.ruixin.util.cache;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

/**
 * Ehcache缓存工厂
 */
public class EhcacheFactory implements ICache {

    private static CacheManager cacheManager;
    private static volatile Object locker = new Object();
    private static final Logger log = LoggerFactory.getLogger(EhcacheFactory.class);

    private static CacheManager getCacheManager() {
        if (cacheManager == null) {
            synchronized (EhcacheFactory.class) {
                if (cacheManager == null) {
                    cacheManager = CacheManager.create();
                }
            }
        }
        return cacheManager;
    }

    static Cache getOrAddCache(String cacheName) {
        CacheManager cacheManager = getCacheManager();
        Cache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            synchronized (locker) {
                cache = cacheManager.getCache(cacheName);
                if (cache == null) {
                    log.warn("无法找到缓存 [" + cacheName + "]的配置, 使用默认配置.");
                    cacheManager.addCacheIfAbsent(cacheName);
                    cache = cacheManager.getCache(cacheName);
                    log.debug("缓存 [" + cacheName + "] 启动.");
                }
            }
        }
        return cache;
    }

    public void put(String cacheName, Object key, Object value) {
        getOrAddCache(cacheName).put(new Element(key, value));
    }

    @SuppressWarnings("unchecked")
    public <T> T get(String cacheName, Object key) {
        Element element = getOrAddCache(cacheName).get(key);
        return element != null ? (T) element.getObjectValue() : null;
    }

    @SuppressWarnings("rawtypes")
    public List getKeys(String cacheName) {
        return getOrAddCache(cacheName).getKeys();
    }

    public Map<Object, Element> getAll(String cacheName) {
        return getOrAddCache(cacheName).getAll(getKeys(cacheName));
    }

    public void remove(String cacheName, Object key) {
        getOrAddCache(cacheName).remove(key);
    }

    public void removeAll(String cacheName) {
        getOrAddCache(cacheName).removeAll();
    }

}
