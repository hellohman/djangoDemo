import json

import xlrd
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from cmdb import models
from cmdb.HhHelper.paramsHelper import dl_beginAndStopDate
from cmdb.HhHelper.rowsHelper import dl_rows2TotalRowsJson


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


# 注册页面
def register(request):
    return render(request, 'register.html', )


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
    data = json.loads(request.POST['data'])
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


# 用户批量操作
def userOption(request):
    if request.method == 'POST':
        field_row, excel = 1, xlrd.open_workbook(file_contents=request.FILES['uploadExcel'].read())
        table = excel.sheets()[0]
        key_arr = table.row_values(field_row - 1)
        if key_arr == ['操作类型(1-修改数据；2-新增数据；3-删除数据)', '数据id', '用户名', '密码']:
            index_dic = {aa: key_arr.index(aa) for aa in key_arr}
            rt_arr = []
            for i in range(field_row, table.nrows):
                try:
                    # 1.解析数据
                    data_id = int(table.row_values(i)[index_dic['数据id']])
                    data_type = int(table.row_values(i)[index_dic['操作类型(1-修改数据；2-新增数据；3-删除数据)']])
                    data_user = str(table.row_values(i)[index_dic['用户名']])
                    data_pswd = str(table.row_values(i)[index_dic['密码']])
                    # 2.操作
                    if data_type == 1:        # 修改
                        models.UserInfo.objects.filter(id=data_id).update(pswd=data_pswd)
                    elif data_type == 2:      # 新增
                        models.UserInfo.objects.create(user=data_user, pswd=data_pswd)
                    elif data_type == 3:      # 删除
                        models.UserInfo.objects.filter(id=data_id).delete()
                    else:
                        rt_arr.append({'result':'第{}行数据操作失败！'.format(i)})
                except:
                    rt_arr.append({'result':'第{}行数据操作失败！'.format(i)})
            if rt_arr:
                rt_dic = {'total': len(rt_arr), 'rows': rt_arr}
                return HttpResponse(json.dumps(rt_dic), content_type="application/json")
            return HttpResponse("所有数据操作成功: 共{}条数据！".format(table.nrows - field_row))
        else:
            return HttpResponse("请勿修改模板表格第一行的文字！")
    else:
        return render(request, 'userOption.html', )