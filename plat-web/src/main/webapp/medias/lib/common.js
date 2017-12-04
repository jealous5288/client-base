//-------------设置点击以后的样式

function ChangeStyle(name, object,number,sum) {
    var Links = document.getElementsByName(name);
    for (var i = 0; i < Links.length; i++)
        Links[i].className = '';
    object.className = 'ClickStyle';

    //点击主菜单，显示子菜单
    if (number != '') {
    if (number != '0') {
        for (var i = 1; i <= sum; i++) {
            if (number == i) {
                with (document.getElementById('SubSideBarNav' + number).style)
                { display = (display == 'none' || display == '') ? 'block' : 'none'; };
                var tempObj = document.getElementById('SubSideBarNav' + number);
                if (tempObj.style.display == 'none')
                    //document.getElementById('SubSideSpan' + number).className = "sj";
                 document.getElementById('SubSideSpan' + number).className = "sj_white";
                else
                    document.getElementById('SubSideSpan' + number).className = "sj_down";
            } else {
                document.getElementById('SubSideBarNav' + i).style.display = 'none';
                document.getElementById('SubSideSpan' + i).className = "sj";
            }
        }
      }
    }else{
    for (var i = 1; i <= sum; i++) {
          document.getElementById('SubSideBarNav' + i).style.display = 'none';
          document.getElementById('SubSideSpan' + i).className = "sj";
        }
    }

}




