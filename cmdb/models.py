from django.db import models

# Create your models here.


class UserInfo(models.Model):
    user = models.CharField(max_length=32)
    pswd = models.CharField(max_length=32)


# class Salesman(models.Model):
#     name = models.CharField(max_length=10)
#     age = models.PositiveSmallIntegerField()
#     createData = models.IntegerField()
#     date_publish = models.DateTimeField(auto_now=True)
