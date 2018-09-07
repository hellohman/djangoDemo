var dgPageNumber = 1;   //初始默认值
var dgPageSize = 10;    //初始默认值

// 查询: 精确 + 模糊
function queryData(pageNumber,pageSize,queryType) {
    $('#search').form('submit', {
        url: '/queryData/',
        onSubmit: function (param) {
            param.pageNumber = pageNumber;
            param.queryType = queryType;
            param.pageSize = pageSize;
        },
        success: function (result) {
            dgPageNumber = pageNumber;
            dgPageSize = pageSize;
            dl_datagrid(result);
        }
    });
}

// 重置条件
function clearForm(id){
    $(id).form('clear');
    dgPageNumber = 1;
    queryData(dgPageNumber,dgPageSize,'fuzzy');
}

// 新增数据
function insertRow(){
    var index = 0;
    $('#dg').datagrid('insertRow', {
        index: index,
        row:{}
    });
    $('#dg').datagrid('selectRow',index);
    $('#dg').datagrid('beginEdit',index);
}

// 删除数据
function deleteData() {
    var selRows = $('#dg').datagrid('getChecked');
    if (selRows.length > 0) {       // 勾选形式
        $.messager.confirm('确认', '确认删除' + selRows.length + '条数据吗？', function(r){
            if (r){
                var params = {
                    data: JSON.stringify(selRows),
                    pageNumber: dgPageNumber,
                    pageSize: dgPageSize
                };
                $.post('/deleteData/',params,function (result) {
                    $.messager.alert('提示','成功删除' + selRows.length + '条数据！','info');
                    dl_datagrid(result);
                })
            }
        });
    } else {            // 输入形式
        var arr = dl_form("#search");
        var user = arr[0].value;
        if (user != null && user !== "") {
            $.messager.confirm('确认', '确认删除用户名为 ' + user + ' 的数据吗？', function(r){
                if (r){
                    var params = {
                        data: JSON.stringify([{user:user}]),
                        pageNumber: dgPageNumber,
                        pageSize: dgPageSize
                    };
                    $.post('/deleteData/',params,function (result) {
                        $.messager.alert('提示','成功删除用户名为 ' + user + ' 的数据！','info');
                        dl_datagrid(result);
                    })
                }
            });
        } else {
            $.messager.alert('提示','请至少勾选一条数据 或 填写用户名！','warning');
        }
    }
}

// 导出数据
function exportData() {
    $.post('/exportData/',function (result) {
        var title = ["id","用户名","密码"];
        var field = ["id","user","pswd"];
        JSONToExcel(result, "用户信息", title, field);
    })
}

