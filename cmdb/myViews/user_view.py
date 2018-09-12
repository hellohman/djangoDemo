import json

from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render
from cmdb import models
from cmdb.HhHelper.paramsHelper import dl_beginAndStopDate
from cmdb.HhHelper.rowsHelper import dl_rows2TotalRowsJson


# 主页
def user(request):
    data = list(models.UserInfo.objects.all().order_by('-create_time').values('id', 'user', 'pswd', 'create_time'))
    return render(request, 'user.html', {'data': data})


# 查询: 精确 + 模糊
def queryData(request):
    pageNumber, pageSize = int(request.POST.get('pageNumber', None)), int(request.POST.get('pageSize', None))
    queryType = request.POST.get('queryType', None)
    user = request.POST.get('user', None)
    pswd = request.POST.get('pswd', None)
    beginTime, stopTime = dl_beginAndStopDate(request.POST.get('beginTime', None), request.POST.get('stopTime', None))
    if queryType == 'fuzzy':                                   # 模糊查询
        if user and pswd:
            data = models.UserInfo.objects.filter(Q(user__icontains=user), Q(pswd__icontains=pswd), Q(create_time__range=(beginTime, stopTime))).order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
        elif user:
            data = models.UserInfo.objects.filter(Q(user__icontains=user), Q(create_time__range=(beginTime, stopTime))).order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
        elif pswd:
            data = models.UserInfo.objects.filter(Q(pswd__icontains=pswd), Q(create_time__range=(beginTime, stopTime))).order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
        else:
            data = models.UserInfo.objects.filter(Q(create_time__range=(beginTime, stopTime))).order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
    else:                                                       # 精确查询
        if user and pswd:
            data = models.UserInfo.objects.filter(Q(user=user), Q(pswd=pswd), Q(create_time__range=(beginTime, stopTime))).order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
        elif user:
            data = models.UserInfo.objects.filter(Q(user=user), Q(create_time__range=(beginTime, stopTime))).order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
        elif pswd:
            data = models.UserInfo.objects.filter(Q(pswd=pswd), Q(create_time__range=(beginTime, stopTime))).order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
        else:
            data = models.UserInfo.objects.filter(Q(create_time__range=(beginTime, stopTime))).order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
    rt_json = dl_rows2TotalRowsJson(data, pageNumber, pageSize, ['create_time'])
    return HttpResponse(rt_json, content_type="application/json")


# 删除数据
def deleteData(request):
    data = json.loads(request.POST['rows'])
    pageNumber, pageSize = int(request.POST.get('pageNumber', None)), int(request.POST.get('pageSize', None))
    for index, each in enumerate(data, 1):
        try:
            models.UserInfo.objects.filter(id=each['id']).delete()
            print('{} - 用户名:{} 删除成功!'.format(index, each['user']))
        except:
            print("id:'{}' -不存在".format(each['id']))
    data = models.UserInfo.objects.all().order_by('-create_time').values('id', 'user', 'pswd', 'create_time')
    rt_json = dl_rows2TotalRowsJson(data, pageNumber, pageSize, ['create_time'])
    return HttpResponse(rt_json, content_type="application/json")


# 导出数据
def exportData(request):
    data = list(models.UserInfo.objects.all().order_by('-create_time').values('id', 'user', 'pswd', 'create_time'))
    return HttpResponse(json.dumps(data), content_type="application/json")


# 修改、添加数据
def editRow(request):
    user = request.POST.get('user', None)
    pswd = request.POST.get('pswd', None)
    try:
        # 修改用户
        dataId = int(request.POST.get('id', None))
        models.UserInfo.objects.filter(id=dataId).update(pswd=pswd)
        data = list(models.UserInfo.objects.filter(Q(id=dataId)).values('id', 'user', 'pswd', 'create_time'))
        return HttpResponse(json.dumps(data), content_type="application/json")
    except:
        # 新增用户
        if user not in [each.user for each in models.UserInfo.objects.all()]:
            models.UserInfo.objects.create(user=user, pswd=pswd)
            data = list(models.UserInfo.objects.filter(Q(user=user)).values('id', 'user', 'pswd', 'create_time'))
            return HttpResponse(json.dumps(data), content_type="application/json")
        return HttpResponse("用户名已存在")