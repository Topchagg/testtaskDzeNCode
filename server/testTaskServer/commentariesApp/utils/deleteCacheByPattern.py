from django.core import cache
from django_redis import get_redis_connection

from .cacheMethods import *

import json


def deleteCacheByPattern(pattern: str) -> None:
    try:
        redis_conn = get_redis_connection("default") 

        all_keys = redis_conn.keys("*")  

        deleted_count = 0
        for key in all_keys:
            decoded_key = key.decode('utf-8') 
            
            print(decoded_key[3:])
            if decoded_key[3:].startswith(pattern):
                redis_conn.delete(decoded_key)  
                deleted_count += 1  

        return deleted_count 

    except Exception as e:
        print(f"Error while deleting cache: {e}")
        return 0 