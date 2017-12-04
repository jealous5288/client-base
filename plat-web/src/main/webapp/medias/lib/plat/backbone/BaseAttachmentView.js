/*****************************************************************
 * 附件列表基础面板
 * 最后更新时间：2016-02-26
 * 最后更新人：zhan
 *****************************************************************/

//创建附件model
var AttachmentModel = Backbone.Model.extend({
    defaults: {
        id: "",
        name: "",
        slt: "",
        scr: "张三",
        scsj: "2016-02-18"
    },
    idAttribute: "id",
    del: function () {
        alert("delete");
    }
});

//创建附件model集合collection
var AttachmentCollection = Backbone.Collection.extend({
    model: AttachmentModel
});

//创建附件列表面板view
var AttachmentListView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: '',   //主体样式
    state: "",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    listName: "",        //附件列表头部名称
    element: null,
    dictStr: "[{value:\"附件文件\",code:\"0\"}]",
    fileType: null,
    minNum: null,
    dictCode: null,
    pcode: null,
    defaultType: null,
    //初始方法
    initialize: function (options) {
        if (options.uuid != null && options.uuid != "") {
            this.uuid = options.uuid;
        }
        if (options.listName) {
            this.listName = options.listName;
        } else {
            this.listName = "附件资料";
        }
        if (options.state != null) {
            this.state = options.state;
        }
        if (options.dictStr != null && options.dictStr != "") {
            this.dictStr = options.dictStr;
        }
        if (options.dictCode != null && options.dictCode != "") {
            this.dictCode = options.dictCode;
        }
        if (options.pcode != null) {
            this.pcode = options.pcode;
        }
        if (options.fileType != null && options.fileType != "") {
            this.fileType = options.fileType;
        }
        if (options.minNum != null) {
            this.minNum = options.minNum;
        }
        if (options.defaultType != null) {
            this.defaultType = options.defaultType;
        }
        this.render();
    },
    //获取实际新实体model方法
    getNewModel: function () {
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function (item, mode, index, state) {
        var view = this;
        return new AttachmentView({
            model: item,
            renderCallback: mode,
            index: index,
            state: state,
            parentView: view
        });
    },


    //获取控制区域html
    getControlHtml: function () {
        var view = this;
        var controlstr = "";
        controlstr += '<div class="page_title">';
        controlstr += "<h1>" + this.listName + "</h1>";
        if (view.state == "ck") {
            controlstr += "</div>";
        } else {
            if (view.minNum != null && typeof(view.minNum) == "number") {
                controlstr += "<p>（至少上传" + view.minNum + "份）</p>" + "<ul class='action_button to_right ' minnum='" + view.minNum + "'><li><a href='#none' class='addFileItem'><i class='iconfont '>&#xe8ab;</i>上传附件</a></li>";
            } else {
                controlstr += "<ul class='action_button to_right ' minnum='" + view.minNum + "'><li><a href='#none' class='addFileItem'><i class='iconfont'>&#xe8ab;</i>上传附件</a></li>";
            }
            controlstr += '<li><a href="#none" class="viewSltyl"><i class="iconfont">&#xe61f;</i>缩略图预览</a></li></ul>';
            controlstr += "</div>";
        }
        return controlstr;
    },


    //事件
    events: {
        'click a.addFileItem': 'addNewItem',
        'click a.viewSltyl': 'viewSltyl'
    },
    //依据uuid请求数据方法
    makeAttListData: function () {
        var view = this;
        view.collection.remove(view.collection.models);
        if (view.uuid != null && view.uuid != "") {
            var jsonMap = {
                uuid: view.uuid,
                fjType: "list"
            };
            $.ajax({
                type: "post",
                url: "/attachment/getAttachmentList",
                data: {"map": JSON.stringify(jsonMap)},
                async: false,
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
    },
    //主渲染方法
    render: function () {
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).append(view.getControlHtml());//标题和控制按钮
        var dicts = eval("(" + view.dictStr + ")");
        var boxdiv = $("<div></div>");
        boxdiv.addClass("attachment_box");
        var olist = [];
        if (!dicts) {
            _.map(view.collection.models, function (model, key) {
                olist.push(model);
            });
        } else {
            _.map(view.collection.models, function (model, key) {
                if (model.get("fjlbNo") === null || model.get("fjlbNo") === "") {
                    olist.push(model);
                }
            });
        }
        if (olist.length > 0 || !dicts) {
            var headhtml = "<div class=\"attachment_header\" minNum='0'>" +
                "<h1>未分类资料(<em>" + olist.length + "</em>)" + "</h1>";
            headhtml += '<a href=\"javascript:void(0);\" title=\"展开\"><img alt=\"\" src=' + RX.handlePath("/medias/images/plat/Arrow1.gif") + '></a>' +
                "</div>";
            var headdiv = $(headhtml);

            var filediv = $("<div class=\"attachment_content\" zdno=\"0\" style=\"display:none\">" +
                //'<p style="width: 100%;height: 100px; line-height: 100px;color: red;text-align: center;margin-top: 20px ">不可为空</p>'+
                "<ul class=\"download_thumbnail\">" +
                "</ul>" +
                "</div>" +
                "<div class=\"clear\"></div>");
            $(filediv).children(".download_thumbnail").append(
                _.map(olist, function (model, key) {
                    view.index++;
                    return view.getNewFileView(model, 'renderEditMode', view.index, view.state).render().el;
                })
            );
            $(boxdiv).append(headdiv);
            $(boxdiv).append(filediv);
        }
        if (dicts && dicts.length > 0) {
            $.each(dicts, function (index, value) {
                var list = [];
                _.map(view.collection.models, function (model, key) {
                    if (model.get("fjlbNo") == value.code) {
                        list.push(model);
                    }
                });
                var minNum = 0;
                if (view.minNum != null) {
                    if (view.minNum["zd" + value.code] != null && view.minNum["zd" + value.code] > 0) {
                        minNum = view.minNum["zd" + value.code];
                    }
                }
                var headhtml = "<div class=\"attachment_header\" minNum='" + minNum + "'>" +
                    "<h1>" + value.value + "(<em>" + list.length + "</em>)" + "</h1>";
                if (view.state == "xz" && minNum > 0) {
                    headhtml += "<b style='color:#717171;font-weight:normal;'>最少上传" + minNum + "份</b>";
                }
                headhtml += "<a href='javascript:void(0);' title=\"展开\"><img alt=\"\" src=\"" + RX.handlePath("/medias/images/plat/Arrow1.gif") + "\"/></a>" +
                    "</div>";
                var headdiv = $(headhtml);

                var filediv = $("<div class=\"attachment_content\" zdno=\"" + value.code + "\">" +
                    "<ul class=\"download_thumbnail\">" +
                    "</ul>" +
                    "</div>" +
                    "<div class=\"clear\"></div>");
                $(filediv).children(".download_thumbnail").append(
                    _.map(list, function (model, key) {
                        view.index++;
                        return view.getNewFileView(model, 'renderEditMode', view.index, view.state).render().el;
                    })
                );
                $(boxdiv).append(headdiv);
                $(boxdiv).append(filediv);
            });
        }
        $(view.el).append(boxdiv);
        $(view.el).find(".attachment_header").click(function () {
            var $t = $(this);
            $(view.el).find(".attachment_header").each(function (i, t) {
                if ($t[0] === $(this)[0]) {
                    $(this).next().toggle("slow");
                } else {
                    $(this).next().hide("slow");
                }
            });
        });
        $(view.el).find(".attachment_header").eq(0).next().show();
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        var url = "";
        if (view.dictCode) {
            url = RX.handlePath("/attachment/addFileUpload?uuid=") + view.uuid + "&dictCode=" + encode(view.dictCode);
            if (view.pcode) {
                url += "&pcode=" + view.pcode;
            }
        } else {
            url = RX.handlePath("/attachment/addFileUpload?uuid=") + view.uuid;
        }

        if (view.defaultType) {
            url += "&defaultType=" + view.defaultType;
        }
        url += "&random=" + Math.random();
        openStack(window, "上传资料", ["450px", "300px"], url, view.fileType,
            {
                end: function () {
                    view.render();
                }
            });

    },
    //跳转缩略图预览页面
    viewSltyl: function () {
        var view = this;
        var url = "/plat/attachment/showLzPhoto?uuid=" + view.uuid + "&random=" + Math.random();
        openStack(window, "缩略图预览", ["900px", "600px"], url, null,
            {
                end: function () {
                    view.render();
                }
            });
    }
});

//创建附件列表面板view
var AttachmentListViewHtml5 = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: '',   //主体样式
    state: "",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    listName: "",        //附件列表头部名称
    element: null,
    dictStr: "[{value:\"附件文件\",code:\"0\"}]",
    fileType: null,
    minNum: null,
    dictCode: null,
    pcode: null,
    defaultType: null,
    h5AcceptJson: null,
    //初始方法
    initialize: function (options) {
        if (options.uuid != null && options.uuid != "") {
            this.uuid = options.uuid;
        }
        if (options.listName) {
            this.listName = options.listName;
        } else {
            this.listName = "附件资料";
        }
        if (options.state != null) {
            this.state = options.state;
        }
        if (options.dictStr != null && options.dictStr != "") {
            this.dictStr = options.dictStr;
        }
        if (options.dictCode != null && options.dictCode != "") {
            this.dictCode = options.dictCode;
        }
        if (options.pcode != null) {
            this.pcode = options.pcode;
        }
        if (options.fileType != null && options.fileType != "") {
            this.fileType = options.fileType;
        }
        if (options.minNum != null) {
            this.minNum = options.minNum;
        }
        if (options.defaultType != null) {
            this.defaultType = options.defaultType;
        }
        this.render();
        var view = this;
        $.ajax({
            type: "GET",
            url: "/medias/utilJson/h5AcceptJson.js",
            dataType: "JSON",
            data: {},
            success: function (ar) {
                view.h5AcceptJson = ar;
            },
            error: function () {
            }
        });
    },
    //获取实际新实体model方法
    getNewModel: function () {
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function (item, mode, index, state) {
        var view = this;
        return new AttachmentView({
            model: item,
            renderCallback: mode,
            index: index,
            state: state,
            parentView: view
        });
    },

    //获取控制区域html
    getControlHtml: function () {
        var controlstr = "";
        controlstr += '<div class="page_title">';
        controlstr += "<h1>" + this.listName + "</h1></div>";
        return controlstr;
    },

    //事件
    events: {
        'click a.addFileItem': 'addNewItem', //上传附件
        'click a.viewSltyl': 'viewSltyl',
        'click a.addAttachment1': 'addAttachment1'
    },
    //依据uuid请求数据方法
    makeAttListData: function () {
        var view = this;
        view.collection.remove(view.collection.models);
        if (view.uuid != null && view.uuid != "") {
            var jsonMap = {
                uuid: view.uuid,
                fjType: "list"
            };
            $.ajax({
                type: "post",
                url: "/attachment/getAttachmentList",
                data: {"map": JSON.stringify(jsonMap)},
                async: false,
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
    },
    //主渲染方法
    render: function () {
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).append(view.getControlHtml());//标题和控制按钮
        var $form = $("<form id='uploadHtml5Form'  name='uploadHtml5Form' enctype='multipart/form-data' method='POST'>" + "</form>");
        var $file = $('<input type="file" style="display:none" name="filedata" multiple id="uploadfile"  />');
        $file.change(function () {
            view.fileChanged();
        });
        $form.append($file)

        $(view.el).append($form);
        var dicts = eval("(" + view.dictStr + ")");
        var boxdiv = $("<div></div>");
        boxdiv.addClass("attachment_box");
        var olist = [];
        if (!dicts) {
            _.map(view.collection.models, function (model, key) {
                olist.push(model);
            });
        } else {
            _.map(view.collection.models, function (model, key) {
                if (model.get("fjlbNo") === null || model.get("fjlbNo") === "") {
                    olist.push(model);
                }
            });
        }
        if (olist.length > 0 || !dicts) {
            var headhtml = "<div class=\"attachment_header\" minNum='0'>" +
                "<h1>未分类资料(<em>" + olist.length + "</em>)" + "</h1>";
            headhtml += '<a href=\"javascript:void(0);\" title=\"展开\"><img alt=\"\" src=' + RX.handlePath("/medias/images/plat/Arrow1.gif") + '></a><a href="javascript:void(0);" class="addAttachment1">添加附件</a>' +
                "</div>";
            var headdiv = $(headhtml);

            var filediv = $("<div class=\"attachment_content\" zdno=\"0\" style=\"display:none\">" +
                "<ul class=\"download_thumbnail\">" +
                "</ul>" +
                "</div>" +
                "<div class=\"clear\"></div>");
            $(filediv).children(".download_thumbnail").append(
                _.map(olist, function (model, key) {
                    view.index++;
                    return view.getNewFileView(model, 'renderEditMode', view.index, view.state).render().el;
                })
            );
            $(boxdiv).append(headdiv);
            $(boxdiv).append(filediv);
        }
        if (dicts && dicts.length > 0) {
            $.each(dicts, function (index, value) {
                var list = [];
                _.map(view.collection.models, function (model, key) {
                    if (model.get("fjlbNo") == value.code) {
                        list.push(model);
                    }
                });
                var minNum = 0;
                if (view.minNum != null) {
                    if (view.minNum["zd" + value.code] != null && view.minNum["zd" + value.code] > 0) {
                        minNum = view.minNum["zd" + value.code];
                    }
                }
                var headhtml = "<div class=\"attachment_header\" minNum='" + minNum + "'>" +
                    "<h1>" + value.value + "(<em>" + list.length + "</em>)" + "</h1>";
                if (view.state == "xz" && minNum > 0) {
                    headhtml += "<b style='color:#717171;font-weight:normal;'>最少上传" + minNum + "份</b>";
                }
                headhtml += "<a href='javascript:void(0);' title=\"展开\"><img alt=\"\" src=\"" + RX.handlePath("/medias/images/plat/Arrow1.gif") + "\"/></a><a href='javascript:void(0);' class='addAttachment1' fileNo='" + value.code + "'>添加附件</a>" +
                    "</div>";
                var headdiv = $(headhtml);

                var filediv = $("<div class=\"attachment_content\" zdno=\"" + value.code + "\">" +
                    "<ul class=\"download_thumbnail\">" +
                    "</ul>" +
                    "</div>" +
                    "<div class=\"clear\"></div>");
                $(filediv).children(".download_thumbnail").append(
                    _.map(list, function (model, key) {
                        view.index++;
                        return view.getNewFileView(model, 'renderEditMode', view.index, view.state).render().el;
                    })
                );
                $(boxdiv).append(headdiv);
                $(boxdiv).append(filediv);
            });
        }
        $(view.el).append(boxdiv);
        $(view.el).find(".attachment_header").click(function (event) {
            //由上传附件触发的click事件

            if ((event.target.className||event.target.classList[0]) == "addAttachment1") return;
            var $t = $(this);
            $(view.el).find(".attachment_header").each(function (i, t) {
                if ($t[0] === $(this)[0]) {
                    $(this).next().toggle("slow");
                }
            });
        });
        $(view.el).find(".attachment_header").eq(0).next().show();
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var frameContent = $("#tjfjIframe").contents();
        //存储附件view
        $("#tjfjIframe").data("attachmentView", this);
        //限制附件类型等;
        frameContent.find(":input[name='filedata']").click();
    },
    addAttachment1: function (event) {
        $("#uploadfile").click();
        var view = this;
        //获取字典类别
        var fileNo = event.target.getAttribute("fileNo");
        var frameContent = $("#tjfjIframe").contents();
        //存储附件view
        $("#tjfjIframe").data("attachmentView", this);
        $("#tjfjIframe").data("fileNo", fileNo);
        //限制附件上传类型 和h5 accept进行转换
        //string 所有类型一样
        //考虑存储的问题，肯定不会再此处获取
        var h5AcceptJson = view.h5AcceptJson;
        var fileExt = view.fileType ? (typeof view.fileType == "object" ? (view.fileType["zd" + fileNo] ? view.fileType["zd" + fileNo].split(",") : []) : view.fileType.split(",")) : [];
        var fileExtHandArr = [];
        if (fileExt.length > 0) {
            for (var i = 0, maxLength = fileExt.length; i < maxLength; i++) {
                fileExtHandArr.push(h5AcceptJson[fileExt[i]]);
            }
        }
        //为对象，则根据类别判断
        frameContent.find(":input[name='filedata']").attr("accept", fileExtHandArr.join(","));
        //限制附件类型等
        frameContent.find(":input[name='filedata']").click();
    },
    //跳转缩略图预览页面
    viewSltyl: function () {
        var view = this;
        var url = "/attachment/showLzPhoto?uuid=" + view.uuid + "&random=" + Math.random();
        openStack(window, "缩略图预览", ["900px", "600px"], url, null,
            {
                end: function () {
                    view.render();
                }
            });
    },

    //保存附件到数据库
    fileChanged: function (ss) {
        var view = this;
        //判断附件类别是否符合配置
        var form = $("#uploadHtml5Form");
        form.attr("action", "/" + RX.config.defaultPath + "/attachment/mulupload?uuid=" + view.uuid + "&fjlbNo=" + 1);
        form.ajaxSubmit(function (ar) { //表单提交，根据后台Action返回的数据进行相关的操作
            var file = form.find("#uploadfile");
            file.after(file.clone().val(""));
            file.remove();
            layer.alert("上传成功");
            view.render();
            //清空
            $("#tjfjIframe").data("fileNo", "");
            form.bind("change", function () {

            });
        });
    }
});

//创建附件列表行view
var AttachmentView = Backbone.View.extend({
    tagName: 'li',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    state: "",       //状态，“ck”查看、其他
    parentView: null,
    index: 0,    //序号
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if (option.index != undefined)
            this.index = option.index;
        if (option.state != undefined)
            this.state = option.state;
        if (option.parentView != undefined)
            this.parentView = option.parentView;
    },
    //渲染主方法
    render: function () {
        var view = this;
        var model = view.model;
        var src = "";
        var hasExt = true;
        var ns = model.get("name").split(".");
        if (model.get("extension") == null || "" == model.get("extension")) {
            hasExt = false;
            if (ns.length > 0) {
                model.set("extension", ns[ns.length - 1]);
            }
        } else if (ns.length > 0) {
            var ext = ns[ns.length - 1];
            if (ext == model.get("extension")) {
                hasExt = false;
            }
        }
        var ftype = model.get("extension") != null ? model.get("extension").toString().toLowerCase() : "";
        if (ftype == "docx" || ftype == "doc") {
            src = "/medias/images/plat/attachment/word.png";
        } else if (ftype == "xls" || ftype == "xlsx") {
            src = "/medias/images/plat/attachment/excel.png";
        } else if (ftype == "ppt" || ftype == "pptx") {
            src = "/medias/images/plat/attachment/ppt.png";
        } else if (ftype == "ppt" || ftype == "pptx") {
            src = "/medias/images/plat/attachment/ppt.png";
        } else if (ftype == "rar" || ftype == "zip" || ftype == "7z") {
            src = "/medias/images/plat/attachment/zip.png";
        } else if (ftype == "jpg" || ftype == "jpeg" || ftype == "gif" || ftype == "png") {
            src = "/attachment/getThumbnail?id=" + model.get("id") + "&thPath=" + encode(model.get("thAbsolutePath") || '');
        } else {
            src = "/medias/images/plat/attachment/pt.png";
        }
        var html = "<a href='javascript:void(0);'>" +
            "<img alt=\"\" onerror=\"onerror=null;src='" + RX.handlePath('/medias/images/plat/attachment/pt.png') + "'\"" + " src=\"" + RX.handlePath(src) + "\"/>" +
            "<span class='attachment_operation'>" +
            "<i class='downloadFile iconfont' title='下载'>&#xe630;</i>";
        if (ftype == "jpg" || ftype == "jpeg" || ftype == "gif" || ftype == "png") {
            html += "<i class='openFile iconfont' title='打开'>&#xe632;</i>";
        }

        if (view.state == "xz") {
            html += "<i class='deleteFile iconfont' title='删除'>&#xe606;</i>";
        }
        html += "</span><p>" + model.get("name") + (hasExt ? ("." + model.get("extension")) : "") + "</p></a>";
        $(this.el).append(html);
        return this;

    },
    //事件
    events: {
        'click .deleteFile': 'deleteFile',
        'click .openFile': 'openFile',
        'click .downloadFile': 'downloadFile'
    },
    //删除事件响应方法
    deleteFile: function () {
        var view = this;
        layer.confirm("您确定要删除该条信息吗", function (index) {
            $.post("/attachment/delAttachment", {idstr: view.model.get("id")}, function (ar) {
                if (ar.success) {
                    layer.msg("删除成功",{icon:1});
                    view.parentView.render();
                } else {
                    layer.alert(ar.msg);
                }
                layer.close(index);
            });
        });
    },
    openFile: function () {
        openStack(window, "查看附件信息", "medium", "/attachment/showFile?id=" + this.model.get("id"));
    },
    //下载事件响应方法
    downloadFile: function () {
        window.open(RX.handlePath("/attachment/download?id=" + this.model.get("id")));
    }
});

//创建附件列表面板view
var AttachmentDivView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'enclosure',   //主体样式
    state: "",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    listName: "附件资料",        //附件列表头部名称
    element: null,
    dictStr: "[{value:\"附件文件\",code:\"0\"}]",
    dictCode: null,
    uploadName: "上传附件",        //附件按钮文字
    fileType: "",
    minNum: null,
    defaultType: null,
    showTag: false,
    //初始方法
    initialize: function (options) {
        if (options.uuid != null && options.uuid != "") {
            this.uuid = options.uuid;
        }
        if (options.state != null) {
            this.state = options.state;
        }
        if (options.fileType != null && options.fileType != "") {
            this.fileType = options.fileType;
        }
        if (options.uploadName != null && options.uploadName != "") {
            this.uploadName = options.uploadName;
        }
        if (options.minNum != null) {
            this.minNum = options.minNum;
        }
        if (options.defaultType != null) {
            this.defaultType = options.defaultType;
        }
        if (options.showTag != null) {
            this.showTag = options.showTag;
        }
        if (options.listName != null && options.listName != "") {
            this.listName = options.listName;
        }
        this.render();
    },
    //获取实际新实体model方法
    getNewModel: function () {
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function (item, mode, index, state) {
        var view = this;
        return new AttachmentDdView({
            model: item,
            renderCallback: mode,
            index: index,
            state: state,
            parentView: view
        });
    },
    //获取控制区域html
    getControlHtml: function () {
        var view = this;
        var controlstr = "<div class='page_title'>" +
            "<h1>" + this.listName + "</h1>";
        if (view.state == "ck") {
            controlstr += "</div>";
        } else {
            controlstr += "<ul class='action_button' style='float: right;margin: 0 5px 0 0;'>" +
                "<li><a class='addFileItem'>上传资料</a></li>" +
                "</ul>" +
                "</div>";
        }
        return controlstr;
    },
    //事件
    events: {
        'click button.addFileItem': 'addNewItem',
        'click a.addFileItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    makeAttListData: function () {
        var view = this;
        view.collection.remove(view.collection.models);
        if (view.uuid != null && view.uuid != "") {
            var url = "/attachment/getAttachmentList?fj_id=" + this.uuid + "&random=" + Math.random();
            if (view.defaultType != null) {
                url += "&defaultType=" + view.defaultType;
            }
            $.ajax({
                url: url,
                async: false,
                success: function (ar) {
                    if (ar.success) {
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
        //var attList = [{id:1, zd_no:1,name:"附件1"},{id:2,zd_no:1,name:"附件2"},{id:3, zd_no:2,name:"附件3"}];
        //this.collection.add(attList);
    },
    //主渲染方法
    render: function () {
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        var minNum = 0;
        if (view.minNum != null) {
            if (view.minNum != null && view.minNum > 0) {
                minNum = view.minNum;
            }
        }
        var dl = $("<dl minNum='" + minNum + "'></dl>");
        if (view.state == "xz") {
            var dthtml = "<dt><img src='" + RX.handlePath("/medias/images/plat/attachment/enclosure.png") + "'><a class='addFileItem' href='javascript:;' title='" + view.uploadName + "'>" + view.uploadName + "</a>";
            if (minNum > 0) {
                dthtml += "&nbsp;&nbsp;<b style='color:#717171;font-weight:normal;'>(最少上传" + minNum + "份)</b>";
            }
            dthtml += "</dt>"
            $(dl).append(dthtml);
        } else if (view.showTag) {
            var dthtml = "<dt><img src='/plat/medias/images/plat/attachment/enclosure.png'><span>" + view.uploadName + "</span></dt>";
            $(dl).append(dthtml);
        }
        $.each(view.collection.models, function (index, value) {
            view.index++;
            var dd = view.getNewFileView(value, 'renderEditMode', view.index, view.state).render().el;
            $(dl).append(dd);
        });
        $(view.el).append(dl);
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        var url = RX.handlePath("/attachment/addFileUpload?fj_id=") + view.uuid;
        if (view.defaultType != null) {
            url += "&defaultType=" + view.defaultType;
        }
        if (view.fileType != null && view.fileType != "") {
            url += "&fileType=" + view.fileType;
        }
        url += "&random=" + Math.random();
        _top.layer.open({
            type: 2,//代表iframe
            area: ["450px", "300px"],  //代表宽高
            title: "上传资料",
            content: url,   //url地址
            end: function () {
                view.render();
            }
        });
    }
});

//创建附件列表行view
var AttachmentDdView = Backbone.View.extend({
    tagName: 'dd',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    state: "",       //状态，“ck”查看、其他
    parentView: null,
    index: 0,    //序号
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if (option.index != undefined)
            this.index = option.index;
        if (option.state != undefined)
            this.state = option.state;
        if (option.parentView != undefined)
            this.parentView = option.parentView;
    },
    //渲染主方法
    render: function () {
        var view = this;
        var model = view.model;
        var hasExt = true;
        if (model.get("extension") == null || "" == model.get("extension")) {
            hasExt = false;
        }
        var html =
            "<p>" + model.get("name") + (hasExt ? ("." + model.get("extension")) : "") + "</p>" +
            "<a class=\"downloadFile\" href=\"javascript:void(0);\">下载</a> " +
            "<a class=\"openFile\" href=\"javascript:void(0);\">打开</a> ";

        if (view.state == "xz") {
            html += "<a class=\"deleteFile\" href=\"javascript:void(0);\">删除</a>";
        }
        $(this.el).append(html);
        return this;
    },
    //事件
    events: {
        'click a.deleteFile': 'deleteFile',
        'click a.openFile': 'openFile',
        'click a.downloadFile': 'downloadFile'
    },
    //删除事件响应方法
    deleteFile: function () {
        var view = this;
        if (confirm("您确定要删除该条信息吗")) {
            $.post("/attachment/deleteAttachment", {ids: view.model.get("id")}, function (data) {
                _top.layer.alert(data, function (index) {
                    view.parentView.render();
                    _top.layer.close(index);
                });
            });
        }
    },
    openFile: function () {
        openLayer("查看附件信息", "medium", "/attachment/showFile?id=" + this.model.get("id"));
    },
    //下载事件响应方法
    downloadFile: function () {
        window.open(RX.handlePath("/attachment/downloadAttachment?id=" + this.model.get("id")));
    }
});

//创建附件列表面板view
var AttachmentTableView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'list',   //主体样式
    state: "",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    listName: "",        //附件列表头部名称
    element: null,
    dictStr: "[{value:\"附件文件\",code:\"0\"}]",
    dictCode: null,
    fileType: "",
    minNum: null,
    defaultType: null,
    //初始方法
    initialize: function (options) {
        if (options.uuid != null && options.uuid != "") {
            this.uuid = options.uuid;
        }
        if (options.state != null) {
            this.state = options.state;
        }
        if (options.listName != null) {
            this.listName = options.listName;
        } else {
            this.listName = "附件资料";
        }
        if (options.fileType != null && options.fileType != "") {
            this.fileType = options.fileType;
        }
        if (options.minNum != null) {
            this.minNum = options.minNum;
        }
        if (options.defaultType != null) {
            this.defaultType = options.defaultType;
        }
        this.render();
    },
    //获取实际新实体model方法
    getNewModel: function () {
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function (item, mode, index, state) {
        var view = this;
        return new AttachmentTrView({
            model: item,
            renderCallback: mode,
            index: index,
            state: state,
            parentView: view
        });
    },
    //获取控制区域html
    getControlHtml: function () {
        var view = this;
        var minNum = 0;
        if (view.minNum != null) {
            if (view.minNum != null && view.minNum > 0) {
                minNum = view.minNum;
            }
        }
        $(view.el).attr("minNum", minNum);
        var controlstr = "<div class='page_title'>" +
            "<h1>" + this.listName + "</h1>";
        if (view.state == "ck") {
            controlstr += "</div>";
        } else {
            if (minNum > 0) {
                controlstr += "<p>(最少上传" + minNum + "份)</p>";
            }
            controlstr += "<form id='uploadForm' enctype='multipart/form-data' method='POST'><ul class='action_button to_right'>" +
                "<li ><a class='tabFile' href='#none' ><input type='file' class='addFile' name='filedata'  id='uploadFile'>添加附件</a>" +
                "</li>" +
                " <input type='hidden' name='fj_type' value='fj' /></ul></form>";
        }
        return controlstr;
    },
    //事件
    events: {
        'click button.addFileItem': 'addNewItem',
        'click a.addFileItem': 'addNewItem',
        'change input.addFile': "fileChange"
    },
    //依据uuid请求数据方法
    makeAttListData: function () {
        var view = this;
        view.collection.remove(view.collection.models);
        var jsonMap = {
            uuid: view.uuid
        };
        if (view.uuid != null && view.uuid != "") {
            $.ajax({
                type: "post",
                url: "/attachment/getAttachmentList",
                data: {"map": JSON.stringify(jsonMap)},
                async: false,
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
    },
    //主渲染方法
    render: function () {
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).removeAttr("tip");
        $(view.el).append(this.getControlHtml());
        var $tab = $("<table border='0' cellpadding='0' cellspacing='0' class='list'></table>")
        $(view.el).append($tab);
        //渲染table的thead部分
        $tab.append("<thead><th width='70%'>附件</th><th>操作</th></thead>");
        if (view.collection.models.length > 0) {
            $.each(view.collection.models, function (index, value) {
                view.index++;
                var tr = view.getNewFileView(value, 'renderEditMode', view.index, view.state).render().el;
                $tab.append(tr);
            });
        } else {
            var tr = $("<tr class='rx-grid-tr errortr'><td colspan='2' align='center' style='text-align:center;'><span style='font-size:12px;color:red;font-weight:bold;line-height: 34px;'>无数据</span></td></tr>");
            $tab.append(tr);
        }
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        var url = RX.handlePath("/attachment/addFileUpload?uuid=") + view.uuid;
        if (view.defaultType != null) {
            url += "&defaultType=" + view.defaultType;
        }
        //if(view.fileType != null && view.fileType != ""){
        //    url += "&fileType=" + view.fileType;
        //}
        url += "&random=" + Math.random();
        openStack(window, "上传资料", ["450px", "300px"], url, view.fileType,
            {
                end: function () {
                    view.render();
                }
            });
    },
    fileChange: function () {
        var view = this;
        $("#uploadForm").attr("action", "/" + RX.config.defaultPath + "/attachment/mulupload?uuid=" + view.uuid);
        $("#uploadForm").ajaxSubmit(function (ar) { //表单提交，根据后台Action返回的数据进行相关的操作
            var datastr = ar;
            datastr = datastr.replace("<pre>", "").replace("</pre>", "").replace("<PRE>", "").replace("</PRE>", "");
            // var data = eval('(' + datastr + ')');
            var file = $("#uploadFile");
            file.after(file.clone().val(""));
            file.remove();
            // if (data.error) {
            //     layer.alert(data.error);
            // } else if (data.msg) {
            layer.alert("上传成功");
            view.render();
            // } else {
            //     layer.alert("上传失败");
            // }
            $("#uploadFile").bind("change", function () {

            });
        });
    }
});

//创建附件列表行view
var AttachmentTrView = Backbone.View.extend({
    tagName: 'tr',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    state: "",       //状态，“ck”查看、其他
    parentView: null,
    index: 0,    //序号
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if (option.index != undefined)
            this.index = option.index;
        if (option.state != undefined)
            this.state = option.state;
        if (option.parentView != undefined)
            this.parentView = option.parentView;
    },
    //渲染主方法
    render: function () {
        var view = this;
        var model = view.model;
        var hasExt = true;
        var ns = model.get("name").split(".");
        if (model.get("extension") == null || "" == model.get("extension")) {
            hasExt = false;
        } else if (ns.length > 0) {
            var ext = ns[ns.length - 1];
            if (ext == model.get("extension")) {
                hasExt = false;
            }
        }
        var html =
            "<td>" + model.get("name") + (hasExt ? ("." + model.get("extension")) : "") + "</td>" +
            "<td><a class=\"downloadFile\" href=\"javascript:void(0);\">下载</a> ";

        if (view.state == "xz") {
            html += "<a class=\"deleteFile\" href=\"javascript:void(0);\">删除</a>";
        }
        html += "</td>";
        $(this.el).append(html);
        return this;
    },
    //事件
    events: {
        'click a.deleteFile': 'deleteFile',
        'click a.openFile': 'openFile',
        'click a.downloadFile': 'downloadFile'
    },
    //删除事件响应方法
    deleteFile: function () {
        var view = this;
        layer.confirm("您确定要删除该条信息吗", function (index1) {
            layer.close(index1);
            $.post("/attachment/delAttachment", {idstr: view.model.get("id")}, function (ar) {
                if (ar.success) {
                    layer.msg("删除成功",{icon:1});
                    view.parentView.render();
                } else {
                    layer.alert(ar.msg);
                }
            });
        })
    },
    openFile: function () {
        openStack(window, "查看附件信息", "medium", "/attachment/showFile?id=" + this.model.get("id"));
    },
    //下载事件响应方法
    downloadFile: function () {
        window.open("/" + RX.config.defaultPath + "/attachment/download?id=" + this.model.get("id"));
    }
});

//创建附件列表面板view
var AttachmentSingleView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'enclosure',   //主体样式
    state: "",      //状态，“ck”查看、其他
    uuid: "",       //附件列表关联的uuid
    uploadName: "上传附件",        //附件按钮文字
    element: null,
    dictStr: "[{value:\"附件文件\",code:\"0\"}]",
    dictCode: null,
    fileType: "",
    defaultType: null,
    //初始方法
    initialize: function (options) {
        if (options.uuid != null && options.uuid != "") {
            this.uuid = options.uuid;
        }
        if (options.state != null) {
            this.state = options.state;
        }
        if (options.fileType != null && options.fileType != "") {
            this.fileType = options.fileType;
        }
        if (options.uploadName != null) {
            this.uploadName = options.uploadName;
        }
        if (options.defaultType != null) {
            this.defaultType = options.defaultType;
        }
        this.render();
    },
    //获取实际新实体model方法
    getNewModel: function () {
        return new AttachmentModel();
    },
    //获取实际个体数据view方法
    getNewFileView: function (item, mode, index, state) {
        var view = this;
        return new AttachmentSingleDdView({
            model: item,
            renderCallback: mode,
            index: index,
            state: state,
            parentView: view
        });
    },
    //事件
    events: {
        'click button.addFileItem': 'addNewItem',
        'click a.addFileItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    makeAttListData: function () {
        var view = this;
        view.collection.remove(view.collection.models);
        if (view.uuid != null && view.uuid != "") {
            var jsonMap = {
                uuid: view.uuid
            };
            $.ajax({
                url: "/attachment/getAttachmentList",
                data: {"map": JSON.stringify(jsonMap)},
                async: false,
                success: function (ar) {
                    if (ar.success) {
                        view.collection.reset(ar.data);
                    }
                }
            });
        }
        //var attList = [{id:1, zd_no:1,name:"附件1"},{id:2,zd_no:1,name:"附件2"},{id:3, zd_no:2,name:"附件3"}];
        //this.collection.add(attList);
    },
    //主渲染方法
    render: function () {
        var view = this;
        view.index = 0;
        view.makeAttListData();
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        var dl = $("<dl></dl>");
        $(dl).css("float", "left");
        if (view.state == "xz") {
            $(dl).append("<dt style='float:left;'><img src=" + RX.handlePath('/medias/images/plat/attachment/enclosure.png') + "><a class='addFileItem' href='javascript:;' title='" + view.uploadName + "'>" + view.uploadName + "</a></dt>");
        }
        $.each(view.collection.models, function (index, value) {
            view.index++;
            var dd = view.getNewFileView(value, 'renderEditMode', view.index, view.state).render().el;
            $(dl).append(dd);
        });
        $(view.el).append(dl);
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        if (view.collection.models != null && view.collection.models.length > 0) {
            _top.layer.confirm("仅能上传一条附件，点击确定删除已有附件", function (index) {
                $.ajax({
                    type: "post",
                    url: "/attachment/delAttachment",
                    data: {idstr: view.collection.models[0].get("id")},
                    async: false,
                    success: function (ar) {
                        if (ar.success) {
                            view.render();
                        } else {
                            layer.alert(ar.msg);
                        }

                    }
                });
                var url = RX.handlePath("/attachment/addFileUpload?uuid=") + view.uuid + "&limit=1";
                if (view.defaultType != null) {
                    url += "&defaultType=" + view.defaultType;
                }
                if (view.fileType != null && view.fileType != "") {
                    url += "&fileType=" + view.fileType;
                }
                openStack(window, "上传资料", ["450px", "300px"], url, null, {
                    end: function () {
                        view.render();
                    }
                });
            });
        } else {
            var url = RX.handlePath("/attachment/addFileUpload?uuid=") + view.uuid + "&limit=1";
            if (view.defaultType != null) {
                url += "&defaultType=" + view.defaultType;
            }
            if (view.fileType != null && view.fileType != "") {
                url += "&fileType=" + view.fileType;
            }
            openStack(window, "上传资料", ["450px", "300px"], url, null, {
                end: function () {
                    view.render();
                }
            });
        }

    }
});

//创建附件列表行view
var AttachmentSingleDdView = Backbone.View.extend({
    tagName: 'dd',  //标签名，表单块个体创建为div,行个体创建为tr
    className: 'rowdd',   //个体样式
    state: "",       //状态，“ck”查看、其他
    parentView: null,
    index: 0,    //序号
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if (option.index != undefined)
            this.index = option.index;
        if (option.state != undefined)
            this.state = option.state;
        if (option.parentView != undefined)
            this.parentView = option.parentView;
    },
    //渲染主方法
    render: function () {
        var view = this;
        var model = view.model;
        $(view.el).addClass(view.className);
        var hasExt = true;
        var ns = model.get("name").split(".");
        if (model.get("extension") == null || "" == model.get("extension")) {
            hasExt = false;
        } else if (ns.length > 0) {
            var ext = ns[ns.length - 1];
            if (ext == model.get("extension")) {
                hasExt = false;
            }
        }
        var html =
            model.get("name") + (hasExt ? ("." + model.get("extension")) : "") +
            "  <a class=\"downloadFile\" href=\"javascript:void(0);\">下载</a> " +
            "<a class=\"openFile\" href=\"javascript:void(0);\">打开</a> ";

        if (view.state == "xz") {
            html += "<a class=\"deleteFile\" href=\"javascript:void(0);\">删除</a>";
        }
        $(this.el).append(html);
        return this;
    },
    //事件
    events: {
        'click a.deleteFile': 'deleteFile',
        'click a.openFile': 'openFile',
        'click a.downloadFile': 'downloadFile'
    },
    //删除事件响应方法
    deleteFile: function () {
        var view = this;
        layer.confirm("您确定要删除该条信息吗？", function (index) {
            $.post("/attachment/delAttachment", {idstr: view.model.get("id")}, function (ar) {
                if (ar.success) {
                    layer.msg("删除成功",{icon:1});
                    view.parentView.render();
                } else {
                    layer.alert(ar.msg);
                }
            });
        });
    },
    openFile: function () {
        openStack(window, "查看附件信息", "medium", "/attachment/showFile?id=" + this.model.get("id"));
    },
    //下载事件响应方法
    downloadFile: function () {
        window.open(RX.handlePath("/attachment/downloadAttachment?id=" + this.model.get("id")));
    }
});

var ImageUploadView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'enclosure',   //主体样式
    state: "",      //状态，“ck”查看、其他
    zpid: "",       //附件列表关联的uuid
    listName: "",        //附件列表头部名称
    element: null,
    dictStr: "[{value:\"附件文件\",code:\"0\"}]",
    ModelName: "",
    property: "",
    frameWin: null,
    //初始方法
    initialize: function (options) {
        if (options.zpid != null && options.zpid != "") {
            this.zpid = options.zpid;
        }
        if (options.uuid != null && options.uuid != "") {
            this.uuid = options.uuid;
        }
        if (options.state != null && options.state != "") {
            this.state = options.state;
        }
        if (options.ModelName != null && options.ModelName != "") {
            this.ModelName = options.ModelName;
        }
        if (options.property != null && options.property != "") {
            this.property = options.property;
        }
        this.render();
    },
    //事件
    events: {
        'click button.addZpItem': 'addNewItem',
        'click a.addZpItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    //主渲染方法
    render: function () {
        var view = this;
        view.index = 0;
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        if (view.zpid != "") {
            $(view.el).append("<a herf='javascript:;' class='addZpItem'><img style='width:100%' onerror='onerror=null;src=\"/plat/medias/images/plat/001.jpg\"'  src='/plat/attachment/getImage?id=" + view.zpid + "&random=" + Math.random() + "'/></a>");
        } else {
            $(view.el).append("<a herf='javascript:;' class='addZpItem'><img class='zpimage' style='width:100%' src='" + RX.handlePath('/medias/images/plat/001.jpg') + "'/></a>");
        }
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        if (view.state == "xz") {
            var url = "/attachment/addImageUpload?limit=1";
            //var url = "/attachment/addImageUpload?limit=1&random=" + Math.random();
            openStack(window, "上传图片", ["450px", "300px"], url, null, {
                end: function () {
                    var zpid = _top.getZpid();
                    if (zpid != null && zpid != "") {
                        view.zpid = zpid;
                        $.getEle(view.ModelName, view.property).val(zpid);
                    }
                    _top.setZpid("");
                    if (zpid && zpid !== "" && zpid !== null & zpid !== undefined) {
                        view.render();
                    }
                }
            });

        }
    }
});

