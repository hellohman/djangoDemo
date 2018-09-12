import datetime


def dl_beginAndStopDate(beginDate=None, stopDate=None):
    beginArr, stopArr = (1753, 1, 1), (9999, 12, 31)
    if beginDate and stopDate:
        beginArr = (int(aa) if aa[0] != '0' else int(aa[1]) for aa in beginDate.split("-"))
        stopArr = (int(aa) if aa[0] != '0' else int(aa[1]) for aa in stopDate.split("-"))
    elif beginDate:
        beginArr = (int(aa) if aa[0] != '0' else int(aa[1]) for aa in beginDate.split("-"))
    elif stopDate:
        stopArr = (int(aa) if aa[0] != '0' else int(aa[1]) for aa in stopDate.split("-"))
    return datetime.date(*beginArr), datetime.date(*stopArr)
