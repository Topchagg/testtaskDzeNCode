from django.core.cache import cache

import json

class CacheMethods:
    def getCache(key):
        return cache.get(key)

    def setCache(key, value, timeout):
        print(key)
        cache.set(key, json.dumps(value,ensure_ascii=False), timeout)

    def deleteCache(key):
        cache.delete(key)

    def cacheIsExist(key):
        approximateCache = cache.get(key)

        if approximateCache:
            return True
        
        return False

    def DeleteByPatern(pattern):
        pass # Нужно реализовать функкцию которая бы по паттерну удаляла кеш