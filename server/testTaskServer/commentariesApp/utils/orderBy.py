

def orderBy(querySet, fieldName, inWhatOrder):
    relatedFields = ["username", "email"]

    try:
        isRelated = False
        if fieldName in relatedFields:
            isRelated = True

        if inWhatOrder not in ["descending", "ascending"]:
            raise Exception("Param have to be  'descending' or 'ascending' ")

        if inWhatOrder == "descending":
            if isRelated:
                newQuerySet = querySet.select_related("owner").order_by(f"-owner__{fieldName}")
            else:
                newQuerySet = querySet.order_by(f"-{fieldName}")
        else:
            if isRelated:
                newQuerySet = querySet.select_related("owner").order_by(f"owner__{fieldName}")
            else:
                newQuerySet = querySet.order_by(fieldName)

        return newQuerySet

    except Exception as e:
        print(f"OrderBy function raised: {e}")
        return querySet