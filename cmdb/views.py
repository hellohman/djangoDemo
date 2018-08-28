import json

from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from cmdb import models


# 登录页面
def login(request):
    if request.method == 'POST':
        user = request.POST.get('user', None)
        pswd = request.POST.get('pswd', None)
        data = models.UserInfo.objects.all().order_by('user')
        for each in data:
            if user == each.user:
                if pswd == each.pswd:
                    data = [{'user': each.user, 'pswd': each.pswd} for each in data]
                    return HttpResponse(json.dumps(data), content_type="application/json")
                else:
                    return HttpResponse("密码错误")
        return HttpResponse("用户名错误")
    return render(request, 'login.html', )


# 注册页面
def register(request):
    data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all().order_by('user')]
    return render(request, 'register.html', {'data': data})


# 添加用户
def addUser(request):
    user = request.POST.get('user', None)
    pswd = request.POST.get('pswd', None)
    if user not in [each.user for each in models.UserInfo.objects.all()]:
        models.UserInfo.objects.create(user=user, pswd=pswd)
        data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all().order_by('user')]
        return HttpResponse(json.dumps(data), content_type="application/json")
    return HttpResponse("用户名已存在")


# 修改用户
def updateUser(request):
    if request.method == 'POST':
        data = json.loads(request.POST['data'])
        print(data)


# 删除用户
def deleteUser(request):
    data = json.loads(request.POST['data'])
    for index,each in enumerate(data,1):
        models.UserInfo.objects.filter(user=each['user']).delete()
        print('{} - 用户名:{} 删除成功!'.format(index,each['user']))
    rt_data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all()]
    return HttpResponse(json.dumps(rt_data), content_type="application/json")


# 精确查询
def exactSearch(request):
    user = request.POST.get('user', None)
    pswd = request.POST.get('pswd', None)
    pageNumber = request.POST.get('pageNumber', None)
    pageSize = request.POST.get('pageSize', None)
    if user and pswd:
        data = models.UserInfo.objects.filter(Q(user=user), Q(pswd=pswd))
    elif user:
        data = models.UserInfo.objects.filter(Q(user=user))
    else:
        data = models.UserInfo.objects.filter(Q(pswd=pswd))
    rt_data = [{'user': each.user, 'pswd': each.pswd} for each in data]
    return HttpResponse(json.dumps(rt_data), content_type="application/json")


# 模糊查询
def fuzzySearch(request):
    user = request.POST.get('user', None)
    pswd = request.POST.get('pswd', None)
    if user and pswd:
        data = models.UserInfo.objects.filter(Q(user__icontains=user), Q(pswd__icontains=pswd))
    elif user:
        data = models.UserInfo.objects.filter(Q(user__icontains=user))
    else:
        data = models.UserInfo.objects.filter(Q(pswd__icontains=pswd))
    rt_data = [{'user': each.user, 'pswd': each.pswd} for each in data]
    return HttpResponse(json.dumps(rt_data), content_type="application/json")


# 返回json
def rt_json(request):
    data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all()]
    return HttpResponse(json.dumps(data), content_type="application/json")