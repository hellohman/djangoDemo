var dgPageNumber = 1;   //初始默认值
var dgPageSize = 10;    //初始默认值

// 精确查询
function exactSearch() {
    $('#search').form('submit', {
        url: '/exactSearch/',
        onSubmit: function (param) {
            param.pageNumber = 1;
            param.pageSize = 10;
        },
        success: function (result) {
            dgPageNumber = 1;
            dgPageSize = 10;
            dl_datagrid(result);
        }
    });
}

// 模糊查询
function fuzzySearch(pageNumber,pageSize) {
    $('#search').form('submit', {
        url: '/fuzzySearch/',
        onSubmit: function (param) {
            param.pageNumber = pageNumber;
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
    fuzzySearch(1,dgPageSize);
}

// 新增数据
function addUser() {
    var arr = dl_form("#search");
    var user = arr[0].value;
    var pswd = arr[1].value;
    // 用户名判断
    if (user != null && user !== "") {
        // 密码判断
        if (pswd != null && pswd !== "") {
            // 发送请求
            $.post('/addUser/',{user:user,pswd:pswd,pageNumber:dgPageNumber,pageSize:dgPageSize},function (result) {
                if (result == "用户名已存在") {
                    $.messager.alert('错误','新增失败：用户名已存在！','error');
                } else {
                    $.messager.alert('提示','新增成功！','info');
                    dl_datagrid(result);
                }
            })
        } else {
            $.messager.alert('错误','密码不能为空！','error');
        }
    } else {
        $.messager.alert('错误','用户名不能为空！','error');
    }
}

// 删除数据
function deleteUserList() {
    var selRows = $('#dg').datagrid('getChecked');
    if (selRows.length > 0) {
        $.messager.confirm('确认', '确认删除' + selRows.length + '条数据吗？', function(r){
            if (r){
                var params = {
                    data: JSON.stringify(selRows),
                    pageNumber: dgPageNumber,
                    pageSize: dgPageSize
                };
                $.post('/deleteUser/',params,function (result) {
                    $.messager.alert('提示','成功删除' + selRows.length + '条数据！','info');
                    dl_datagrid(result);
                })
            }
        });
    } else {
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
                    $.post('/deleteUser/',params,function (result) {
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
function exportExcel() {
    $.post('/exportExcel/',function (result) {
        var title = ["id","用户名","密码"];
        var field = ["id","user","pswd"];
        JSONToExcel(result, "用户信息", title, field);
    })
}

// 更新行状态
function updateActions(index,row){
    $('#dg').datagrid('updateRow',{
        index: index,
        row:{ck:false}
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
            var rows = $('#dg').datagrid('getRows');        // 所有行
            var row = rows[index];                          // 其中一行
            var params = {
                data: JSON.stringify(row),
                pageNumber: dgPageNumber,
                pageSize: dgPageSize
            };
            $.post('/editRow/', params, function (result) {
                $.messager.alert('提示','成功修改1条数据！','info');
                dl_datagrid(result);
            });
        }
    });
    $('#dg').datagrid('endEdit', getRowIndex(target));
}

// 取消行编辑
function cancelRow(target){
    $('#dg').datagrid('cancelEdit', getRowIndex(target));
}

// 数据网格
$(function(){
    document.getElementById("left_1").innerHTML += "<li>" + "<a href=\"/login/\" title=\"test\">111</a>" + "</li>";
    $('#dg').datagrid({
        // iconCls:'icon-edit',
        fit: false,
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
        // fitColumns: true,
        selectOnCheck: true,
        striped: true,
        nowrap: true,
        columns:[[
            {field:'ck',checkbox:true},
            {field:'id',title:'数据ID',width:150,align:'center',editor:'text',resizable:true,hidden:true},
            {field:'user',title:'用户名',width:150,align:'center',editor:'text',resizable:true},
            {field:'pswd',title:'密码',width:150,align:'center',editor:'text',resizable:true},
            {field:'action',title:'操作',width:80,align:'center',
                formatter:function(value,row,index){
                    if (row.editing){
                        var save = '<a href="#" onclick="saveRow(this)">保存 </a>';
                        var cancel = '<a href="#" onclick="cancelRow(this)">取消</a>';
                        return save + cancel;
                    } else {
                        var edit = '<a href="#" onclick="editRow(this)">修改 </a> ';
                        var del = '<a href="#" onclick="deleteRow(this)">删除</a>';
                        return edit + del;
                    }
                }
            }
        ]],
        onBeforeEdit:function(index,row){
            row.editing = true;
            updateActions(index,row);
        },
        onAfterEdit:function(index,row){
            row.editing = false;
            alert('onAfterEdit');
            updateActions(index,row);
        },
        onCancelEdit:function(index,row){
            row.editing = false;
            alert('onCancelEdit');
            updateActions(index,row);
        },
        toolbar: '#tb'
    });
    $('#dg').datagrid('getPager').pagination({
        showRefresh: false,
        showPageList: true,
        beforePageText:  '第',
        afterPageText: '页.共{pages}页',
        displayMsg: '第{from}-{to}条. 共{total}条',
        onSelectPage:function(pageNumber, pageSize){
            fuzzySearch(pageNumber,pageSize);
        }
    });
    fuzzySearch(1,10);
});

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