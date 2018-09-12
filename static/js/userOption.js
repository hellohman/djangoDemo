var forExport;

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
            if (result === "请勿修改模板表格第一行的文字！") {
                $.messager.alert('提示',result,'warning');
            } else if(result.substr(0, 8) === "所有数据操作成功") {
                $.messager.alert('提示',result,'warning');
            } else {
                var data;
                if (typeof result === "string") {
                    var helpDic = JSON.parse(result);                  // 转json
                    forExport = helpDic['forExport'];
                    data = helpDic['forDatagrid'];
                } else {
                    forExport = result['forExport'];
                    data = result['forDatagrid'];
                }
                document.getElementsByClassName('panel datagrid panel-htop easyui-fluid')[0].setAttribute("style","display:block");
                $('#dg').datagrid('loadData',data);
                $.messager.alert('提示','导入完毕，处理结果如下！','info');
                document.getElementsByClassName('panel-title')[4].innerHTML += " - 共" + data.total + "条失败数据！";
            }
        }
    });
}

// 数据网格
$(function(){
    $('#dg').datagrid({
        height: 350,
        fit: true,                            // 全屏
        // rownumbers: true,
        singleSelect: false,
        checkOnSelect: true,
        fitColumns: true,
        remoteSort: false,                  // 是否从服务器排序数据
        selectOnCheck: true,
        striped: true,
        nowrap: true,
        fixRowHeight: 1,
        toolbar: '#tb',
        columns:[[
            {field:'result',title:'处理结果',width:400,align:'center',editor:'text'}
        ]]
    });
    document.getElementsByClassName('panel datagrid panel-htop easyui-fluid')[0].setAttribute("style","display:none");
});

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