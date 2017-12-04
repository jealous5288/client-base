package net.ruixin.util.cache;

import net.sf.ehcache.Element;

import java.util.List;
import java.util.Map;

/**
 * 缓存工具类
 */
public class CacheKit {

    private static ICache defaultCacheFactory = new EhcacheFactory();

    public static void put(String cacheName, Object key, Object value) {
        defaultCacheFactory.put(cacheName, key, value);
    }

    public static <T> T get(String cacheName, Object key) {
        return defaultCacheFactory.get(cacheName, key);
    }

    @SuppressWarnings("rawtypes")
    public static List getKeys(String cacheName) {
        return defaultCacheFactory.getKeys(cacheName);
    }

    public static Map<Object, Element> getAll(String cacheName) {
        return defaultCacheFactory.getAll(cacheName);
    }

    public static void remove(String cacheName, Object key) {
        defaultCacheFactory.remove(cacheName, key);
    }

    public static void removeAll(String cacheName) {
        defaultCacheFactory.removeAll(cacheName);
    }
}


