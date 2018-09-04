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

// 添加用户
function addUser() {
    $('#dg').datagrid('insertRow',{
        index: 0,	// index start with 0
        row: {
            user: 'new',
            pswd: 'messages'
        }
    });
    // $.post('/addUser/',{'user':'xxxxx','pswd':'xxx'},function (result) {
    //     alert(result);
    // })
}


function editrow(target){
    $('#tt').datagrid('beginEdit', getRowIndex(target));
}

// 修改用户
function updateUser(target) {
    var selRows = $('#dg').datagrid('getChecked');
    $.post('/updateUser/',{data:JSON.stringify(selRows)},function (result) {
        alert(result);
    })
}

// 批量删除用户
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
        columns:[[
            {field:'ck',title:'选择',checkbox:true},     // 复选框
            {field:'user',title:'用户名',width:250,align:'center',halign:'center',resizable:true},
            {field:'pswd',title:'密码',width:250,align:'center',halign:'center',resizable:true},
            {field:'action',title:'操作',width:200,align:'center',
                formatter:function(value,row,index){
                    if (row.editing){
                        var s = '<a href="#" onclick="saverow(this)">Save</a> ';
                        var c = '<a href="#" onclick="cancelrow(this)">Cancel</a>';
                        return s+c;
                    } else {
                        var e = '<a href="#" onclick="editrow(this)">Edit</a> ';
                        var d = '<a href="#" onclick="deleterow(this)">Delete</a>';
                        return e+d;
                    }
                }
            }
        ]],
        onBeforeEdit:function(index,row){
            row.editing = true;
            // updateActions(index);
        },
        onAfterEdit:function(index,row){
            row.editing = false;
            // updateActions(index);
        },
        onCancelEdit:function(index,row){
            row.editing = false;
            // updateActions(index);
        },
        toolbar: '#tb',
        // toolbar: [{
        //     text:'添加',
        //     iconCls: 'icon-add',
        //     handler: function(){
        //         addUser();
        //     }
        // },'-',{
        //     text:'批量删除',
        //     iconCls: 'icon-remove',
        //     handler: function(){
        //         deleteUserList();
        //     }
        // }],
        fit: false,
        method: 'post',
        loadMsg: '数据加载中...',
        pagination: true,
        pageSize: 10,
        pageList: [10,20,30,50],
        rownumbers: true,
        singleSelect: false,
        checkOnSelect: true,
        fitColumns: true,
        selectOnCheck: true,
        striped: true,
        nowrap: true
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

// 修改
function editrow(data) {
    alert(data)
}

// 清空表单
function clearForm(id){
    $(id).form('clear');
    fuzzySearch(1,10);
}