


def CacheNameBuilder(startOfCacheName,dictionary:dict):

    try:
        strToReturn = startOfCacheName

        splitName = "__"
        splitValue = "="

        for key,value in dictionary.items():
            strToReturn += splitName + key
            strToReturn += splitValue + value
            
    except Exception as e:
        print(e)
        return False
    
    return strToReturn
    
    