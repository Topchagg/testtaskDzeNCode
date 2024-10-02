from .cacheMethods import *

def CallBackUpdateCache(selfInstance,callBackFunc,request,*args,**kwargs,):
    try:
        pageNumber = request.GET.get("page")

        keyOfCache = selfInstance.keyOfCache + pageNumber

        response =  callBackFunc(selfInstance,request,*args,**kwargs)

        CacheMethods.deleteCache(keyOfCache)

        return response

    except Exception as e:
        print(e)
        return False