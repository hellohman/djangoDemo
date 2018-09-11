import datetime


def dl_beginAndStopDate(beginDate=None, stopDate=None):
    beginArr, stopArr = [1, 1, 1753], [12, 31, 9999]
    if beginDate and stopDate:
        beginArr, stopArr = [int(aa) for aa in beginDate.split("/")], [int(aa) for aa in stopDate.split("/")]
    elif beginDate:
        beginArr = [int(aa) for aa in beginDate.split("/")]
    elif stopDate:
        stopArr = [int(aa) for aa in stopDate.split("/")]
    return datetime.date(beginArr[2],beginArr[0],beginArr[1]), datetime.date(stopArr[2],stopArr[0],stopArr[1])
