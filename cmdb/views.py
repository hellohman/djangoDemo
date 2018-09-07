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
                    return HttpResponse("登陆成功！")
                else:
                    return HttpResponse("密码错误！")
        return HttpResponse("用户名错误！")
    return render(request, 'login.html', )


# 注册页面
def register(request):
    return render(request, 'register.html', )


# 主页
def home(request):
    data = list(models.UserInfo.objects.all().order_by('user').values('user', 'pswd', 'id'))
    return render(request, 'home.html', {'data': data})


# 查询: 精确 + 模糊
def queryData(request):
    pageNumber = int(request.POST.get('pageNumber', None))
    pageSize = int(request.POST.get('pageSize', None))
    queryType = request.POST.get('queryType', None)
    user = request.POST.get('user', None)
    pswd = request.POST.get('pswd', None)
    if queryType == 'fuzzy':                                   # 模糊查询
        if user and pswd:
            data = models.UserInfo.objects.filter(Q(user__icontains=user), Q(pswd__icontains=pswd)).order_by('user').values('user', 'pswd', 'id')
        elif user:
            data = models.UserInfo.objects.filter(Q(user__icontains=user)).order_by('user').values('user', 'pswd', 'id')
        elif pswd:
            data = models.UserInfo.objects.filter(Q(pswd__icontains=pswd)).order_by('user').values('user', 'pswd', 'id')
        else:
            data = models.UserInfo.objects.all().order_by('user').values('user', 'pswd', 'id')
        data = list(data)
        rows = data[(pageNumber - 1) * pageSize:pageNumber * pageSize]
        if not rows:
            rows = data[:pageSize]
        rt_dic = {'total': len(data), 'rows': rows}
        return HttpResponse(json.dumps(rt_dic), content_type="application/json")
    else:                                                       # 精确查询
        if user and pswd:
            data = models.UserInfo.objects.filter(Q(user=user), Q(pswd=pswd)).order_by('user').values('user', 'pswd', 'id')
        elif user:
            data = models.UserInfo.objects.filter(Q(user=user)).order_by('user').values('user', 'pswd', 'id')
        elif pswd:
            data = models.UserInfo.objects.filter(Q(pswd=pswd)).order_by('user').values('user', 'pswd', 'id')
        else:
            data = models.UserInfo.objects.all().order_by('user').values('user', 'pswd', 'id')
        data = list(data)
        rt_dic = {'total': len(data), 'rows': data[(pageNumber - 1) * pageSize:pageNumber * pageSize]}
        return HttpResponse(json.dumps(rt_dic), content_type="application/json")


# 删除数据
def deleteData(request):
    data = json.loads(request.POST['data'])
    pageNumber = int(request.POST.get('pageNumber', None))
    pageSize = int(request.POST.get('pageSize', None))
    for index, each in enumerate(data, 1):
        try:
            models.UserInfo.objects.filter(id=each['id']).delete()
            print('{} - 用户名:{} 删除成功!'.format(index, each['user']))
        except:
            print("id:'{}' -不存在".format(each['id']))
    data = list(models.UserInfo.objects.all().order_by('user').values('user', 'pswd', 'id'))
    rt_dic = {'total': len(data), 'rows': data[(pageNumber - 1) * pageSize:pageNumber * pageSize]}
    return HttpResponse(json.dumps(rt_dic), content_type="application/json")


# 导出数据
def exportData(request):
    data = list(models.UserInfo.objects.all().order_by('user').values('user', 'pswd', 'id'))
    return HttpResponse(json.dumps(data), content_type="application/json")


# 修改、添加数据
def editRow(request):
    user = request.POST.get('user', None)
    pswd = request.POST.get('pswd', None)
    try:
        # 修改用户
        dataId = int(request.POST.get('id', None))
        models.UserInfo.objects.filter(id=dataId).update(pswd=pswd)
        data = list(models.UserInfo.objects.filter(Q(id=dataId)).values('user', 'pswd', 'id'))
        return HttpResponse(json.dumps(data), content_type="application/json")
    except:
        # 新增用户
        if user not in [each.user for each in models.UserInfo.objects.all()]:
            models.UserInfo.objects.create(user=user, pswd=pswd)
            data = list(models.UserInfo.objects.filter(Q(user=user)).values('user', 'pswd', 'id'))
            return HttpResponse(json.dumps(data), content_type="application/json")
        return HttpResponse("用户名已存在")