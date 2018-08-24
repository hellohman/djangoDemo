import json
import traceback

from django.core.paginator import Paginator
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from cmdb import models


def addUser(request):
    if request.method == 'POST':
        user = request.POST.get('user', None)
        pswd = request.POST.get('pswd', None)
        if user not in [each.user for each in models.UserInfo.objects.all()]:
            if pswd:
                models.UserInfo.objects.create(user=user, pswd=pswd)
                data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all()]
                return render(request, 'addUser.html', {'data': data})
            else:
                return HttpResponse("密码不能为空")
        return HttpResponse("用户名已存在")
    else:       # 返回页面
        return render(request, 'addUser.html', )


def add(request):
    if request.method == 'POST':
        user = request.POST.get('user', None)
        pswd = request.POST.get('pswd', None)
        if user not in [each.user for each in models.UserInfo.objects.all()]:
            if pswd:
                models.UserInfo.objects.create(user=user, pswd=pswd)
                data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all()]
                return HttpResponse(json.dumps(data), content_type="application/json")
            else:
                return HttpResponse("密码不能为空")
        return HttpResponse("用户名已存在")
    else:       # 返回页面
        return render(request, 'addUser.html', )


def rt_json(request):       # 返回json
    data = [{'user': each.user, 'pswd': each.pswd} for each in models.UserInfo.objects.all()]
    return HttpResponse(json.dumps(data), content_type="application/json")