/*
 Name:       jQuery.fn.paginate
 Summary:    基于jQuery的分页页码组件
 根据页码的参数进行显示
 不涉及列表JSON数据展示，非Ajax组件
 Create by:  Herist.ZHOU
 Date:       2009-08-09

 */
(function($) {
    $.fn.paginate = function(options) {
        var opts = $.extend({
            pageNo:1,
            pageSize : 25,
            groupSize : 10,
            totalCount:0,
            preStr : '<<', //前翻的符号
            nextStr: '>>', //后翻的符号
            url:'#none',
            postFunction:function() {
                alert('没有添加post提交函数');
            }

        }, options || {});

        if (opts.totalCount === 0) {
            return;
        }

        var pageCount = Math.ceil(opts.totalCount / opts.pageSize);//总页数

        var groupNo = Math.ceil(opts.pageNo / opts.groupSize) - 1;
        var groupCount = Math.floor(pageCount / opts.groupSize);

        var begin = groupNo * opts.groupSize + 1;
        //begin = begin === opts.pageNo ? begin : begin + 1;

        var end = (groupNo + 1) * opts.groupSize;
        end = groupNo < groupCount ? end : pageCount;

        var hasPre = (begin > 1); //是否有前翻
        var hasNext = (end < pageCount );//是否有后翻

        this.empty();

        this.appendPage = function(no) {
            var $label;
            if (no === opts.pageNo) {
                $label=$('<span class="current" >' + no + '</span>');
            } else {
                $label=$('<a href ="#none" class="num" onclick=\'' + opts.postFunction + '(' + no + ');\'>' + no + '</a>');
            }
            if(no==1){
                $label.css({"margin-left":0});
            }
            $label.appendTo(this);
        } ;

        if (hasPre) {
//            this.appendPage(1);//首页
            $('<span class="num" style="margin-left: 0" >' + 1 + '</span>').appendTo(this);
            $('<a href ="#none"  class="next" onclick=\'' + opts.postFunction + '(' + (begin - 1) + ');\'>' + opts.preStr + '</a>').appendTo(this);
        }

        for (var i = begin; i <= end; i++) {
            this.appendPage(i);
        }

        if (hasNext) {
            $('<a href ="#none" class="next" onclick=\'' + opts.postFunction + '(' + (end + 1) + ');\'>' + opts.nextStr + '</a>').appendTo(this);
            this.appendPage(pageCount);
        }

        $('<span  class="rows"> 总数 ' + opts.totalCount + '</span>').appendTo(this);
    };
})(jQuery);