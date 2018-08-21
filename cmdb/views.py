import json

from django.http import HttpResponse
from django.shortcuts import render
from cmdb import models

# Create your views here.


def addUser(request):
    # return render(request, 'index.html', )
    # return HttpResponse('Hello world!')

    if request.method == 'POST':
        user = request.POST.get('username',None)
        pswd = request.POST.get('password',None)
        if user not in [each.user for each in models.UserInfo.objects.all()]:
            if pswd:
                models.UserInfo.objects.create(user=user,pswd=pswd)
                return render(request, 'addUser.html', {'data': models.UserInfo.objects.all()})
            else:
                return HttpResponse("密码不能为空")
        return HttpResponse("用户名已存在")
    else:       # 返回页面
        return render(request, 'addUser.html', )

def rt_json(request):       # 返回json
    test = {'name':'晃晃','age':21}
    return HttpResponse(json.dumps(test), content_type="application/json")