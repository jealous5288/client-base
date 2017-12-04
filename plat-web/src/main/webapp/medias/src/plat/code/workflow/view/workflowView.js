$(function () {
    var id = GetQueryString("id");
    $("#view").attr("src", RX.handlePath("/workflow/view/image?id=" + id));
    addFrameWin(window.frames["imageViewWin"],window);
    addFrameWin(window.frames["taskListViewWin"],window);
    //任务栏收缩
    $("#bottomTips").hover(
        function () {
            $(this).addClass("bottomTipsHover")
        },
        function () {
            $(this).removeClass("bottomTipsHover");
        }).toggle(function () {
        $("#tashList").animate({"height": "0"}, "slow");
        $("#wfView").animate({"height": "100%"}, "slow");
        $(this).html("<b>点击查看任务列表</b>");
    }, function () {
        $("#tashList").animate({"height": "30%"}, "slow");
        $("#wfView").animate({"height": "70%"}, "slow");
        $(this).html("<b>点击关闭任务列表</b>")
});
});