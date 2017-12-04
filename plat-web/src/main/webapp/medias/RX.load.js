/*****************************************************************************
 * RX前端配置
 * 项目路径在RX.config.ctxPath上设置，可由RX.ctxPath /RX.config.ctxPath 获取
 * 所属项目：plat
 * 最后更新时间：2017-10-12
 * 最后更新人：Zp
 *****************************************************************************/
//注册RX空间
window.RX = window.RX || {};

//浏览器参数获取
RX.browser = {
    debug: false,     //是否开启加载日志
    canCache: false,      //页面js、css是否可缓存
    isIE: !!window.ActiveXObject,    //是否为IE
    isIE6: !!window.ActiveXObject && !window.XMLHttpRequest,     //是否为IE6
    isIE8: !!window.ActiveXObject && !!document.documentMode        //是否为IE8
};

//加载项配置
RX.config = {

    // 项目路径(项目code)
    ctxPath: 'plat',

    // 设置路径，方便跨目录调用
    paths: {
    },

    //默认加载库，引入本js会自动加载所需的库文件（阻塞式）
    defaultLib: ["jquery","perfectLoad","formUtils"],

    // 设置别名，方便调用
    alias: {
        'jquery': '/medias/lib/jquery-1.8.3.js',
        'json2': '/medias/lib/store+json2.min.js',
        'validTip': '/medias/lib/jquery.bgiframe.min.js',
        'underscore': '/medias/lib/plat/backbone/underscore-min.js',
        'backbone': '/medias/lib/plat/backbone/backbone-min.js',
        'relational': '/medias/lib/plat/backbone/backbone-relational.js',
        'formUtils': '/medias/lib/plat/formUtils.js',
        'datagrid': '/medias/plugin/rx-grid/datagrid.RX.1.1.js',
        'modelRenderer': '/medias/lib/plat/backbone/ModelRenderer.js',
        'gridModel': '/medias/lib/plat/backbone/BaseGridModel.js',
        'detailModel': '/medias/lib/plat/backbone/DetailModel.js',
        'searchView': '/medias/lib/plat/backbone/SearchView.js',
        'validate': '/medias/lib/plat/validate.js',
        'formView': '/medias/lib/plat/backbone/BaseFormView.js',
        'attachmentView': '/medias/lib/plat/backbone/BaseAttachmentView.js',
        'datePicker': '/medias/plugin/My97DatePicker/WdatePicker.js',
        'msgbox': '/medias/plugin/loading/msgbox.js',
        'layer': '/medias/plugin/layer/layer.js',
        'layerExtend': "/medias/plugin/layer/extend/layer.ext.js",
        'cookie': '/medias/lib/jquery.cookie.js',
        'pngFix': '/medias/lib/DD_belatedPNG_0.0.8a-min.js',
        'zTree': '/medias/lib/jquery.ztree.all-3.4.min.js',
        'tabPanel': '/medias/lib/TabPanel.js',
        'operamasks': '/medias/lib/operamasks-ui.js',
        'flowProp': '/medias/lib/plat/flow/flow.property.js',
        'select2': '/medias/plugin/select2/dist/js/select2.full.min.js',
        'zh-CN': '/medias/plugin/select2/dist/js/i18n/zh-CN.js',
        'uploadify': '/medias/plugin/uploadify/jquery.uploadify.min.js',
        // "workflow": "/medias/js/plat/code/workflow/instance/workflow.js",
        "opinionView": "/medias/lib/plat/backbone/OpinionView.js",
        "mathUuid": "/medias/lib/Math.uuid.js",
        "jqueryUrl": "/medias/lib/jquery.url.js",
        "jqueryJson": "/medias/lib/jquery.json-2.3.min.js",
        "jqueryForm": "/medias/lib/jquery.form.js",
        "tpl": "/medias/lib/rx/RX.tpl-0.2.js",
        "perfectLoad": "/medias/plugin/perfectLoad/PerfectLoad.js"
    },

    //设置模板，方便复用
    template: {
        'grid': [['json2', 'underscore'],
            ['backbone', 'modelRenderer'],
            ['relational', 'validate', 'datagrid', 'datePicker'],
            ['detailModel', 'gridModel', 'searchView']],
        'form': [['json2', 'underscore'],
            ['backbone', 'modelRenderer'],
            ['relational', 'validate', 'validTip', 'datePicker'],
            ['detailModel', 'formView', 'jqueryForm', 'attachmentView']]
    },
    // 设置别名，方便调用
    cssAlias: {
        // 'form': '/medias/css/plat/MainForm.css',
        // 'grid': '/medias/css/plat/MainGrid.css',
        'validTip': '/medias/style/plat/validate.css',
        'platMain': '/medias/style/plat/plat.css',
        'platFlow': '/medias/style/plat/platFlow.css',
        'model': '/medias/style/plat/Model.css',
        'global': '/medias/style/plat/Global.css',
        'iconfont': '/medias/style/plat/iconfont.css',
        'datagrid': '/medias/plugin/rx-grid/datagrid.RX.1.1.css',
        'operamasks': '/medias/style/plat/workflow/operamasks-ui.min.css',
        'uploadify': '/medias/plugin/uploadify/uploadify.css',
        'tabPanelJb': '/medias/style/plat/TabPanelJb.css',
        'tabPanel': '/medias/style/plat/TabPanel.css',
        'treeIcon': '/medias/css/plat/TreeIcon.css',
        'zTree': '/medias/style/zTreeStyle/zTreeStyle.css',
        'layer': '/medias/plugin/layer/skin/layer.css'
    },

    //设置模板，方便复用
    cssTemplate: {
        // 'grid': ['grid', 'model', 'global', 'iconfont'],
        // 'form': ['form'],
        'platMain': ['global', 'platMain', 'iconfont', 'validTip'],
        'platFlow': ['global', 'platFlow', 'iconfont', 'validTip']
    }
};

