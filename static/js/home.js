// data
function dl_datagrid(data) {
    var data = JSON.parse(data);                  // 转json
    if (data['total'] == 0) {
        $.messager.alert('提示','未查询到数据！','info');
    } else {
        // $("#div-dg").addClass('visible');       // 显示
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
            dl_datagrid(result);
        }
    });
}

// 精确查询
function exactSearch() {
    $('#search').form('submit', {
        url: '/exactSearch/',
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
    if (selRows.length > 0) {
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
    } else {
        $.messager.alert('提示','请至少选择一条数据！','warning');
    }
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
                    var edit = '<a href="#" onclick="editrow(value,row,index)">修改</a> ';
                    var del = '<a href="#" onclick="alert(index)">删除</a>';
                    return edit + del;
                }
            }
        ]],
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
            fuzzySearch(pageNumber,pageSize)
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