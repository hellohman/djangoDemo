import json


def dl_rows2TotalRowsJson(dataList, pageNumber, pageSize, time_fieldsArr=None):
    rows = list(dataList[(pageNumber - 1) * pageSize:pageNumber * pageSize])
    if not rows:
        rows = dataList[:pageSize]
    else:
        for field in time_fieldsArr:
            for data in rows:
                data[field] = data[field].strftime("%Y-%m-%d %H:%M:%S")
    rt_dic = {'total': len(dataList), 'rows':rows}
    return json.dumps(rt_dic)
