// 导出数据
function exportData() {
    $.post('/exportData/',function (result) {
        var title = ["id","用户名","密码"];
        var field = ["id","user","pswd"];
        JSONToExcel(result, "用户信息", title, field);
    })
}

// 模板下载
function downloadModel() {
    var title = ["操作类型(1-修改数据；2-新增数据；3-删除数据)","数据id","用户名","密码"];
    var field = [];
    var result = [];
    JSONToExcel(result, "操作模板", title, field);
}

// 导入数据
function uploadExcel() {

    $('#questionTypesManage').form('submit', {
        url: '/user/userOption/',
        onSubmit: function (param) {
        },
        success: function (result) {
            if (result == '请勿修改模板表格第一行的文字！' || result == '密码错误！') {

            }
        }
    });

    // //得到上传文件的全路径
    // var fileName= $('#uploadExcel').filebox('getValue');
    // if(fileName === ""){
    //     $.messager.alert('提示','请选择上传文件！','info');
    // }else{
    //     //对文件格式进行校验
    //     var d1 = /\.[^\.]+$/.exec(fileName);
    //     alert(d1);
    //     if(d1 === ".xls" || d1 === ".xlsx"){
    //         // //获取题型
    //         // var id= $('#questionType').combobox('getValue')
    //         // var questionTypes=encodeURI(id);
    //         //
    //         // //获取课程
    //         // var courseTypeId =$('#courseTypeId').combobox('getValue')
    //         // var courseType=encodeURI(courseTypeId);
    //
    //         //提交表单
    //         document.getElementById("questionTypesManage").action="${pageContext.request.contextPath}/leadtoQuestionTypes/leadInExcelQuestionBank?questionType="+questionTypes+"&courseType="+courseType;
    //         document.getElementById("questionTypesManage").submit();
    //         $.messager.alert('提示','操作成功！','info');
    //     }else{
    //         $.messager.alert('提示','请选择xls格式文件！','info');
    //         $('#uploadExcel').filebox('setValue','');
    //     }
    // }
    //获取题型
    // var id = $('#questionType').combobox('getValue');
    // var questionTypes = encodeURI(id);

    // if(questionTypes !== ""){
    //     //进行基本校验
    //     if(fileName === ""){
    //         $.messager.alert('提示','请选择上传文件！','info');
    //     }else{
    //         //对文件格式进行校验
    //         var d1=/\.[^\.]+$/.exec(fileName);
    //         if(d1==".xls"){
    //             //获取题型
    //             var id= $('#questionType').combobox('getValue')
    //             var questionTypes=encodeURI(id);
    //
    //             //获取课程
    //             var courseTypeId =$('#courseTypeId').combobox('getValue')
    //             var courseType=encodeURI(courseTypeId);
    //
    //             //提交表单
    //             document.getElementById("questionTypesManage").action="${pageContext.request.contextPath}/leadtoQuestionTypes/leadInExcelQuestionBank?questionType="+questionTypes+"&courseType="+courseType;
    //             document.getElementById("questionTypesManage").submit();
    //             $.messager.alert('提示','操作成功！','info');
    //         }else{
    //             $.messager.alert('提示','请选择xls格式文件！','info');
    //             $('#uploadExcel').filebox('setValue','');
    //         }
    //     }
    // }else{
    //     $.messager.alert('提示','请选择课程题型！','info');
    // }
}

// 导出辅助
function JSONToExcel(JSONData, FileName, Title, Field) {
    var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    var excel = "<table>";
    var rows = "<tr>";

    // 表头
    for (var i in Title) {
        rows += "<td>" + Title[i] + "</td>";
    }
    excel += rows + "</tr>";

    // 数据
    for (i = 0; i < arrData.length; i++) {
        rows = "<tr>";
        for (var j in Field) {
            if (Field[j] !== "") {
                rows += "<td>" + arrData[i][Field[j]] + "</td>";
            }
        }
        excel += rows + "</tr>";
    }
    excel += "</table>";

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "Sheet1";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";

    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = FileName + ".xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}