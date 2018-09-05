//新增
//修改
//单条删除

var dgPageNumber = 1;   //初始默认值
var dgPageSize = 10;    //初始默认值

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

// 精确查询
function exactSearch() {
    $('#search').form('submit', {
        url: '/exactSearch/',
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

// 清空表单
function clearForm(id){
    $(id).form('clear');
    fuzzySearch(1,10);
}

// 新增,插入行
function addUser() {
    // $('#dg').datagrid('insertRow',{
    //     index: 0,	// index start with 0
    //     row: {
    //         user: 'new',
    //         pswd: 'messages'
    //     }
    // });
    var index = 0;
    $('#dg').datagrid('insertRow', {
        index: index,
        row:{
            status:'P'
        }
    });
    $('#dg').datagrid('selectRow',index);
    $('#dg').datagrid('beginEdit',index);
    // $.post('/addUser/',{'user':'xxxxx','pswd':'xxx'},function (result) {
    //     alert(result);
    // })
}

// 批量删除
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
                    dl_datagrid(result);
                    $.messager.alert('提示','成功删除' + selRows.length + '条数据！','info');
                })
            }
        });
    } else {
        $.messager.alert('提示','请至少勾选一条数据！','warning');
    }
}

// 数据网格
$(function(){
    document.getElementById("left_ul").innerHTML += "<li>" + "<a href=\"/login/\" title=\"test\">111</a>" + "</li>";
    $('#dg').datagrid({
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
        fitColumns: true,
        selectOnCheck: true,
        striped: true,
        nowrap: true,
        columns:[[
            {field:'ck',checkbox:true},
            {field:'user',title:'用户名',width:150,align:'center',editor:'text',resizable:true},
            {field:'pswd',title:'密码',width:150,align:'center',editor:'text',resizable:true},
            {field:'status',title:'Status',width:50,align:'center',
                editor:{
                    type:'checkbox',
                    options:{
                        on: 'P',
                        off: ''
                    }
                }
            },
            {field:'action',title:'操作',width:80,align:'center',
                formatter:function(value,row,index){
                    if (row.editing){
                        var s = '<a href="#" onclick="saveRow(this)">保存</a> ';
                        var c = '<a href="#" onclick="cancelRow(this)">取消</a>';
                        return s + c;
                    } else {
                        return '<a href="#" onclick="editRow(this)">编辑</a> ';
                    }
                }
            }
        ]],
        onBeforeEdit:function(index,row){
            row.editing = true;
            updateActions(index);
        },
        onAfterEdit:function(index,row){
            row.editing = false;
            updateActions(index);
        },
        onCancelEdit:function(index,row){
            row.editing = false;
            updateActions(index);
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

// 更新行状态
function updateActions(index){
    $('#dg').datagrid('updateRow',{
        index: index,
        row:{}
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

// 保存行
function saveRow(target){
    $('#dg').datagrid('endEdit', getRowIndex(target));
}

// 取消行编辑
function cancelRow(target){
    $('#tt').datagrid('cancelEdit', getRowIndex(target));
}