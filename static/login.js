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

// 登录
function login() {
    $('#login').form('submit', {
        url: '/login/',
        onSubmit: function(){
            var tempArray = dl_form("#login");
            var username = tempArray[0].value;
            var password = tempArray[1].value;
            if (password.length < 8) {
                return true;
            }
            return false;
        },
        success: function (result) {
            if (result == '用户名错误' || result == '密码错误') {
                $.messager.alert('提示',result,'info');
            } else {
                window.location.href="/register/";
            }
        }
    })
}