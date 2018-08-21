import json

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from cmdb import models


def index(request):
    # return render(request, 'index.html', )
    # return HttpResponse('Hello world!')

    user_list = []
    if request.method == 'POST':
        username = request.POST.get('username',None)
        password = request.POST.get('password',None)
        user_list.append({'user': username, 'pswd': password})
        models.UserInfo.objects.create(user=username,pswd=password)
        user_list = models.UserInfo.objects.all()
    return render(request, 'index.html', {'data': user_list})

def rt_html(request):       # 返回静态页面
    return render(request, 'index.html', )

def rt_json(request):       # 返回json
    test = {'name':'晃晃','age':21}
    return HttpResponse(json.dumps(test), content_type="application/json")