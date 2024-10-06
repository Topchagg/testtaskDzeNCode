from .cacheMethods import *
from .deleteCacheByPattern import *

def CallBackUpdateCache(selfInstance,callBackFunc,cacheToClear,request,*args,**kwargs,):
    try:
        response =  callBackFunc(selfInstance,request,*args,**kwargs)

        deleteCacheByPattern(selfInstance.filteredCacheName) # Очищаю все фильтрационные кеши т.к любое изменение приводит к изменениям фильтров
        CacheMethods.deleteCache(cacheToClear)

        return response

    except Exception as e:
        print(e)
        return False