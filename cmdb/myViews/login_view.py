from django.http import HttpResponse
from django.shortcuts import render
from cmdb import models


# 登录页面
def login(request):
    if request.method == 'POST':
        user = request.POST.get('user', None)
        pswd = request.POST.get('pswd', None)
        for each in models.UserInfo.objects.all():
            if user == each.user:
                if pswd == each.pswd:
                    return HttpResponse("登陆成功！")
                else:
                    return HttpResponse("密码错误！")
        return HttpResponse("用户名错误！")
    return render(request, 'login.html', )