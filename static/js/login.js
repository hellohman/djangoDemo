// 登录,提交表单
function login() {
    $('#login').form('submit', {
        url: '/login/',
        success: function (result) {
            if (result == '用户名错误！' || result == '密码错误！') {
                $.messager.alert('提示',result,'info');
            } else if (result == '登陆成功！') {
                window.location.href="/home/";
            }
        }
    })
}

// 注册
function register() {

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

// 清空表单
function clearForm(id){
    $(id).form('clear');
}