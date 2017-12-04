$(function () {
    var index = GetQueryString("index");
    var $p = $("#nav");
    $p.empty();
    var firstUrl;
    if (index) {
        //子菜单
        var subMenu = parent.menuData[index].CHILD_MENU;
        var flag = 0;
        $.each(subMenu, function (i, t) {
            var $li = $("<li></li>");
            $p.append($li);
            if (!t.CHILD_MENU) {
                $li.append('<a href="' + RX.handlePath(t.MENU_URL) + '" target="MainIframeR" class="menu" name="menu"' + ' onclick="ChangeStyle(\'menu\',this,\'\');" ' + '><i class="iconfont">' + (t.MENU_ICON ? t.MENU_ICON : '') + '</i>' + t.MENU_NAME + '</a>');
                $p.append($li);
            }
            else { //存在二级菜单
                flag++;
                var first=(i==0?'block':'none');
                $li.append('<a href="javascript:void(0);" target="MainIframeR" name="menu"' + ' onclick="ChangeStyle(\'menu\',this,' + flag + ',' + t.CHILD_MENU.length+1 + ');' + '"><i class="iconfont">' + (t.MENU_ICON ? t.MENU_ICON : '') + '</i>' + t.MENU_NAME + '<span id="SubSideSpan' + flag + '"' + ' class="sj"></span></a>');
                var $ul = $('<ul id="SubSideBarNav' + flag + '" style="display: '+first+'"></ul>');
                $.each(t.CHILD_MENU, function (j, k) {
                    $ul.append('<li><a href="' + RX.handlePath(k.MENU_URL) + '" target="MainIframeR" class="menu" name="menu"' + ' onclick="ChangeStyle(\'menu\',this,\'0\',\'1\');" ' + '><i class="iconfont">' + (k.MENU_ICON ? k.MENU_ICON : '') + '</i>' + k.MENU_NAME + '</a></li>');
                });
                $li.append($ul);
            }
            if (i == 0) {//初始化右侧页面
                firstUrl = t.MENU_URL?t.MENU_URL:t.CHILD_MENU[0].MENU_URL;
            }
        });
        $("#MainIframeR").attr("src", RX.handlePath(firstUrl));
    }
    $p.find(".menu:first").addClass("ClickStyle");

});


//-------------设置点击以后的样式

function ChangeStyle(name, object, number, sum) {
    var Links = document.getElementsByName(name);
    for (var i = 0; i < Links.length; i++)
        Links[i].className = '';
    object.className = 'ClickStyle';

    //点击主菜单，显示子菜单
    if (number != '') {
        if (number != '0') {
            for (var i = 1; i <= sum; i++) {
                if (number == i) {
                    with (document.getElementById('SubSideBarNav' + number).style) {
                        display = (display == 'none' || display == '') ? 'block' : 'none';
                    }
                    var tempObj = document.getElementById('SubSideBarNav' + number);
                    if (tempObj.style.display == 'none') {
                        document.getElementById('SubSideSpan' + number).className = "sj_white";
                    }
                    else
                        document.getElementById('SubSideSpan' + number).className = "sj_down";
                } else {
                    debugger;
                    document.getElementById('SubSideBarNav' + i).style.display = 'none';
                    document.getElementById('SubSideSpan' + i).className = "sj";
                }
            }
        }
    } else {
        for (var i = 1; i <= sum; i++) {
            document.getElementById('SubSideBarNav' + i).style.display = 'none';
            document.getElementById('SubSideSpan' + i).className = "sj";
        }
    }

}