// 数据网格
$(function(){
    document.getElementById("left_1").innerHTML += "<li>" + "<a href=\"/login/\" title=\"test\">111</a>" + "</li>";
    $('#dg').datagrid({
        iconCls:'icon-edit',
        method: 'post',
        loadMsg: '数据加载中...',
        pagination: true,
        pageSize: 10,
        width:1000,
        height:600,
        pageList: [10,20,30,50],
        rownumbers: true,
        singleSelect: false,
        checkOnSelect: true,
        multiSort: true,                     // 是否多列排序
        remoteSort: false,                  // 是否从服务器排序数据
        // collapsible: true,                 // 收缩
        // fitColumns: true,
        selectOnCheck: true,
        striped: true,
        nowrap: true,
        fixRowHeight: 1,
        toolbar: '#tb',
        columns:[[
            {field:'ck',checkbox:true},
            {field:'id',title:'数据ID',width:150,align:'center',editor:'text',hidden:true},
            {field:'user',title:'用户名',width:"30%",align:'center',editor:'text',resizable:true,sortable:true},
            {field:'pswd',title:'密码',width:150,align:'center',editor:'text',resizable:true,sortable:true},
            {field:'action',title:'操作',width:80,align:'center',
                formatter:function(value,row,index){
                    if (row.editing){
                        var save = '<a href="#" onclick="saveRow(this)" style="font-size:13px">保存</a> ';
                        var cancel = '<a href="#" onclick="cancelRow(this)" style="font-size:13px">取消</a>';
                        return save + cancel;
                    } else {
                        var edit = '<a href="#" onclick="editRow(this)" style="color:blue;font-size:13px">修改</a> ';
                        var del = '<a href="#" onclick="deleteRow(this)" style="color:red;font-size:12px">删除</a>';
                        return edit + del;
                    }
                }
            }
        ]],
        onBeforeEdit:function(index,row){
            updateActions(index,{editing:true});
        },
        onAfterEdit:function(index,row){
            if (row.user !== "" && row.pswd !== "") {
                row.editing = false;
                $.post('/editRow/', row, function (result) {
                    if (result == "用户名已存在") {
                        $.messager.alert('提示','用户名已存在，请重新输入！','info');
                        $('#dg').datagrid('selectRow',index);
                        $('#dg').datagrid('beginEdit',index);
                    } else {
                        $.messager.alert('提示','成功修改1条数据！','info');
                        updateActions(index,result);
                    }
                });
            } else {
                $.messager.alert('错误','用户名、密码均不能为空！','error');
                $('#dg').datagrid('selectRow',index);
                $('#dg').datagrid('beginEdit',index);
            }
        },
        onCancelEdit:function(index,row){
            updateActions(index,{editing:false});
        }
    });
    $('#dg').datagrid('getPager').pagination({
        showRefresh: false,
        showPageList: true,
        beforePageText:  '第',
        afterPageText: '页.共{pages}页',
        displayMsg: '第{from}-{to}条. 共{total}条',
        onSelectPage:function(pageNumber, pageSize){
            queryData(pageNumber,pageSize,'fuzzy');
        }
    });
    queryData(1,10,'fuzzy');
});

// ------------------------------------------------ 行 处 理 -------------------------------------------------------- //
// 更新行状态
function updateActions(index,dic){
    $('#dg').datagrid('updateRow',{
        index: index,
        row:dic
    });
}

// 获取行号
function getRowIndex(target){
    var tr = $(target).closest('tr.datagrid-row');
    return parseInt(tr.attr('datagrid-row-index'));
}

// 修改行
function editRow(target){
    $('#dg').datagrid('beginEdit', getRowIndex(target));
}

// 删除行
function deleteRow(target){
    var index = getRowIndex(target);
    $.messager.confirm('提示','确认删除第' + (index+1) + '条数据？',function(r){
        if (r){
            var rows = $('#dg').datagrid('getRows');        // 所有行
            var row = [rows[index]];                          // 其中一行
            var params = {
                data: JSON.stringify(row),
                pageNumber: dgPageNumber,
                pageSize: dgPageSize
            };
            $.post('/deleteUser/', params, function (result) {
                $.messager.alert('提示','成功删除1条数据！','info');
                dl_datagrid(result);
            });
        }
    });
}

// 保存行
function saveRow(target){
    var index = getRowIndex(target);
    $.messager.confirm('提示','确认修改第' + (index+1) + '条数据？',function(r){
        if (r){
            $('#dg').datagrid('endEdit', index);
        }
    });
}

// 取消行编辑
function cancelRow(target){
    $('#dg').datagrid('cancelEdit', getRowIndex(target));
}
// ------------------------------------------------ 行 处 理 -------------------------------------------------------- //

// ------------------------------------------------- 辅 助 ---------------------------------------------------------- //
// data
function dl_datagrid(input) {
    var data;
    if (typeof input == "string") {
        data = JSON.parse(input);                  // 转json
    } else {
        data = input;
    }
    if (data['total'] == 0) {
        $.messager.alert('提示','未查询到数据！','info');
    } else {
        $('#dg').datagrid('loadData',data);
    }
}

// form
function dl_form(id) {
    var params = $(id).serialize();
    var paramsArray = params.split("&");
    var tempArray = [];
    for(var i =0;i<paramsArray.length;i++){
        var obj={};
        obj.key = paramsArray[i].split("=")[0];
        obj.value = paramsArray[i].split("=")[1];
        tempArray.push(obj);
    }
    return tempArray;
}

// excel
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
            rows += "<td>" + arrData[i][Field[j]] + "</td>";
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
// ------------------------------------------------- 辅 助 ---------------------------------------------------------- //