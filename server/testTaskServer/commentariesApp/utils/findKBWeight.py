

def FindKbWeight(txt:str) -> int:
    
    byteSize = len(txt.encode('utf-8'))

    kbSize = byteSize/1024

    return kbSize