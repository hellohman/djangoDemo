import json


def dl_rows2TotalRowsJson(dataList, pageNumber=None, pageSize=None, time_fieldsArr=None):
    if pageNumber and pageSize:
        rows = dataList[(pageNumber - 1) * pageSize:pageNumber * pageSize]
        if not rows:
            rows = dataList[:pageSize]
    else:
        rows = dataList

    if not rows:
        rows = dataList
    else:
        for field in time_fieldsArr:
            for data in rows:
                data[field] = data[field].strftime("%Y-%m-%d %H:%M:%S")
    rt_dic = {'total': len(dataList), 'rows': list(rows)}
    return json.dumps(rt_dic)
