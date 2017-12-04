/**
 * 登录
 */
$(function () {
    //窗口初始化
    addFrameWin(window.frames["MainIframe"], window);
    //初始化内容区域高
    $("#leftMenu").height($(window).height() - 40);
    //添加窗口层次管理
    addFrameWin(window.frames["MainIframe"], window);
    //生成一级菜单
    createMenu();
    // RX.fixPng();
    $("a").click(function () {
        $(".childMenu a").each(function () {
            $(this).parent().attr("class", "");
        });
        $(this).parent().attr("class", "submenuchecked");
    });
    $("#user_name").html($.cookie('userName'));
});
//页面大小改变时，触发jquery的resize方法，自适应拖拽
$(window).resize(function () {
    $("#leftMenu").height($(window).height() - 40);
});

//动态生成菜单
function createMenu() {
    $.ajax({
        type: "post",
        url: "/main/getUserMenus",
        async: false,
        dataType: "json",
        success: function (ar) {
            if (ar.success) {
                menuData = ar.data;
                debugger
                $.each(menuData, function (i, v) {
                    if (v.MENU_URL) {
                        $("#topMenu").append('<li><a href="' + v.MENU_URL + '"' + ' target="MainIframe">' + v.MENU_NAME + '</a></li>');
                    } else {
                        $("#topMenu").append("<li><a href='javascript:void(0)' target='MainIframe' onclick='goMenu(this," + i + ")' tMenuId='menu" + v.MENU_CODE + "'>" + v.MENU_NAME + "</a></li>");
                    }
                });
            } else {
                layer.alert(ar.msg);
            }
        }
    });
}
//跳转菜单
function goMenu(t, index) {
    //ie6有问题
    $("#leftMenu").attr("src","leftMenu.html?index="+index);
}

function gotoUrl(obj, url) {
    var el = obj[0], iframe = el.contentWindow;
    if (iframe != null) {
        if (iframe.closeFunc) {
            iframe.closeFunc();
        }
    }
    if (el) {
        if (isIE) {
            el.src = 'about:blank';
            try {
                iframe.document.write('');
                iframe.close();
            } catch (e) {
            }
        }
        el.src = url;
    }
}