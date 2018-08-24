function submitForm(){
    $('#ff').form('submit', {
        url: '/add/',
        success: function (result) {
            // $('#dg').datagrid({
            //     data: data,
            // });
            var xxx =
            $('#dg').datagrid('load',{'user':1,'pswd':2});

            $('#dg').datagrid({
                columns:[[
                    // {field:'user',title:'用户名',width:350},
                    {field:'pswd',title:'密码',width:350}
                ]],
                method: 'get',
                pagination: true,
                rownumbers: true,
                singleSelect: true,
                fitColumns: true,
                selectOnCheck: true
            });
            var pager = $('#dg').datagrid('getPager');
            pager.pagination({
                showPageList:true,
                pageSize: 10,
                pageList: [10,20,50,100],
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
            });
        }
    })
}

function clearForm(){
    $('#ff').form('clear');
}

$(function(){
    $('#dg').datagrid({
        columns:[[
            {field:'user',title:'用户名',width:350},
            {field:'pswd',title:'密码',width:350}
        ]],
        method: 'get',
        pagination: true,
        rownumbers: true,
        singleSelect: true,
        fitColumns: true,
        selectOnCheck: true
    });
    var pager = $('#dg').datagrid('getPager');
    pager.pagination({
        showPageList:true,
        pageSize: 10,
        pageList: [10,20,50,100],
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