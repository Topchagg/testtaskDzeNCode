

def orderBy(querySet,fieldName,char):

    try:
        if char != "-" and char != "+":
            raise Exception("Char have to be + or -")

        if char == "-":
            newQuerySet = querySet.order_by(char+fieldName)
        elif char == "+":
            newQuerySet = querySet.order_by(fieldName)

        return newQuerySet

    except Exception as e:
        print(f"OrderBy function raised: {e}")
        return querySet