import json

from io import StringIO

import xlwt
import xlrd
from django.http import HttpResponse
from django.shortcuts import render
from cmdb import models


# 用户批量操作
def userOption(request):
    if request.method == 'POST':
        field_row, excel = 1, xlrd.open_workbook(file_contents=request.FILES['uploadExcel'].read())
        table = excel.sheets()[0]
        key_arr = table.row_values(field_row - 1)
        if key_arr == ['操作类型(1-修改数据；2-新增数据；3-删除数据)', '数据id', '用户名', '密码']:
            index_dic = {aa: key_arr.index(aa) for aa in key_arr}
            arr_forDatagrid, arr_forExport = [], [['操作类型(1-修改数据；2-新增数据；3-删除数据)', '数据id', '用户名', '密码']]
            for i in range(field_row, table.nrows):
                try:
                    # 1.解析数据
                    data_type = int(table.row_values(i)[index_dic['操作类型(1-修改数据；2-新增数据；3-删除数据)']])
                    data_id = int(table.row_values(i)[index_dic['数据id']])
                    data_user = str(table.row_values(i)[index_dic['用户名']])
                    data_pswd = str(table.row_values(i)[index_dic['密码']])
                    # 2.操作
                    if data_type == 1:        # 修改
                        if models.UserInfo.objects.filter(id=data_id):
                            models.UserInfo.objects.filter(id=data_id).update(pswd=data_pswd)
                        else:                                               # 修改失败
                            arr_forExport.append(table.row_values(i))
                            arr_forDatagrid.append({'result':'第{}行数据 - 修改失败 - id:"{}" 不存在'.format(i, data_id)})
                    elif data_type == 2:      # 新增
                        if models.UserInfo.objects.filter(id=data_id):      # 新增失败
                            arr_forExport.append(table.row_values(i))
                            arr_forDatagrid.append({'result':'第{}行数据 - 新增失败 - id:"{}" 已存在'.format(i, data_id)})
                        else:
                            models.UserInfo.objects.create(user=data_user, pswd=data_pswd)
                    elif data_type == 3:      # 删除
                        if models.UserInfo.objects.filter(id=data_id):
                            models.UserInfo.objects.filter(id=data_id).delete()
                        else:                                               # 删除失败
                            arr_forExport.append(table.row_values(i))
                            arr_forDatagrid.append({'result':'第{}行数据 - 删除失败 - id:"{}" 不存在'.format(i, data_id)})
                    else:
                        arr_forExport.append(table.row_values(i))
                        arr_forDatagrid.append({'result':'第{}行数据 - 操作失败 - 操作类型错误'.format(i)})
                except:
                    arr_forExport.append(table.row_values(i))
                    arr_forDatagrid.append({'result':'第{}行数据 - 操作失败 - 未知错误'.format(i)})
            if arr_forDatagrid:
                rt_dic = {'forDatagrid': {'total': len(arr_forDatagrid), 'rows': arr_forDatagrid}, 'forExport': arr_forExport}
                return HttpResponse(json.dumps(rt_dic), content_type="application/json")
            return HttpResponse("所有数据操作成功: 共{}条！".format(table.nrows - field_row))
        else:
            return HttpResponse("请勿修改模板表格第一行的文字！")
    else:
        return render(request, 'userOption.html', )


# 导出操作失败数据excel
def export_failedDataExcel(request):
    inputArr = json.loads(request.POST['data'])
    wb = xlwt.Workbook(encoding='utf-8')
    sheet1 = wb.add_sheet(u"数据报表第一页")
    for i, title in enumerate(['操作类型(1-修改数据；2-新增数据；3-删除数据)', '数据id', '用户名', '密码']):
        sheet1.write(0, i, title)
    for write_row, write_arr in enumerate(inputArr,1):
        for i, fill in enumerate(write_arr):
            sheet1.write(write_row, i, fill)
    sio = StringIO()
    wb.save(sio)
    sio.seek(0)
    response = HttpResponse(sio.getvalue(), content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename=失败数据报表.xls'
    response.write(sio.getvalue())
    return response