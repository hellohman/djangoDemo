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
                // alert(password);
                return true;
            }
            return false;
        },
        success: function (result) {
            var result = eval('(' + result + ')');  // 转str
            $('#dg').datagrid({
                data: result
            });
        }
    })
}

// 清空
function clearForm(){
    $('#ff').form('clear');
}

// 数据网格
$(function(){
    $('#dg').datagrid({
        columns:[[
            {field:'ck',checkbox:true},     // 复选框
            {field:'user',title:'用户名',width:350,align:'center',halign:'center',resizable:true},
            {field:'pswd',title:'密码',width:350,align:'center',halign:'center',resizable:true}
        ]],
        method: 'get',
        pagination: true,
        rownumbers: true,
        singleSelect: false,
        checkOnSelect: true,
        fitColumns: true,
        selectOnCheck: true
    });
    var pager = $('#dg').datagrid('getPager');
    pager.pagination({
        showPageList:true,
        pageSize: 5,
        pageList: [5,10,20,50,100],
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
        onBeforeRefresh:function(){
            alert('before refresh');
            return true;
        }
    })
});