var CysbUploadView = Backbone.View.extend({
    tagName: 'div', //标签名，列表主体暂固定为table
    className: 'enclosure',   //主体样式
    state: "",      //状态，“ck”查看、其他
    zpid: "",       //附件列表关联的uuid
    listName: "",        //附件列表头部名称
    element: null,
    dictStr: "[{value:\"附件文件\",code:\"0\"}]",
    ModelName: "",
    property: "",
    frameWin: null,
    //初始方法
    initialize: function (options) {
        if (options.zpid != null && options.zpid != "") {
            this.zpid = options.zpid;
        }
        if (options.uuid != null && options.uuid != "") {
            this.uuid = options.uuid;
        }
        if (options.state != null && options.state != "") {
            this.state = options.state;
        }
        if (options.ModelName != null && options.ModelName != "") {
            this.ModelName = options.ModelName;
        }
        if (options.property != null && options.property != "") {
            this.property = options.property;
        }
        this.render();
    },
    //事件
    events: {
        'click button.addZpItem': 'addNewItem',
        'click a.addZpItem': 'addNewItem'
    },
    //依据uuid请求数据方法
    //主渲染方法
    render: function () {
        var view = this;
        view.index = 0;
        $(view.el).empty();
        $(view.el).removeClass().addClass(view.className);
        if (view.zpid != "") {
            $(view.el).append("<a herf='javascript:;' class='addZpItem'><img style='width:100%;height:auto;' src='/rygl/getGczp?id=" + view.zpid + "&random=" + Math.random() + "'/></a>");
        } else {
            $(view.el).append("<a herf='javascript:;' class='addZpItem'><img class='zpimage' style='width:100%;height:auto;' src='/medias/images/plat/001.jpg'/></a>");
        }
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        if (view.state == "xz") {
            var url = "/attachment/addImageUpload?imagetype=cysb&limit=1&random=" + Math.random();
            _top.layer.open({
                type: 2,//代表iframe
                area: ["450px", "300px"],  //代表宽高
                title: "上传图片",
                content: url,   //url地址
                success: function (layero, index) {
                },
                end: function () {
                    var zpid = _top.getZpid();
                    if (zpid != null && zpid != "") {
                        view.zpid = zpid;
                        $.getEle(view.ModelName, view.property).val(zpid);
                    }
                    _top.setZpid("");
                    if (zpid && zpid !== "" && zpid !== null & zpid !== undefined) {
                        view.render();
                    }
                }
            });
        }
    }
});
//辅助附件上传  change事件
function onUploadChange(t, v) {
    //获取view
    $("#uploadHtml5Form").attr("action", "/" + RX.config.defaultPath + "/attachment/mulupload?uuid=" + view.uuid);

    $("#uploadHtml5Form").ajaxSubmit(function (ar) { //表单提交，根据后台Action返回的数据进行相关的操作
        var datastr = ar;
        datastr = datastr.replace("<pre>", "").replace("</pre>", "").replace("<PRE>", "").replace("</PRE>", "");
        var data = eval('(' + datastr + ')');
        var file = $("#uploadFile");
        file.after(file.clone().val(""));
        file.remove();
        if (data.error) {
            layer.alert(data.error);
        } else if (data.msg) {
            layer.alert("上传成功");
            view.render();
        } else {
            layer.alert("上传失败");
        }
        $("#uploadFile").bind("change", function () {

        });
    });
// }
//     var attView = $("#tjfjIframe").data("attachmentView");
//     attView.render();
//     // attView.fileChanged(ss);
}