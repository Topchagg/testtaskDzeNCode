


def CacheNameBuilder(startOfCacheName,dictionary:dict):

    try:
        strToReturn = startOfCacheName

        vars = ["ascending","descending"]

        splitName = "__"
        splitValue = "="

        for key,value in dictionary.items():
            
            if value:
                if value in vars or key == "page" and int(value):
                    strToReturn += splitName + key
                    strToReturn += splitValue + value
                else:
                    raise Exception("Wrong params")

        return strToReturn

    except Exception as e:
        print(e)
        return False
        
    