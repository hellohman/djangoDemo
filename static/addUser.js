// 提交
function submitForm(){
    $('#ff').form('submit', {
        url: '/add/',
        onSubmit: function(){
            var params = $("#ff").serialize();
            var paramsArray = params.split("&");
            var tempArray = [];
            for(var i =0;i<paramsArray.length;i++){
                var obj={};
                obj.key = paramsArray[i].split("=")[0];
                obj.value = paramsArray[i].split("=")[1];
                tempArray.push(obj);
            }
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
                alert('用户名已存在,请重新输入!');
            } else {
                $("#div-dg").addClass('visible');       // 隐藏
                var result = eval('(' + result + ')');   // 转json
                $('#dg').datagrid({
                    data: result
                });
                var pager = $('#dg').datagrid('getPager');
                pager.pagination({
                    showPageList:true,
                    pageSize: 5,
                    pageList: [5,10,20,50,100],
                    beforePageText: '第',
                    afterPageText:'页.共 {pages} 页',
                    displayMsg:'显示 {from}-{to} 条. 共 {total} 条'
                })
            }
        }
    })
}

// 清空
function clearForm(){
    $('#ff').form('clear');
}

// 添加用户
function addCustomer() {
    // alert("xxx");
    $.post('/add/',{'user':'xxxxx','pswd':'xxx'},function (result) {
        alert(result);
    })
}

// 数据网格
$(function(){
    $('#dg').datagrid({
        columns:[[
            {field:'ck',title:'选择',checkbox:true},     // 复选框
            {field:'user',title:'用户名',width:350,align:'center',halign:'center',resizable:true},
            {field:'pswd',title:'密码',width:350,align:'center',halign:'center',resizable:true}
        ]],
        toolbar: [{
            text:'添加用户',
            iconCls: 'icon-add',
            handler: function(){
                addCustomer();
            }
        },'-',{
            text:'修改用户',
            iconCls: 'icon-edit',
            handler: function(){
                updateCustomer();
            }
        },'-',{
            text:'删除用户',
            iconCls: 'icon-remove',
            handler: function(){
                delCustomer();
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