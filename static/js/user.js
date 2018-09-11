var dgPageNumber = 1;   //初始默认值
var dgPageSize = 10;    //初始默认值

// 查询: 精确 + 模糊
function queryData(pageNumber,pageSize,queryType) {
    $('#search').form('submit', {
        url: '/queryData/',
        onSubmit: function (param) {
            // var data = dl_form('#search');
            // if (data[0].value === '' && data[0].value === '') {
            //     $.messager.alert('提示','查询信息不能为空！','warning');
            //     return false;
            // } else {
            //     param.pageNumber = pageNumber;
            //     param.queryType = queryType;
            //     param.pageSize = pageSize;
            //     return true;
            // }
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

// 清空条件
function clearForm(id){
    $(id).form('clear');
    dgPageNumber = 1;
    queryData(dgPageNumber,dgPageSize,'fuzzy');
}

// 全部勾选
function checkAll() {
    $('#dg').datagrid('checkAll');
}

// 取消勾选
function uncheckAll() {
    $('#dg').datagrid('uncheckAll');
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
            $.messager.alert('提示','请 至少勾选一条数据 或 填写用户名！','warning');
        }
    }
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
        // fitColumns: true,
        fit: true,                            // 全屏
        // multiSort: true,                     // 是否多列排序
        // collapsible: true,                  // 收缩
        remoteSort: false,                  // 是否从服务器排序数据
        selectOnCheck: true,
        striped: true,
        nowrap: true,
        fixRowHeight: 1,
        toolbar: '#tb',
        columns:[[
            {field:'ck',checkbox:true},
            {field:'id',title:'数据ID',width:50,align:'center',editor:'text',hidden:true},
            {field:'user',title:'用户名',width:150,align:'center',editor:'text',resizable:true,sortable:true},
            {field:'pswd',title:'密码',width:150,align:'center',editor:'text',resizable:true,sortable:true},
            {field:'create_time',title:'创建时间',width:200,align:'center',editor:'text',resizable:true,sortable:true},
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
                    if (result === "用户名已存在") {
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
            if (typeof row.id === 'undefined') {
                $('#dg').datagrid('deleteRow',index);
            } else {
                updateActions(index,{editing:false});
            }
        }
    });
    $('#dg').datagrid('getPager').pagination({
        showRefresh: false,
        showPageList: true,
        beforePageText:  '第',
        afterPageText: '页.共{pages}页',
        displayMsg: '第{from}-{to}条. 共{total}条',
        onSelectPage:function(pageNumber, pageSize){
            dgPageSize = pageSize;
            dgPageNumber = pageNumber;
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
    $.messager.confirm('提示','确认删除 第' + (index+1) + '条 数据？',function(r){
        if (r){
            var rows = $('#dg').datagrid('getRows');        // 所有行
            var row = [rows[index]];                          // 其中一行
            var params = {
                data: JSON.stringify(row),
                pageNumber: dgPageNumber,
                pageSize: dgPageSize
            };
            $.post('/deleteData/', params, function (result) {
                $.messager.alert('提示','成功删除1条数据！','info');
                dl_datagrid(result);
            });
        }
    });
}

// 保存行
function saveRow(target){
    var index = getRowIndex(target);
    $.messager.confirm('提示','确认修改 第' + (index+1) + '条 数据？',function(r){
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
    if (typeof input === "string") {
        data = JSON.parse(input);                  // 转json
    } else {
        data = input;
    }
    if (data['total'] === 0) {
        $.messager.alert('提示','未查询到数据！','info');
    } else {
        $('#dg').datagrid('loadData',data);
    }
}

// form
function dl_form(formId) {
    var params = $(formId).serialize();
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
// ------------------------------------------------- 辅 助 ---------------------------------------------------------- //