//项目路径，RX命名调整
RX.ctxPath = RX.config.ctxPath || "";

/*****************************************************************
 * 文件加载器内核与封装
 * 项目开发人员请勿调整！
 * 最后更新时间：2017-10-12
 * 最后更新人：Zp
 *****************************************************************/
(function (global) {
    
    var _$LAB = global.$LAB,

        // constants for the valid keys of the options object
        _UseLocalXHR = "UseLocalXHR",
        _AlwaysPreserveOrder = "AlwaysPreserveOrder",
        _AllowDuplicates = "AllowDuplicates",
        _CacheBust = "CacheBust",
        /*!START_DEBUG*/_Debug = "Debug", /*!END_DEBUG*/
        _BasePath = "BasePath",

        // stateless variables used across all $LAB instances
        root_page = /^[^?#]*\//.exec(location.href)[0],
        root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
        append_to = document.head || document.getElementsByTagName("head"),

        // inferences... ick, but still necessary
        opera_or_gecko = (global.opera && Object.prototype.toString.call(global.opera) == "[object Opera]") || ("MozAppearance" in document.documentElement.style),

        /*!START_DEBUG*/
        // console.log() and console.error() wrappers
        log_msg = function () {
        },
        log_error = log_msg,
        /*!END_DEBUG*/

        // feature sniffs (yay!)
        test_script_elem = document.createElement("script"),
        explicit_preloading = typeof test_script_elem.preload == "boolean", // http://wiki.whatwg.org/wiki/Script_Execution_Control#Proposal_1_.28Nicholas_Zakas.29
        real_preloading = explicit_preloading || (test_script_elem.readyState && test_script_elem.readyState == "uninitialized"), // will a script preload with `src` set before DOM append?
        script_ordered_async = !real_preloading && test_script_elem.async === true, // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order

        // XHR preloading (same-domain) and cache-preloading (remote-domain) are the fallbacks (for some browsers)
        xhr_or_cache_preloading = !real_preloading && !script_ordered_async && !opera_or_gecko
    ;

    /*!START_DEBUG*/
    // define console wrapper functions if applicable
    if (global.console && global.console.log) {
        if (!global.console.error) global.console.error = global.console.log;
        log_msg = function (msg) {
            global.console.log(msg);
        };
        log_error = function (msg, err) {
            global.console.error(msg, err);
        };
    }
    /*!END_DEBUG*/

    // test for function
    function is_func(func) {
        return Object.prototype.toString.call(func) == "[object Function]";
    }

    // test for array
    function is_array(arr) {
        return Object.prototype.toString.call(arr) == "[object Array]";
    }

    // make script URL absolute/canonical
    function canonical_uri(src, base_path) {
        var absolute_regex = /^\w+\:\/\//;

        // is `src` is protocol-relative (begins with // or ///), prepend protocol
        if (/^\/\/\/?/.test(src)) {
            src = location.protocol + src;
        }
        // is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /)
        else if (!absolute_regex.test(src) && src.charAt(0) != "/") {
            // prepend `base_path`, if any
            src = (base_path || "") + src;
        }
        // make sure to return `src` as absolute
        return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src);
    }

    // merge `source` into `target`
    function merge_objs(source, target) {
        for (var k in source) {
            if (source.hasOwnProperty(k)) {
                target[k] = source[k]; // TODO: does this need to be recursive for our purposes?
            }
        }
        return target;
    }

    // does the chain group have any ready-to-execute scripts?
    function check_chain_group_scripts_ready(chain_group) {
        var any_scripts_ready = false;
        for (var i = 0; i < chain_group.scripts.length; i++) {
            if (chain_group.scripts[i].ready && chain_group.scripts[i].exec_trigger) {
                any_scripts_ready = true;
                chain_group.scripts[i].exec_trigger();
                chain_group.scripts[i].exec_trigger = null;
            }
        }
        return any_scripts_ready;
    }

    // creates a script load listener
    function create_script_load_listener(elem, registry_item, flag, onload) {
        elem.onload = elem.onreadystatechange = function () {
            if ((elem.readyState && elem.readyState != "complete" && elem.readyState != "loaded") || registry_item[flag]) return;
            elem.onload = elem.onreadystatechange = null;
            onload();
        };
    }

    // script executed handler
    function script_executed(registry_item) {
        registry_item.ready = registry_item.finished = true;
        for (var i = 0; i < registry_item.finished_listeners.length; i++) {
            registry_item.finished_listeners[i]();
        }
        registry_item.ready_listeners = [];
        registry_item.finished_listeners = [];
    }

    // make the request for a scriptha
    function request_script(chain_opts, script_obj, registry_item, onload, preload_this_script) {
        // setTimeout() "yielding" prevents some weird race/crash conditions in older browsers
        setTimeout(function () {
            var script, src = script_obj.real_src, xhr;

            // don't proceed until `append_to` is ready to append to
            if ("item" in append_to) { // check if `append_to` ref is still a live node list
                if (!append_to[0]) { // `append_to` node not yet ready
                    // try again in a little bit -- note: will re-call the anonymous function in the outer setTimeout, not the parent `request_script()`
                    setTimeout(arguments.callee, 25);
                    return;
                }
                // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
                append_to = append_to[0];
            }
            script = document.createElement("script");
            if (script_obj.type) script.type = script_obj.type;
            if (script_obj.charset) script.charset = script_obj.charset;

            // should preloading be used for this script?
            if (preload_this_script) {
                // real script preloading?
                if (real_preloading) {
                    /*!START_DEBUG*/
                    if (chain_opts[_Debug]) log_msg("start script preload: " + src);
                    /*!END_DEBUG*/
                    registry_item.elem = script;
                    if (explicit_preloading) { // explicit preloading (aka, Zakas' proposal)
                        script.preload = true;
                        script.onpreload = onload;
                    }
                    else {
                        script.onreadystatechange = function () {
                            if (script.readyState == "loaded") onload();
                        };
                    }
                    script.src = src;
                    // NOTE: no append to DOM yet, appending will happen when ready to execute
                }
                // same-domain and XHR allowed? use XHR preloading
                else if (preload_this_script && src.indexOf(root_domain) == 0 && chain_opts[_UseLocalXHR]) {
                    xhr = new XMLHttpRequest(); // note: IE never uses XHR (it supports true preloading), so no more need for ActiveXObject fallback for IE <= 7
                    /*!START_DEBUG*/
                    if (chain_opts[_Debug]) log_msg("start script preload (xhr): " + src);
                    /*!END_DEBUG*/
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            xhr.onreadystatechange = function () {
                            }; // fix a memory leak in IE
                            registry_item.text = xhr.responseText + "\n//@ sourceURL=" + src; // http://blog.getfirebug.com/2009/08/11/give-your-eval-a-name-with-sourceurl/
                            onload();
                        }
                    };
                    xhr.open("GET", src);
                    xhr.send();
                }
                // as a last resort, use cache-preloading
                else {
                    /*!START_DEBUG*/
                    if (chain_opts[_Debug]) log_msg("start script preload (cache): " + src);
                    /*!END_DEBUG*/
                    script.type = "text/cache-script";
                    create_script_load_listener(script, registry_item, "ready", function () {
                        append_to.removeChild(script);
                        onload();
                    });
                    script.src = src;
                    append_to.insertBefore(script, append_to.firstChild);
                }
            }
            // use async=false for ordered async? parallel-load-serial-execute http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            else if (script_ordered_async) {
                /*!START_DEBUG*/
                if (chain_opts[_Debug]) log_msg("start script load (ordered async): " + src);
                /*!END_DEBUG*/
                script.async = false;
                create_script_load_listener(script, registry_item, "finished", onload);
                script.src = src;
                append_to.insertBefore(script, append_to.firstChild);
            }
            // otherwise, just a normal script element
            else {
                /*!START_DEBUG*/
                if (chain_opts[_Debug]) log_msg("start script load: " + src);
                /*!END_DEBUG*/
                create_script_load_listener(script, registry_item, "finished", onload);
                script.src = src;
                append_to.insertBefore(script, append_to.firstChild);
            }
        }, 0);
    }

    // create a clean instance of $LAB
    function create_sandbox() {
        var global_defaults = {},
            can_use_preloading = real_preloading || xhr_or_cache_preloading,
            queue = [],
            registry = {},
            instanceAPI
        ;

        // global defaults
        global_defaults[_UseLocalXHR] = true;
        global_defaults[_AlwaysPreserveOrder] = false;
        global_defaults[_AllowDuplicates] = false;
        global_defaults[_CacheBust] = false;
        /*!START_DEBUG*/
        global_defaults[_Debug] = false;
        /*!END_DEBUG*/
        global_defaults[_BasePath] = "";

        // execute a script that has been preloaded already
        function execute_preloaded_script(chain_opts, script_obj, registry_item) {
            var script;

            function preload_execute_finished() {
                if (script != null) { // make sure this only ever fires once
                    script = null;
                    script_executed(registry_item);
                }
            }

            if (registry[script_obj.src].finished) return;
            if (!chain_opts[_AllowDuplicates]) registry[script_obj.src].finished = true;

            script = registry_item.elem || document.createElement("script");
            if (script_obj.type) script.type = script_obj.type;
            if (script_obj.charset) script.charset = script_obj.charset;
            create_script_load_listener(script, registry_item, "finished", preload_execute_finished);

            // script elem was real-preloaded
            if (registry_item.elem) {
                registry_item.elem = null;
            }
            // script was XHR preloaded
            else if (registry_item.text) {
                script.onload = script.onreadystatechange = null;	// script injection doesn't fire these events
                script.text = registry_item.text;
            }
            // script was cache-preloaded
            else {
                script.src = script_obj.real_src;
            }
            append_to.insertBefore(script, append_to.firstChild);

            // manually fire execution callback for injected scripts, since events don't fire
            if (registry_item.text) {
                preload_execute_finished();
            }
        }

        // process the script request setup
        function do_script(chain_opts, script_obj, chain_group, preload_this_script) {
            var registry_item,
                registry_items,
                ready_cb = function () {
                    script_obj.ready_cb(script_obj, function () {
                        execute_preloaded_script(chain_opts, script_obj, registry_item);
                    });
                },
                finished_cb = function () {
                    script_obj.finished_cb(script_obj, chain_group);
                }
            ;

            script_obj.src = canonical_uri(script_obj.src, chain_opts[_BasePath]);
            script_obj.real_src = script_obj.src +
                // append cache-bust param to URL?
                (chain_opts[_CacheBust] ? ((/\?.*$/.test(script_obj.src) ? "&_" : "?_") + ~~(Math.random() * 1E9) + "=") : "")
            ;

            if (!registry[script_obj.src]) registry[script_obj.src] = {items: [], finished: false};
            registry_items = registry[script_obj.src].items;

            // allowing duplicates, or is this the first recorded load of this script?
            if (chain_opts[_AllowDuplicates] || registry_items.length == 0) {
                registry_item = registry_items[registry_items.length] = {
                    ready: false,
                    finished: false,
                    ready_listeners: [ready_cb],
                    finished_listeners: [finished_cb]
                };

                request_script(chain_opts, script_obj, registry_item,
                    // which callback type to pass?
                    (
                        (preload_this_script) ? // depends on script-preloading
                            function () {
                                registry_item.ready = true;
                                for (var i = 0; i < registry_item.ready_listeners.length; i++) {
                                    registry_item.ready_listeners[i]();
                                }
                                registry_item.ready_listeners = [];
                            } :
                            function () {
                                script_executed(registry_item);
                            }
                    ),
                    // signal if script-preloading should be used or not
                    preload_this_script
                );
            }
            else {
                registry_item = registry_items[0];
                if (registry_item.finished) {
                    finished_cb();
                }
                else {
                    registry_item.finished_listeners.push(finished_cb);
                }
            }
        }

        // creates a closure for each separate chain spawned from this $LAB instance, to keep state cleanly separated between chains
        function create_chain() {
            var chainedAPI,
                chain_opts = merge_objs(global_defaults, {}),
                chain = [],
                exec_cursor = 0,
                scripts_currently_loading = false,
                group
            ;

            // called when a script has finished preloading
            function chain_script_ready(script_obj, exec_trigger) {
                /*!START_DEBUG*/
                if (chain_opts[_Debug]) log_msg("script preload finished: " + script_obj.real_src);
                /*!END_DEBUG*/
                script_obj.ready = true;
                script_obj.exec_trigger = exec_trigger;
                advance_exec_cursor(); // will only check for 'ready' scripts to be executed
            }

            // called when a script has finished executing
            function chain_script_executed(script_obj, chain_group) {
                /*!START_DEBUG*/
                if (chain_opts[_Debug]) log_msg("script execution finished: " + script_obj.real_src);
                /*!END_DEBUG*/
                script_obj.ready = script_obj.finished = true;
                script_obj.exec_trigger = null;
                // check if chain group is all finished
                for (var i = 0; i < chain_group.scripts.length; i++) {
                    if (!chain_group.scripts[i].finished) return;
                }
                // chain_group is all finished if we get this far
                chain_group.finished = true;
                advance_exec_cursor();
            }

            // main driver for executing each part of the chain
            function advance_exec_cursor() {
                while (exec_cursor < chain.length) {
                    if (is_func(chain[exec_cursor])) {
                        /*!START_DEBUG*/
                        if (chain_opts[_Debug]) log_msg("$LAB.wait() executing: " + chain[exec_cursor]);
                        /*!END_DEBUG*/
                        try {
                            chain[exec_cursor++]();
                        } catch (err) {
                            /*!START_DEBUG*/
                            if (chain_opts[_Debug]) log_error("$LAB.wait() error caught: ", err);
                            /*!END_DEBUG*/
                            if (window.console && window.console.log) {
                                console.log(err)
                            }
                        }
                        continue;
                    }
                    else if (!chain[exec_cursor].finished) {
                        if (check_chain_group_scripts_ready(chain[exec_cursor])) continue;
                        break;
                    }
                    exec_cursor++;
                }
                // we've reached the end of the chain (so far)
                if (exec_cursor == chain.length) {
                    scripts_currently_loading = false;
                    group = false;
                }
            }

            // setup next chain script group
            function init_script_chain_group() {
                if (!group || !group.scripts) {
                    chain.push(group = {scripts: [], finished: true});
                }
            }

            // API for $LAB chains
            chainedAPI = {
                // start loading one or more scripts
                script: function () {
                    for (var i = 0; i < arguments.length; i++) {
                        (function (script_obj, script_list) {
                            var splice_args;

                            if (!is_array(script_obj)) {
                                script_list = [script_obj];
                            }
                            for (var j = 0; j < script_list.length; j++) {
                                init_script_chain_group();
                                script_obj = script_list[j];

                                if (is_func(script_obj)) script_obj = script_obj();
                                if (!script_obj) continue;
                                if (is_array(script_obj)) {
                                    // set up an array of arguments to pass to splice()
                                    splice_args = [].slice.call(script_obj); // first include the actual array elements we want to splice in
                                    splice_args.unshift(j, 1); // next, put the `index` and `howMany` parameters onto the beginning of the splice-arguments array
                                    [].splice.apply(script_list, splice_args); // use the splice-arguments array as arguments for splice()
                                    j--; // adjust `j` to account for the loop's subsequent `j++`, so that the next loop iteration uses the same `j` index value
                                    continue;
                                }
                                if (typeof script_obj == "string") script_obj = {src: script_obj};
                                script_obj = merge_objs(script_obj, {
                                    ready: false,
                                    ready_cb: chain_script_ready,
                                    finished: false,
                                    finished_cb: chain_script_executed
                                });
                                group.finished = false;
                                group.scripts.push(script_obj);

                                do_script(chain_opts, script_obj, group, (can_use_preloading && scripts_currently_loading));
                                scripts_currently_loading = true;

                                if (chain_opts[_AlwaysPreserveOrder]) chainedAPI.wait();
                            }
                        })(arguments[i], arguments[i]);
                    }
                    return chainedAPI;
                },
                // force LABjs to pause in execution at this point in the chain, until the execution thus far finishes, before proceeding
                wait: function () {
                    if (arguments.length > 0) {
                        for (var i = 0; i < arguments.length; i++) {
                            chain.push(arguments[i]);
                        }
                        group = chain[chain.length - 1];
                    }
                    else group = false;

                    advance_exec_cursor();

                    return chainedAPI;
                }
            };

            // the first chain link API (includes `setOptions` only this first time)
            return {
                script: chainedAPI.script,
                wait: chainedAPI.wait,
                setOptions: function (opts) {
                    merge_objs(opts, chain_opts);
                    return chainedAPI;
                }
            };
        }

        // API for each initial $LAB instance (before chaining starts)
        instanceAPI = {
            // main API functions
            setGlobalDefaults: function (opts) {
                merge_objs(opts, global_defaults);
                return instanceAPI;
            },
            setOptions: function () {
                return create_chain().setOptions.apply(null, arguments);
            },
            script: function () {
                return create_chain().script.apply(null, arguments);
            },
            wait: function () {
                return create_chain().wait.apply(null, arguments);
            },

            // built-in queuing for $LAB `script()` and `wait()` calls
            // useful for building up a chain programmatically across various script locations, and simulating
            // execution of the chain
            queueScript: function () {
                queue[queue.length] = {type: "script", args: [].slice.call(arguments)};
                return instanceAPI;
            },
            queueWait: function () {
                queue[queue.length] = {type: "wait", args: [].slice.call(arguments)};
                return instanceAPI;
            },
            runQueue: function () {
                var $L = instanceAPI, len = queue.length, i = len, val;
                for (; --i >= 0;) {
                    val = queue.shift();
                    $L = $L[val.type].apply(null, val.args);
                }
                return $L;
            },

            // rollback `[global].$LAB` to what it was before this file was loaded, the return this current instance of $LAB
            noConflict: function () {
                global.$LAB = _$LAB;
                return instanceAPI;
            },

            // create another clean instance of $LAB
            sandbox: function () {
                return create_sandbox();
            }
        };

        return instanceAPI;
    }

    // create the main instance of $LAB
    global.$LAB = create_sandbox();


    /* The following "hack" was suggested by Andrea Giammarchi and adapted from: http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
     NOTE: this hack only operates in FF and then only in versions where document.readyState is not present (FF < 3.6?).

     The hack essentially "patches" the **page** that LABjs is loaded onto so that it has a proper conforming document.readyState, so that if a script which does
     proper and safe dom-ready detection is loaded onto a page, after dom-ready has passed, it will still be able to detect this state, by inspecting the now hacked
     document.readyState property. The loaded script in question can then immediately trigger any queued code executions that were waiting for the DOM to be ready.
     For instance, jQuery 1.4+ has been patched to take advantage of document.readyState, which is enabled by this hack. But 1.3.2 and before are **not** safe or
     fixed by this hack, and should therefore **not** be lazy-loaded by script loader tools such as LABjs.
     */
    (function (addEvent, domLoaded, handler) {
        if (document.readyState == null && document[addEvent]) {
            document.readyState = "loading";
            document[addEvent](domLoaded, handler = function () {
                document.removeEventListener(domLoaded, handler, false);
                document.readyState = "complete";
            }, false);
        }
    })("addEventListener", "DOMContentLoaded");

    var head = document.head || document.getElementsByTagName('head')[0];
    var styleSheets = document.styleSheets;
    var env = getEnv(); //获取用户代理信息，为浏览器差异化加载提供判断依据
    var queue = []; //CSS加载队列
    /*
     @格式1 queue队列内元素格式
     {
     urls: ['a.css', 'b.css', 'd.css'],
     callback: function(param){},  //urls里面所有CSS文件加载完成后的回调方法，可选
     obj: {age:24} //callback回调方法传入的实参
     }
     */

    /**
     * @private
     * @description 获取元素下标
     */
    function indexOf(arr, ele) {
        var ret = -1;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == ele) ret = i;
        }
        return ret;
    }

    /**
     * @private
     * @description 返回用户浏览器代理信息，为判断不同浏览器提供依据
     * @return {Object} 格式见内部代码
     */
    function getEnv() {
        var ua = navigator.userAgent;
        var env = {};

        (env.webkit = /AppleWebKit\//.test(ua))
        || (env.ie = /MSIE/.test(ua))
        || (env.opera = /Opera/.test(ua))
        || (env.gecko = /Gecko\//.test(ua))
        || (env.unknown = true);

        return env;
    }

    /**
     * @private
     * @description gecko内核的浏览器轮询检测方法
     * 参考：http://www.zachleat.com/web/2010/07/29/load-css-dynamically/
     * @param {HTMLElement} node style节点，node.nodeName == 'STYLE'
     * @param {Object} queueObj 见@格式1
     */
    function pollGecko(node, queueObj) {
        try {
            node.sheet.cssRules;
        } catch (ex) {
            node.pollCount++;
            if (node.pollCount < 200) {
                setTimeout(function () {
                    pollGecko(node, queueObj);
                }, 50);
            } else {
                finishLoading(node.href, queueObj);  //用不用略做些延迟，防止神一样的渲染问题？？
            }
            return;
        }
        finishLoading(node.href, queueObj);
    }

    /**
     * @private
     * @description webkit内核的浏览器轮询检测方法
     * @param {HTMLElement} node link节点，node.nodeName == 'LINK'
     * @param {Object} queueObj 见@格式1
     */
    function pollWebKit(node, queueObj) {
        for (var i = styleSheets.length; i > 0; i--) {
            if (styleSheets[i - 1].href === node.href) {
                finishLoading(node.href, queueObj);
                return;
            }
        }
        node.pollCount++; //轮询次数加1
        if (node.pollCount < 200) {
            setTimeout(function () {
                pollWebKit(node, queueObj);
            }, 50);
        } else {
            finishLoading(node.href, queueObj);
        }
    }

    //检查css加载是否成功
    function checkSucc(className, attr, value) {
        var div = document.createElement('div');
        div.style.cssText += 'height:0; line-height:0; visibility:hidden;';
        div.className = className;
        document.body.appendChild(div);
        return getComputedStyle(div, attr) == value;
    }

    /**
     * @description 获取节点样式值——只能获取比较简单的样式的值，一些兼容性问题不是重点，在这里不做处理，有兴趣可以看下jquery源码
     * @param {HTMLElement} node dom节点
     * @param {String} attr 样式名字，如display、visibility等
     */
    function getComputedStyle(node, attr) {
        var getComputedStyle = window.getComputedStyle;
        if (getComputedStyle) {
            return getComputedStyle(node, null)[attr];
        } else if (node.currentStyle) {
            return node.currentStyle[attr];
        } else {
            return node.style[attr];
        }
    }

    /**
     * @private
     * @description url对应的CSS文件加载完成时的回调（404也包括在内）
     * @param {String} url CSS文件的url
     * @param {Object} queueObj 见@格式1
     */
    function finishLoading(url, queueObj) {
        var index = indexOf(queueObj.urls, url);
        queueObj.urls.splice(index, 1);
        if (!queueObj.urls.length) {
            queueObj.callback(queueObj.obj);
            index = indexOf(queue, queueObj);
            queue.splice(index, 1);
        }
    }

    /**
     * @description 加载CSS的方法
     * @param {Array} urls 加载的CSS文件名队列
     * @param {Function} [callback] CSS文件队列全部加载完的回调
     * @param {Object} obj callback的参数
     * @param {Object} context
     * @return {Undefined}
     */
    function _loadCSS(urls, callback, obj) {
        var queueObj = {
            urls: urls,
            callback: callback,
            obj: obj
        }
        queue.push(queueObj);
        var pendingUrls = queueObj.urls;
        for (var i = 0, len = pendingUrls.length; i < len; ++i) {
            var url = pendingUrls[i];
            var node;
            if (env.gecko) {
                node = document.createElement('style');
            } else {
                node = document.createElement('link');
                node.rel = 'stylesheet';
                node.href = url;
            }
            //node.setAttribute('charset', 'utf-8');  //设不设置有木有影响，持保留态度
            if (env.gecko || env.webkit) {  //老版本webkit、gecko不支持onload
                node.pollCount = 0;
                queueObj.urls[i] = node.href; //轮询判断的时候用到，因为不同浏览器里面取到的node.href值会不一样，有的只有文件名，有的是完整文件名？（相对路径、绝对路径）
                if (env.webkit) {  //之所以要用轮询，后面讨论，@TODO: 新版本的webkit已经支持onload、onerror，优化下？
                    pollWebKit(node, queueObj);
                } else {
                    node.innerHTML = '@import "' + url + '";';  //为什么这样做，猛点击这里：http://www.phpied.com/when-is-a-stylesheet-really-loaded/
                    pollGecko(node, queueObj);
                }
            } else {
                node.onload = node.onerror = function () {
                    finishLoading(this.href, queueObj);
                };
            }
            head.appendChild(node);
        }
    }


    /**
     * @private
     * @description 处理js加载队列
     * @param {Array} queue 加载的JS队列
     * @param {Object} 详见@格式2
     * @return {Undefined}
     */
    function _handleQueue(queue, options) {
        var moduleArr = options.module, length = moduleArr.length;
        for (var i = 0; i < length; i++) {
            if (typeof(moduleArr[i]) == "object") {
                queue.push(moduleArr[i]);
            } else {
                queue.push([moduleArr[i]]);
            }
        }
    }

    /**
     * @private
     * @description 处理模板配置
     * @param {Array} queue 加载的JS队列
     * @param {Object} 详见@格式2
     * @return {Undefined}
     */
    function _handletemplate(queue, options) {
        var templateQueue = RX.config.template[options.template], length = templateQueue.length;
        if (templateQueue) {
            for (var i = 0; i < length; i++) {
                queue.push(templateQueue[i]);
            }
        }
    }

    /**
     * @private
     * @description 获取Js别名对应的详细地址
     * @param {String} alias 别名
     * @return {String} 详细地址
     */
    function _handleAlias(alias) {
        var tLocation = RX.config.alias[alias];
        tLocation = tLocation ? tLocation : alias;
        if (!RX.browser.canCache) {
            if (tLocation.indexOf("?") > -1) {
                tLocation = tLocation + "&r=" + Math.random();
            } else {
                tLocation = tLocation + "?r=" + Math.random();
            }
        }
        return tLocation;
    }

    /**
     * @private
     * @description 获取Css别名对应的详细地址
     * @param {String} alias 别名
     * @return {String} 详细地址
     */
    function _handleCssAlias(alias) {
        var tLocation = RX.config.cssAlias[alias];
        tLocation = tLocation ? tLocation : alias;
        if (!RX.browser.canCache) {
            if (tLocation.indexOf("?") > -1) {
                tLocation = tLocation + "&r=" + Math.random();
            } else {
                tLocation = tLocation + "?r=" + Math.random();
            }
        }
        return tLocation;
    }

    /**
     * @private
     * @description 按照队列内容，加载js
     * @param {String} queue js队列
     * @param {Object} options 详见@格式2
     * @return {Undefined}
     */
    function _loadScript(queue, options) {
        var i = 0, l = queue.length;
        var loadstr = ["$LAB"];
        for (; i < l; i++) {
            var subqueue = queue[i], si = 0, sl = subqueue.length;
            for (; si < sl; si++) {
                var turl = RX.handlePath(_handleAlias(subqueue[si]));
                if (si == sl - 1) {
                    if (i == l - 1 && options.callback) {
                        loadstr.push(".script('" + turl + "').wait(options.callback)");
                        RX.browser.debug && console.log("RX.load:(script)" + turl);
                        RX.browser.debug && console.log("RX.load:wait and callback");
                    } else {
                        loadstr.push(".script('" + turl + "').wait()");
                        RX.browser.debug && console.log("RX.load:(script)" + turl);
                        RX.browser.debug && console.log("RX.load:wait");
                    }
                } else {
                    loadstr.push(".script('" + turl + "')");
                    RX.browser.debug && console.log("RX.load:(script)" + turl);
                }
            }
        }
        if (loadstr.length > 1) {
            eval(loadstr.join(""));
        }
    }

    /**
     * @private
     * @description JS文件加载入口方法
     * @param {String} queue js队列
     * @param {Object} options 详见@格式2
     * @return {Undefined}
     */
    function _loadJS(options) {
        var loadQueue = [];
        options.template && _handletemplate(loadQueue, options);
        options.module && (typeof(options.module) == "object" ? _handleQueue(loadQueue, options) : loadQueue.push([options.module]));
        _loadScript(loadQueue, options);
    }

    /*
     * 同步加载js
     * */
    function _loadBlockJS(options) {
        var loadQueue = [];
        options.template && _handletemplate(loadQueue, options);
        options.module && (typeof(options.module) == "object" ? _handleQueue(loadQueue, options) : loadQueue.push([options.module]));
        RX.loadScriptBlocked(loadQueue);
    }

    // 阻塞式加载css脚本文件
    RX.loadCssBlocked = function (urls, hasHandleTag) {
        if (urls) {
            if (typeof(urls) == "object") {
                for (var i = 0; i < urls.length; i++) {
                    document.write('<link rel="stylesheet" href="' + (hasHandleTag ? urls[i] : RX.handlePath(_handleCssAlias(urls[i]))) + '"/>');
                }
            } else if (typeof(urls) == "string") {
                document.write('<link rel="stylesheet" href="' + (hasHandleTag ? urls : RX.handlePath(_handleCssAlias(urls))) + '"/>');
            }
        }
    }

    /*
     @格式1 queue队列内元素格式
     {
     urls: ['a.css', 'b.css', 'd.css'],
     callback: function(param){},  //urls里面所有CSS文件加载完成后的回调方法，可选
     obj: {age:24} //callback回调方法传入的实参
     }
     */
    /**
     * @public
     * @description 加载CSS
     * @param {Object} 加载CSS参数，详见@格式1
     * @return {Object} RX 链式调用
     */
    RX.loadCSS = function (options) {
        RX.handleSrc();
        var loadQueue = [];
        options.template && (loadQueue = loadQueue.concat(RX.config.cssTemplate[options.template]));
        if (options.module) {
            if (typeof(options.module) == "object") {
                loadQueue = loadQueue.concat(options.module)
            } else {
                loadQueue.push(options.module);
            }
        }
        var length = loadQueue.length;
        for (var i = 0; i < length; i++) {
            loadQueue[i] = RX.handlePath(_handleCssAlias(loadQueue[i]));
        }
        if (options.async) {
            _loadCSS([].concat(loadQueue), options.callback || function () {
                }, options.obj || {});
        } else {
            RX.loadCssBlocked([].concat(loadQueue), true);
        }
        return RX;
    };

    /*
     @格式2 js加载参数格式
     {
     template: 'grid',  //按模板加载JS文件，优先处理，可选
     module: ['a.js', 'b.js', 'd.js'],  //待加载的js队列，可为js地址，也可为别名注册的名称，可选
     callback: function(){}  //所有JS文件加载完成后的回调方法，可选
     }
     */
    /**
     * @public
     * @description 加载JS
     * @param {Object} 加载JS参数，详见@格式2
     * @return {Object} RX 链式调用
     */
    RX.load = function (options) {
        if (!options || typeof(options) != "object") {
            RX.browser.debug && console.log("RX.load:参数异常");
            return;
        }
        if (options.async == false) {
            _loadBlockJS(options);
        } else {
            _loadJS(options);
        }
        return RX;
    };

    RX.fixPng = function (str) {
        str = str || '*';
        RX.load({
            module: "pngFix", callback: function () {
                $(function () {
                    if (isIE6) {         //IE6
                        DD_belatedPNG.fix(str);
                    }
                })
            }
        });
    };

    String.prototype.endWith = function (s) {
        if (s == null || s == "" || this.length == 0 || s.length > this.length)
            return false;
        if (this.substring(this.length - s.length) == s)
            return true;
        else
            return false;
        return true;
    }
    String.prototype.startWith = function (s) {
        if (s == null || s == "" || this.length == 0 || s.length > this.length)
            return false;
        if (this.substr(0, s.length) == s)
            return true;
        else
            return false;
        return true;
    }

    //处理路径
    RX.handlePath = function (url) {
        if (url) {
            var us = url.toString().split("|");
            if (us.length == 3) {
                if (us[1] != "") {
                    var withPath = RX.config.paths[us[1]];
                    var resultUrl = us[0] || "";
                    if (!us[0] || us[0].charAt(us[0].length - 1) != "/") {
                        resultUrl += "/";
                    }
                    resultUrl += withPath || "";
                    if (us[2] && us[2].charAt(0) != "/") {
                        resultUrl += "/";
                    }
                    resultUrl += us[2] || "";
                    return resultUrl;
                }
            } else {
                var surl = url.toString();
                var withPath = RX.config.ctxPath;
                if (withPath && surl.charAt(0) == "/") {
                    if (!surl.startWith("/" + withPath + "/")) {
                        return "/" + withPath + surl;
                    }
                }
                return surl;
            }
        }
        return "";
    }

    //处理src
    RX.fixSrc = function (obj) {
        if (obj && obj.getAttribute("_srcFixed") != "1") {
            var osrc = obj.getAttribute("src");
            if (osrc) {
                obj.src = RX.handlePath(osrc);
                obj.setAttribute("_srcFixed", "1");
            }
        }
    };

    //页面加载后img与iframe的真实路径处理
    RX.handleSrc = function () {
        window.onload = function () {
            var imgs = window.document.getElementsByTagName("img");
            for (var i = 0; i < imgs.length; i++) {
                var osrc = imgs[i].getAttribute("src");
                if (osrc) {
                    var osrc2 = RX.handlePath(osrc);
                    if (osrc2 != osrc) {
                        imgs[i].src = osrc2;
                    }
                } else {
                    var tsrc = imgs[i].getAttribute("basesrc");
                    if (tsrc) {
                        var tsrc2 = RX.handlePath(tsrc);
                        if (tsrc2 != tsrc) {
                            imgs[i].src = tsrc2;
                        }
                    }
                }
            }

            var atags = window.document.getElementsByTagName("a");
            for (var i = 0; i < atags.length; i++) {
                var osrc = atags[i].getAttribute("href");
                if (osrc) {
                    var osrc2 = RX.handlePath(osrc);
                    if (osrc2 != osrc) {
                        atags[i].href = osrc2;
                    }
                } else {
                    var tsrc = atags[i].getAttribute("basehref");
                    if (tsrc) {
                        var tsrc2 = RX.handlePath(tsrc);
                        if (tsrc2 != tsrc) {
                            atags[i].href = tsrc2;
                        }
                    }
                }
            }

            var frames = window.document.getElementsByTagName("iframe");
            for (var i = 0; i < frames.length; i++) {
                var osrc = frames[i].getAttribute("src");
                if (osrc) {
                    var osrc2 = RX.handlePath(osrc);
                    if (osrc2 != osrc) {
                        frames[i].src = osrc2;
                    }
                } else {
                    var tsrc = frames[i].getAttribute("basesrc");
                    if (tsrc) {
                        var tsrc2 = RX.handlePath(tsrc);
                        if (tsrc2 != tsrc) {
                            frames[i].src = tsrc2;
                        }
                    }
                }
            }
        }
    }

    // 阻塞式加载js脚本文件
    RX.loadScriptBlocked = function (urls) {
        if (urls) {
            if (typeof(urls) == "object") {
                for (var i = 0; i < urls.length; i++) {
                    document.write('<script type="text/javascript" src="' + RX.handlePath(_handleAlias(urls[i])) + '"></script>');
                }
            } else if (typeof(urls) == "string") {
                document.write('<script type="text/javascript" src="' + RX.handlePath(_handleAlias(urls)) + '"></script>');
            }
        }
    }

    //操作代码
    //加载默认库js
    RX.loadScriptBlocked(RX.config.defaultLib);
})(this);


