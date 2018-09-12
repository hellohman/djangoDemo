from django.shortcuts import render


# 注册页面
def register(request):
    return render(request, 'register.html', )