from django.db import models


# Create your models here.


class UserInfo(models.Model):
    user = models.CharField(max_length=32)
    pswd = models.CharField(max_length=32)
    create_time = models.DateTimeField(auto_now_add=True)
    change_time = models.DateTimeField(auto_now=True)


class Salesman(models.Model):
    name = models.CharField(max_length=10)
    age = models.PositiveSmallIntegerField()
    createData = models.IntegerField()
    date_publish = models.DateTimeField(auto_now=True)
    mod_date = models.DateTimeField('最后修改日期', auto_now=True)
