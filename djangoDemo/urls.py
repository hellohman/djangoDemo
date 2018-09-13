"""djangoDemo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from cmdb import views
from cmdb.myViews import login_view
from cmdb.myViews import register_view
from cmdb.myViews import user_view
from cmdb.myViews import userOption_view

urlpatterns = [
    path(r'login/', login_view.login),                           # 登录页面
    path(r'register/', register_view.register),                 # 注册页面

    path(r'user/', user_view.user),                              # 用户页面
    path(r'queryData/', user_view.queryData),                   # 查询: 精确 + 模糊
    path(r'deleteData/', user_view.deleteData),                 # 删除数据
    path(r'exportData/', user_view.exportData),                 # 导出数据
    path(r'editRow/', user_view.editRow),                       # 修改、添加数据

    path(r'user/userOption/', userOption_view.userOption),     # 用户批量操作页面
    path(r'user/userOption/export_failedDataExcel/', userOption_view.export_failedDataExcel)
]
