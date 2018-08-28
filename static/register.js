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

// 清空表单
function clearForm(id){
    $(id).form('clear');
}

// datagrid
function dl_datagrid(data) {
    $("#div-dg").addClass('visible');       // 显示
    var data = JSON.parse(data);          // 转json
    $('#dg').datagrid({
        data: data
    });
    var pager = $('#dg').datagrid('getPager');
    pager.pagination({
        showPageList:true,
        pageSize: 5,
        pageList: [5,10,20,50,100],
        beforePageText: '第',
        afterPageText:'页.共 {pages} 页',
        displayMsg:'显示 {from}-{to} 条. 共 {total} 条',
        buttons:[{
            iconCls:'icon-search',
            handler:function(){
                alert('search');
            }
        },{
            iconCls:'icon-add',
            handler:function(){
                alert('add');
            }
        },{
            iconCls:'icon-edit',
            handler:function(){
                alert('edit');
            }
        }],
    })
}

// 提交表单
function submitForm(){
    $('#ff').form('submit', {
        url: '/addUser/',
        onSubmit: function(){
            var tempArray = dl_form("#ff");
            var username = tempArray[0].value;
            var password = tempArray[1].value;
            if (password.length < 8) {
                return true;
            }
            return false;
        },
        success: function (result) {
            if (result == '用户名已存在') {
                clearForm();
                $.messager.alert('提示','用户名已存在，请重新输入！','warning');
            } else {
                dl_datagrid(result);
            }
        }
    })
}

// 精确查询
function exactSearch() {
    $('#search').form('submit', {
        url: '/exactSearch/',
        onSubmit: function () {
            var tempArray = dl_form("#search");
            var username = tempArray[0].value;
            var password = tempArray[1].value;
            if (username != "" || password != "") {
                return true;
            } else {
                $.messager.alert('提示','条件不能为空！','warning');
                return false;
            }
        },
        success: function (result) {
            dl_datagrid(result);
        }
    });
}

// 模糊查询
function fuzzySearch() {
    $('#search').form('submit', {
        url: '/fuzzySearch/',
        onSubmit: function () {
            var tempArray = dl_form("#search");
            var username = tempArray[0].value;
            var password = tempArray[1].value;
            if (username != "" || password != "") {
                return true;
            } else {
                $.messager.alert('提示','条件不能为空！','warning');
                return false;
            }
        },
        success: function (result) {
            dl_datagrid(result);
        }
    });
}

// 添加用户
function addUser() {
    $.post('/addUser/',{'user':'xxxxx','pswd':'xxx'},function (result) {
        alert(result);
    })
}

// 修改用户
function updateUser() {
    var selRows = $('#dg').datagrid('getChecked');
    $.post('/updateUser/',{data:JSON.stringify(selRows)},function (result) {
        alert(result);
    })
}

// 批量删除用户
function deleteUserList() {
    var selRows = $('#dg').datagrid('getChecked');
    $.messager.confirm('确认', '确认删除' + selRows.length + '条数据吗？', function(r){
        if (r){
            $.post('/deleteUser/',{data:JSON.stringify(selRows)},function (result) {
                $('#dg').datagrid({
                    data: result
                });
                $.messager.alert('提示','成功删除' + selRows.length + '条数据！','info');
            })
        }
    });
}

// 数据网格
$(function(){
    $('#dg').datagrid({
        columns:[[
            {field:'ck',title:'选择',checkbox:true},     // 复选框
            {field:'user',title:'用户名',width:250,align:'center',halign:'center',resizable:true},
            {field:'pswd',title:'密码',width:250,align:'center',halign:'center',resizable:true},
            {field:'action',title:'操作',width:200,align:'center',
                formatter:function(value,row,index){
                    var edit = '<a href="#" onclick="editrow(this)">修改</a> ';
                    var del = '<a href="#" onclick="alert(index)">删除</a>';
                    return edit + del;
                }
            }
        ]],
        toolbar: [{
            text:'添加',
            iconCls: 'icon-add',
            handler: function(){
                addUser();
            }
        },'-',{
            text:'修改',
            iconCls: 'icon-edit',
            handler: function(){
                updateUser();
            }
        },'-',{
            text:'删除',
            iconCls: 'icon-remove',
            handler: function(){
                deleteUserList();
            }
        }],
        method: 'get',
        pagination: true,
        rownumbers: true,
        singleSelect: false,
        checkOnSelect: true,
        fitColumns: true,
        selectOnCheck: true
    });
});