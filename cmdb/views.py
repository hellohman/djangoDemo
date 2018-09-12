import json

import xlrd
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from cmdb import models
from cmdb.HhHelper.paramsHelper import dl_beginAndStopDate
from cmdb.HhHelper.rowsHelper import dl_rows2TotalRowsJson

