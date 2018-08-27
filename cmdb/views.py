import json

from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from cmdb import models


# 注册页面
def register(request):
    return render(request, 'register.html', )


# 添加用户
def addUser(request):
    if request.method == 'POST':
        user = request.POST.get('user', None)
        pswd = request.POST.get('pswd', None)
        if user not in [each.user for each in models.UserInfo.objects.all()]:
            models.UserInfo.objects.create(user=user, pswd=pswd)
            data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all()]
            return HttpResponse(json.dumps(data), content_type="application/json")
        return HttpResponse("用户名已存在")
    else:       # 返回页面
        return render(request, 'register.html', )


# 修改用户
def updateUser(request):
    if request.method == 'POST':
        data = json.loads(request.POST['data'])
        print(data)


# 删除用户
def deleteUser(request):
    if request.method == 'POST':
        data = json.loads(request.POST['data'])
        for index,each in enumerate(data,1):
            models.UserInfo.objects.filter(user=each['user']).delete()
            print('{} - 用户名:{} 删除成功!'.format(index,each['user']))
        rt_data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all()]
        return HttpResponse(json.dumps(rt_data), content_type="application/json")


# 返回json
def rt_json(request):
    data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all()]
    return HttpResponse(json.dumps(data), content_type="application/json")