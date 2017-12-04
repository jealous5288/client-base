(function ($, undefined) {
    $.om = $.om || {};
    if ($.om.version) {
        return;
    }
    $.extend($.om, {version:"2.0", keyCode:{TAB:9, ENTER:13, ESCAPE:27, SPACE:32, LEFT:37, UP:38, RIGHT:39, DOWN:40}, lang:{_get:function (options, comp, attr) {
        return options[attr] ? options[attr] : $.om.lang[comp][attr];
    }}});
    $.fn.extend({propAttr:$.fn.prop || $.fn.attr, _oldFocus:$.fn.focus, focus:function (delay, fn) {
        return typeof delay === "number" ? this.each(function () {
            var elem = this;
            setTimeout(function () {
                $(elem).focus();
                if (fn) {
                    fn.call(elem);
                }
            }, delay);
        }) : this._oldFocus.apply(this, arguments);
    }, scrollParent:function () {
        var scrollParent;
        if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
            scrollParent = this.parents().filter(
                function () {
                    return(/(relative|absolute|fixed)/).test($.curCSS(this, 'position', 1)) && (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1));
                }).eq(0);
        } else {
            scrollParent = this.parents().filter(
                function () {
                    return(/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1));
                }).eq(0);
        }
        return(/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
    }, zIndex:function (zIndex) {
        if (zIndex !== undefined) {
            return this.css("zIndex", zIndex);
        }
        if (this.length) {
            var elem = $(this[0]), position, value;
            while (elem.length && elem[0] !== document) {
                position = elem.css("position");
                if (position === "absolute" || position === "relative" || position === "fixed") {
                    value = parseInt(elem.css("zIndex"), 10);
                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }
                elem = elem.parent();
            }
        }
        return 0;
    }, disableSelection:function () {
        return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".om-disableSelection", function (event) {
            event.preventDefault();
        });
    }, enableSelection:function () {
        return this.unbind(".om-disableSelection");
    }});
    $.each(["Width", "Height"], function (i, name) {
        var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], type = name.toLowerCase(), orig = {innerWidth:$.fn.innerWidth, innerHeight:$.fn.innerHeight, outerWidth:$.fn.outerWidth, outerHeight:$.fn.outerHeight};

        function reduce(elem, size, border, margin) {
            $.each(side, function () {
                size -= parseFloat($.curCSS(elem, "padding" + this, true)) || 0;
                if (border) {
                    size -= parseFloat($.curCSS(elem, "border" + this + "Width", true)) || 0;
                }
                if (margin) {
                    size -= parseFloat($.curCSS(elem, "margin" + this, true)) || 0;
                }
            });
            return size;
        }

        $.fn["inner" + name] = function (size) {
            if (size === undefined) {
                return orig["inner" + name].call(this);
            }
            return this.each(function () {
                $(this).css(type, reduce(this, size) + "px");
            });
        };
        $.fn["outer" + name] = function (size, margin) {
            if (typeof size !== "number") {
                return orig["outer" + name].call(this, size);
            }
            return this.each(function () {
                $(this).css(type, reduce(this, size, true, margin) + "px");
            });
        };
    });
    function focusable(element, isTabIndexNotNaN) {
        var nodeName = element.nodeName.toLowerCase();
        if ("area" === nodeName) {
            var map = element.parentNode, mapName = map.name, img;
            if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
                return false;
            }
            img = $("img[usemap=#" + mapName + "]")[0];
            return!!img && visible(img);
        }
        return(/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" == nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element);
    }

    function visible(element) {
        return!$(element).parents().andSelf().filter(
            function () {
                return $.curCSS(this, "visibility") === "hidden" || $.expr.filters.hidden(this);
            }).length;
    }

    $.extend($.expr[":"], {data:function (elem, i, match) {
        return!!$.data(elem, match[3]);
    }, focusable:function (element) {
        return focusable(element, !isNaN($.attr(element, "tabindex")));
    }, tabbable:function (element) {
        var tabIndex = $.attr(element, "tabindex"), isTabIndexNaN = isNaN(tabIndex);
        return(isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
    }});
    $(function () {
        var body = document.body, div = body.appendChild(div = document.createElement("div"));
        $.extend(div.style, {minHeight:"100px", height:"auto", padding:0, borderWidth:0});
        $.support.minHeight = div.offsetHeight === 100;
        $.support.selectstart = "onselectstart"in div;
        body.removeChild(div).style.display = "none";
    });
    $.extend($.om, {plugin:{add:function (module, option, set) {
        var proto = $.om[module].prototype;
        for (var i in set) {
            proto.plugins[i] = proto.plugins[i] || [];
            proto.plugins[i].push([option, set[i]]);
        }
    }, call:function (instance, name, args) {
        var set = instance.plugins[name];
        if (!set || !instance.element[0].parentNode) {
            return;
        }
        for (var i = 0; i < set.length; i++) {
            if (instance.options[set[i][0]]) {
                set[i][1].apply(instance.element, args);
            }
        }
    }}});
})(jQuery);
(function ($, undefined) {
    if ($.cleanData) {
        var _cleanData = $.cleanData;
        $.cleanData = function (elems) {
            for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                $(elem).triggerHandler("om-remove");
            }
            _cleanData(elems);
        };
    }
    $.omWidget = function (name, base, prototype) {
        var namespace = name.split(".")[0], fullName;
        name = name.split(".")[1];
        fullName = namespace + "-" + name;
        if (!prototype) {
            prototype = base;
            base = $.OMWidget;
        }
        $.expr[":"][fullName] = function (elem) {
            return!!$.data(elem, name);
        };
        $[namespace] = $[namespace] || {};
        $[namespace][name] = function (options, element) {
            if (arguments.length) {
                this._createWidget(options, element);
            }
        };
        var basePrototype = new base();
        basePrototype.options = $.extend(true, {}, basePrototype.options);
        $[namespace][name].prototype = $.extend(true, basePrototype, {namespace:namespace, widgetName:name, widgetEventPrefix:$[namespace][name].prototype.widgetEventPrefix || name, widgetBaseClass:fullName}, prototype);
        $.omWidget.bridge(name, $[namespace][name]);
    };
    $.omWidget.bridge = function (name, object) {
        $.fn[name] = function (options) {
            var isMethodCall = typeof options === "string", args = Array.prototype.slice.call(arguments, 1), returnValue = this;
            options = !isMethodCall && args.length ? $.extend.apply(null, [true, options].concat(args)) : options;
            if (isMethodCall && options.charAt(0) === "_") {
                return returnValue;
            }
            if (isMethodCall) {
                this.each(function () {
                    var instance = $.data(this, name);
                    if (options == 'options') {
                        returnValue = instance && instance.options;
                        return false;
                    } else {
                        var methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : instance;
                        if (methodValue !== instance && methodValue !== undefined) {
                            returnValue = methodValue;
                            return false;
                        }
                    }
                });
            } else {
                this.each(function () {
                    var instance = $.data(this, name);
                    if (instance) {
                        instance._setOptions(options || {});
                        $.extend(instance.options, options);
                        $(instance.beforeInitListeners).each(function () {
                            this.call(instance);
                        });
                        instance._init();
                        $(instance.initListeners).each(function () {
                            this.call(instance);
                        });
                    } else {
                        $.data(this, name, new object(options, this));
                    }
                });
            }
            return returnValue;
        };
    };
    $.omWidget.addCreateListener = function (name, fn) {
        var temp = name.split(".");
        $[temp[0]][temp[1]].prototype.createListeners.push(fn);
    };
    $.omWidget.addInitListener = function (name, fn) {
        var temp = name.split(".");
        $[temp[0]][temp[1]].prototype.initListeners.push(fn);
    };
    $.omWidget.addBeforeInitListener = function (name, fn) {
        var temp = name.split(".");
        $[temp[0]][temp[1]].prototype.beforeInitListeners.push(fn);
    };
    $.OMWidget = function (options, element) {
        this.createListeners = [];
        this.initListeners = [];
        this.beforeInitListeners = [];
        if (arguments.length) {
            this._createWidget(options, element);
        }
    };
    $.OMWidget.prototype = {widgetName:"widget", widgetEventPrefix:"", options:{disabled:false}, _createWidget:function (options, element) {
        $.data(element, this.widgetName, this);
        this.element = $(element);
        this.options = $.extend(true, {}, this.options, this._getCreateOptions(), options);
        var self = this;
        this.element.bind("om-remove._" + this.widgetName, function () {
            self.destroy();
        });
        this._create();
        $(this.createListeners).each(function () {
            this.call(self);
        });
        this._trigger("create");
        $(this.beforeInitListeners).each(function () {
            this.call(self);
        });
        this._init();
        $(this.initListeners).each(function () {
            this.call(self);
        });
    }, _getCreateOptions:function () {
        return $.metadata && $.metadata.get(this.element[0])[this.widgetName];
    }, _create:function () {
    }, _init:function () {
    }, destroy:function () {
        this.element.unbind("." + this.widgetName).removeData(this.widgetName);
        this.widget().unbind("." + this.widgetName);
    }, widget:function () {
        return this.element;
    }, option:function (key, value) {
        var options = key;
        if (arguments.length === 0) {
            return $.extend({}, this.options);
        }
        if (typeof key === "string") {
            if (value === undefined) {
                return this.options[key];
            }
            options = {};
            options[key] = value;
        }
        this._setOptions(options);
        return this;
    }, _setOptions:function (options) {
        var self = this;
        $.each(options, function (key, value) {
            self._setOption(key, value);
        });
        return this;
    }, _setOption:function (key, value) {
        this.options[key] = value;
        return this;
    }, _trigger:function (type, event) {
        var callback = this.options[type];
        event = $.Event(event);
        event.type = type;
        if (event.originalEvent) {
            for (var i = $.event.props.length, prop; i;) {
                prop = $.event.props[--i];
                event[prop] = event.originalEvent[prop];
            }
        }
        var newArgs = [], argLength = arguments.length;
        for (var i = 2; i < argLength; i++) {
            newArgs[i - 2] = arguments[i];
        }
        if (argLength > 1) {
            newArgs[argLength - 2] = arguments[1];
        }
        return!($.isFunction(callback) && callback.apply(this.element, newArgs) === false || event.isDefaultPrevented());
    }};
})(jQuery);
(function ($, undefined) {
    $.omWidget("om.omMouse", {options:{cancel:':input,option', distance:1, delay:0}, _mouseInit:function () {
        var self = this;
        this.element.bind('mousedown.' + this.widgetName,
            function (event) {
                return self._mouseDown(event);
            }).bind('click.' + this.widgetName, function (event) {
            if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
                $.removeData(event.target, self.widgetName + '.preventClickEvent');
                event.stopImmediatePropagation();
                return false;
            }
        });
        this.started = false;
    }, _mouseDestroy:function () {
        this.element.unbind('.' + this.widgetName);
    }, _mouseDown:function (event) {
        event.originalEvent = event.originalEvent || {};
        if (event.originalEvent.mouseHandled) {
            return;
        }
        (this._mouseStarted && this._mouseUp(event));
        this._mouseDownEvent = event;
        var self = this, btnIsLeft = (event.which == 1), elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).closest(this.options.cancel).length : false);
        if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
            return true;
        }
        this.mouseDelayMet = !this.options.delay;
        if (!this.mouseDelayMet) {
            this._mouseDelayTimer = setTimeout(function () {
                self.mouseDelayMet = true;
            }, this.options.delay);
        }
        if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
            this._mouseStarted = (this._mouseStart(event) !== false);
            if (!this._mouseStarted) {
                event.preventDefault();
                return true;
            }
        }
        if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
            $.removeData(event.target, this.widgetName + '.preventClickEvent');
        }
        this._mouseMoveDelegate = function (event) {
            return self._mouseMove(event);
        };
        this._mouseUpDelegate = function (event) {
            return self._mouseUp(event);
        };
        $(document).bind('mousemove.' + this.widgetName, this._mouseMoveDelegate).bind('mouseup.' + this.widgetName, this._mouseUpDelegate);
        event.preventDefault();
        event.originalEvent.mouseHandled = true;
        return true;
    }, _mouseMove:function (event) {
        if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
            return this._mouseUp(event);
        }
        if (this._mouseStarted) {
            this._mouseDrag(event);
            return event.preventDefault();
        }
        if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
            this._mouseStarted = (this._mouseStart(this._mouseDownEvent, event) !== false);
            (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
        }
        return!this._mouseStarted;
    }, _mouseUp:function (event) {
        $(document).unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate).unbind('mouseup.' + this.widgetName, this._mouseUpDelegate);
        if (this._mouseStarted) {
            this._mouseStarted = false;
            if (event.target == this._mouseDownEvent.target) {
                $.data(event.target, this.widgetName + '.preventClickEvent', true);
            }
            this._mouseStop(event);
        }
        return false;
    }, _mouseDistanceMet:function (event) {
        return(Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance);
    }, _mouseDelayMet:function (event) {
        return this.mouseDelayMet;
    }, _mouseStart:function (event) {
    }, _mouseDrag:function (event) {
    }, _mouseStop:function (event) {
    }, _mouseCapture:function (event) {
        return true;
    }});
})(jQuery);
(function ($, undefined) {
    $.om = $.om || {};
    var horizontalPositions = /left|center|right/, verticalPositions = /top|center|bottom/, center = "center", _position = $.fn.position, _offset = $.fn.offset;
    $.fn.position = function (options) {
        if (!options || !options.of) {
            return _position.apply(this, arguments);
        }
        options = $.extend({}, options);
        var target = $(options.of), targetElem = target[0], collision = (options.collision || "flip").split(" "), offset = options.offset ? options.offset.split(" ") : [0, 0], targetWidth, targetHeight, basePosition;
        if (targetElem.nodeType === 9) {
            targetWidth = target.width();
            targetHeight = target.height();
            basePosition = {top:0, left:0};
        } else if (targetElem.setTimeout) {
            targetWidth = target.width();
            targetHeight = target.height();
            basePosition = {top:target.scrollTop(), left:target.scrollLeft()};
        } else if (targetElem.preventDefault) {
            options.at = "left top";
            targetWidth = targetHeight = 0;
            basePosition = {top:options.of.pageY, left:options.of.pageX};
        } else {
            targetWidth = target.outerWidth();
            targetHeight = target.outerHeight();
            basePosition = target.offset();
        }
        $.each(["my", "at"], function () {
            var pos = (options[this] || "").split(" ");
            if (pos.length === 1) {
                pos = horizontalPositions.test(pos[0]) ? pos.concat([center]) : verticalPositions.test(pos[0]) ? [center].concat(pos) : [center, center];
            }
            pos[0] = horizontalPositions.test(pos[0]) ? pos[0] : center;
            pos[1] = verticalPositions.test(pos[1]) ? pos[1] : center;
            options[this] = pos;
        });
        if (collision.length === 1) {
            collision[1] = collision[0];
        }
        offset[0] = parseInt(offset[0], 10) || 0;
        if (offset.length === 1) {
            offset[1] = offset[0];
        }
        offset[1] = parseInt(offset[1], 10) || 0;
        if (options.at[0] === "right") {
            basePosition.left += targetWidth;
        } else if (options.at[0] === center) {
            basePosition.left += targetWidth / 2;
        }
        if (options.at[1] === "bottom") {
            basePosition.top += targetHeight;
        } else if (options.at[1] === center) {
            basePosition.top += targetHeight / 2;
        }
        basePosition.left += offset[0];
        basePosition.top += offset[1];
        return this.each(function () {
            var elem = $(this), elemWidth = elem.outerWidth(), elemHeight = elem.outerHeight(), marginLeft = parseInt($.curCSS(this, "marginLeft", true)) || 0, marginTop = parseInt($.curCSS(this, "marginTop", true)) || 0, collisionWidth = elemWidth + marginLeft +
                (parseInt($.curCSS(this, "marginRight", true)) || 0), collisionHeight = elemHeight + marginTop +
                (parseInt($.curCSS(this, "marginBottom", true)) || 0), position = $.extend({}, basePosition), collisionPosition;
            if (options.my[0] === "right") {
                position.left -= elemWidth;
            } else if (options.my[0] === center) {
                position.left -= elemWidth / 2;
            }
            if (options.my[1] === "bottom") {
                position.top -= elemHeight;
            } else if (options.my[1] === center) {
                position.top -= elemHeight / 2;
            }
            position.left = Math.round(position.left);
            position.top = Math.round(position.top);
            collisionPosition = {left:position.left - marginLeft, top:position.top - marginTop};
            $.each(["left", "top"], function (i, dir) {
                if ($.om.omPosition[collision[i]]) {
                    $.om.omPosition[collision[i]][dir](position, {targetWidth:targetWidth, targetHeight:targetHeight, elemWidth:elemWidth, elemHeight:elemHeight, collisionPosition:collisionPosition, collisionWidth:collisionWidth, collisionHeight:collisionHeight, offset:offset, my:options.my, at:options.at});
                }
            });
            if ($.fn.bgiframe) {
                elem.bgiframe();
            }
            elem.offset($.extend(position, {using:options.using}));
        });
    };
    $.om.omPosition = {fit:{left:function (position, data) {
        var win = $(window), over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
        position.left = over > 0 ? position.left - over : Math.max(position.left - data.collisionPosition.left, position.left);
    }, top:function (position, data) {
        var win = $(window), over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
        position.top = over > 0 ? position.top - over : Math.max(position.top - data.collisionPosition.top, position.top);
    }}, flip:{left:function (position, data) {
        if (data.at[0] === center) {
            return;
        }
        var win = $(window), over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(), myOffset = data.my[0] === "left" ? -data.elemWidth : data.my[0] === "right" ? data.elemWidth : 0, atOffset = data.at[0] === "left" ? data.targetWidth : -data.targetWidth, offset = -2 * data.offset[0];
        position.left += data.collisionPosition.left < 0 ? myOffset + atOffset + offset : over > 0 ? myOffset + atOffset + offset : 0;
    }, top:function (position, data) {
        if (data.at[1] === center) {
            return;
        }
        var win = $(window), over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(), myOffset = data.my[1] === "top" ? -data.elemHeight : data.my[1] === "bottom" ? data.elemHeight : 0, atOffset = data.at[1] === "top" ? data.targetHeight : -data.targetHeight, offset = -2 * data.offset[1];
        position.top += data.collisionPosition.top < 0 ? myOffset + atOffset + offset : over > 0 ? myOffset + atOffset + offset : 0;
    }}};
    if (!$.offset.setOffset) {
        $.offset.setOffset = function (elem, options) {
            if (/static/.test($.curCSS(elem, "position"))) {
                elem.style.position = "relative";
            }
            var curElem = $(elem), curOffset = curElem.offset(), curTop = parseInt($.curCSS(elem, "top", true), 10) || 0, curLeft = parseInt($.curCSS(elem, "left", true), 10) || 0, props = {top:(options.top - curOffset.top) + curTop, left:(options.left - curOffset.left) + curLeft};
            if ('using'in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        };
        $.fn.offset = function (options) {
            var elem = this[0];
            if (!elem || !elem.ownerDocument) {
                return null;
            }
            if (options) {
                return this.each(function () {
                    $.offset.setOffset(this, options);
                });
            }
            return _offset.call(this);
        };
    }
}(jQuery));
;
(function ($, undefined) {
    $.omWidget("om.omDroppable", {widgetEventPrefix:"drop", options:{accept:'*', activeClass:false, greedy:false, hoverClass:false, _scope:'default'}, _create:function () {
        var o = this.options, accept = o.accept;
        this.isover = 0;
        this.isout = 1;
        this.accept = $.isFunction(accept) ? accept : function (d) {
            return d.is(accept);
        };
        this.proportions = {width:this.element[0].offsetWidth, height:this.element[0].offsetHeight};
        $.om.ddmanager.droppables[o._scope] = $.om.ddmanager.droppables[o._scope] || [];
        $.om.ddmanager.droppables[o._scope].push(this);
        this.element.addClass("om-droppable");
    }, destroy:function () {
        var drop = $.om.ddmanager.droppables[this.options._scope];
        for (var i = 0; i < drop.length; i++)
            if (drop[i] == this)
                drop.splice(i, 1);
        this.element.removeClass("om-droppable om-droppable-disabled").removeData("omDroppable").unbind(".droppable");
        return this;
    }, _setOption:function (key, value) {
        if (key == 'accept') {
            this.accept = $.isFunction(value) ? value : function (d) {
                return d.is(value);
            };
        }
        $.OMWidget.prototype._setOption.apply(this, arguments);
    }, _activate:function (event) {
        var draggable = $.om.ddmanager.current;
        if (this.options.activeClass)this.element.addClass(this.options.activeClass);
        (draggable && this._trigger('onDragStart', event, draggable.currentItem || draggable.element));
    }, _deactivate:function (event) {
        var draggable = $.om.ddmanager.current;
        if (this.options.activeClass)this.element.removeClass(this.options.activeClass);
    }, _over:function (event) {
        var draggable = $.om.ddmanager.current;
        if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0])return;
        if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
            if (this.options.hoverClass)this.element.addClass(this.options.hoverClass);
            this._trigger('onDragOver', event, draggable.currentItem || draggable.element);
        }
    }, _out:function (event) {
        var draggable = $.om.ddmanager.current;
        if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0])return;
        if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
            if (this.options.hoverClass)this.element.removeClass(this.options.hoverClass);
            this._trigger('onDragOut', event, draggable.currentItem || draggable.element);
        }
    }, _drop:function (event, custom) {
        var draggable = custom || $.om.ddmanager.current;
        if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0])return false;
        var childrenIntersection = false;
        this.element.find(":data(omDroppable)").not(".om-draggable-dragging").each(function () {
            var inst = $.data(this, 'omDroppable');
            if (inst.options.greedy && !inst.options.disabled && inst.options._scope == draggable.options._scope && inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element)) && $.om.intersect(draggable, $.extend(inst, {offset:inst.element.offset()}))) {
                childrenIntersection = true;
                return false;
            }
        });
        if (childrenIntersection)return false;
        if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
            if (this.options.activeClass)this.element.removeClass(this.options.activeClass);
            if (this.options.hoverClass)this.element.removeClass(this.options.hoverClass);
            this._trigger('onDrop', event, draggable.currentItem || draggable.element);
            return this.element;
        }
        return false;
    }});
    $.om.intersect = function (draggable, droppable) {
        if (!droppable.offset)return false;
        var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width, y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
        var l = droppable.offset.left, r = l + droppable.proportions.width, t = droppable.offset.top, b = t + droppable.proportions.height;
        return(l < x1 + (draggable.helperProportions.width / 2) && x2 - (draggable.helperProportions.width / 2) < r && t < y1 + (draggable.helperProportions.height / 2) && y2 - (draggable.helperProportions.height / 2) < b);
    };
    $.om.ddmanager = {current:null, droppables:{'default':[]}, prepareOffsets:function (t, event) {
        var m = $.om.ddmanager.droppables[t.options._scope] || [];
        var type = event ? event.type : null;
        var list = (t.currentItem || t.element).find(":data(omDroppable)").andSelf();
        droppablesLoop:for (var i = 0; i < m.length; i++) {
            if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element))))continue;
            for (var j = 0; j < list.length; j++) {
                if (list[j] == m[i].element[0]) {
                    m[i].proportions.height = 0;
                    continue droppablesLoop;
                }
            }
            ;
            m[i].visible = m[i].element.css("display") != "none";
            if (!m[i].visible)continue;
            if (type == "mousedown")m[i]._activate.call(m[i], event);
            m[i].offset = m[i].element.offset();
            m[i].proportions = {width:m[i].element[0].offsetWidth, height:m[i].element[0].offsetHeight};
        }
    }, drop:function (draggable, event) {
        var dropped = false;
        $.each($.om.ddmanager.droppables[draggable.options._scope] || [], function () {
            if (!this.options)return;
            if (!this.options.disabled && this.visible && $.om.intersect(draggable, this))
                dropped = dropped || this._drop.call(this, event);
            if (!this.options.disabled && this.visible && this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
                this.isout = 1;
                this.isover = 0;
                this._deactivate.call(this, event);
            }
        });
        return dropped;
    }, dragStart:function (draggable, event) {
        draggable.element.parentsUntil("body").bind("scroll.droppable", function () {
            if (!draggable.options.refreshPositions)$.om.ddmanager.prepareOffsets(draggable, event);
        });
    }, drag:function (draggable, event) {
        if (draggable.options.refreshPositions)$.om.ddmanager.prepareOffsets(draggable, event);
        $.each($.om.ddmanager.droppables[draggable.options._scope] || [], function () {
            if (this.options.disabled || this.greedyChild || !this.visible)return;
            var intersects = $.om.intersect(draggable, this);
            var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
            if (!c)return;
            var parentInstance;
            if (this.options.greedy) {
                var parent = this.element.parents(':data(omDroppable):eq(0)');
                if (parent.length) {
                    parentInstance = $.data(parent[0], 'omDroppable');
                    parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
                }
            }
            if (parentInstance && c == 'isover') {
                parentInstance['isover'] = 0;
                parentInstance['isout'] = 1;
                parentInstance._out.call(parentInstance, event);
            }
            this[c] = 1;
            this[c == 'isout' ? 'isover' : 'isout'] = 0;
            this[c == "isover" ? "_over" : "_out"].call(this, event);
            if (parentInstance && c == 'isout') {
                parentInstance['isout'] = 0;
                parentInstance['isover'] = 1;
                parentInstance._over.call(parentInstance, event);
            }
        });
    }, dragStop:function (draggable, event) {
        draggable.element.parentsUntil("body").unbind("scroll.droppable");
        if (!draggable.options.refreshPositions)$.om.ddmanager.prepareOffsets(draggable, event);
    }};
})(jQuery);
;
(function ($, undefined) {
    $.omWidget("om.omDraggable", $.om.omMouse, {widgetEventPrefix:"drag", options:{axis:false, containment:false, cursor:"auto", _scope:"default", handle:false, helper:"original", revert:false, scroll:true}, _create:function () {
        if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
            this.element[0].style.position = 'relative';
        this.element.addClass("om-draggable");
        (this.options.disabled && this.element.addClass("om-draggable-disabled"));
        this._mouseInit();
    }, destroy:function () {
        if (!this.element.data('omDraggable'))return;
        this.element.removeData("omDraggable").unbind(".draggable").removeClass("om-draggable"
            + " om-draggable-dragging"
            + " om-draggable-disabled");
        this._mouseDestroy();
        return this;
    }, _mouseCapture:function (event) {
        var o = this.options;
        if (this.helper || o.disabled || $(event.target).is('.om-resizable-handle'))
            return false;
        this.handle = this._getHandle(event);
        if (!this.handle)
            return false;
        return true;
    }, _mouseStart:function (event) {
        var o = this.options;
        this.helper = this._createHelper(event);
        this._cacheHelperProportions();
        if ($.om.ddmanager)
            $.om.ddmanager.current = this;
        this._cacheMargins();
        this.cssPosition = this.helper.css("position");
        this.scrollParent = this.helper.scrollParent();
        this.offset = this.positionAbs = this.element.offset();
        this.offset = {top:this.offset.top - this.margins.top, left:this.offset.left - this.margins.left};
        $.extend(this.offset, {click:{left:event.pageX - this.offset.left, top:event.pageY - this.offset.top}, parent:this._getParentOffset(), relative:this._getRelativeOffset()});
        this.originalPosition = this.position = this._generatePosition(event);
        this.originalPageX = event.pageX;
        this.originalPageY = event.pageY;
        if (o.containment)
            this._setContainment();
        if (this._trigger("onStart", event) === false) {
            this._clear();
            return false;
        }
        this._cacheHelperProportions();
        if ($.om.ddmanager && !o.dropBehaviour)
            $.om.ddmanager.prepareOffsets(this, event);
        this.helper.addClass("om-draggable-dragging");
        this._mouseDrag(event, true);
        if ($.om.ddmanager)$.om.ddmanager.dragStart(this, event);
        return true;
    }, _mouseDrag:function (event, noPropagation) {
        this.position = this._generatePosition(event);
        this.positionAbs = this._convertPositionTo("absolute");
        if (!noPropagation) {
            var ui = this._uiHash();
            if (this._trigger('onDrag', event, ui) === false) {
                this._mouseUp({});
                return false;
            }
            this.position = ui.position;
        }
        if (!this.options.axis || this.options.axis != "y")this.helper[0].style.left = this.position.left + 'px';
        if (!this.options.axis || this.options.axis != "x")this.helper[0].style.top = this.position.top + 'px';
        if ($.om.ddmanager)$.om.ddmanager.drag(this, event);
        return false;
    }, _mouseStop:function (event) {
        var dropped = false;
        if ($.om.ddmanager && !this.options.dropBehaviour)
            dropped = $.om.ddmanager.drop(this, event);
        if (this.dropped) {
            dropped = this.dropped;
            this.dropped = false;
        }
        if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
            return false;
        if ((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
            var self = this;
            $(this.helper).animate(this.originalPosition, 500, function () {
                if (self._trigger("onStop", event) !== false) {
                    self._clear();
                }
            });
        } else {
            if (this._trigger("onStop", event) !== false) {
                this._clear();
            }
        }
        return false;
    }, _mouseUp:function (event) {
        if ($.om.ddmanager)$.om.ddmanager.dragStop(this, event);
        return $.om.omMouse.prototype._mouseUp.call(this, event);
    }, cancel:function () {
        if (this.helper.is(".om-draggable-dragging")) {
            this._mouseUp({});
        } else {
            this._clear();
        }
        return this;
    }, _getHandle:function (event) {
        var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
        $(this.options.handle, this.element).find("*").andSelf().each(function () {
            if (this == event.target)handle = true;
        });
        return handle;
    }, _createHelper:function (event) {
        var o = this.options;
        var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);
        if (!helper.parents('body').length)
            helper.appendTo(this.element[0].parentNode);
        if (helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
            helper.css("position", "absolute");
        return helper;
    }, _getParentOffset:function () {
        this.offsetParent = this.helper.offsetParent();
        var po = this.offsetParent.offset();
        if (this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
            po.left += this.scrollParent.scrollLeft();
            po.top += this.scrollParent.scrollTop();
        }
        if ((this.offsetParent[0] == document.body) || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie))
            po = {top:0, left:0};
        return{top:po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left:po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)};
    }, _getRelativeOffset:function () {
        if (this.cssPosition == "relative") {
            var p = this.element.position();
            return{top:p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left:p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()};
        } else {
            return{top:0, left:0};
        }
    }, _cacheMargins:function () {
        this.margins = {left:(parseInt(this.element.css("marginLeft"), 10) || 0), top:(parseInt(this.element.css("marginTop"), 10) || 0), right:(parseInt(this.element.css("marginRight"), 10) || 0), bottom:(parseInt(this.element.css("marginBottom"), 10) || 0)};
    }, _cacheHelperProportions:function () {
        this.helperProportions = {width:this.helper.outerWidth(), height:this.helper.outerHeight()};
    }, _setContainment:function () {
        var o = this.options;
        if (o.containment == 'parent')o.containment = this.helper[0].parentNode;
        if (o.containment == 'document' || o.containment == 'window')this.containment = [o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left, (o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
        if (!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
            var c = $(o.containment);
            var ce = c[0];
            if (!ce)return;
            var co = c.offset();
            var over = ($(ce).css("overflow") != 'hidden');
            this.containment = [(parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0), (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0), (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
            this.relative_container = c;
        } else if (o.containment.constructor == Array) {
            this.containment = o.containment;
        }
    }, _convertPositionTo:function (d, pos) {
        if (!pos)pos = this.position;
        var mod = d == "absolute" ? 1 : -1;
        var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
        return{top:(pos.top
            + this.offset.relative.top * mod
            + this.offset.parent.top * mod
            - ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())) * mod)), left:(pos.left
            + this.offset.relative.left * mod
            + this.offset.parent.left * mod
            - ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod))};
    }, _generatePosition:function (event) {
        var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
        var pageX = event.pageX;
        var pageY = event.pageY;
        if (this.originalPosition) {
            var containment;
            if (this.containment) {
                if (this.relative_container) {
                    var co = this.relative_container.offset();
                    containment = [this.containment[0] + co.left, this.containment[1] + co.top, this.containment[2] + co.left, this.containment[3] + co.top];
                }
                else {
                    containment = this.containment;
                }
                if (event.pageX - this.offset.click.left < containment[0])pageX = containment[0] + this.offset.click.left;
                if (event.pageY - this.offset.click.top < containment[1])pageY = containment[1] + this.offset.click.top;
                if (event.pageX - this.offset.click.left > containment[2])pageX = containment[2] + this.offset.click.left;
                if (event.pageY - this.offset.click.top > containment[3])pageY = containment[3] + this.offset.click.top;
            }
        }
        return{top:(pageY
            - this.offset.click.top
            - this.offset.relative.top
            - this.offset.parent.top
            + ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())))), left:(pageX
            - this.offset.click.left
            - this.offset.relative.left
            - this.offset.parent.left
            + ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())))};
    }, _clear:function () {
        this.helper.removeClass("om-draggable-dragging");
        if (this.helper[0] != this.element[0] && !this.cancelHelperRemoval)this.helper.remove();
        this.helper = null;
        this.cancelHelperRemoval = false;
    }, _trigger:function (type, event, ui) {
        ui = ui || this._uiHash();
        $.om.plugin.call(this, type, [event, ui]);
        if (type == "onDrag")this.positionAbs = this._convertPositionTo("absolute");
        return $.OMWidget.prototype._trigger.call(this, type, event, ui);
    }, plugins:{}, _uiHash:function (event) {
        return{helper:this.helper, position:this.position, originalPosition:this.originalPosition, offset:this.positionAbs};
    }});
    $.om.plugin.add("omDraggable", "cursor", {onStart:function (ui, event) {
        var t = $('body'), o = $(this).data('omDraggable').options;
        if (t.css("cursor"))o._cursor = t.css("cursor");
        t.css("cursor", o.cursor);
    }, onStop:function (ui, event) {
        var drag = $(this).data('omDraggable');
        if (drag) {
            var o = drag.options;
            if (o._cursor)$('body').css("cursor", o._cursor);
        }
    }});
    $.om.plugin.add("omDraggable", "scroll", {onStart:function (ui, event) {
        var i = $(this).data("omDraggable");
        if (i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML')i.overflowOffset = i.scrollParent.offset();
    }, onDrag:function (ui, event) {
        var i = $(this).data("omDraggable"), o = i.options, scrolled = false, scrollSensitivity = 20, scrollSpeed = 20;
        if (i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {
            if (!o.axis || o.axis != 'x') {
                if ((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < scrollSensitivity)
                    i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + scrollSpeed; else if (event.pageY - i.overflowOffset.top < scrollSensitivity)
                    i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - scrollSpeed;
            }
            if (!o.axis || o.axis != 'y') {
                if ((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < scrollSensitivity)
                    i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + scrollSpeed; else if (event.pageX - i.overflowOffset.left < scrollSensitivity)
                    i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - scrollSpeed;
            }
        } else {
            if (!o.axis || o.axis != 'x') {
                if (event.pageY - $(document).scrollTop() < scrollSensitivity)
                    scrolled = $(document).scrollTop($(document).scrollTop() - scrollSpeed); else if ($(window).height() - (event.pageY - $(document).scrollTop()) < scrollSensitivity)
                    scrolled = $(document).scrollTop($(document).scrollTop() + scrollSpeed);
            }
            if (!o.axis || o.axis != 'y') {
                if (event.pageX - $(document).scrollLeft() < scrollSensitivity)
                    scrolled = $(document).scrollLeft($(document).scrollLeft() - scrollSpeed); else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < scrollSensitivity)
                    scrolled = $(document).scrollLeft($(document).scrollLeft() + scrollSpeed);
            }
        }
        if (scrolled !== false && $.om.ddmanager && !o.dropBehaviour)
            $.om.ddmanager.prepareOffsets(i, event);
    }});
})(jQuery);
(function ($, undefined) {
    $.omWidget("om.omResizable", $.om.omMouse, {widgetEventPrefix:"resize", options:{alsoResize:false, aspectRatio:false, autoHide:false, containment:false, handles:"e,s,se", helper:false, maxHeight:null, maxWidth:null, minHeight:10, minWidth:10, zIndex:1000}, _create:function () {
        var self = this, o = this.options;
        this.element.addClass("om-resizable");
        $.extend(this, {_aspectRatio:!!(o.aspectRatio), aspectRatio:o.aspectRatio, originalElement:this.element, _proportionallyResizeElements:[], _helper:o.helper || o.ghost || o.animate ? o.helper || 'om-resizable-helper' : null});
        if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {
            if (/relative/.test(this.element.css('position')) && $.browser.opera)
                this.element.css({position:'relative', top:'auto', left:'auto'});
            this.element.wrap($('<div class="om-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css('position'), width:this.element.outerWidth(), height:this.element.outerHeight(), top:this.element.css('top'), left:this.element.css('left')}));
            this.element = this.element.parent().data("resizable", this.element.data('resizable'));
            this.elementIsWrapper = true;
            this.element.css({marginLeft:this.originalElement.css("marginLeft"), marginTop:this.originalElement.css("marginTop"), marginRight:this.originalElement.css("marginRight"), marginBottom:this.originalElement.css("marginBottom")});
            this.originalElement.css({marginLeft:0, marginTop:0, marginRight:0, marginBottom:0});
            this.originalResizeStyle = this.originalElement.css('resize');
            this.originalElement.css('resize', 'none');
            this._proportionallyResizeElements.push(this.originalElement.css({position:'static', zoom:1, display:'block'}));
            this.originalElement.css({margin:this.originalElement.css('margin')});
            this._proportionallyResize();
        }
        this.handles = o.handles || (!$('.om-resizable-handle', this.element).length ? "e,s,se" : {n:'.om-resizable-n', e:'.om-resizable-e', s:'.om-resizable-s', w:'.om-resizable-w', se:'.om-resizable-se', sw:'.om-resizable-sw', ne:'.om-resizable-ne', nw:'.om-resizable-nw'});
        if (this.handles.constructor == String) {
            if (this.handles == 'all')this.handles = 'n,e,s,w,se,sw,ne,nw';
            var n = this.handles.split(",");
            this.handles = {};
            for (var i = 0; i < n.length; i++) {
                var handle = $.trim(n[i]), hname = 'om-resizable-' + handle;
                var axis = $('<div class="om-resizable-handle ' + hname + '"></div>');
                if (/sw|se|ne|nw/.test(handle))axis.css({zIndex:++o.zIndex});
                if ('se' == handle) {
                    axis.addClass('om-icon om-icon-gripsmall-diagonal-se');
                }
                ;
                this.handles[handle] = '.om-resizable-' + handle;
                this.element.append(axis);
            }
        }
        this._renderAxis = function (target) {
            target = target || this.element;
            for (var i in this.handles) {
                if (this.handles[i].constructor == String)
                    this.handles[i] = $(this.handles[i], this.element).show();
                if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                    var axis = $(this.handles[i], this.element), padWrapper = 0;
                    padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();
                    var padPos = ['padding', /ne|nw|n/.test(i) ? 'Top' : /se|sw|s/.test(i) ? 'Bottom' : /^e$/.test(i) ? 'Right' : 'Left'].join("");
                    target.css(padPos, padWrapper);
                    this._proportionallyResize();
                }
                if (!$(this.handles[i]).length)
                    continue;
            }
        };
        this._renderAxis(this.element);
        this._handles = $('.om-resizable-handle', this.element).disableSelection();
        this._handles.mouseover(function () {
            if (!self.resizing) {
                if (this.className)
                    var axis = this.className.match(/om-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                self.axis = axis && axis[1] ? axis[1] : 'se';
            }
        });
        if (o.autoHide) {
            this._handles.hide();
            $(this.element).addClass("om-resizable-autohide").hover(function () {
                if (o.disabled)return;
                $(this).removeClass("om-resizable-autohide");
                self._handles.show();
            }, function () {
                if (o.disabled)return;
                if (!self.resizing) {
                    $(this).addClass("om-resizable-autohide");
                    self._handles.hide();
                }
            });
        }
        this._mouseInit();
    }, destroy:function () {
        this._mouseDestroy();
        var _destroy = function (exp) {
            $(exp).removeClass("om-resizable om-resizable-disabled om-resizable-resizing").removeData("resizable").unbind(".resizable").find('.om-resizable-handle').remove();
        };
        if (this.elementIsWrapper) {
            _destroy(this.element);
            var wrapper = this.element;
            wrapper.after(this.originalElement.css({position:wrapper.css('position'), width:wrapper.outerWidth(), height:wrapper.outerHeight(), top:wrapper.css('top'), left:wrapper.css('left')})).remove();
        }
        this.originalElement.css('resize', this.originalResizeStyle);
        _destroy(this.originalElement);
        return this;
    }, _mouseCapture:function (event) {
        var handle = false;
        for (var i in this.handles) {
            if ($(this.handles[i])[0] == event.target) {
                handle = true;
            }
        }
        return!this.options.disabled && handle;
    }, _mouseStart:function (event) {
        var o = this.options, iniPos = this.element.position(), el = this.element;
        this.resizing = true;
        this.documentScroll = {top:$(document).scrollTop(), left:$(document).scrollLeft()};
        if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
            el.css({position:'absolute', top:iniPos.top, left:iniPos.left});
        }
        if ($.browser.opera && (/relative/).test(el.css('position')))
            el.css({position:'relative', top:'auto', left:'auto'});
        this._renderProxy();
        var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));
        if (o.containment) {
            curleft += $(o.containment).scrollLeft() || 0;
            curtop += $(o.containment).scrollTop() || 0;
        }
        this.offset = this.helper.offset();
        this.position = {left:curleft, top:curtop};
        this.size = this._helper ? {width:el.outerWidth(), height:el.outerHeight()} : {width:el.width(), height:el.height()};
        this.originalSize = this._helper ? {width:el.outerWidth(), height:el.outerHeight()} : {width:el.width(), height:el.height()};
        this.originalPosition = {left:curleft, top:curtop};
        this.sizeDiff = {width:el.outerWidth() - el.width(), height:el.outerHeight() - el.height()};
        this.originalMousePosition = {left:event.pageX, top:event.pageY};
        this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);
        var cursor = $('.om-resizable-' + this.axis).css('cursor');
        $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);
        el.addClass("om-resizable-resizing");
        this._propagate("start", event);
        return true;
    }, _mouseDrag:function (event) {
        var el = this.helper, o = this.options, props = {}, self = this, smp = this.originalMousePosition, a = this.axis;
        var dx = (event.pageX - smp.left) || 0, dy = (event.pageY - smp.top) || 0;
        var trigger = this._change[a];
        if (!trigger)return false;
        var data = trigger.apply(this, [event, dx, dy]), ie6 = $.browser.msie && $.browser.version < 7, csdif = this.sizeDiff;
        this._updateVirtualBoundaries(event.shiftKey);
        if (this._aspectRatio || event.shiftKey)
            data = this._updateRatio(data, event);
        data = this._respectSize(data, event);
        this._propagate("resize", event);
        el.css({top:this.position.top + "px", left:this.position.left + "px", width:this.size.width + "px", height:this.size.height + "px"});
        if (!this._helper && this._proportionallyResizeElements.length)
            this._proportionallyResize();
        this._updateCache(data);
        this._trigger('resize', event, this.ui());
        return false;
    }, _mouseStop:function (event) {
        this.resizing = false;
        var o = this.options, self = this;
        if (this._helper) {
            var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName), soffseth = ista && self._hasScroll(pr[0], 'left') ? 0 : self.sizeDiff.height, soffsetw = ista ? 0 : self.sizeDiff.width;
            var s = {width:(self.helper.width() - soffsetw), height:(self.helper.height() - soffseth)}, left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null, top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;
            if (!o.animate)
                this.element.css($.extend(s, {top:top, left:left}));
            self.helper.height(self.size.height);
            self.helper.width(self.size.width);
            if (this._helper && !o.animate)this._proportionallyResize();
        }
        $('body').css('cursor', 'auto');
        this.element.removeClass("om-resizable-resizing");
        this._propagate("stop", event);
        if (this._helper)this.helper.remove();
        return false;
    }, _updateVirtualBoundaries:function (forceAspectRatio) {
        var o = this.options, pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b;
        b = {minWidth:isNumber(o.minWidth) ? o.minWidth : 0, maxWidth:isNumber(o.maxWidth) ? o.maxWidth : Infinity, minHeight:isNumber(o.minHeight) ? o.minHeight : 0, maxHeight:isNumber(o.maxHeight) ? o.maxHeight : Infinity};
        if (this._aspectRatio || forceAspectRatio) {
            pMinWidth = b.minHeight * this.aspectRatio;
            pMinHeight = b.minWidth / this.aspectRatio;
            pMaxWidth = b.maxHeight * this.aspectRatio;
            pMaxHeight = b.maxWidth / this.aspectRatio;
            if (pMinWidth > b.minWidth)b.minWidth = pMinWidth;
            if (pMinHeight > b.minHeight)b.minHeight = pMinHeight;
            if (pMaxWidth < b.maxWidth)b.maxWidth = pMaxWidth;
            if (pMaxHeight < b.maxHeight)b.maxHeight = pMaxHeight;
        }
        this._vBoundaries = b;
    }, _updateCache:function (data) {
        var o = this.options;
        this.offset = this.helper.offset();
        if (isNumber(data.left))this.position.left = data.left;
        if (isNumber(data.top))this.position.top = data.top;
        if (isNumber(data.height))this.size.height = data.height;
        if (isNumber(data.width))this.size.width = data.width;
    }, _updateRatio:function (data, event) {
        var o = this.options, cpos = this.position, csize = this.size, a = this.axis;
        if (isNumber(data.height))data.width = (data.height * this.aspectRatio); else if (isNumber(data.width))data.height = (data.width / this.aspectRatio);
        if (a == 'sw') {
            data.left = cpos.left + (csize.width - data.width);
            data.top = null;
        }
        if (a == 'nw') {
            data.top = cpos.top + (csize.height - data.height);
            data.left = cpos.left + (csize.width - data.width);
        }
        return data;
    }, _respectSize:function (data, event) {
        var el = this.helper, o = this._vBoundaries, pRatio = this._aspectRatio || event.shiftKey, a = this.axis, ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height), isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);
        if (isminw)data.width = o.minWidth;
        if (isminh)data.height = o.minHeight;
        if (ismaxw)data.width = o.maxWidth;
        if (ismaxh)data.height = o.maxHeight;
        var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
        var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
        if (isminw && cw)data.left = dw - o.minWidth;
        if (ismaxw && cw)data.left = dw - o.maxWidth;
        if (isminh && ch)data.top = dh - o.minHeight;
        if (ismaxh && ch)data.top = dh - o.maxHeight;
        var isNotwh = !data.width && !data.height;
        if (isNotwh && !data.left && data.top)data.top = null; else if (isNotwh && !data.top && data.left)data.left = null;
        return data;
    }, _proportionallyResize:function () {
        var o = this.options;
        if (!this._proportionallyResizeElements.length)return;
        var element = this.helper || this.element;
        for (var i = 0; i < this._proportionallyResizeElements.length; i++) {
            var prel = this._proportionallyResizeElements[i];
            if (!this.borderDif) {
                var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')], p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];
                this.borderDif = $.map(b, function (v, i) {
                    var border = parseInt(v, 10) || 0, padding = parseInt(p[i], 10) || 0;
                    return border + padding;
                });
            }
            if ($.browser.msie && !(!($(element).is(':hidden') || $(element).parents(':hidden').length)))
                continue;
            prel.css({height:(element.height() - this.borderDif[0] - this.borderDif[2]) || 0, width:(element.width() - this.borderDif[1] - this.borderDif[3]) || 0});
        }
        ;
    }, _renderProxy:function () {
        var el = this.element, o = this.options;
        this.elementOffset = el.offset();
        if (this._helper) {
            this.helper = this.helper || $('<div style="overflow:hidden;"></div>');
            var ie6 = $.browser.msie && $.browser.version < 7, ie6offset = (ie6 ? 1 : 0), pxyoffset = (ie6 ? 2 : -1);
            this.helper.addClass(this._helper).css({width:this.element.outerWidth() + pxyoffset, height:this.element.outerHeight() + pxyoffset, position:'absolute', left:this.elementOffset.left - ie6offset + 'px', top:this.elementOffset.top - ie6offset + 'px', zIndex:++o.zIndex});
            this.helper.appendTo("body").disableSelection();
        } else {
            this.helper = this.element;
        }
    }, _change:{e:function (event, dx, dy) {
        return{width:this.originalSize.width + dx};
    }, w:function (event, dx, dy) {
        var o = this.options, cs = this.originalSize, sp = this.originalPosition;
        return{left:sp.left + dx, width:cs.width - dx};
    }, n:function (event, dx, dy) {
        var o = this.options, cs = this.originalSize, sp = this.originalPosition;
        return{top:sp.top + dy, height:cs.height - dy};
    }, s:function (event, dx, dy) {
        return{height:this.originalSize.height + dy};
    }, se:function (event, dx, dy) {
        return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
    }, sw:function (event, dx, dy) {
        return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
    }, ne:function (event, dx, dy) {
        return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
    }, nw:function (event, dx, dy) {
        return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
    }}, _propagate:function (n, event) {
        $.om.plugin.call(this, n, [event, this.ui()]);
        (n != "resize" && this._trigger(n, event, this.ui()));
    }, _hasScroll:function (el, a) {
        if ($(el).css("overflow") === "hidden") {
            return false;
        }
        var scroll = (a && a === "left") ? "scrollLeft" : "scrollTop", has = false;
        if (el[scroll] > 0) {
            return true;
        }
        el[scroll] = 1;
        has = (el[scroll] > 0);
        el[scroll] = 0;
        return has;
    }, plugins:{}, ui:function () {
        return{originalElement:this.originalElement, element:this.element, helper:this.helper, position:this.position, size:this.size, originalSize:this.originalSize, originalPosition:this.originalPosition};
    }});
    $.extend($.om.resizable, {version:"1.1"});
    $.om.plugin.add("omResizable", "alsoResize", {start:function (event, ui) {
        var self = $(this).data("omResizable"), o = self.options;
        var _store = function (exp) {
            $(exp).each(function () {
                var el = $(this);
                el.data("resizable-alsoresize", {width:parseInt(el.width(), 10), height:parseInt(el.height(), 10), left:parseInt(el.css('left'), 10), top:parseInt(el.css('top'), 10), position:el.css('position')});
            });
        };
        if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
            if (o.alsoResize.length) {
                o.alsoResize = o.alsoResize[0];
                _store(o.alsoResize);
            }
            else {
                $.each(o.alsoResize, function (exp) {
                    _store(exp);
                });
            }
        } else {
            _store(o.alsoResize);
        }
    }, resize:function (event, ui) {
        var self = $(this).data("omResizable"), o = self.options, os = self.originalSize, op = self.originalPosition;
        var delta = {height:(self.size.height - os.height) || 0, width:(self.size.width - os.width) || 0, top:(self.position.top - op.top) || 0, left:(self.position.left - op.left) || 0}, _alsoResize = function (exp, c) {
            $(exp).each(function () {
                var el = $(this), start = $(this).data("resizable-alsoresize"), style = {}, css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];
                $.each(css, function (i, prop) {
                    var sum = (start[prop] || 0) + (delta[prop] || 0);
                    if (sum && sum >= 0)
                        style[prop] = sum || null;
                });
                if ($.browser.opera && /relative/.test(el.css('position'))) {
                    self._revertToRelativePosition = true;
                    el.css({position:'absolute', top:'auto', left:'auto'});
                }
                el.css(style);
            });
        };
        if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
            $.each(o.alsoResize, function (exp, c) {
                _alsoResize(exp, c);
            });
        } else {
            _alsoResize(o.alsoResize);
        }
    }, stop:function (event, ui) {
        var self = $(this).data("omResizable"), o = self.options;
        var _reset = function (exp) {
            $(exp).each(function () {
                var el = $(this);
                el.css({position:el.data("resizable-alsoresize").position});
            });
        };
        if (self._revertToRelativePosition) {
            self._revertToRelativePosition = false;
            if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
                $.each(o.alsoResize, function (exp) {
                    _reset(exp);
                });
            } else {
                _reset(o.alsoResize);
            }
        }
        $(this).removeData("resizable-alsoresize");
    }});
    $.om.plugin.add("omResizable", "containment", {start:function (event, ui) {
        var self = $(this).data("omResizable"), o = self.options, el = self.element;
        var oc = o.containment, ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
        if (!ce)return;
        self.containerElement = $(ce);
        if (/document/.test(oc) || oc == document) {
            self.containerOffset = {left:0, top:0};
            self.containerPosition = {left:0, top:0};
            self.parentData = {element:$(document), left:0, top:0, width:$(document).width(), height:$(document).height() || document.body.parentNode.scrollHeight};
        }
        else {
            var element = $(ce), p = [];
            $(["Top", "Right", "Left", "Bottom"]).each(function (i, name) {
                p[i] = num(element.css("padding" + name));
            });
            self.containerOffset = element.offset();
            self.containerPosition = element.position();
            self.containerSize = {height:(element.innerHeight() - p[3]), width:(element.innerWidth() - p[1])};
            var co = self.containerOffset, ch = self.containerSize.height, cw = self.containerSize.width, width = (self._hasScroll(ce, "left") ? ce.scrollWidth : cw), height = (self._hasScroll(ce) ? ce.scrollHeight : ch);
            self.parentData = {element:ce, left:co.left, top:co.top, width:width, height:height};
        }
    }, resize:function (event, ui) {
        var self = $(this).data("omResizable"), o = self.options, ps = self.containerSize, co = self.containerOffset, cs = self.size, cp = self.position, pRatio = self._aspectRatio || event.shiftKey, cop = {top:0, left:0}, ce = self.containerElement;
        if (ce[0] != document && (/static/).test(ce.css('position')))cop = co;
        if (cp.left < (self._helper ? co.left : 0)) {
            self.size.width = self.size.width + (self._helper ? (self.position.left - co.left) : (self.position.left - cop.left));
            if (pRatio)self.size.height = self.size.width / o.aspectRatio;
            self.position.left = o.helper ? co.left : 0;
        }
        if (cp.top < (self._helper ? co.top : 0)) {
            self.size.height = self.size.height + (self._helper ? (self.position.top - co.top) : self.position.top);
            if (pRatio)self.size.width = self.size.height * o.aspectRatio;
            self.position.top = self._helper ? co.top : 0;
        }
        self.offset.left = self.parentData.left + self.position.left;
        self.offset.top = self.parentData.top + self.position.top;
        var woset = Math.abs((self._helper ? self.offset.left - cop.left : (self.offset.left - cop.left)) + self.sizeDiff.width), hoset = Math.abs((self._helper ? self.offset.top - cop.top : (self.offset.top - co.top)) + self.sizeDiff.height);
        var isParent = self.containerElement.get(0) == self.element.parent().get(0), isOffsetRelative = /relative|absolute/.test(self.containerElement.css('position'));
        if (isParent && isOffsetRelative)woset -= self.parentData.left;
        if (woset + self.size.width >= self.parentData.width) {
            self.size.width = self.parentData.width - woset;
            if (pRatio)self.size.height = self.size.width / self.aspectRatio;
        }
        if (hoset + self.size.height >= self.parentData.height) {
            self.size.height = self.parentData.height - hoset;
            if (pRatio)self.size.width = self.size.height * self.aspectRatio;
        }
    }, stop:function (event, ui) {
        var self = $(this).data("omResizable"), o = self.options, cp = self.position, co = self.containerOffset, cop = self.containerPosition, ce = self.containerElement;
        var helper = $(self.helper), ho = helper.offset(), w = helper.outerWidth() - self.sizeDiff.width, h = helper.outerHeight() - self.sizeDiff.height;
        if (self._helper && !o.animate && (/relative/).test(ce.css('position')))
            $(this).css({left:ho.left - cop.left - co.left, width:w, height:h});
        if (self._helper && !o.animate && (/static/).test(ce.css('position')))
            $(this).css({left:ho.left - cop.left - co.left, width:w, height:h});
    }});
    var num = function (v) {
        return parseInt(v, 10) || 0;
    };
    var isNumber = function (value) {
        return!isNaN(parseInt(value, 10));
    };
})(jQuery);
(function ($, undefined) {
    $.omWidget("om.sortable", $.om.omMouse, {widgetEventPrefix:"sort", options:{helper:"original", items:'> *', placeholder:false}, _create:function () {
        this.containerCache = {};
        this.element.addClass("ui-sortable");
        this.refresh();
        this.floating = this.items.length ? (/left|right/).test(this.items[0].item.css('float')) || (/inline|table-cell/).test(this.items[0].item.css('display')) : false;
        this.offset = this.element.offset();
        this._mouseInit();
    }, _mouseCapture:function (event, overrideHandle) {
        if (this.reverting) {
            return false;
        }
        if (this.options.disabled || this.options.type == 'static')return false;
        this._refreshItems(event);
        var currentItem = null, self = this, nodes = $(event.target).parents().each(function () {
            if ($.data(this, 'sortable-item') == self) {
                currentItem = $(this);
                return false;
            }
        });
        if ($.data(event.target, 'sortable-item') == self)currentItem = $(event.target);
        if (!currentItem)return false;
        this.currentItem = currentItem;
        return true;
    }, _mouseStart:function (event, overrideHandle, noActivation) {
        this.currentContainer = this;
        this.refreshPositions();
        this.helper = this._createHelper(event);
        this._cacheHelperProportions();
        this._cacheMargins();
        this.scrollParent = this.helper.scrollParent();
        this.offset = this.currentItem.offset();
        this.offset = {top:this.offset.top - this.margins.top, left:this.offset.left - this.margins.left};
        this.helper.css("position", "absolute");
        this.cssPosition = this.helper.css("position");
        $.extend(this.offset, {click:{left:event.pageX - this.offset.left, top:event.pageY - this.offset.top}, parent:this._getParentOffset(), relative:this._getRelativeOffset()});
        this.originalPosition = this._generatePosition(event);
        this.originalPageX = event.pageX;
        this.originalPageY = event.pageY;
        this.domPosition = {prev:this.currentItem.prev()[0], parent:this.currentItem.parent()[0]};
        if (this.helper[0] != this.currentItem[0]) {
            this.currentItem.hide();
        }
        this._createPlaceholder();
        this.helper.css("zIndex", 1000);
        if (this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
            this.overflowOffset = this.scrollParent.offset();
        this._trigger("start", event, this._uiHash());
        if (!this._preserveHelperProportions)
            this._cacheHelperProportions();
        this.helper.addClass("ui-sortable-helper");
        this._mouseDrag(event);
        return true;
    }, _mouseDrag:function (event) {
        this.position = this._generatePosition(event);
        this.positionAbs = this._convertPositionTo("absolute");
        if (!this.lastPositionAbs) {
            this.lastPositionAbs = this.positionAbs;
        }
        var o = this.options, scrolled = false;
        if ((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < 20)
            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + 20; else if (event.pageY - this.overflowOffset.top < 20)
            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - 20;
        if ((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < 20)
            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + 20; else if (event.pageX - this.overflowOffset.left < 20)
            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - 20;
        this.positionAbs = this._convertPositionTo("absolute");
        this.helper[0].style.left = this.position.left + 'px';
        this.helper[0].style.top = this.position.top + 'px';
        for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
            if (!intersection)continue;
            if (itemElement != this.currentItem[0] && this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement && !$.contains(this.placeholder[0], itemElement) && (this.options.type == 'semi-dynamic' ? !$.contains(this.element[0], itemElement) : true)) {
                this.direction = intersection == 1 ? "down" : "up";
                if (this._intersectsWithSides(item)) {
                    this._rearrange(event, item);
                } else {
                    break;
                }
                break;
            }
        }
        this.lastPositionAbs = this.positionAbs;
        return false;
    }, _mouseStop:function (event, noPropagation) {
        if (!event)return;
        this._clear(event, noPropagation);
        return false;
    }, _intersectsWith:function (item) {
        var x1 = this.positionAbs.left, x2 = x1 + this.helperProportions.width, y1 = this.positionAbs.top, y2 = y1 + this.helperProportions.height;
        var l = item.left, r = l + item.width, t = item.top, b = t + item.height;
        var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
        var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;
        return(l < x1 + (this.helperProportions.width / 2) && x2 - (this.helperProportions.width / 2) < r && t < y1 + (this.helperProportions.height / 2) && y2 - (this.helperProportions.height / 2) < b);
    }, _isOverAxis:function (x, reference, size) {
        return(x > reference) && (x < (reference + size));
    }, _intersectsWithPointer:function (item) {
        var isOverElementHeight = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height), isOverElementWidth = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width), isOverElement = isOverElementHeight && isOverElementWidth, verticalDirection = this._getDragVerticalDirection(), horizontalDirection = this._getDragHorizontalDirection();
        if (!isOverElement)
            return false;
        return this.floating ? (((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1) : (verticalDirection && (verticalDirection == "down" ? 2 : 1));
    }, _intersectsWithSides:function (item) {
        var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height / 2), item.height), isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width / 2), item.width), verticalDirection = this._getDragVerticalDirection(), horizontalDirection = this._getDragHorizontalDirection();
        if (this.floating && horizontalDirection) {
            return((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
        } else {
            return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
        }
    }, _getDragVerticalDirection:function () {
        var delta = this.positionAbs.top - this.lastPositionAbs.top;
        return delta != 0 && (delta > 0 ? "down" : "up");
    }, _getDragHorizontalDirection:function () {
        var delta = this.positionAbs.left - this.lastPositionAbs.left;
        return delta != 0 && (delta > 0 ? "right" : "left");
    }, refresh:function (event) {
        this._refreshItems(event);
        this.refreshPositions();
        return this;
    }, _refreshItems:function (event) {
        this.items = [];
        this.containers = [this];
        var items = this.items;
        var queries = [$(this.options.items, this.element), this];
        var targetData = queries[1];
        var _queries = queries[0];
        for (var j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
            var item = $(_queries[j]);
            item.data('sortable-item', targetData);
            items.push({item:item, instance:targetData, width:0, height:0, left:0, top:0});
        }
        ;
    }, refreshPositions:function (fast) {
        if (this.offsetParent && this.helper) {
            this.offset.parent = this._getParentOffset();
        }
        for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i];
            if (item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
                continue;
            var t = item.item;
            if (!fast) {
                item.width = t.outerWidth();
                item.height = t.outerHeight();
            }
            var p = t.offset();
            item.left = p.left;
            item.top = p.top;
        }
        ;
        return this;
    }, _createPlaceholder:function (that) {
        var self = that || this, o = self.options;
        if (!o.placeholder || o.placeholder.constructor == String) {
            var className = o.placeholder;
            o.placeholder = {element:function () {
                var el = $(document.createElement(self.currentItem[0].nodeName)).addClass(className || self.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                if (!className)
                    el.style.visibility = "hidden";
                return el;
            }};
        }
        self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));
        self.currentItem.after(self.placeholder);
    }, _createHelper:function (event) {
        var helper = this.currentItem;
        if (!helper.parents('body').length)
            $(this.currentItem[0].parentNode)[0].appendChild(helper[0]);
        this._storedCSS = {width:this.currentItem[0].style.width, height:this.currentItem[0].style.height, position:this.currentItem.css("position"), top:this.currentItem.css("top"), left:this.currentItem.css("left")};
        return helper;
    }, _getParentOffset:function () {
        this.offsetParent = this.helper.offsetParent();
        var offsetp = this.offsetParent, po = offsetp.offset();
        if (this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], offsetp[0])) {
            po.left += this.scrollParent.scrollLeft();
            po.top += this.scrollParent.scrollTop();
        }
        if ((offsetp[0] == document.body) || (offsetp[0].tagName && offsetp[0].tagName.toLowerCase() == 'html' && $.browser.msie))
            po = {top:0, left:0};
        return{top:po.top + (parseInt(offsetp.css("borderTopWidth"), 10) || 0), left:po.left + (parseInt(offsetp.css("borderLeftWidth"), 10) || 0)};
    }, _getRelativeOffset:function () {
        if (this.cssPosition == "relative") {
            var p = this.currentItem.position();
            return{top:p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left:p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()};
        } else {
            return{top:0, left:0};
        }
    }, _cacheMargins:function () {
        this.margins = {left:(parseInt(this.currentItem.css("marginLeft"), 10) || 0), top:(parseInt(this.currentItem.css("marginTop"), 10) || 0)};
    }, _cacheHelperProportions:function () {
        this.helperProportions = {width:this.helper.outerWidth(), height:this.helper.outerHeight()};
    }, _convertPositionTo:function (d, pos) {
        if (!pos)pos = this.position;
        var mod = d == "absolute" ? 1 : -1;
        var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
        return{top:(pos.top
            + this.offset.relative.top * mod
            + this.offset.parent.top * mod
            - ($.browser.safari && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())) * mod)), left:(pos.left
            + this.offset.relative.left * mod
            + this.offset.parent.left * mod
            - ($.browser.safari && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod))};
    }, _generatePosition:function (event) {
        var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
        if (this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
            this.offset.relative = this._getRelativeOffset();
        }
        var pageX = event.pageX;
        var pageY = event.pageY;
        return{top:(pageY
            - this.offset.click.top
            - this.offset.relative.top
            - this.offset.parent.top
            + ($.browser.safari && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())))), left:(pageX
            - this.offset.click.left
            - this.offset.relative.left
            - this.offset.parent.left
            + ($.browser.safari && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())))};
    }, _rearrange:function (event, i, a, hardRefresh) {
        a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));
        this.counter = this.counter ? ++this.counter : 1;
        var self = this, counter = this.counter;
        window.setTimeout(function () {
            if (counter == self.counter)self.refreshPositions(!hardRefresh);
        }, 0);
    }, _clear:function (event, noPropagation) {
        this.reverting = false;
        var delayedTriggers = [], self = this;
        if (!this._noFinalSort && this.currentItem.parent().length)this.placeholder.before(this.currentItem);
        this._noFinalSort = null;
        if (this.helper[0] == this.currentItem[0]) {
            for (var i in this._storedCSS) {
                if (this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static')this._storedCSS[i] = '';
            }
            this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
        } else {
            this.currentItem.show();
        }
        this.helper.css("zIndex", 1000);
        if (this.cancelHelperRemoval) {
            if (!noPropagation) {
                for (var i = 0; i < delayedTriggers.length; i++) {
                    delayedTriggers[i].call(this, event);
                }
                ;
                this._trigger("stop", event, this._uiHash());
            }
            return false;
        }
        this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
        if (this.helper[0] != this.currentItem[0])this.helper.remove();
        this.helper = null;
        if (!noPropagation) {
            for (var i = 0; i < delayedTriggers.length; i++) {
                delayedTriggers[i].call(this, event);
            }
            ;
            this._trigger("stop", event, this._uiHash());
        }
        this.fromOutside = false;
        return true;
    }, _trigger:function () {
        $.OMWidget.prototype._trigger.apply(this, arguments);
    }, _uiHash:function (inst) {
        var self = inst || this;
        return{helper:self.helper, placeholder:self.placeholder || $([]), position:self.position, originalPosition:self.originalPosition, offset:self.positionAbs, item:self.currentItem, sender:inst ? inst.element : null};
    }});
    $.extend($.om.sortable, {version:"1.1"});
})(jQuery);
(function ($) {
    var innerToolId = ['collapse', 'min', 'max', 'close'], innerToolCls = ['om-panel-tool-collapse', 'om-panel-tool-expand', 'om-panel-tool-min', 'om-panel-tool-max', 'om-panel-tool-close'], effects = {anim:true, speed:'fast'};
    $.omWidget("om.omPanel", {options:{title:'', width:'auto', height:'auto', header:true, collapsible:false, closable:false, closed:false, collapsed:false, tools:[], loadingMessage:"default", _closeMode:"hidden", _helpMsg:false}, _create:function () {
        this.element.addClass("om-panel-body om-widget-content").wrap("<div class='om-widget om-panel'></div>");
    }, _init:function () {
        var options = this.options, $body = this.element, $parent = $body.parent(), $header;
        this._renderHeader();
        $header = $body.prev();
        if (options.header === false) {
            $body.addClass("om-panel-noheader");
        }
        this._bindEvent();
        this._resize($parent);
        var headerHeight = options.header !== false ? $header.outerHeight() : 0;
        if (options.collapsed !== false) {
            "auto" !== options.height && $parent.height(headerHeight);
            $body.hide();
            if (options.header !== false) {
                $header.find(">.om-panel-tool >.om-panel-tool-collapse").removeClass("om-panel-tool-collapse").addClass("om-panel-tool-expand");
            }
        } else {
            $body.show();
            "auto" !== options.height && $parent.height(headerHeight + $body.outerHeight());
            if (options.header !== false) {
                $header.find(">.om-panel-tool >.om-panel-tool-expand").removeClass("om-panel-tool-expand").addClass("om-panel-tool-collapse");
            }
        }
        options.closed !== false ? this._hide($parent) : this._show($parent);
        this.reload();
    }, _hide:function ($target) {
        if ("hidden" === this.options._closeMode) {
            $target.hide();
        } else if ("visibility" === this.options._closeMode) {
            $target.addClass("om-helper-hidden-accessible");
        }
    }, _show:function ($target) {
        if ("hidden" === this.options._closeMode) {
            $target.show();
        } else if ("visibility" === this.options._closeMode) {
            $target.removeClass("om-helper-hidden-accessible");
        }
    }, _bindEvent:function () {
        var self = this, $body = this.element, options = this.options, header = $body.prev();
        if (options.collapsible !== false) {
            header.click(
                function (event) {
                    if ($(event.target).is(".om-panel-icon,.om-panel-title,.om-panel-header")) {
                        options.collapsed !== false ? self.expand() : self.collapse();
                    }
                }).find(".om-panel-tool-collapse , .om-panel-tool-expand").click(function () {
                options.collapsed !== false ? self.expand() : self.collapse();
            });
        }
        if (options.closable !== false) {
            header.find(".om-panel-tool-close").click(function (e) {
                self.close();
            });
        }
    }, _renderHeader:function () {
        this.header && this.header.remove();
        if (this.options.header === false) {
            return;
        }
        var that = this, options = this.options, tools = options.tools, $header = this.header = $("<div class='om-panel-header'></div>").insertBefore(this.element);
        if (options._helpMsg) {
            $header.parent().addClass('helpMsg');
        }
        if (options.iconCls) {
            $("<div class='om-icon om-panel-icon'></div>").addClass(options.iconCls).appendTo($header);
        }
        $("<div class='om-panel-title'></div>").html(options.title).appendTo($header);
        $tool = $("<div class='om-panel-tool'></div>");
        if (options.collapsible !== false) {
            $("<div class='om-icon om-panel-tool-collapse'></div>").appendTo($tool);
        }
        if ($.isArray(tools)) {
            for (var i = 0, len = tools.length; i < len; i++) {
                var tool = tools[i], iconCls;
                if (iconCls = this._getInnerToolCls(tool.id)) {
                    $("<div class='om-icon'></div>").addClass(iconCls).click(
                        function (event) {
                            tool.handler.call(this, that, event);
                        }).appendTo($tool);
                } else if (typeof tool.iconCls === 'string') {
                    $("<div class='om-icon'></div>").addClass(tool.iconCls).click(
                        function (event) {
                            tool.handler.call(this, that, event);
                        }).appendTo($tool);
                } else if ($.isArray(tool.iconCls)) {
                    (function (tool) {
                        $("<div class='om-icon'></div>").addClass(tool.iconCls[0]).click(
                            function (event) {
                                tool.handler.call(this, that, event);
                            }).hover(
                            function () {
                                if (tool.iconCls[1]) {
                                    $(this).toggleClass(tool.iconCls[1]);
                                }
                            }).appendTo($tool);
                    })(tool);
                }
            }
        } else {
            try {
                $(tools).appendTo($tool);
            } catch (error) {
                throw"bad format of jquery selector.";
            }
        }
        if (options.closable !== false) {
            $("<div class='om-icon om-panel-tool-close'></div>").appendTo($tool);
        }
        $tool.find(">div.om-icon").hover(function () {
            var self = this;
            $.each(innerToolCls, function () {
                if ($(self).hasClass(this)) {
                    $(self).toggleClass(this + "-hover");
                }
            });
        });
        $tool.appendTo($header);
    }, _resize:function ($panel) {
        var $body = this.element, $header = $body.prev(), $panel = $body.parent(), options = this.options;
        if (options.width == 'fit') {
            options.width = '100%';
            $panel.width('100%');
            $header.css("width", "");
            $body.css("width", "");
        } else if (options.width !== 'auto') {
            $panel.width(options.width);
            $header.outerWidth($panel.width());
            $body.outerWidth($panel.width());
        } else {
            var style = $body.attr("style");
            if (style && style.indexOf("width") !== -1) {
                $panel.width($body.outerWidth());
                $header.outerWidth($body.outerWidth());
            } else {
                $panel.css("width", "");
                $header.css("width", "");
                $body.css("width", "");
            }
        }
        if (options.height == 'fit') {
            options.height = '100%';
            $panel.height('100%');
            $body.outerHeight($panel.height() - (this.options.header !== false ? $header.outerHeight() : 0));
        } else if (options.height !== 'auto') {
            $panel.height(options.height);
            $body.outerHeight($panel.height() - (this.options.header !== false ? $header.outerHeight() : 0));
        } else {
            var style = $body.attr("style");
            if (style && style.indexOf("height") !== -1) {
                $panel.height($header.outerHeight() + $body.outerHeight());
            } else {
                $panel.css("height", "");
                $body.css("height", "");
            }
        }
    }, _getInnerToolCls:function (id) {
        return $.inArray(id, innerToolId) != -1 ? 'om-panel-tool-' + id : null;
    }, _showLoadingMessage:function () {
        var options = this.options, $body = this.element, $loadMsg = $body.next(".om-panel-loadingMessage"), position = {width:$body.innerWidth(), height:$body.innerHeight(), left:$body.position().left + parseInt($body.css("border-left-width")), top:$body.position().top};
        if ($loadMsg.length === 0) {
            if ("default" === options.loadingMessage) {
                $("<div class='om-panel-loadingMessage'><div class='valignMiddle'><div class='loadingImg'>数据加载中</div></div></div>").css(position).appendTo($body.parent());
            } else {
                $("<div class='om-panel-loadingMessage'></div>").appendTo($body.parent()).html(options.loadingMessage).css(position);
            }
        } else {
            $loadMsg.css(position).show();
        }
    }, _hideLoadingMessage:function () {
        this.element.parent().find(".om-panel-loadingMessage").hide();
    }, setTitle:function (title) {
        this.element.prev().find(">.om-panel-title").html(title);
    }, setIconClass:function (iconCls) {
        var $header = this.element.prev();
        var $icon = $header.find(">.om-panel-icon");
        if (iconCls == null && $icon.length !== 0) {
            $icon.remove();
        } else {
            if ($icon.length == 0) {
                $icon = $("<div class='om-icon om-panel-icon'></div>").insertBefore($header.find(">.om-panel-title"));
            }
            if (this.options.iconCls) {
                $icon.removeClass(this.options.iconCls);
            }
            $icon.addClass(iconCls);
            this.options.iconCls = iconCls;
        }
    }, open:function () {
        var $body = this.element, options = this.options;
        if (options.closed) {
            if (options.onBeforeOpen && this._trigger("onBeforeOpen") === false) {
                return;
            }
            this._show($body.parent());
            options.closed = false;
            options.onOpen && this._trigger("onOpen");
        }
    }, close:function () {
        var $body = this.element, options = this.options;
        if (!options.closed) {
            if (options.onBeforeClose && this._trigger("onBeforeClose") === false) {
                return;
            }
            this._hide($body.parent());
            options.closed = true;
            options.onClose && this._trigger("onClose");
        }
    }, reload:function (url) {
        var options = this.options, $body = this.element, self = this;
        if ($body.data("loading")) {
            return;
        } else {
            $body.data("loading", true);
        }
        url = url || options.url;
        if (!url) {
            $body.data("loading", false);
            return;
        }
        options.url = url;
        this._showLoadingMessage();
        $.ajax(url, {cache:false, success:function (data, textStatus, jqXHR) {
            $body.html(options.preProcess ? options.preProcess.call($body[0], data, textStatus) : data);
            $body.data("loading", false);
            self._hideLoadingMessage();
            options.onSuccess && self._trigger("onSuccess", null, data, textStatus, jqXHR);
        }, error:function (jqXHR, textStatus, errorThrown) {
            $body.data("loading", false);
            self._hideLoadingMessage();
            options.onError && self._trigger("onError", null, jqXHR, textStatus, errorThrown);
        }});
    }, resize:function (position) {
        var options = this.options, width, height;
        if ($.isPlainObject(position)) {
            width = position.width || null;
            height = position.height || null;
        } else {
            width = arguments[0];
            height = arguments[1];
        }
        options.width = width || options.width;
        options.height = height || options.height;
        this._resize(this.element.parent());
    }, collapse:function () {
        var self = this, $body = this.element, $header = $body.prev(), $parent = $body.parent(), $loadMessage = $body.next(".om-panel-loadingMessage"), options = this.options, anim = effects.anim, speed = effects.speed;
        if (arguments[0] != undefined) {
            anim = arguments[0];
        }
        speed = arguments[1] || speed;
        if (options.onBeforeCollapse && self._trigger("onBeforeCollapse") === false) {
            return;
        }
        $parent.stop(true, true);
        if ($header.length !== 0) {
            var $expandTool = $header.find("> .om-panel-tool > div.om-panel-tool-collapse");
            if ($expandTool.length !== 0) {
                $expandTool.removeClass("om-panel-tool-collapse").addClass("om-panel-tool-expand");
                if ($expandTool.hasClass("om-panel-tool-collapse-hover")) {
                    $expandTool.toggleClass("om-panel-tool-collapse-hover om-panel-tool-expand-hover");
                }
            }
        }
        $parent.animate({height:'-=' + $body.outerHeight()}, anim ? (speed || 'normal') : 0, function () {
            $body.hide();
            $loadMessage.hide();
            "auto" === options.height && $parent.css("height", "");
            options.onCollapse && self._trigger("onCollapse");
        });
        options.collapsed = true;
    }, expand:function () {
        var self = this, $body = this.element, $header = $body.prev(), $parent = $body.parent(), $loadMessage = $body.next(".om-panel-loadingMessage"), options = this.options, anim = effects.anim, speed = effects.speed;
        if (arguments[0] != undefined) {
            anim = arguments[0];
        }
        speed = arguments[1] || speed;
        if (options.onBeforeExpand && self._trigger("onBeforeExpand") === false) {
            return;
        }
        $parent.stop(true, true);
        if ($header.length !== 0) {
            var $expandTool = $header.find("> .om-panel-tool > div.om-panel-tool-expand");
            if ($expandTool.length !== 0) {
                $expandTool.removeClass("om-panel-tool-expand").addClass("om-panel-tool-collapse");
                if ($expandTool.hasClass("om-panel-tool-expand-hover")) {
                    $expandTool.toggleClass("om-panel-tool-expand-hover om-panel-tool-collapse-hover");
                }
            }
        }
        "auto" === options.height && $parent.height($header.outerHeight());
        $body.show();
        if ($body.data("loading")) {
            $loadMessage.show();
        }
        $parent.animate({height:'+=' + $body.outerHeight()}, anim ? (speed || 'normal') : 0, function () {
            "auto" === options.height && $parent.css("height", "");
            options.onExpand && self._trigger("onExpand");
        });
        options.collapsed = false;
    }, destroy:function () {
        var $body = this.element;
        $body.parent().after($body).remove();
    }});
})(jQuery);
(function ($, undefined) {
    var panelIdPrefix = 'om-accordion-panel-' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-', id = 0;
    $.omWidget("om.omAccordion", {options:{active:0, autoPlay:false, collapsible:false, disabled:false, height:'auto', header:"> ul:first li", iconCls:null, interval:1000, switchEffect:false, switchMode:"click", width:'auto', onActivate:function (index, event) {
    }, onBeforeActivate:function (index, event) {
    }, onBeforeCollapse:function (index, event) {
    }, onCollapse:function (index, event) {
    }}, activate:function (index) {
        var options = this.options;
        clearInterval(options.autoInterId);
        this._activate(index);
        this._setAutoInterId(this);
    }, disable:function () {
        var $acc = this.element, options = this.options, $disableDiv;
        if (options.autoPlay) {
            clearInterval(options.autoInterId);
        }
        options.disabled = true;
        if (($disableDiv = $acc.find(">.om-accordion-disable")).length === 0) {
            $("<div class='om-accordion-disable'></div>").css({position:"absolute", top:0, left:0}).width($acc.outerWidth()).height($acc.outerHeight()).appendTo($acc);
        }
        $disableDiv.show();
    }, enable:function () {
        this.options.disabled = false;
        this.element.find(">.om-accordion-disable").hide();
    }, getActivated:function () {
        var panels = $.data(this.element, "panels");
        for (var i = 0, len = panels.length; i < len; i++) {
            if (!panels[i].omPanel("option", "collapsed")) {
                return panels[i].prop("id");
            }
        }
        return null;
    }, getLength:function () {
        return $.data(this.element, "panels").length;
    }, reload:function (index) {
        var panels = $.data(this.element, "panels");
        if (this.options.disabled !== false || panels.length === 0) {
            return this;
        }
        index = this._correctIndex(index);
        panels[index].omPanel('reload');
    }, resize:function () {
        var $acc = this.element, options = this.options, panels = $.data(this.element, "panels"), headerHeight = 0;
        this._initWidthOrHeight('width');
        this._initWidthOrHeight('height');
        $.each(panels, function (index, panel) {
            headerHeight += panel.prev().outerHeight();
        });
        $.each(panels, function (index, panel) {
            if (options.height === 'auto') {
                panel.css('height', "");
            } else {
                panel.outerHeight($acc.height() - headerHeight);
            }
        });
    }, setTitle:function (index, title) {
        var panels = $.data(this.element, "panels");
        if (this.options.disabled !== false || panels.length === 0) {
            return this;
        }
        index = this._correctIndex(index);
        panels[index].omPanel("setTitle", title);
    }, url:function (index, url) {
        var panels = $.data(this.element, "panels");
        if (!url || this.options.disabled !== false || panels.length === 0) {
            return;
        }
        index = this._correctIndex(index);
        panels[index].omPanel('option', "url", url);
    }, _create:function () {
        var $acc = this.element, options = this.options;
        $acc.addClass("om-widget om-accordion").css("position", "relative");
        this._renderPanels();
        options.active = this._correctIndex(options.active);
        this.resize();
        this._buildEvent();
        if (options.disabled !== false) {
            this.disable();
        }
    }, _correctIndex:function (index) {
        var $acc = this.element, panels = $.data(this.element, "panels"), panel = $acc.children().find(">div#" + index), len = panels.length, oldIndex = index;
        index = panel.length ? $acc.find(">.om-panel").index(panel.parent()) : index;
        index = index == -1 ? oldIndex : index;
        var r = parseInt(index);
        r = (isNaN(r) && '0' || r) - 0;
        return len == 0 || (r === -1 && this.options.collapsible !== false) ? -1 : (r < 0 ? 0 : (r >= len ? len - 1 : r));
    }, _panelCreateCollapse:function (len, index) {
        var $acc = this.element, options = this.options, panel, num;
        if (options.active === -1 && options.collapsible === true) {
            return true;
        } else {
            panel = $acc.find(">div#" + options.active);
            num = $acc.children().index(panel);
            num = (num == -1 ? options.active : num);
            var r = parseInt(num);
            r = (isNaN(r) && '0' || r) - 0;
            r = r < 0 ? 0 : (r >= len ? len - 1 : r);
            return r !== index;
        }
    }, _renderPanels:function () {
        var $acc = this.element, self = this, panels = [], options = this.options, $headers = $acc.find(options.header), cfg = [], first;
        $headers.find("a").each(function (n) {
            var href = this.getAttribute('href', 2);
            var hrefBase = href.split("#")[0], baseEl;
            if (hrefBase && (hrefBase === location.toString().split("#")[0] || (baseEl = $("base")[0]) && hrefBase === baseEl.href)) {
                href = this.hash;
                this.href = href;
            }
            var $anchor = $(this);
            cfg[n] = {title:$anchor.text(), iconCls:$anchor.attr("iconCls"), onExpand:function (event) {
                self._trigger("onActivate", event, n);
            }, tools:[
                {id:"collapse", handler:function (panel, event) {
                    clearInterval(options.autoInterId);
                    self._activate(n, true);
                    self._setAutoInterId(self);
                    event.stopPropagation();
                }}
            ], onCollapse:function (event) {
                self._trigger("onCollapse", event, n);
            }, onSuccess:function () {
                self.resize();
            }, onError:function () {
                self.resize();
            }};
            var target = $('>' + href, $acc);
            var pId = target.prop("id");
            if (!!(target[0])) {
                if (!pId) {
                    target.prop("id", pId = panelIdPrefix + (id++));
                }
                target.appendTo($acc);
            } else {
                cfg[n].url = $anchor.attr('href');
                $("<div></div>").prop('id', pId = ($anchor.prop('id') || panelIdPrefix + (id++))).appendTo($acc);
            }
            first = first || pId;
        });
        first && $acc.find("#" + first).prevAll().remove();
        $headers.remove();
        $.each(cfg, function (index, config) {
            config.collapsed = self._panelCreateCollapse(cfg.length, index);
        });
        $.each($acc.children(), function (index, panel) {
            panels.push(self._createPanel(panel, cfg[index]));
            if (index === 0) {
                var $h = panels[0].prev();
                $h.css('border-top-width', $h.css('border-bottom-width'));
            }
        });
        $.data($acc, "panels", panels);
    }, _initWidthOrHeight:function (type) {
        var $acc = this.element, options = this.options, styles = this.element.attr("style"), value = options[type];
        if (value == 'fit') {
            $acc.css(type, '100%');
        } else if (value !== 'auto') {
            $acc.css(type, value);
        } else if (styles && styles.indexOf(type) != -1) {
            options[type] = $acc.css(type);
        } else {
            $acc.css(type, '');
        }
    }, _createPanel:function (target, config) {
        return $(target).omPanel(config);
    }, _buildEvent:function () {
        var options = this.options, self = this;
        this.element.children().find('>div.om-panel-header').each(function (n) {
            var header = $(this);
            header.unbind();
            if (options.switchMode == 'mouseover') {
                header.bind('mouseenter.omaccordions', function (event) {
                    clearInterval(options.autoInterId);
                    var timer = $.data(self.element, 'expandTimer');
                    (typeof timer !== 'undefined') && clearTimeout(timer);
                    timer = setTimeout(function () {
                        self._activate(n, true);
                        self._setAutoInterId(self);
                    }, 200);
                    $.data(self.element, 'expandTimer', timer);
                });
            } else if (options.switchMode == 'click') {
                header.bind('click.omaccordions', function (event) {
                    clearInterval(options.autoInterId);
                    self._activate(n, true);
                    self._setAutoInterId(self);
                });
            }
            header.hover(function () {
                $(this).toggleClass("om-panel-header-hover");
            });
        });
        if (options.autoPlay) {
            clearInterval(options.autoInterId);
            self._setAutoInterId(self);
        }
    }, _setAutoInterId:function (self) {
        var options = self.options;
        if (options.autoPlay) {
            options.autoInterId = setInterval(function () {
                self._activate('next');
            }, options.interval);
        }
    }, _setOption:function (key, value) {
        $.OMWidget.prototype._setOption.apply(this, arguments);
        var options = this.options;
        switch (key) {
            case"active":
                this.activate(value);
                break;
            case"disabled":
                value === false ? this.enable() : this.disable();
                break;
            case"width":
                options.width = value;
                this._initWidthOrHeight("width");
                break;
            case"height":
                options.height = value;
                this._initWidthOrHeight("height");
                break;
        }
    }, _activate:function (index, isSwitchMode) {
        var panels = $.data(this.element, "panels"), len = panels.length, options = this.options, self = this, isExpand = false, expandIndex = -1, anim = false, speed;
        if (options.disabled !== false && len === 0) {
            return;
        }
        index = index === 'next' ? (options.active + 1) % len : self._correctIndex(index);
        if (options.switchEffect) {
            anim = true;
            speed = 'fast';
        }
        for (var i = 0; i < len; i++) {
            $(panels[i]).stop(true, true);
        }
        var active = self.getActivated();
        isExpand = !!active;
        if (isExpand) {
            expandIndex = self._correctIndex(active);
            if (expandIndex == index) {
                if (isSwitchMode === true && options.collapsible !== false && self._trigger("onBeforeCollapse", null, expandIndex) !== false) {
                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
                    options.active = -1;
                } else {
                    options.active = expandIndex;
                }
            } else {
                if (index === -1) {
                    if (self._trigger("onBeforeCollapse", null, expandIndex) !== false) {
                        $(panels[expandIndex]).omPanel('collapse', anim, speed);
                        options.active = -1;
                    } else {
                        options.active = expandIndex;
                    }
                } else if (self._trigger("onBeforeCollapse", null, expandIndex) !== false && (canAct = self._trigger("onBeforeActivate", null, index) !== false)) {
                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
                    $(panels[index]).omPanel('expand', anim, speed);
                    options.active = index;
                } else {
                    options.active = expandIndex;
                }
            }
        } else {
            if (index === "-1") {
                options.active = -1;
            } else if (self._trigger("onBeforeActivate", null, index) !== false) {
                $(panels[index]).omPanel('expand', anim, speed);
                options.active = index;
            }
        }
    }});
})(jQuery);
;
(function ($) {
    $.fn.omAjaxSubmit = function (options) {
        if (!this.length) {
            log('omAjaxSubmit: skipping submit process - no element selected');
            return this;
        }
        var method, action, url, $form = this;
        if (typeof options == 'function') {
            options = {success:options};
        }
        method = this.attr('method');
        action = this.attr('action');
        url = (typeof action === 'string') ? $.trim(action) : '';
        url = url || window.location.href || '';
        if (url) {
            url = (url.match(/^([^#]+)/) || [])[1];
        }
        options = $.extend(true, {url:url, success:$.ajaxSettings.success, method:method || 'GET', iframeSrc:/^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'}, options);
        var veto = {};
        this.trigger('form-pre-serialize', [this, options, veto]);
        if (veto.veto) {
            log('omAjaxSubmit: submit vetoed via form-pre-serialize trigger');
            return this;
        }
        if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
            log('omAjaxSubmit: submit aborted via beforeSerialize callback');
            return this;
        }
        var n, v, a = this.formToArray(options.semantic);
        if (options.data) {
            options.extraData = options.data;
            for (n in options.data) {
                if (options.data[n]instanceof Array) {
                    for (var k in options.data[n]) {
                        a.push({name:n, value:options.data[n][k]});
                    }
                }
                else {
                    v = options.data[n];
                    v = $.isFunction(v) ? v() : v;
                    a.push({name:n, value:v});
                }
            }
        }
        if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
            log('omAjaxSubmit: submit aborted via beforeSubmit callback');
            return this;
        }
        this.trigger('form-submit-validate', [a, this, options, veto]);
        if (veto.veto) {
            log('omAjaxSubmit: submit vetoed via form-submit-validate trigger');
            return this;
        }
        var q = $.param(a);
        if (options.method.toUpperCase() == 'GET') {
            options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
            options.data = null;
        }
        else {
            options.data = q;
        }
        var callbacks = [];
        if (options.resetForm) {
            callbacks.push(function () {
                $form.resetForm();
            });
        }
        if (options.clearForm) {
            callbacks.push(function () {
                $form.clearForm();
            });
        }
        if (!options.dataType && options.target) {
            var oldSuccess = options.success || function () {
            };
            callbacks.push(function (data) {
                var fn = options.replaceTarget ? 'replaceWith' : 'html';
                $(options.target)[fn](data).each(oldSuccess, arguments);
            });
        }
        else if (options.success) {
            callbacks.push(options.success);
        }
        options.success = function (data, status, xhr) {
            var context = options.context || options;
            for (var i = 0, max = callbacks.length; i < max; i++) {
                callbacks[i].apply(context, [data, status, xhr || $form, $form]);
            }
        };
        var fileInputs = $('input:file', this).length > 0;
        var mp = 'multipart/form-data';
        var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);
        if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
            if (options.closeKeepAlive) {
                $.get(options.closeKeepAlive, function () {
                    fileUpload(a);
                });
            }
            else {
                fileUpload(a);
            }
        }
        else {
            if ($.browser.msie && method == 'get') {
                var ieMeth = $form[0].getAttribute('method');
                if (typeof ieMeth === 'string')
                    options.method = ieMeth;
            }
            options.type = options.method;
            $.ajax(options);
        }
        this.trigger('form-submit-notify', [this, options]);
        return this;
        function fileUpload(a) {
            var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
            var useProp = !!$.fn.prop;
            if (a) {
                for (i = 0; i < a.length; i++) {
                    el = $(form[a[i].name]);
                    el[useProp ? 'prop' : 'attr']('disabled', false);
                }
            }
            if ($(':input[name=submit],:input[id=submit]', form).length) {
                alert('Error: Form elements must not have name or id of "submit".');
                return;
            }
            s = $.extend(true, {}, $.ajaxSettings, options);
            s.context = s.context || s;
            id = 'jqFormIO' + (new Date().getTime());
            if (s.iframeTarget) {
                $io = $(s.iframeTarget);
                n = $io.attr('name');
                if (n == null)
                    $io.attr('name', id); else
                    id = n;
            }
            else {
                $io = $('<iframe name="' + id + '" src="' + s.iframeSrc + '" />');
                $io.css({position:'absolute', top:'-1000px', left:'-1000px'});
            }
            io = $io[0];
            xhr = {aborted:0, responseText:null, responseXML:null, status:0, statusText:'n/a', getAllResponseHeaders:function () {
            }, getResponseHeader:function () {
            }, setRequestHeader:function () {
            }, abort:function (status) {
                var e = (status === 'timeout' ? 'timeout' : 'aborted');
                log('aborting upload... ' + e);
                this.aborted = 1;
                $io.attr('src', s.iframeSrc);
                xhr.error = e;
                s.error && s.error.call(s.context, xhr, e, status);
                g && $.event.trigger("ajaxError", [xhr, s, e]);
                s.complete && s.complete.call(s.context, xhr, e);
            }};
            g = s.global;
            if (g && !$.active++) {
                $.event.trigger("ajaxStart");
            }
            if (g) {
                $.event.trigger("ajaxSend", [xhr, s]);
            }
            if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
                if (s.global) {
                    $.active--;
                }
                return;
            }
            if (xhr.aborted) {
                return;
            }
            sub = form.clk;
            if (sub) {
                n = sub.name;
                if (n && !sub.disabled) {
                    s.extraData = s.extraData || {};
                    s.extraData[n] = sub.value;
                    if (sub.type == "image") {
                        s.extraData[n + '.x'] = form.clk_x;
                        s.extraData[n + '.y'] = form.clk_y;
                    }
                }
            }
            var CLIENT_TIMEOUT_ABORT = 1;
            var SERVER_ABORT = 2;

            function getDoc(frame) {
                var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
                return doc;
            }

            function doSubmit() {
                var t = $form.attr('target'), a = $form.attr('action');
                form.setAttribute('target', id);
                if (!method) {
                    form.setAttribute('method', 'POST');
                }
                if (a != s.url) {
                    form.setAttribute('action', s.url);
                }
                if (!s.skipEncodingOverride && (!method || /post/i.test(method))) {
                    $form.attr({encoding:'multipart/form-data', enctype:'multipart/form-data'});
                }
                if (s.timeout) {
                    timeoutHandle = setTimeout(function () {
                        timedOut = true;
                        cb(CLIENT_TIMEOUT_ABORT);
                    }, s.timeout);
                }
                function checkState() {
                    try {
                        var state = getDoc(io).readyState;
                        log('state = ' + state);
                        if (state.toLowerCase() == 'uninitialized')
                            setTimeout(checkState, 50);
                    }
                    catch (e) {
                        log('Server abort: ', e, ' (', e.name, ')');
                        cb(SERVER_ABORT);
                        timeoutHandle && clearTimeout(timeoutHandle);
                        timeoutHandle = undefined;
                    }
                }

                var extraInputs = [];
                try {
                    if (s.extraData) {
                        for (var n in s.extraData) {
                            extraInputs.push($('<input type="hidden" name="' + n + '" />').attr('value', s.extraData[n]).appendTo(form)[0]);
                        }
                    }
                    if (!s.iframeTarget) {
                        $io.appendTo('body');
                        io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
                    }
                    setTimeout(checkState, 15);
                    form.submit();
                }
                finally {
                    form.setAttribute('action', a);
                    if (t) {
                        form.setAttribute('target', t);
                    } else {
                        $form.removeAttr('target');
                    }
                    $(extraInputs).remove();
                }
            }

            if (s.forceSync) {
                doSubmit();
            }
            else {
                setTimeout(doSubmit, 10);
            }
            var data, doc, domCheckCount = 50, callbackProcessed;

            function cb(e) {
                if (xhr.aborted || callbackProcessed) {
                    return;
                }
                try {
                    doc = getDoc(io);
                }
                catch (ex) {
                    log('cannot access response document: ', ex);
                    e = SERVER_ABORT;
                }
                if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                    xhr.abort('timeout');
                    return;
                }
                else if (e == SERVER_ABORT && xhr) {
                    xhr.abort('server abort');
                    return;
                }
                if (!doc || doc.location.href == s.iframeSrc) {
                    if (!timedOut)
                        return;
                }
                io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);
                var status = 'success', errMsg;
                try {
                    if (timedOut) {
                        throw'timeout';
                    }
                    var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                    log('isXml=' + isXml);
                    if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
                        if (--domCheckCount) {
                            log('requeing onLoad callback, DOM not available');
                            setTimeout(cb, 250);
                            return;
                        }
                    }
                    var docRoot = doc.body ? doc.body : doc.documentElement;
                    xhr.responseText = docRoot ? docRoot.innerHTML : null;
                    xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                    if (isXml)
                        s.dataType = 'xml';
                    xhr.getResponseHeader = function (header) {
                        var headers = {'content-type':s.dataType};
                        return headers[header];
                    };
                    if (docRoot) {
                        xhr.status = Number(docRoot.getAttribute('status')) || xhr.status;
                        xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                    }
                    var dt = s.dataType || '';
                    var scr = /(json|script|text)/.test(dt.toLowerCase());
                    if (scr || s.textarea) {
                        var ta = doc.getElementsByTagName('textarea')[0];
                        if (ta) {
                            xhr.responseText = ta.value;
                            xhr.status = Number(ta.getAttribute('status')) || xhr.status;
                            xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                        }
                        else if (scr) {
                            var pre = doc.getElementsByTagName('pre')[0];
                            var b = doc.getElementsByTagName('body')[0];
                            if (pre) {
                                xhr.responseText = pre.textContent ? pre.textContent : pre.innerHTML;
                            }
                            else if (b) {
                                xhr.responseText = b.innerHTML;
                            }
                        }
                    }
                    else if (s.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
                        xhr.responseXML = toXml(xhr.responseText);
                    }
                    try {
                        data = httpData(xhr, s.dataType, s);
                    }
                    catch (e) {
                        status = 'parsererror';
                        xhr.error = errMsg = (e || status);
                    }
                }
                catch (e) {
                    log('error caught: ', e);
                    status = 'error';
                    xhr.error = errMsg = (e || status);
                }
                if (xhr.aborted) {
                    log('upload aborted');
                    status = null;
                }
                if (xhr.status) {
                    status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
                }
                if (status === 'success') {
                    s.success && s.success.call(s.context, data, 'success', xhr);
                    g && $.event.trigger("ajaxSuccess", [xhr, s]);
                }
                else if (status) {
                    if (errMsg == undefined)
                        errMsg = xhr.statusText;
                    s.error && s.error.call(s.context, xhr, status, errMsg);
                    g && $.event.trigger("ajaxError", [xhr, s, errMsg]);
                }
                g && $.event.trigger("ajaxComplete", [xhr, s]);
                if (g && !--$.active) {
                    $.event.trigger("ajaxStop");
                }
                s.complete && s.complete.call(s.context, xhr, status);
                callbackProcessed = true;
                if (s.timeout)
                    clearTimeout(timeoutHandle);
                setTimeout(function () {
                    if (!s.iframeTarget)
                        $io.remove();
                    xhr.responseXML = null;
                }, 100);
            }

            var toXml = $.parseXML || function (s, doc) {
                if (window.ActiveXObject) {
                    doc = new ActiveXObject('Microsoft.XMLDOM');
                    doc.async = 'false';
                    doc.loadXML(s);
                }
                else {
                    doc = (new DOMParser()).parseFromString(s, 'text/xml');
                }
                return(doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
            };
            var parseJSON = $.parseJSON || function (s) {
                return window['eval']('(' + s + ')');
            };
            var httpData = function (xhr, type, s) {
                var ct = xhr.getResponseHeader('content-type') || '', xml = type === 'xml' || !type && ct.indexOf('xml') >= 0, data = xml ? xhr.responseXML : xhr.responseText;
                if (xml && data.documentElement.nodeName === 'parsererror') {
                    $.error && $.error('parsererror');
                }
                if (s && s.dataFilter) {
                    data = s.dataFilter(data, type);
                }
                if (typeof data === 'string') {
                    if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                        data = parseJSON(data);
                    } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                        $.globalEval(data);
                    }
                }
                return data;
            };
        }
    };
    $.fn.ajaxForm = function (options) {
        if (this.length === 0) {
            var o = {s:this.selector, c:this.context};
            if (!$.isReady && o.s) {
                log('DOM not ready, queuing ajaxForm');
                $(function () {
                    $(o.s, o.c).ajaxForm(options);
                });
                return this;
            }
            log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
            return this;
        }
        return this.ajaxFormUnbind().bind('submit.form-plugin',
            function (e) {
                if (!e.isDefaultPrevented()) {
                    e.preventDefault();
                    $(this).omAjaxSubmit(options);
                }
            }).bind('click.form-plugin', function (e) {
            var target = e.target;
            var $el = $(target);
            if (!($el.is(":submit,input:image"))) {
                var t = $el.closest(':submit');
                if (t.length == 0) {
                    return;
                }
                target = t[0];
            }
            var form = this;
            form.clk = target;
            if (target.type == 'image') {
                if (e.offsetX != undefined) {
                    form.clk_x = e.offsetX;
                    form.clk_y = e.offsetY;
                } else if (typeof $.fn.offset == 'function') {
                    var offset = $el.offset();
                    form.clk_x = e.pageX - offset.left;
                    form.clk_y = e.pageY - offset.top;
                } else {
                    form.clk_x = e.pageX - target.offsetLeft;
                    form.clk_y = e.pageY - target.offsetTop;
                }
            }
            setTimeout(function () {
                form.clk = form.clk_x = form.clk_y = null;
            }, 100);
        });
    };
    $.fn.ajaxFormUnbind = function () {
        return this.unbind('submit.form-plugin click.form-plugin');
    };
    $.fn.formToArray = function (semantic) {
        var a = [];
        if (this.length === 0) {
            return a;
        }
        var form = this[0];
        var els = semantic ? form.getElementsByTagName('*') : form.elements;
        if (!els) {
            return a;
        }
        var i, j, n, v, el, max, jmax;
        for (i = 0, max = els.length; i < max; i++) {
            el = els[i];
            n = el.name;
            if (!n) {
                continue;
            }
            if (semantic && form.clk && el.type == "image") {
                if (!el.disabled && form.clk == el) {
                    a.push({name:n, value:$(el).val()});
                    a.push({name:n + '.x', value:form.clk_x}, {name:n + '.y', value:form.clk_y});
                }
                continue;
            }
            v = $.fieldValue(el, true);
            if (v && v.constructor == Array) {
                for (j = 0, jmax = v.length; j < jmax; j++) {
                    a.push({name:n, value:v[j]});
                }
            }
            else if (v !== null && typeof v != 'undefined') {
                a.push({name:n, value:v});
            }
        }
        if (!semantic && form.clk) {
            var $input = $(form.clk), input = $input[0];
            n = input.name;
            if (n && !input.disabled && input.type == 'image') {
                a.push({name:n, value:$input.val()});
                a.push({name:n + '.x', value:form.clk_x}, {name:n + '.y', value:form.clk_y});
            }
        }
        return a;
    };
    $.fn.formSerialize = function (semantic) {
        return $.param(this.formToArray(semantic));
    };
    $.fn.fieldSerialize = function (successful) {
        var a = [];
        this.each(function () {
            var n = this.name;
            if (!n) {
                return;
            }
            var v = $.fieldValue(this, successful);
            if (v && v.constructor == Array) {
                for (var i = 0, max = v.length; i < max; i++) {
                    a.push({name:n, value:v[i]});
                }
            }
            else if (v !== null && typeof v != 'undefined') {
                a.push({name:this.name, value:v});
            }
        });
        return $.param(a);
    };
    $.fn.fieldValue = function (successful) {
        for (var val = [], i = 0, max = this.length; i < max; i++) {
            var el = this[i];
            var v = $.fieldValue(el, successful);
            if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
                continue;
            }
            v.constructor == Array ? $.merge(val, v) : val.push(v);
        }
        return val;
    };
    $.fieldValue = function (el, successful) {
        var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
        if (successful === undefined) {
            successful = true;
        }
        if (successful && (!n || el.disabled || t == 'reset' || t == 'button' || (t == 'checkbox' || t == 'radio') && !el.checked || (t == 'submit' || t == 'image') && el.form && el.form.clk != el || tag == 'select' && el.selectedIndex == -1)) {
            return null;
        }
        if (tag == 'select') {
            var index = el.selectedIndex;
            if (index < 0) {
                return null;
            }
            var a = [], ops = el.options;
            var one = (t == 'select-one');
            var max = (one ? index + 1 : ops.length);
            for (var i = (one ? index : 0); i < max; i++) {
                var op = ops[i];
                if (op.selected) {
                    var v = op.value;
                    if (!v) {
                        v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                    }
                    if (one) {
                        return v;
                    }
                    a.push(v);
                }
            }
            return a;
        }
        return $(el).val();
    };
    $.fn.clearForm = function () {
        return this.each(function () {
            $('input,select,textarea', this).clearFields();
        });
    };
    $.fn.clearFields = $.fn.clearInputs = function () {
        var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function () {
            var t = this.type, tag = this.tagName.toLowerCase();
            if (re.test(t) || tag == 'textarea') {
                this.value = '';
            }
            else if (t == 'checkbox' || t == 'radio') {
                this.checked = false;
            }
            else if (tag == 'select') {
                this.selectedIndex = -1;
            }
        });
    };
    $.fn.resetForm = function () {
        return this.each(function () {
            if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
                this.reset();
            }
        });
    };
    $.fn.enable = function (b) {
        if (b === undefined) {
            b = true;
        }
        return this.each(function () {
            this.disabled = !b;
        });
    };
    $.fn.selected = function (select) {
        if (select === undefined) {
            select = true;
        }
        return this.each(function () {
            var t = this.type;
            if (t == 'checkbox' || t == 'radio') {
                this.checked = select;
            }
            else if (this.tagName.toLowerCase() == 'option') {
                var $sel = $(this).parent('select');
                if (select && $sel[0] && $sel[0].type == 'select-one') {
                    $sel.find('option').selected(false);
                }
                this.selected = select;
            }
        });
    };
    function log() {
        var msg = '[jquery.form] ' + Array.prototype.join.call(arguments, '');
        if (window.console && window.console.log) {
            window.console.log(msg);
        }
        else if (window.opera && window.opera.postError) {
            window.opera.postError(msg);
        }
    }


})(jQuery);

(function ($) {
    $.omWidget('om.omButton', {options:{disabled:null, label:null, icons:{left:null, right:null}, width:null, onClick:null}, _create:function () {
        this._determineButtonType();
        var wrapperSpan = $('<span>').addClass('om-btn om-state-default').css('border', 'none'), leftSpan = $('<span>').addClass('om-btn-bg om-btn-left'), centerSpan = $('<span>').addClass('om-btn-bg om-btn-center'), rightSpan = $('<span>').addClass('om-btn-bg om-btn-right');
        if (this.element.hasClass('apusic-btn-deepblue')) {
            wrapperSpan.addClass('apusic-btn-deepblue');
        }
        this.element.addClass('om-btn-txt').css({'background-position':'left center', 'background-repeat':'no-repeat'}).wrap(wrapperSpan).before(leftSpan).after(rightSpan).wrap(centerSpan);
    }, _init:function () {
        var self = this, options = this.options, element = this.element;
        if (typeof options.disabled != "boolean") {
            options.disabled = element.propAttr("disabled");
        }
        if (element.attr('disabled') == 'disabled' || options.disabled == 'disabled') {
            options.disabled = true;
        }
        this._initButton();
        if (options.disabled) {
            self._addClass('disabled');
            element.css('cursor', 'default');
        }
        var $newelement = element.parent().parent();
        $newelement.bind('mouseenter',
            function (event) {
                if (options.disabled) {
                    return false;
                }
                self._addClass('hover');
            }).bind("mouseleave",
            function (event) {
                if (options.disabled) {
                    return false;
                }
                self._removeClass('hover');
                self._removeClass('active');
            }).bind("click",
            function (event) {
                if (options.disabled) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                } else if (self.options.onClick) {
                    self._trigger("onClick", event);
                }
            }).bind("mousedown",
            function (event) {
                if (options.disabled) {
                    return false;
                }
                self._addClass('active');
                self._removeClass('focus');
                var onClick = options.onClick;
            }).bind("mouseup",
            function (event) {
                if (options.disabled) {
                    return false;
                }
                self._addClass('focus');
                self._removeClass('active');
            }).bind("keydown",
            function (event) {
                if (options.disabled) {
                    return false;
                }
                if (event.keyCode == $.om.keyCode.SPACE || event.keyCode == $.om.keyCode.ENTER) {
                    self._addClass('active');
                }
                if (event.keyCode == $.om.keyCode.SPACE) {
                    var onClick = options.onClick;
                    if (onClick && self._trigger("onClick", event) === false) {
                        return;
                    }
                }
            }).bind("keyup", function () {
                self._removeClass('active');
            });
        element.bind("focus.button",
            function (event) {
                if (options.disabled) {
                    return false;
                }
                self._addClass('focus');
            }).bind("blur.button", function (event) {
                if (options.disabled) {
                    return false;
                }
                self._removeClass('focus');
            });
    }, enable:function () {
        this._removeClass('disabled');
        this.options.disabled = false;
        this.element.css('cursor', 'pointer').removeAttr('disabled');
    }, disable:function () {
        this._addClass('disabled');
        this.options.disabled = true;
        this.element.css('cursor', 'default');
        if (this.type == 'input' || this.type == 'button') {
            this.element.attr('disabled', 'disabled');
        }
    }, click:function () {
        if (!this.options.disabled && this.options.onClick) {
            this._trigger("onClick");
        }
    }, changeLabel:function (label) {
        if (this.type == 'a') {
            this.element.text(label);
        } else if (this.type == 'input') {
            this.element.val(label);
        } else if (this.type == 'button') {
            this.element.html(label);
        }
    }, changeIcons:function (icons) {
        if (!this.options.disabled) {
            if (icons) {
                icons.left ? this.element.css('backgroundImage', 'url( ' + icons.left + ' )') : null;
                icons.right ? this.element.next().attr('src', icons.right) : null;
            }
        }
    }, destroy:function () {
        $el = this.element;
        $el.closest(".om-btn").after($el).remove();
    }, _addClass:function (state) {
        this.element.parent().parent().addClass('om-state-' + state);
    }, _removeClass:function (state) {
        this.element.parent().parent().removeClass('om-state-' + state);
    }, _initButton:function () {
        var options = this.options, label = this._getLabel(), element = this.element;
        element.removeClass('om-btn-icon om-btn-only-icon').next("img").remove();
        if (options.width > 10) {
            element.parent().css('width', parseInt(options.width) - 10);
        }
        if (this.type == 'a' || this.type == 'button') {
            element.html(label);
        } else {
            element.val(label);
        }
        if (options.icons.left) {
            if (label) {
                element.addClass('om-btn-icon').css('background-image', 'url(' + options.icons.left + ')');
            } else {
                element.addClass('om-btn-only-icon').css('background-image', 'url(' + options.icons.left + ')');
            }
        }
        if (options.icons.right) {
            if (label != '') {
                $('<img>').attr('src', options.icons.right).css({'vertical-align':'baseline', 'padding-left':'3px'}).insertAfter(element);
            } else {
                $('<img>').attr('src', options.icons.right).css('vertical-align', 'baseline').insertAfter(element);
            }
        }
    }, _getLabel:function () {
        return this.options.label || this.element.html() || this.element.text() || this.element.val();
    }, _determineButtonType:function () {
        if (this.element.is("input")) {
            this.type = "input";
        } else if (this.element.is("a")) {
            this.type = "a";
        } else if (this.element.is('button')) {
            this.type = "button";
        }
    }});
})(jQuery);
;
(function ($) {
    $.omWidget("om.omCalendar", {options:{date:new Date(), startDay:0, pages:1, minDate:false, maxDate:false, popup:true, showTime:false, onSelect:function (date, event) {
    }, disabledDays:[], disabledFn:function (d) {
    }, disabled:false, readOnly:false, editable:true, dateFormat:false}, disable:function () {
        if (this.options.popup) {
            this.hide();
            this.options.disabled = true;
            this.element.attr("disabled", true).unbind('.omCalendar').next().addClass('om-state-disabled').unbind();
        }
    }, enable:function () {
        if (this.options.popup) {
            this.options.disabled = false;
            this.element.attr("disabled", false).next().removeClass('om-state-disabled');
            this._buildStatusEvent();
        }
    }, getDate:function () {
        return this.options.date;
    }, setDate:function (d) {
        this.options.date = d;
        this._render({date:d});
    }, _create:function () {
        var $self = this.element, opts = this.options;
        this.cid = this._stamp($self);
        if (opts.popup) {
            $self.wrap('<span></span>').after('<span class="om-calendar-trigger"></span>').parent().addClass("om-calendar om-widget om-state-default");
            this.con = $('<div></div>').appendTo(document.body).css({'top':'0px', 'position':'absolute', 'background':'white', 'visibility':'hidden', 'z-index':'2000'});
            this._buildBodyEvent();
            this._buildStatusEvent();
        } else {
            this.con = this.element;
        }
        var _this = this;
        $self.blur(function (e) {
            var v = $(this).val();
            if (v == "") {
                return;
            }
            if (!_this._checkDate(v) && !_this._checkDateTime(v)) {
                alert("不合法的日期格式!");
                $(this).focus();
            }
        });
        this.con.addClass('om-calendar-list-wrapper om-widget om-clearfix om-widget-content');
    }, _checkDate:function (DateStr) {
        var sDate = DateStr.replace(/(^\s+|\s+$)/g, '');
        if (sDate == '')
            return true;
        var s = sDate.replace(/[\d]{4,4}[\-]{1}[\d]{1,2}[\-]{1}[\d]{1,2}/g, '');
        if (s != '') {
            return false;
        }
        return true;
    }, _checkDateTime:function (str) {
        var reg = /^(\d{4})\-(\d{1,2})\-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        var r = str.match(reg);
        if (r == null)
            return false;
        r[2] = r[2] - 1;
        var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
        if (d.getFullYear() != r[1])
            return false;
        if (d.getMonth() != r[2])
            return false;
        if (d.getDate() != r[3])
            return false;
        if (d.getHours() != r[4])
            return false;
        if (d.getMinutes() != r[5])
            return false;
        if (d.getSeconds() != r[6])
            return false;
        return true;
    }, _init:function () {
        var $ele = this.element, opts = this.options;
        this.con.addClass('multi-' + opts.pages);
        this._buildParam();
        if (opts.popup) {
            $ele.val() && (opts.date = $.omCalendar.parseDate($ele.val(), opts.dateFormat || this._defaultFormat) || new Date());
        }
        this._render();
        if (opts.readOnly || !opts.editable) {
            $ele.attr('readonly', 'readOnly').unbind();
        } else {
            $ele.removeAttr('readonly');
        }
        opts.disabled ? this.disable() : this.enable();
    }, _render:function (o) {
        var i = 0, _prev, _next, _oym, $self = this.element, opt = this.options;
        this.ca = [];
        this._parseParam(o);
        this.con.html('');
        for (i = 0, _oym = [this.year, this.month]; i < opt.pages; i++) {
            if (i === 0) {
                _prev = true;
            } else {
                _prev = false;
                _oym = this._computeNextMonth(_oym);
            }
            _next = i == (opt.pages - 1);
            this.ca.push(new $.om.omCalendar.Page({year:_oym[0], month:_oym[1], prevArrow:_prev, nextArrow:_next, showTime:self.showTime}, this));
            this.ca[i]._render();
        }
        if (opt.pages > 1) {
            var calbox = $self.find(".om-cal-box");
            var array = [];
            $.each(calbox, function (i, n) {
                array.push($(n).css("height"));
            });
            array.sort();
            calbox.css("height", array[array.length - 1]);
        }
    }, _stamp:function ($el) {
        if ($el.attr('id') === undefined || $el.attr('id') === '') {
            $el.attr('id', 'K_' + new Date().getTime());
        }
        return $el.attr('id');
    }, _buildStatusEvent:function () {
        var self = this;
        this.element.unbind('.omCalendar').bind('click.omCalendar',
            function (e) {
                self.toggle();
            }).bind('focus.omCalendar',
            function () {
                $(this).parent().addClass('om-state-hover om-state-active');
            }).bind('blur.omCalendar',
            function () {
                $(this).parent().removeClass('om-state-hover om-state-active');
            }).next().unbind().click(
            function () {
                self.element.trigger('focus');
                self.show();
            }).mouseover(
            function () {
                $(this).parent().addClass('om-state-hover');
            }).mouseout(function () {
            !self.isVisible() && $(this).parent().removeClass('om-state-hover');
        });
    }, _buildBodyEvent:function () {
        var self = this;
        $(document).bind('mousedown.omCalendar', this.globalEvent = function (e) {
            self.hide();
        });
        self.con.mousedown(function (e) {
            e.stopPropagation();
        });
    }, toggle:function () {
        if (!this.isVisible()) {
            this.show();
        } else {
            this.hide();
        }
    }, isVisible:function () {
        if (this.con.css('visibility') == 'hidden') {
            return false;
        }
        return true;
    }, show:function () {
        var $container = this.element.parent();
        this.con.css('visibility', '');
        var _x = $container.offset().left, height = $container.offsetHeight || $container.outerHeight(), _y = $container.offset().top + height;
        this.con.css('left', _x.toString() + 'px');
        this.con.css('top', _y.toString() + 'px');
    }, hide:function () {
        this.con.css('visibility', 'hidden');
    }, destroy:function () {
        var $self = this.element;
        $('body').unbind('.omCalendar', this.globalEvent);
        if (this.options.popup) {
            $self.parent().after($self).remove();
            this.con.remove();
        }
    }, _buildParam:function () {
        var opts = this.options;
        opts.startDay && (opts.startDay = (7 - opts.startDay) % 7);
        !opts.dateFormat && (this._defaultFormat = opts.showTime ? "yy-mm-dd H:i:s" : "yy-mm-dd");
        this.EV = [];
        return this;
    }, _parseParam:function (o) {
        o && $.extend(this.options, o);
        this._handleDate();
    }, _templetShow:function (templet, data) {
        var str_in, value_s, i, m, value, par;
        if (data instanceof Array) {
            str_in = '';
            for (i = 0; i < data.length; i++) {
                str_in += arguments.callee(templet, data[i]);
            }
            templet = str_in;
        } else {
            value_s = templet.match(/{\$(.*?)}/g);
            if (data !== undefined && value_s !== null) {
                for (i = 0, m = value_s.length; i < m; i++) {
                    par = value_s[i].replace(/({\$)|}/g, '');
                    value = (data[par] !== undefined) ? data[par] : '';
                    templet = templet.replace(value_s[i], value);
                }
            }
        }
        return templet;
    }, _handleDate:function () {
        var date = this.options.date;
        this.day = date.getDate();
        this.month = date.getMonth();
        this.year = date.getFullYear();
    }, _getHeadStr:function (year, month) {
        return year.toString() + $.om.lang.omCalendar.year + (Number(month) + 1).toString() + $.om.lang.omCalendar.month;
    }, _monthAdd:function () {
        var self = this;
        if (self.month == 11) {
            self.year++;
            self.month = 0;
        } else {
            self.month++;
        }
        self.options.date.setFullYear(self.year, self.month, 1);
        return this;
    }, _monthMinus:function () {
        var self = this;
        if (self.month === 0) {
            self.year--;
            self.month = 11;
        } else {
            self.month--;
        }
        self.options.date.setFullYear(self.year, self.month, 1);
        return this;
    }, _computeNextMonth:function (a) {
        var _year = a[0], _month = a[1];
        if (_month == 11) {
            _year++;
            _month = 0;
        } else {
            _month++;
        }
        return[_year, _month];
    }, _handleOffset:function () {
        var self = this, i18n = $.om.lang.omCalendar, data = [i18n.Su, i18n.Mo, i18n.Tu, i18n.We, i18n.Th, i18n.Fr, i18n.Sa], temp = '<span>{$day}</span>', offset = this.options.startDay, day_html = '', a = [];
        for (var i = 0; i < 7; i++) {
            a[i] = {day:data[(i - offset + 7) % 7]};
        }
        day_html = self._templetShow(temp, a);
        return{day_html:day_html};
    }});
    $.extend($.om.omCalendar, {Page:function (config, father) {
        var i18n = $.om.lang.omCalendar;
        this.father = father;
        this.month = Number(config.month);
        this.year = Number(config.year);
        this.prevArrow = config.prevArrow;
        this.nextArrow = config.nextArrow;
        this.node = null;
        this.timmer = null;
        this.id = '';
        this.EV = [];
        this.html = ['<div class="om-cal-box" id="{$id}">', '<div class="om-cal-hd om-widget-header">', '<a href="javascript:void(0);" class="om-prev {$prev}"><span class="om-icon om-icon-seek-prev">Prev</span></a>', '<a href="javascript:void(0);" class="om-title">{$title}</a>', '<a href="javascript:void(0);" class="om-next {$next}"><span class="om-icon om-icon-seek-next">Next</span></a>', '</div>', '<div class="om-cal-bd">', '<div class="om-whd">', father._handleOffset().day_html, '</div>', '<div class="om-dbd om-clearfix">', '{$ds}', '</div>', '</div>', '<div class="om-setime om-state-default hidden">', '</div>', '<div class="om-cal-ft {$showtime}">', '<div class="om-cal-time om-state-default">', '时间：00:00 &hearts;', '</div>', '</div>', '<div class="om-selectime om-state-default hidden">', '</div>', '</div><!--#om-cal-box-->'].join("");
        this.nav_html = ['<p>', i18n.month, '<select value="{$the_month}">', '<option class="m1" value="1">01</option>', '<option class="m2" value="2">02</option>', '<option class="m3" value="3">03</option>', '<option class="m4" value="4">04</option>', '<option class="m5" value="5">05</option>', '<option class="m6" value="6">06</option>', '<option class="m7" value="7">07</option>', '<option class="m8" value="8">08</option>', '<option class="m9" value="9">09</option>', '<option class="m10" value="10">10</option>', '<option class="m11" value="11">11</option>', '<option class="m12" value="12">12</option>', '</select>', '</p>', '<p>', i18n.year, '<input type="text" value="{$the_year}" onfocus="this.select()"/>', '</p>', '<p>', '<button class="ok">', i18n.ok, '</button><button class="cancel">', i18n.cancel, '</button>', '</p>'].join("");
        this.Verify = function () {
            var isDay = function (n) {
                if (!/^\d+$/i.test(n)) {
                    return false;
                }
                n = Number(n);
                return!(n < 1 || n > 31);
            }, isYear = function (n) {
                if (!/^\d+$/i.test(n)) {
                    return false;
                }
                n = Number(n);
                return!(n < 100 || n > 10000);
            }, isMonth = function (n) {
                if (!/^\d+$/i.test(n)) {
                    return false;
                }
                n = Number(n);
                return!(n < 1 || n > 12);
            };
            return{isDay:isDay, isYear:isYear, isMonth:isMonth};
        };
        this._renderUI = function () {
            var cc = this, _o = {}, ft, fOpts = cc.father.options;
            cc.HTML = '';
            _o.prev = '';
            _o.next = '';
            _o.title = '';
            _o.ds = '';
            if (!cc.prevArrow) {
                _o.prev = 'hidden';
            }
            if (!cc.nextArrow) {
                _o.next = 'hidden';
            }
            if (!cc.father.showTime) {
                _o.showtime = 'hidden';
            }
            _o.id = cc.id = 'om-cal-' + Math.random().toString().replace(/.\./i, '');
            _o.title = cc.father._getHeadStr(cc.year, cc.month);
            cc.createDS();
            _o.ds = cc.ds;
            cc.father.con.append(cc.father._templetShow(cc.html, _o));
            cc.node = $('#' + cc.id);
            if (fOpts.showTime) {
                ft = cc.node.find('.om-cal-ft');
                ft.removeClass('hidden');
                cc.timmer = new $.om.omCalendar.TimeSelector(ft, cc.father);
            }
            return this;
        };
        this._buildEvent = function () {
            var cc = this, i, con = $('#' + cc.id), fOpts = cc.father.options;
            var span = cc.father.element.parent();
            if (!span.data("bind")) {
                (function (cc) {
                    span.bind("click", function (e) {
                        var con = cc.father.con, fOpts = cc.father.options;
                        if (fOpts.minDate instanceof $ || fOpts.maxDate instanceof $) {
                            var min = $(fOpts.minDate.selector);
                            var max = $(fOpts.maxDate.selector);
                            var date = null;
                            con.find("div.om-dbd a").each(function () {
                                var a = $(this);
                                if (!a.is(".om-state-disabled,.om-null")) {
                                    var day = $.trim(a.html());
                                    if (day != "0" && day != "") {
                                        date = new Date(cc.year + "/" + (cc.month + 1) + "/" + day);
                                        if ((min.size() > 0 && $.trim(min.val()) != "" && date.getTime() < new Date($.trim(min.val()).replace(/\-/ig, "/")).getTime()) || (max.size() > 0 && $.trim(max.val()) != "" && date.getTime() > new Date($.trim(max.val()).replace(/\-/ig, "/")).getTime())) {
                                            a.addClass("om-date-disabled");
                                        } else {
                                            a.removeClass("om-date-disabled");
                                        }
                                    }
                                }
                            });
                        }
                    });
                    span.data("bind", true);
                })(cc);
            }
            cc.EV[0] = con.find('div.om-dbd').bind('mousedown',
                function (e) {
                    var $source = $(e.target);
                    if ($source.filter('.om-null, .om-state-disabled, .om-date-disabled').length > 0) {
                        return;
                    }
                    var selected = Number($source.html());
                    var d = new Date(fOpts.date);
                    d.setFullYear(cc.year, cc.month, selected);
                    cc.father.dt_date = d;
                    if (!fOpts.showTime) {
                        cc.father._trigger("onSelect", e, d);
                    }
                    if (fOpts.popup && !fOpts.showTime) {
                        cc.father.hide();
                        if (!isNaN(cc.father.dt_date)) {
                            var dateStr = $.omCalendar.formatDate(cc.father.dt_date, fOpts.dateFormat || cc.father._defaultFormat);
                            $(cc.father.element).val(dateStr).focus().blur();
                        }
                    }
                    cc.father._render({date:d});
                }).find('a').bind('mouseover',
                function (e) {
                    $(this).addClass('om-state-hover om-state-nobd');
                }).bind('mouseout', function (e) {
                    $(this).removeClass('om-state-hover').not('.om-state-highlight, .om-state-active').removeClass('om-state-nobd');
                });
            cc.EV[1] = con.find('a.om-prev').bind('click', function (e) {
                cc.father._monthMinus()._render();
                return false;
            });
            cc.EV[2] = con.find('a.om-next').bind('click', function (e) {
                cc.father._monthAdd()._render();
                return false;
            });
            cc.EV[3] = con.find('a.om-title').bind('click',
                function (e) {
                    try {
                        cc.timmer.hidePopup();
                    } catch (exp) {
                    }
                    var $source = $(e.target);
                    var in_str = cc.father._templetShow(cc.nav_html, {the_month:cc.month + 1, the_year:cc.year});
                    con.find('.om-setime').html(in_str).removeClass('hidden').find("option:[value=" + (cc.month + 1) + "]").attr("selected", "selected");
                    this.blur();
                    con.find('input').bind('keydown', function (e) {
                        var $source = $(e.target);
                        if (e.keyCode == $.om.keyCode.UP) {
                            $source.val(Number($source.val()) + 1);
                            $source[0].select();
                        }
                        if (e.keyCode == $.om.keyCode.DOWN) {
                            $source.val(Number($source.val()) - 1);
                            $source[0].select();
                        }
                        if (e.keyCode == $.om.keyCode.ENTER) {
                            var _month = con.find('.om-setime select').val();
                            var _year = con.find('.om-setime input').val();
                            con.find('.om-setime').addClass('hidden');
                            if (!cc.Verify().isYear(_year)) {
                                return;
                            }
                            if (!cc.Verify().isMonth(_month)) {
                                return;
                            }
                            cc.father._render({date:cc._computeDate(cc, _year, _month)});
                        }
                    });
                    return false;
                }).bind("mouseover",
                function (e) {
                    $(this).addClass("om-state-hover");
                }).bind("mouseout", function (e) {
                    $(this).removeClass("om-state-hover");
                });
            cc.EV[4] = con.find('.om-setime').bind('click', function (e) {
                e.preventDefault();
                var $source = $(e.target), $this = $(this);
                if ($source.hasClass('ok')) {
                    var _month = $this.find('select').val(), _year = $this.find('input').val();
                    $this.addClass('hidden');
                    if (!cc.Verify().isYear(_year)) {
                        return;
                    }
                    if (!cc.Verify().isMonth(_month)) {
                        return;
                    }
                    _month = _month - $this.parent().prevAll('.om-cal-box').length - 1;
                    cc.father._render({date:cc._computeDate(cc, _year, _month)});
                } else if ($source.hasClass('cancel')) {
                    $this.addClass('hidden');
                }
            });
        };
        this._computeDate = function (cc, year, month) {
            var result = new Date(cc.father.options.date.getTime());
            result.setFullYear(year, month);
            return result;
        };
        this._getNode = function () {
            var cc = this;
            return cc.node;
        };
        this._getNumOfDays = function (year, month) {
            return 32 - new Date(year, month - 1, 32).getDate();
        };
        this.createDS = function () {
            var cc = this, fOpts = cc.father.options, s = '', startweekday = (new Date(cc.year + '/' + (cc.month + 1) + '/01').getDay() + fOpts.startDay + 7) % 7, k = cc._getNumOfDays(cc.year, cc.month + 1) + startweekday, i, _td_s;
            var _dis_days = [];
            for (i = 0; i < fOpts.disabledDays.length; i++) {
                _dis_days[i] = fOpts.disabledDays[i] % 7;
            }
            for (i = 0; i < k; i++) {
                var _td_e = new Date(cc.year + '/' + Number(cc.month + 1) + '/' + (i + 1 - startweekday).toString());
                if (i < startweekday) {
                    s += '<a href="javascript:void(0);" class="om-null" >0</a>';
                } else if ($.inArray((i + fOpts.startDay) % 7, _dis_days) >= 0) {
                    s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                } else if (fOpts.disabledFn(_td_e) === false) {
                    s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                } else if (fOpts.minDate instanceof Date && new Date(cc.year + '/' + (cc.month + 1) + '/' + (i + 1 - startweekday)).getTime() < (fOpts.minDate.getTime() + 1)) {
                    s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                } else if (fOpts.maxDate instanceof Date && new Date(cc.year + '/' + (cc.month + 1) + '/' + (i + 1 - startweekday)).getTime() > fOpts.maxDate.getTime()) {
                    s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                } else if (i == (startweekday + (new Date()).getDate() - 1) && (new Date()).getFullYear() == cc.year && (new Date()).getMonth() == cc.month) {
                    s += '<a href="javascript:void(0);" class="om-state-highlight om-state-nobd">' + (i - startweekday + 1) + '</a>';
                } else if (i == (startweekday + fOpts.date.getDate() - 1) && cc.month == fOpts.date.getMonth() && cc.year == fOpts.date.getFullYear()) {
                    s += '<a href="javascript:void(0);" class="om-state-active om-state-nobd">' + (i - startweekday + 1) + '</a>';
                } else {
                    s += '<a href="javascript:void(0);">' + (i - startweekday + 1) + '</a>';
                }
            }
            if (k % 7 !== 0) {
                for (i = 0; i < (7 - k % 7); i++) {
                    s += '<a href="javascript:void(0);" class="om-null">0</a>';
                }
            }
            cc.ds = s;
        };
        this._render = function () {
            var cc = this;
            cc._renderUI();
            cc._buildEvent();
        };
    }});
    $.extend($.om.omCalendar, {TimeSelector:function (ft, father) {
        var date = father.options.date, i18n = $.om.lang.omCalendar;
        this.father = father;
        this.fcon = ft.parent('.om-cal-box');
        this.popupannel = this.fcon.find('.om-selectime');
        if (typeof date == 'undefined') {
            father.options.date = new Date();
        }
        this.time = father.options.date;
        this.status = 's';
        this.ctime = $('<div class="om-cal-time om-state-default">' + i18n.time + '：<span class="h">h</span>:<span class="m">m</span>:<span class="s">s</span><!--{{arrow--><div class="cta"><button class="u om-icon om-icon-triangle-1-n"></button><button class="d om-icon om-icon-triangle-1-s"></button></div><!--arrow}}--></div>');
        this.button = $('<button class="ct-ok om-state-default">' + i18n.ok + '</button>');
        this.h_a = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        this.m_a = ['00', '10', '20', '30', '40', '50'];
        this.s_a = ['00', '10', '20', '30', '40', '50'];
        this.parseSubHtml = function (a) {
            var in_str = '';
            for (var i = 0; i < a.length; i++) {
                in_str += '<a href="javascript:void(0);" class="om-cal-item">' + a[i] + '</a>';
            }
            in_str += '<a href="javascript:void(0);" class="x">x</a>';
            return in_str;
        };
        this.showPopup = function (instr) {
            var self = this;
            this.popupannel.html(instr);
            this.popupannel.removeClass('hidden');
            var status = self.status;
            var active_cls = "om-state-active om-state-nobd";
            self.ctime.find('span').removeClass(active_cls);
            switch (status) {
                case'h':
                    self.ctime.find('.h').addClass(active_cls);
                    break;
                case'm':
                    self.ctime.find('.m').addClass(active_cls);
                    break;
                case's':
                    self.ctime.find('.s').addClass(active_cls);
                    break;
            }
        };
        this.hidePopup = function () {
            this.popupannel.addClass('hidden');
        };
        this._render = function () {
            var self = this;
            var h = self.get('h');
            var m = self.get('m');
            var s = self.get('s');
            self.father._time = self.time;
            self.ctime.find('.h').html(h);
            self.ctime.find('.m').html(m);
            self.ctime.find('.s').html(s);
            return self;
        };
        this.set = function (status, v) {
            var self = this;
            v = Number(v);
            switch (status) {
                case'h':
                    self.time.setHours(v);
                    break;
                case'm':
                    self.time.setMinutes(v);
                    break;
                case's':
                    self.time.setSeconds(v);
                    break;
            }
            self._render();
        };
        this.get = function (status) {
            var self = this;
            var time = self.time;
            switch (status) {
                case'h':
                    return time.getHours();
                case'm':
                    return time.getMinutes();
                case's':
                    return time.getSeconds();
            }
        };
        this.add = function () {
            var self = this;
            var status = self.status;
            var v = self.get(status);
            v++;
            self.set(status, v);
        };
        this.minus = function () {
            var self = this;
            var status = self.status;
            var v = self.get(status);
            v--;
            self.set(status, v);
        };
        this._timeInit = function () {
            var self = this;
            ft.html('').append(self.ctime);
            ft.append(self.button);
            self._render();
            self.popupannel.bind('click', function (e) {
                var el = $(e.target);
                if (el.hasClass('x')) {
                    self.hidePopup();
                } else if (el.hasClass('om-cal-item')) {
                    var v = Number(el.html());
                    self.set(self.status, v);
                    self.hidePopup();
                }
            });
            self.button.bind('click', function (e) {
                var fOpts = self.father.options;
                var d = typeof self.father.dt_date == 'undefined' ? fOpts.date : self.father.dt_date;
                d.setHours(self.get('h'));
                d.setMinutes(self.get('m'));
                d.setSeconds(self.get('s'));
                self.father._trigger("onSelect", e, d);
                if (fOpts.popup) {
                    var dateStr = $.omCalendar.formatDate(d, fOpts.dateFormat || self.father._defaultFormat);
                    $(self.father.element).val(dateStr);
                    self.father.hide();
                }
            });
            self.ctime.bind('keyup', function (e) {
                if (e.keyCode == $.om.keyCode.UP || e.keyCode == $.om.keyCode.LEFT) {
                    e.preventDefault();
                    self.add();
                }
                if (e.keyCode == $.om.keyCode.DOWN || e.keyCode == $.om.keyCode.RIGHT) {
                    e.preventDefault();
                    self.minus();
                }
            });
            self.ctime.find('.u').bind('click', function () {
                self.hidePopup();
                self.add();
            });
            self.ctime.find('.d').bind('click', function () {
                self.hidePopup();
                self.minus();
            });
            self.ctime.find('.h').bind('click', function () {
                var in_str = self.parseSubHtml(self.h_a);
                self.status = 'h';
                self.showPopup(in_str);
            });
            self.ctime.find('.m').bind('click', function () {
                var in_str = self.parseSubHtml(self.m_a);
                self.status = 'm';
                self.showPopup(in_str);
            });
            self.ctime.find('.s').bind('click', function () {
                var in_str = self.parseSubHtml(self.s_a);
                self.status = 's';
                self.showPopup(in_str);
            });
        };
        this._timeInit();
    }});
    $.omCalendar = $.omCalendar || {};
    $.extend($.omCalendar, {leftPad:function (val, size, ch) {
        var result = new String(val);
        if (!ch) {
            ch = " ";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result.toString();
    }});
    $.extend($.omCalendar, {getShortDayName:function (day) {
        return $.omCalendar.dayMaps[day][0];
    }, getDayName:function (day) {
        return $.omCalendar.dayMaps[day][1];
    }, getShortMonthName:function (month) {
        return $.omCalendar.monthMaps[month][0];
    }, getMonthName:function (month) {
        return $.omCalendar.monthMaps[month][1];
    }, dayMaps:[
        ['Sun', 'Sunday'],
        ['Mon', 'Monday'],
        ['Tue', 'Tuesday'],
        ['Wed', 'Wednesday'],
        ['Thu', 'Thursday'],
        ['Fri', 'Friday'],
        ['Sat', 'Saturday']
    ], monthMaps:[
        ['Jan', 'January'],
        ['Feb', 'February'],
        ['Mar', 'March'],
        ['Apr', 'April'],
        ['May', 'May'],
        ['Jun', 'June'],
        ['Jul', 'July'],
        ['Aug', 'August'],
        ['Sep', 'September'],
        ['Oct', 'October'],
        ['Nov', 'November'],
        ['Dec', 'December']
    ], formatCodes:{d:{g:"this.getDate()", s:"this.setDate({param})", r:"(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])"}, dd:{g:"$.omCalendar.leftPad(this.getDate(), 2, '0')", s:"this.setDate(parseInt('{param}', 10))", r:"(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])"}, m:{g:"(this.getMonth() + 1)", s:"this.setMonth(parseInt('{param}', 10) - 1)", r:"(0[1-9]|1[0-2]|[1-9])"}, mm:{g:"$.omCalendar.leftPad(this.getMonth() + 1, 2, '0')", s:"this.setMonth(parseInt('{param}', 10) - 1)", r:"(0[1-9]|1[0-2]|[1-9])"}, y:{g:"('' + this.getFullYear()).substring(2, 4)", s:"this.setFullYear(parseInt('20{param}', 10))", r:"(\\d{2})"}, yy:{g:"this.getFullYear()", s:"this.setFullYear(parseInt('{param}', 10))", r:"(\\d{4})"}, h:{g:"$.omCalendar.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')", s:"this.setHours(parseInt('{param}', 10))", r:"(0[0-9]|1[0-1])"}, H:{g:"$.omCalendar.leftPad(this.getHours(), 2, '0')", s:"this.setHours(parseInt('{param}', 10))", r:"([0-1][0-9]|2[0-3])"}, g:{g:"((this.getHours() % 12) ? this.getHours() % 12 : 12)", s:"this.setHours(parseInt('{param}', 10))", r:"([0-9]|1[0-1])"}, G:{g:"this.getHours()", s:"this.setHours(parseInt('{param}', 10))", r:"([0-9]|1[0-9]|2[0-3])"}, i:{g:"$.omCalendar.leftPad(this.getMinutes(), 2, '0')", s:"this.setMinutes(parseInt('{param}', 10))", r:"([0-5][0-9])"}, s:{g:"$.omCalendar.leftPad(this.getSeconds(), 2, '0')", s:"this.setSeconds(parseInt('{param}', 10))", r:"([0-5][0-9])"}, u:{g:"$.omCalendar.leftPad(this.getMilliseconds(), 3, '0')", s:"this.setMilliseconds(parseInt('{param}', 10))", r:"(\\d{1,3})"}, D:{g:"$.omCalendar.getShortDayName(this.getDay())", s:"", r:""}, DD:{g:"$.omCalendar.getDayName(this.getDay())", s:"", r:""}, M:{g:"$.omCalendar.getShortMonthName(this.getMonth())", s:"", r:""}, MM:{g:"$.omCalendar.getMonthName(this.getMonth())", s:"", r:""}, a:{g:"(this.getHours() < 12 ? 'am' : 'pm')", s:"", r:""}, A:{g:"(this.getHours() < 12 ? 'AM' : 'PM')", s:"", r:""}}});
    $.extend($.omCalendar, {formatDate:function (date, formatter) {
        if (!date || !formatter) {
            return null;
        }
        if (!(Object.prototype.toString.call(date) === '[object Date]')) {
            return null;
        }
        var i, fi, result = '', literal = false;
        for (i = 0; i < formatter.length; i++) {
            fi = formatter.charAt(i);
            fi_next = formatter.charAt(i + 1);
            if (fi == "'") {
                literal = !literal;
                continue;
            }
            if (!literal && $.omCalendar.formatCodes[fi + fi_next]) {
                fi = new Function("return " + $.omCalendar.formatCodes[fi + fi_next].g).call(date);
                i++;
            } else if (!literal && $.omCalendar.formatCodes[fi]) {
                fi = new Function("return " + $.omCalendar.formatCodes[fi].g).call(date);
            }
            result += fi;
        }
        return result;
    }, parseDate:function (date_string, formatter) {
        if (!date_string || !formatter) {
            return null;
        }
        if (!(Object.prototype.toString.call(date_string) === '[object String]')) {
            return null;
        }
        var setterArr = [], i, fi, $fci = null, m_result;
        for (i = 0; i < formatter.length; i++) {
            fi = formatter.charAt(i);
            fi_next = formatter.charAt(i + 1);
            if ($.omCalendar.formatCodes[fi + fi_next]) {
                $fci = $.omCalendar.formatCodes[fi + fi_next];
                i++;
            } else if ($.omCalendar.formatCodes[fi]) {
                $fci = $.omCalendar.formatCodes[fi];
            } else {
                continue;
            }
            m_result = date_string.match(new RegExp($fci.r));
            if (!m_result) {
                return null;
            }
            setterArr.push($fci.s.replace('{param}', m_result[0]));
            date_string = date_string.substring(m_result.index + m_result[0].length);
            var newChar = formatter.charAt(i + 1);
            if (!(newChar == "" && date_string == "") && (newChar !== date_string.charAt(0)) && ($.omCalendar.formatCodes[newChar] === undefined)) {
                return null;
            }
        }
        var date = new Date();
        new Function(setterArr.join(";")).call(date);
        return date;
    }});
    $.om.lang.omCalendar = {year:'年', month:'月', Su:'日', Mo:'一', Tu:'二', We:'三', Th:'四', Fr:'五', Sa:'六', cancel:'取消', ok:'确定', time:'时间'};
})(jQuery);
;
(function ($) {
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (item) {
            var len = this.length;
            for (var i = 0; i < len; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return-1;
        };
    }
    $.omWidget('om.omCombo', {options:{optionField:'text', valueField:'value', width:'auto', disabled:false, readOnly:false, editable:true, lazyLoad:false, listMaxHeight:300, listAutoWidth:false, autoFilter:true, filterStrategy:'first', filterDelay:500, forceSelection:false, multi:false, multiSeparator:','}, _init:function () {
        var options = this.options, inputEl = this.textInput, source = options.dataSource;
        if (!options.inputField) {
            options.inputField = options.optionField;
        }
        if (typeof options.value !== 'undefined') {
            options.lazyLoad = false;
        }
        if (options.width != 'auto') {
            var span = inputEl.parent().width(options.width);
            inputEl.width(span.innerWidth() - inputEl.next().outerWidth() - inputEl.outerWidth() + inputEl.width());
        }
        if (options.multi) {
            options.editable = this.options.editable = false;
        }
        this._refeshEmptyText(options.emptyText);
        options.disabled ? inputEl.attr('disabled', true) : inputEl.removeAttr('disabled');
        (options.readOnly || !options.editable) ? inputEl.attr('readonly', 'readOnly') : inputEl.removeAttr('readonly');
        if (!options.lazyLoad) {
            this._toggleLoading('add');
            if (source && typeof source == 'string') {
                this._ajaxLoad(source);
            } else if (source && typeof source == 'object') {
                this._loadData(source);
                this._toggleLoading('remove');
            } else {
                this.dataHasLoaded = true;
                this._toggleLoading('remove');
            }
        } else {
            this.dataHasLoaded = false;
        }
        var unusable = options.disabled || options.readOnly;
        if (unusable) {
            this.expandTrigger.addClass('om-state-disabled');
        } else {
            this._bindEvent();
        }
    }, _create:function () {
        var valueEl = this.element;
        var span = $('<span class="om-combo om-widget om-state-default"></span>').insertAfter(valueEl).wrapInner(valueEl);
        this.textInput = valueEl.clone().removeAttr("id").removeAttr("name").appendTo(span);
        this.expandTrigger = $('<span class="om-combo-trigger"></span>').appendTo(span);
        valueEl.hide();
        this.dropList = $($('<div class="om-widget"><div class="om-widget-content om-droplist"></div></div>').css({position:'absolute', zIndex:2000}).appendTo(document.body).children()[0]).hide();
    }, setData:function (param) {
        var self = this, inputEl = self.textInput, valueEl = self.element;
        self.options.value = '';
        valueEl.val('');
        inputEl.val('');
        self._toggleLoading('add');
        if (typeof param === 'string') {
            self._ajaxLoad(param);
        } else {
            self._loadData(param);
            self._toggleLoading('remove');
        }
    }, getData:function () {
        var returnValue = this.options.dataSource;
        return(typeof returnValue == 'object') ? returnValue : null;
    }, value:function (v) {
        if (typeof v === 'undefined') {
            var value = this.element.val();
            return value ? value : '';
        } else {
            this._setValue(v + '');
            return this;
        }
    }, disable:function () {
        var input = this.element;
        input.attr('disabled', true).unbind();
        this.options.disabled = true;
        this.expandTrigger.addClass('om-state-disabled').unbind();
    }, enable:function () {
        var input = this.element;
        input.removeAttr('disabled').unbind();
        this.options.disabled = false;
        this.expandTrigger.removeClass('om-state-disabled').unbind();
        this._bindEvent();
    }, destroy:function () {
        var $input = this.element;
        $(document).unbind('mousedown.omCombo', this.globalEvent);
        $input.parent().after($input).remove();
        this.dropList.parent().remove();
    }, _bindEvent:function () {
        var self = this, options = self.options, input = self.textInput, valueEl = self.element, dropList = self.dropList, expandTrigger = self.expandTrigger, emptyText = options.emptyText;
        var isFocus = false, span = input.parent('span');
        span.mouseenter(
            function () {
                if (!options.disabled) {
                    span.addClass("om-state-hover");
                }
            }).mouseleave(
            function () {
                span.removeClass("om-state-hover");
            }).mousedown(function (e) {
            e.stopPropagation();
        });
        input.focus(
            function () {
                if (isFocus)
                    return;
                isFocus = true;
                $('.om-droplist').hide();
                span.addClass('om-state-focus');
                self._refeshEmptyText(emptyText);
                if (!self.dataHasLoaded) {
                    if (!expandTrigger.hasClass('om-loading')) {
                        self._toggleLoading('add');
                        if (typeof(options.dataSource) == 'object') {
                            self._loadData(options.dataSource);
                            self._toggleLoading('remove');
                        } else if (typeof(options.dataSource) == 'string') {
                            self._ajaxLoad(options.dataSource);
                        } else {
                            self.dataHasLoaded = true;
                            self._toggleLoading('remove');
                        }
                    }
                }
                if (!options.disabled && !options.readOnly) {
                    self._showDropList();
                }
            }).blur(
            function (e) {
                isFocus = false;
                span.removeClass('om-state-focus');
                input.removeClass('om-combo-focus');
                if (!options.disabled && !options.readOnly && !options.multi) {
                    if (self.hasManualInput) {
                        self.hasManualInput = false;
                        var text = input.val();
                        if (text !== '') {
                            var allInputText = $.data(valueEl, 'allInputText');
                            var allValues = $.data(valueEl, 'allValues');
                            var index = allInputText.indexOf(text);
                            if (index > -1) {
                                self._setValue(allValues[index]);
                            } else if (!options.forceSelection) {
                                valueEl.val(input.val());
                            } else {
                                var value = valueEl.val();
                                index = allValues.indexOf(value);
                                if (index > -1) {
                                    input.val(allInputText[index]);
                                } else {
                                    input.val('');
                                }
                            }
                        } else {
                            valueEl.val('');
                        }
                    }
                    self._refeshEmptyText(emptyText);
                }
            }).keyup(function (e) {
                var key = e.keyCode, value = $.om.keyCode;
                switch (key) {
                    case value.DOWN:
                        self._selectNext();
                        break;
                    case value.UP:
                        self._selectPrev();
                        break;
                    case value.ENTER:
                        self._backfill(self.dropList.find('.om-state-hover'));
                        break;
                    case value.ESCAPE:
                        dropList.hide();
                        break;
                    case value.TAB:
                        break;
                    default:
                        self.hasManualInput = true;
                        if (!options.disabled && !options.readOnly && options.editable && options.autoFilter) {
                            if (window._omcomboFilterTimer) {
                                clearTimeout(window._omcomboFilterTimer);
                            }
                            window._omcomboFilterTimer = setTimeout(function () {
                                if ($(document).attr('activeElement').id == input.attr('id')) {
                                    dropList.show();
                                }
                                self._doFilter(input);
                            }, options.filterDelay);
                        }
                }
            });
        dropList.mousedown(function (e) {
            e.stopPropagation();
        });
        expandTrigger.click(
            function () {
                !expandTrigger.hasClass('om-loading') && input.focus();
            }).mousedown(
            function () {
                !expandTrigger.hasClass('om-loading') && span.addClass('om-state-active');
            }).mouseup(function () {
            !expandTrigger.hasClass('om-loading') && span.removeClass('om-state-active');
        });
        $(document).bind('mousedown.omCombo', this.globalEvent = function () {
            dropList.hide();
        });
    }, _showDropList:function () {
        var self = this, options = self.options, inputEl = self.textInput, valueInput = self.element, dropList = self.dropList.scrollTop(0).css('height', 'auto'), valuedItem, nowValue = valueInput.val(), $listRows = dropList.find('.om-combo-list-row'), allItems = self._getAllOptionsBeforeFiltered().removeClass('om-helper-hidden om-state-hover');
        if (allItems.size() <= 0) {
            return;
        }
        $listRows.removeClass('om-combo-selected');
        if (nowValue !== undefined && nowValue !== '') {
            var allValues = $.data(valueInput, 'allValues');
            if (options.multi) {
                var selectedValues = nowValue.split(options.multiSeparator);
                for (var i = 0; i < selectedValues.length; i++) {
                    var index = allValues.indexOf(selectedValues[i]);
                    if (index > -1) {
                        $(dropList.find('.om-combo-list-row').get(index)).addClass('om-combo-selected');
                    }
                }
                valueItem = selectedValues[0];
            } else {
                var index = allValues ? allValues.indexOf(nowValue) : -1;
                if (index > -1) {
                    valuedItem = $(dropList.find('.om-combo-list-row').get(index)).addClass('om-combo-selected');
                }
            }
        }
        var dropListContainer = dropList.parent(), span = inputEl.parent();
        if (!options.listAutoWidth) {
            dropListContainer.width(span.outerWidth());
        } else {
            if ($.browser.msie && ($.browser.version == "7.0") && !$.support.style) {
                dropListContainer.width(dropList.show().outerWidth());
            } else {
                dropListContainer.width(dropList.outerWidth());
            }
        }
        if (options.listMaxHeight != 'auto' && dropList.show().height() > options.listMaxHeight) {
            dropList.height(options.listMaxHeight).css('overflow-y', 'auto');
        }
        var inputPos = span.offset();
        dropListContainer.css({'left':inputPos.left, 'top':inputPos.top + span.outerHeight()});
        dropList.show();
        if (valuedItem) {
            dropList.scrollTop($(valuedItem).offset().top - dropList.offset().top);
        }
    }, _toggleLoading:function (type) {
        if (!this.options.disabled) {
            if (type == 'add') {
                this.expandTrigger.removeClass('om-icon-carat-1-s').addClass('om-loading');
            } else if (type == 'remove') {
                this.expandTrigger.removeClass('om-loading').addClass('om-icon-carat-1-s');
            }
        }
    }, _ajaxLoad:function (url) {
        var self = this;
        var options = this.options;
        $.ajax({url:url, method:'POST', dataType:'json', success:function (data, textStatus) {
            self.dataHasLoaded = true;
            var onSuccess = options.onSuccess;
            if (onSuccess && self._trigger("onSuccess", null, data, textStatus) === false) {
                options.dataSource = data;
                return;
            }
            self._loadData(data);
            self._toggleLoading('remove');
        }, error:function (XMLHttpRequest, textStatus, errorThrown) {
            self.dataHasLoaded = true;
            if (options.onError) {
                self._toggleLoading('remove');
                self._trigger("onError", null, XMLHttpRequest, textStatus, errorThrown);
            } else {
                self._toggleLoading('remove');
                throw new Error('An error occurred while load records from URL "' + url + '",the error message is:' + errorThrown.message);
            }
        }});
    }, _loadData:function (records) {
        var options = this.options, valueEl = this.element;
        options.dataSource = records;
        this.dataHasLoaded = true;
        var inputField = options.inputField;
        var allInputText = [];
        if (typeof inputField === 'string') {
            $(records).each(function () {
                allInputText.push(this[inputField]);
            });
        } else {
            $(records).each(function (index) {
                allInputText.push(inputField(this, index));
            });
        }
        $.data(valueEl, 'allInputText', allInputText);
        var valueField = options.valueField;
        var allValues = [];
        if (typeof valueField === 'string') {
            $(records).each(function () {
                allValues.push('' + this[valueField]);
            });
        } else {
            $(records).each(function (index) {
                allValues.push('' + valueField(this, index));
            });
        }
        $.data(valueEl, 'allValues', allValues);
        var dropList = this.dropList.empty();
        if (options.listProvider) {
            var selectableOptions = options.listProvider(dropList, records);
            if (selectableOptions) {
                selectableOptions.each(function () {
                    $(this).addClass('om-combo-list-row');
                });
            }
        } else {
            var optionField = options.optionField;
            var innerHtml = '';
            var self = this;
            if (typeof optionField === 'string') {
                $(records).each(function (index) {
                    innerHtml += self._wrapText(this[options.optionField]);
                });
            } else {
                $(records).each(function (index) {
                    innerHtml += self._wrapText(options.optionField(this, index));
                });
            }
            if (innerHtml) {
                $(innerHtml).appendTo(dropList);
                dropList.show().css('height', 'auto');
                if (options.listMaxHeight != 'auto' && dropList.height() > options.listMaxHeight) {
                    dropList.height(options.listMaxHeight).css('overflow-y', 'auto');
                }
                dropList.hide();
                if (valueEl.parent().hasClass('om-state-hover')) {
                    self._showDropList();
                }
            }
        }
        if (options.value) {
            this._setValue('' + options.value);
        }
        this._bindEventsToList();
    }, _bindEventsToList:function () {
        var self = this, items = self._getAllOptionsBeforeFiltered();
        items.hover(
            function () {
                items.removeClass('om-state-hover');
                $(this).addClass('om-state-hover');
            },
            function () {
                $(this).removeClass('om-state-hover');
            }).mousedown(function () {
            self._backfill(this);
        });
    }, _wrapText:function (text) {
        return'<div class="om-combo-list-row">' + text + '</div>';
    }, _setValue:function (value) {
        var input = this.textInput, valueEl = this.element;
        var valueChange = true;
        var oldValue = valueEl.val();
        var options = this.options;
        if (value == oldValue) {
            valueChange = false;
        }
        var allValues = $.data(valueEl, 'allValues');
        var inputText = [], values = [];
        if (options.multi) {
            values = value.split(options.multiSeparator);
        } else {
            values.push(value);
        }
        for (var i = 0; i < values.length; i++) {
            var index = allValues ? allValues.indexOf(values[i]) : -1;
            if (index > -1) {
                inputText.push($.data(valueEl, 'allInputText')[index]);
            } else if (!options.forceSelection) {
                inputText.push(value);
            } else {
                valueEl.val('');
                value = '';
            }
        }
        valueEl.val(value);
        if (options.multi) {
            input.val(inputText.join(options.multiSeparator));
        } else {
            input.val(inputText.join(''));
        }
        options.value = value;
        if (options.onValueChange && valueChange) {
            this._trigger("onValueChange", null, input, value, oldValue);
        }
        this._refeshEmptyText(options.emptyText);
    }, _findHighlightItem:function () {
        var dropList = this.dropList;
        var hoverItem = dropList.find('.om-state-hover');
        if (hoverItem.length > 0) {
            return hoverItem;
        }
        var selectedItems = dropList.find('.om-combo-selected');
        return selectedItems.length > 0 ? selectedItems[0] : selectedItems;
    }, _selectPrev:function () {
        var highLightItem = this._findHighlightItem();
        var all = this._getAllOptionsAfterFiltered();
        var nowIndex = all.index(highLightItem);
        var currentItem = $(all[nowIndex]);
        if (nowIndex === 0) {
            nowIndex = all.length;
        } else if (nowIndex == -1) {
            nowIndex = all.length;
        }
        var preNeighborItem = $(all[nowIndex - 1]);
        this._highLisghtAndScrollTo(currentItem, preNeighborItem);
    }, _selectNext:function () {
        var dropList = this.dropList;
        if (dropList.css('display') == 'none') {
            this._showDropList();
            return;
        }
        var all = this._getAllOptionsAfterFiltered();
        var nowIndex = all.index(this._findHighlightItem());
        var currentItem = $(all[nowIndex]);
        if (nowIndex == all.length - 1) {
            nowIndex = -1;
        }
        var nextNeighbor = $(all[nowIndex + 1]);
        this._highLisghtAndScrollTo(currentItem, nextNeighbor);
    }, _highLisghtAndScrollTo:function (currentItem, targetItem) {
        var dropList = this.dropList;
        currentItem.removeClass('om-state-hover');
        targetItem.addClass('om-state-hover');
        if (targetItem.position().top <= 0) {
            dropList.scrollTop(dropList.scrollTop() + targetItem.position().top);
        } else if (targetItem.position().top + targetItem.outerHeight() > dropList.height()) {
            dropList.scrollTop(dropList.scrollTop() + targetItem.position().top + targetItem.outerHeight() - dropList.height());
        }
    }, _backfill:function (source) {
        if (source.length === 0) {
            return;
        }
        var self = this, valueEl = self.element, dropList = self.dropList, options = self.options, enableMulti = options.multi;
        if (enableMulti) {
            $(source).toggleClass('om-combo-selected').removeClass('om-state-hover');
        } else {
            this._getAllOptionsBeforeFiltered().removeClass('om-combo-selected');
            $(source).addClass('om-combo-selected');
        }
        if (dropList.css('display') == 'none') {
            return;
        }
        var value = [], selectedIndexs = dropList.find('.om-combo-selected');
        for (var i = 0; i < selectedIndexs.length; i++) {
            var nowIndex = $(selectedIndexs[i]).index();
            if (nowIndex > -1) {
                value.push($.data(valueEl, 'allValues')[nowIndex]);
            }
        }
        this._setValue(value.join(enableMulti ? options.multiSeparator : ''));
        if (!enableMulti) {
            dropList.hide();
        }
    }, _getAllOptionsBeforeFiltered:function () {
        return this.dropList.find('.om-combo-list-row');
    }, _getAllOptionsAfterFiltered:function () {
        var dropList = this.dropList;
        return dropList.find('.om-combo-list-row').not(dropList.find('.om-helper-hidden'));
    }, _doFilter:function () {
        var self = this, inputEl = self.textInput, valueEl = self.element, options = self.options;
        records = options.dataSource, filterStrategy = options.filterStrategy, text = inputEl.val(), needShow = false, items = self._getAllOptionsBeforeFiltered(), allInputText = $.data(valueEl, 'allInputText');
        $(records).each(function (index) {
            if (self._filetrPass(filterStrategy, text, records[index], allInputText[index])) {
                $(items.get(index)).removeClass('om-helper-hidden');
                needShow = true;
            } else {
                $(items.get(index)).addClass('om-helper-hidden');
            }
        });
        var dropList = this.dropList.css('height', 'auto');
        if (options.listMaxHeight != 'auto' && dropList.height() > options.listMaxHeight) {
            dropList.height(options.listMaxHeight).css('overflow-y', 'auto');
        }
        if (!needShow) {
            dropList.hide();
        }
    }, _filetrPass:function (filterStrategy, text, record, inputText) {
        if (text === '') {
            return true;
        }
        if (typeof filterStrategy === 'function') {
            return filterStrategy(text, record);
        } else {
            if (filterStrategy === 'first') {
                return inputText.indexOf(text) === 0;
            } else if (filterStrategy === 'anywhere') {
                return inputText.indexOf(text) > -1;
            } else if (filterStrategy === 'last') {
                var i = inputText.lastIndexOf(text);
                return i > -1 && i + text.length == inputText.length;
            } else {
                return false;
            }
        }
    }, _refeshEmptyText:function (emptyText) {
        var inputEl = this.textInput;
        if (!emptyText)
            return;
        if (inputEl.val() === '') {
            inputEl.val(emptyText).addClass('om-empty-text');
        } else {
            if (inputEl.val() === emptyText) {
                inputEl.val('');
            }
            inputEl.removeClass('om-empty-text');
        }
    }});
})(jQuery);
(function ($, undefined) {
    var uiDialogClasses = 'om-dialog ' + 'om-widget ' + 'om-widget-content ' + 'om-corner-all ', sizeRelatedOptions = {buttons:true, height:true, maxHeight:true, maxWidth:true, minHeight:true, minWidth:true, width:true}, resizableRelatedOptions = {maxHeight:true, maxWidth:true, minHeight:true, minWidth:true}, attrFn = $.attrFn || {val:true, css:true, html:true, text:true, data:true, width:true, height:true, offset:true, click:true};
    $.omWidget("om.omDialog", {options:{autoOpen:true, buttons:{}, closeOnEscape:true, closeText:'close', dialogClass:'', draggable:true, hide:null, height:'auto', maxHeight:false, maxWidth:false, minHeight:150, minWidth:150, modal:false, position:{my:'center', at:'center', collision:'fit', using:function (pos) {
        var topOffset = $(this).css(pos).offset().top;
        if (topOffset < 0) {
            $(this).css('top', pos.top - topOffset);
        }
    }}, resizable:true, show:null, stack:true, title:'', width:300, zIndex:1000}, _create:function () {
        this.originalTitle = this.element.attr('title');
        if (typeof this.originalTitle !== "string") {
            this.originalTitle = "";
        }
        this.options.title = this.options.title || this.originalTitle;
        var self = this;
        self.element.parent().bind("om-remove.omDialog", (self.__removeBind = function () {
            self.element.remove();
        }));
        var options = self.options, title = options.title || '&#160;', titleId = $.om.omDialog.getTitleId(self.element), uiDialog = (self.uiDialog = $('<div></div>')).appendTo(window._top.document.body).hide().addClass(uiDialogClasses + options.dialogClass).css({zIndex:options.zIndex}).attr('tabIndex', -1).css('outline', 0).keydown(
            function (event) {
                if (options.closeOnEscape && event.keyCode && event.keyCode === $.om.keyCode.ESCAPE) {
                    self.close(event);
                    event.preventDefault();
                }
            }).attr({role:'dialog', 'aria-labelledby':titleId}).mousedown(function (event) {
            self.moveToTop(false, event);
        }), uiDialogContent = self.element.show().removeAttr('title').addClass('om-dialog-content ' + 'om-widget-content').appendTo(uiDialog), uiDialogTitlebar = (self.uiDialogTitlebar = $('<div></div>')).addClass('om-dialog-titlebar ' + 'om-widget-header ' + 'om-corner-all ' + 'om-helper-clearfix').prependTo(uiDialog), uiDialogTitlebarClose = $('<a href="#"></a>').addClass('om-dialog-titlebar-close ' + 'om-corner-tr').attr('role', 'button').hover(
            function () {
                uiDialogTitlebarClose.addClass('om-state-hover');
            },
            function () {
                uiDialogTitlebarClose.removeClass('om-state-hover');
            }).focus(
            function () {
                uiDialogTitlebarClose.addClass('om-state-focus');
            }).blur(
            function () {
                uiDialogTitlebarClose.removeClass('om-state-focus');
            }).click(
            function (event) {
                self.close(event);
                return false;
            }).appendTo(uiDialogTitlebar), uiDialogTitlebarCloseText = (self.uiDialogTitlebarCloseText = $('<span></span>')).addClass('om-icon-closethick').text(options.closeText).appendTo(uiDialogTitlebarClose), uiDialogTitle = $('<span></span>').addClass('om-dialog-title').attr('id', titleId).html(title).prependTo(uiDialogTitlebar);
        uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();
        if (options.draggable && $.om.omDraggable) {
            self._makeDraggable();
        }
        if (options.resizable && $.fn.omResizable) {
            self._makeResizable();
        }
        self._createButtons(options.buttons);
        self._isOpen = false;
        if ($.fn.bgiframe) {
            uiDialog.bgiframe();
        }
    }, _init:function () {
        if (this.options.autoOpen) {
            this.open();
        }
    }, destroy:function () {
        var self = this;
        if (self.overlay) {
            self.overlay.destroy();
        }
        self.uiDialog.hide();
        self.element.unbind('.dialog').removeData('dialog').removeClass('om-dialog-content om-widget-content').hide().appendTo('body');
        self.uiDialog.remove();
        if (self.originalTitle) {
            self.element.attr('title', self.originalTitle);
        }
        return self;
    }, widget:function () {
        return this.uiDialog;
    }, close:function (event) {
        var self = this, maxZ, thisZ, options = this.options, onBeforeClose = options.onBeforeClose, onClose = options.onClose;
        if (onBeforeClose && false === self._trigger("onBeforeClose", event)) {
            return;
        }
        if (self.overlay) {
            self.overlay.destroy();
        }
        self.uiDialog.unbind('keypress.om-dialog');
        self._isOpen = false;
        if (self.options.hide) {
            self.uiDialog.hide(self.options.hide, function () {
                onClose && self._trigger("onClose", event);
            });
        } else {
            self.uiDialog.hide();
            onClose && self._trigger("onClose", event);
        }
        $.om.omDialog.overlay.resize();
        if (self.options.modal) {
            maxZ = 0;
            $('.om-dialog').each(function () {
                if (this !== self.uiDialog[0]) {
                    thisZ = $(this).css('z-index');
                    if (!isNaN(thisZ)) {
                        maxZ = Math.max(maxZ, thisZ);
                    }
                }
            });
            $.om.omDialog.maxZ = maxZ;
        }
        return self;
    }, isOpen:function () {
        return this._isOpen;
    }, moveToTop:function (force, event) {
        var self = this, options = self.options, saveScroll;
        if ((options.modal && !force) || (!options.stack && !options.modal)) {
            return self._trigger('onFocus', event);
        }
        if (options.zIndex > $.om.omDialog.maxZ) {
            $.om.omDialog.maxZ = options.zIndex;
        }
        if (self.overlay) {
            $.om.omDialog.maxZ += 1;
            self.overlay.$el.css('z-index', $.om.omDialog.overlay.maxZ = $.om.omDialog.maxZ);
        }
        saveScroll = {scrollTop:self.element.scrollTop(), scrollLeft:self.element.scrollLeft()};
        $.om.omDialog.maxZ += 1;
        self.uiDialog.css('z-index', $.om.omDialog.maxZ);
        self.element.attr(saveScroll);
        self._trigger('onFocus', event);
        return self;
    }, open:function () {
        if (this._isOpen) {
            return;
        }
        var self = this, options = self.options, uiDialog = self.uiDialog;
        self.overlay = options.modal ? new $.om.omDialog.overlay(self) : null;
        self._size();
        self._position(options.position);
        uiDialog.show(options.show);
        self.moveToTop(true);
        if (options.modal) {
            uiDialog.bind('keypress.om-dialog', function (event) {
                if (event.keyCode !== $.om.keyCode.TAB) {
                    return;
                }
                var tabbables = $(':tabbable', this), first = tabbables.filter(':first'), last = tabbables.filter(':last');
                if (event.target === last[0] && !event.shiftKey) {
                    first.focus(1);
                    return false;
                } else if (event.target === first[0] && event.shiftKey) {
                    last.focus(1);
                    return false;
                }
            });
        }
        $(self.element.find(':tabbable').get().concat(uiDialog.find('.om-dialog-buttonpane :tabbable').get().concat(uiDialog.get()))).eq(0).focus();
        self._isOpen = true;
        var onOpen = options.onOpen;
        if (onOpen) {
            self._trigger("onOpen");
        }
        return self;
    }, _createButtons:function (buttons) {
        var self = this, hasButtons = false, uiDialogButtonPane = $('<div></div>').addClass('om-dialog-buttonpane ' + 'om-helper-clearfix'), uiButtonSet = $("<div></div>").addClass("om-dialog-buttonset").appendTo(uiDialogButtonPane);
        self.uiDialog.find('.om-dialog-buttonpane').remove();
        if (typeof buttons === 'object' && buttons !== null) {
            $.each(buttons, function () {
                return!(hasButtons = true);
            });
        }
        if (hasButtons) {
            $.each(buttons, function (name, props) {
                props = $.isFunction(props) ? {click:props, text:name} : props;
                var button = $('<button type="button"></button>').click(
                    function () {
                        var _arguments;
                        if (!!props.Custom) {
                            _arguments = Array.prototype.slice.apply(arguments);
                            _arguments.push($(this));
                            _arguments.push(props);
                        } else {
                            _arguments = arguments;
                        }
                        props.click.apply(self.element[0], _arguments);
                    }).appendTo(uiButtonSet);
                $.each(props, function (key, value) {
                    if (key === "click") {
                        return;
                    }
                    if (key in attrFn) {
                        button[key](value);
                    } else if (key !== 'Custom') {
                        button.attr(key, value);
                    }
                });
                if ($.fn.omButton) {
                    if (!!props.Custom && !!props.Custom.ButtonOption) {
                        button.omButton(props.Custom.ButtonOption)
                    } else {
                        button.omButton()
                    }
                }
            });
            uiDialogButtonPane.appendTo(self.uiDialog);
        }
    }, _makeDraggable:function () {
        var self = this, options = self.options, doc = $(window._top.document), heightBeforeDrag;

        function filteredUi(ui) {
            return{position:ui.position, offset:ui.offset};
        }

        self.uiDialog.omDraggable({cancel:'.om-dialog-content, .om-dialog-titlebar-close', handle:'.om-dialog-titlebar', containment:'window._top.document', cursor:'move', onStart:function (ui, event) {
            heightBeforeDrag = options.height === "auto" ? "auto" : $(this).height();
            $(this).height($(this).height()).addClass("om-dialog-dragging");
            self._trigger('onDragStart', filteredUi(ui), event);
        }, onDrag:function (ui, event) {
            self._trigger('onDrag', filteredUi(ui), event);
        }, onStop:function (ui, event) {
            options.position = [ui.position.left - doc.scrollLeft(), ui.position.top - doc.scrollTop()];
            $(this).removeClass("om-dialog-dragging").height(heightBeforeDrag);
            self._trigger('onDragStop', filteredUi(ui), event);
            $.om.omDialog.overlay.resize();
        }});
    }, _makeResizable:function (handles) {
        handles = (handles === undefined ? this.options.resizable : handles);
        var self = this, options = self.options, position = self.uiDialog.css('position'), resizeHandles = (typeof handles === 'string' ? handles : 'n,e,s,w,se,sw,ne,nw');

        function filteredUi(ui) {
            return{originalPosition:ui.originalPosition, originalSize:ui.originalSize, position:ui.position, size:ui.size};
        }

        self.uiDialog.omResizable({cancel:'.om-dialog-content', containment:'document', alsoResize:self.element, maxWidth:options.maxWidth, maxHeight:options.maxHeight, minWidth:options.minWidth, minHeight:self._minHeight(), handles:resizeHandles, start:function (event, ui) {
            $(this).addClass("om-dialog-resizing");
            self._trigger('onResizeStart', event, filteredUi(ui));
        }, resize:function (event, ui) {
            self._trigger('onResize', event, filteredUi(ui));
        }, stop:function (event, ui) {
            $(this).removeClass("om-dialog-resizing");
            options.height = $(this).height();
            options.width = $(this).width();
            self._trigger('onResizeStop', event, filteredUi(ui));
            $.om.omDialog.overlay.resize();
        }}).css('position', position).find('.om-resizable-se').addClass('om-icon om-icon-grip-diagonal-se');
    }, _minHeight:function () {
        var options = this.options;
        if (options.height === 'auto') {
            return options.minHeight;
        } else {
            return Math.min(options.minHeight, options.height);
        }
    }, _position:function (position) {
        var myAt = [], offset = [0, 0], isVisible;
        if (position) {
            if (typeof position === 'string' || (typeof position === 'object' && '0'in position)) {
                myAt = position.split ? position.split(' ') : [position[0], position[1]];
                if (myAt.length === 1) {
                    myAt[1] = myAt[0];
                }
                $.each(['left', 'top'], function (i, offsetPosition) {
                    if (+myAt[i] === myAt[i]) {
                        offset[i] = myAt[i];
                        myAt[i] = offsetPosition;
                    }
                });
                position = {my:myAt.join(" "), at:myAt.join(" "), offset:offset.join(" ")};
            }
            position = $.extend({}, $.om.omDialog.prototype.options.position, position);
        } else {
            position = $.om.omDialog.prototype.options.position;
        }
        isVisible = this.uiDialog.is(':visible');
        if (!isVisible) {
            this.uiDialog.show();
        }
        this.uiDialog.css({top:0, left:0}).position($.extend({of:window}, position));
        if (!isVisible) {
            this.uiDialog.hide();
        }
    }, _setOptions:function (options) {
        var self = this, resizableOptions = {}, resize = false;
        $.each(options, function (key, value) {
            self._setOption(key, value);
            if (key in sizeRelatedOptions) {
                resize = true;
            }
            if (key in resizableRelatedOptions) {
                resizableOptions[key] = value;
            }
        });
        if (resize) {
            this._size();
        }
        if (this.uiDialog.is(":data(resizable)")) {
            this.uiDialog.omResizable("option", resizableOptions);
        }
    }, _setOption:function (key, value) {
        var self = this, uiDialog = self.uiDialog;
        switch (key) {
            case"buttons":
                self._createButtons(value);
                break;
            case"closeText":
                self.uiDialogTitlebarCloseText.text("" + value);
                break;
            case"dialogClass":
                uiDialog.removeClass(self.options.dialogClass).addClass(uiDialogClasses + value);
                break;
            case"disabled":
                if (value) {
                    uiDialog.addClass('om-dialog-disabled');
                } else {
                    uiDialog.removeClass('om-dialog-disabled');
                }
                break;
            case"draggable":
                var isDraggable = uiDialog.is(":data(draggable)");
                if (isDraggable && !value) {
                    uiDialog.omDraggable("destroy");
                }
                if (!isDraggable && value) {
                    self._makeDraggable();
                }
                break;
            case"position":
                self._position(value);
                break;
            case"resizable":
                var isResizable = uiDialog.is(":data(resizable)");
                if (isResizable && !value) {
                    uiDialog.omResizable('destroy');
                }
                if (isResizable && typeof value === 'string') {
                    uiDialog.omResizable('option', 'handles', value);
                }
                if (!isResizable && value !== false) {
                    self._makeResizable(value);
                }
                break;
            case"title":
                $(".om-dialog-title", self.uiDialogTitlebar).html("" + (value || '&#160;'));
                break;
        }
        $.OMWidget.prototype._setOption.apply(self, arguments);
    }, _size:function () {
        var options = this.options, nonContentHeight, minContentHeight, isVisible = this.uiDialog.is(":visible");
        this.element.show().css({width:'auto', minHeight:0, height:0});
        if (options.minWidth > options.width) {
            options.width = options.minWidth;
        }
        nonContentHeight = this.uiDialog.css({height:'auto', width:options.width}).height();
        minContentHeight = Math.max(0, options.minHeight - nonContentHeight);
        if (options.height === "auto") {
            if ($.support.minHeight) {
                this.element.css({minHeight:minContentHeight, height:"auto"});
            } else {
                this.uiDialog.show();
                var autoHeight = this.element.css("height", "auto").height();
                if (!isVisible) {
                    this.uiDialog.hide();
                }
                this.element.height(Math.max(autoHeight, minContentHeight));
            }
        } else {
            this.element.height(Math.max(options.height - nonContentHeight, 0));
        }
        if (this.uiDialog.is(':data(resizable)')) {
            this.uiDialog.omResizable('option', 'minHeight', this._minHeight());
        }
    }});
    $.extend($.om.omDialog, {version:"@VERSION", uuid:0, maxZ:0, getTitleId:function ($el) {
        var id = $el.attr('id');
        if (!id) {
            this.uuid += 1;
            id = this.uuid;
        }
        return'ui-dialog-title-' + id;
    }, overlay:function (dialog) {
        this.$el = $.om.omDialog.overlay.create(dialog);
    }});
    $.extend($.om.omDialog.overlay, {instances:[], oldInstances:[], maxZ:0, events:$.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
        function (event) {
            return event + '.dialog-overlay';
        }).join(' '), create:function (dialog) {
        if (this.instances.length === 0) {
            setTimeout(function () {
                if ($.om.omDialog.overlay.instances.length) {
                    $(window._top.document).bind($.om.omDialog.overlay.events, function (event) {
                        if ($(event.target).zIndex() < $.om.omDialog.overlay.maxZ) {
                            return false;
                        }
                    });
                }
            }, 1);
            $(window._top.document).bind('keydown.dialog-overlay', function (event) {
                if (dialog.options.closeOnEscape && event.keyCode && event.keyCode === $.om.keyCode.ESCAPE) {
                    dialog.close(event);
                    event.preventDefault();
                }
            });
            $(window).bind('resize.dialog-overlay', $.om.omDialog.overlay.resize);
        }
        var $el = (this.oldInstances.pop() || $('<div></div>').addClass('om-widget-overlay')).appendTo(window._top.document.body).css({width:this.width(), height:this.height()});
        if ($.fn.bgiframe) {
            $el.bgiframe();
        }
        this.instances.push($el);
        return $el;
    }, destroy:function ($el) {
        $el.parent().unbind(this.__removeBind);
        var indexOf = $.inArray($el, this.instances);
        if (indexOf != -1) {
            this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
        }
        if (this.instances.length === 0) {
            $([document, window]).unbind('.dialog-overlay');
        }
        $el.remove();
        var maxZ = 0;
        $.each(this.instances, function () {
            maxZ = Math.max(maxZ, this.css('z-index'));
        });
        this.maxZ = maxZ;
    }, height:function () {
        var scrollHeight, offsetHeight;
        if ($.browser.msie && $.browser.version < 7) {
            scrollHeight = Math.max(window._top.document.documentElement.scrollHeight, window._top.document.body.scrollHeight);
            offsetHeight = Math.max(window._top.document.documentElement.offsetHeight, window._top.document.body.offsetHeight);
            if (scrollHeight < offsetHeight) {
                return $(window.top).height() + 'px';
            } else {
                return scrollHeight + 'px';
            }
        } else {
            return $(window._top.document).height() + 'px';
        }
    }, width:function () {
        var scrollWidth, offsetWidth;
        if ($.browser.msie) {
            scrollWidth = Math.max(window._top.document.documentElement.scrollWidth, window._top.document.body.scrollWidth);
            offsetWidth = Math.max(window._top.document.documentElement.offsetWidth, window._top.document.body.offsetWidth);
            if (scrollWidth < offsetWidth) {
                return $(window.top).width() + 'px';
            } else {
                return scrollWidth + 'px';
            }
        } else {
            return $(window._top.document).width() + 'px';
        }
    }, resize:function () {
        var $overlays = $([]);
        $.each($.om.omDialog.overlay.instances, function () {
            $overlays = $overlays.add(this);
        });
        $overlays.css({width:0, height:0}).css({width:$.om.omDialog.overlay.width(), height:$.om.omDialog.overlay.height()});
    }});
    $.extend($.om.omDialog.overlay.prototype, {destroy:function () {
        $.om.omDialog.overlay.destroy(this.$el);
    }});
}(jQuery));
var swfobject = function () {
    var D = "undefined", r = "object", S = "Shockwave Flash", W = "ShockwaveFlash.ShockwaveFlash", q = "application/x-shockwave-flash", R = "SWFObjectExprInst", x = "onreadystatechange", O = window, j = document, t = navigator, T = false, U = [h], o = [], N = [], I = [], l, Q, E, B, J = false, a = false, n, G, m = true, M = function () {
        var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D, ah = t.userAgent.toLowerCase(), Y = t.platform.toLowerCase(), ae = Y ? /win/.test(Y) : /win/.test(ah), ac = Y ? /mac/.test(Y) : /mac/.test(ah), af = /webkit/.test(ah) ? parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, X = !+"\v1", ag = [0, 0, 0], ab = null;
        if (typeof t.plugins != D && typeof t.plugins[S] == r) {
            ab = t.plugins[S].description;
            if (ab && !(typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) {
                T = true;
                X = false;
                ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10);
                ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            }
        } else {
            if (typeof O.ActiveXObject != D) {
                try {
                    var ad = new ActiveXObject(W);
                    if (ad) {
                        ab = ad.GetVariable("$version");
                        if (ab) {
                            X = true;
                            ab = ab.split(" ")[1].split(",");
                            ag = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
                        }
                    }
                } catch (Z) {
                }
            }
        }
        return{w3:aa, pv:ag, wk:af, ie:X, win:ae, mac:ac}
    }(), k = function () {
        if (!M.w3) {
            return
        }
        if ((typeof j.readyState != D && j.readyState == "complete") || (typeof j.readyState == D && (j.getElementsByTagName("body")[0] || j.body))) {
            f()
        }
        if (!J) {
            if (typeof j.addEventListener != D) {
                j.addEventListener("DOMContentLoaded", f, false)
            }
            if (M.ie && M.win) {
                j.attachEvent(x, function () {
                    if (j.readyState == "complete") {
                        j.detachEvent(x, arguments.callee);
                        f()
                    }
                });
                if (O == top) {
                    (function () {
                        if (J) {
                            return
                        }
                        try {
                            j.documentElement.doScroll("left")
                        } catch (X) {
                            setTimeout(arguments.callee, 0);
                            return
                        }
                        f()
                    })()
                }
            }
            if (M.wk) {
                (function () {
                    if (J) {
                        return
                    }
                    if (!/loaded|complete/.test(j.readyState)) {
                        setTimeout(arguments.callee, 0);
                        return
                    }
                    f()
                })()
            }
            s(f)
        }
    }();

    function f() {
        if (J) {
            return
        }
        try {
            var Z = j.getElementsByTagName("body")[0].appendChild(C("span"));
            Z.parentNode.removeChild(Z)
        } catch (aa) {
            return
        }
        J = true;
        var X = U.length;
        for (var Y = 0; Y < X; Y++) {
            U[Y]()
        }
    }

    function K(X) {
        if (J) {
            X()
        } else {
            U[U.length] = X
        }
    }

    function s(Y) {
        if (typeof O.addEventListener != D) {
            O.addEventListener("load", Y, false)
        } else {
            if (typeof j.addEventListener != D) {
                j.addEventListener("load", Y, false)
            } else {
                if (typeof O.attachEvent != D) {
                    i(O, "onload", Y)
                } else {
                    if (typeof O.onload == "function") {
                        var X = O.onload;
                        O.onload = function () {
                            X();
                            Y()
                        }
                    } else {
                        O.onload = Y
                    }
                }
            }
        }
    }

    function h() {
        if (T) {
            V()
        } else {
            H()
        }
    }

    function V() {
        var X = j.getElementsByTagName("body")[0];
        var aa = C(r);
        aa.setAttribute("type", q);
        var Z = X.appendChild(aa);
        if (Z) {
            var Y = 0;
            (function () {
                if (typeof Z.GetVariable != D) {
                    var ab = Z.GetVariable("$version");
                    if (ab) {
                        ab = ab.split(" ")[1].split(",");
                        M.pv = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
                    }
                } else {
                    if (Y < 10) {
                        Y++;
                        setTimeout(arguments.callee, 10);
                        return
                    }
                }
                X.removeChild(aa);
                Z = null;
                H()
            })()
        } else {
            H()
        }
    }

    function H() {
        var ag = o.length;
        if (ag > 0) {
            for (var af = 0; af < ag; af++) {
                var Y = o[af].id;
                var ab = o[af].callbackFn;
                var aa = {success:false, id:Y};
                if (M.pv[0] > 0) {
                    var ae = c(Y);
                    if (ae) {
                        if (F(o[af].swfVersion) && !(M.wk && M.wk < 312)) {
                            w(Y, true);
                            if (ab) {
                                aa.success = true;
                                aa.ref = z(Y);
                                ab(aa)
                            }
                        } else {
                            if (o[af].expressInstall && A()) {
                                var ai = {};
                                ai.data = o[af].expressInstall;
                                ai.width = ae.getAttribute("width") || "0";
                                ai.height = ae.getAttribute("height") || "0";
                                if (ae.getAttribute("class")) {
                                    ai.styleclass = ae.getAttribute("class")
                                }
                                if (ae.getAttribute("align")) {
                                    ai.align = ae.getAttribute("align")
                                }
                                var ah = {};
                                var X = ae.getElementsByTagName("param");
                                var ac = X.length;
                                for (var ad = 0; ad < ac; ad++) {
                                    if (X[ad].getAttribute("name").toLowerCase() != "movie") {
                                        ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value")
                                    }
                                }
                                P(ai, ah, Y, ab)
                            } else {
                                p(ae);
                                if (ab) {
                                    ab(aa)
                                }
                            }
                        }
                    }
                } else {
                    w(Y, true);
                    if (ab) {
                        var Z = z(Y);
                        if (Z && typeof Z.SetVariable != D) {
                            aa.success = true;
                            aa.ref = Z
                        }
                        ab(aa)
                    }
                }
            }
        }
    }

    function z(aa) {
        var X = null;
        var Y = c(aa);
        if (Y && Y.nodeName == "OBJECT") {
            if (typeof Y.SetVariable != D) {
                X = Y
            } else {
                var Z = Y.getElementsByTagName(r)[0];
                if (Z) {
                    X = Z
                }
            }
        }
        return X
    }

    function A() {
        return!a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312)
    }

    function P(aa, ab, X, Z) {
        a = true;
        E = Z || null;
        B = {success:false, id:X};
        var ae = c(X);
        if (ae) {
            if (ae.nodeName == "OBJECT") {
                l = g(ae);
                Q = null
            } else {
                l = ae;
                Q = X
            }
            aa.id = R;
            if (typeof aa.width == D || (!/%$/.test(aa.width) && parseInt(aa.width, 10) < 310)) {
                aa.width = "310"
            }
            if (typeof aa.height == D || (!/%$/.test(aa.height) && parseInt(aa.height, 10) < 137)) {
                aa.height = "137"
            }
            j.title = j.title.slice(0, 47) + " - Flash Player Installation";
            var ad = M.ie && M.win ? "ActiveX" : "PlugIn", ac = "MMredirectURL=" + O.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;
            if (typeof ab.flashvars != D) {
                ab.flashvars += "&" + ac
            } else {
                ab.flashvars = ac
            }
            if (M.ie && M.win && ae.readyState != 4) {
                var Y = C("div");
                X += "SWFObjectNew";
                Y.setAttribute("id", X);
                ae.parentNode.insertBefore(Y, ae);
                ae.style.display = "none";
                (function () {
                    if (ae.readyState == 4) {
                        ae.parentNode.removeChild(ae)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            }
            u(aa, ab, X)
        }
    }

    function p(Y) {
        if (M.ie && M.win && Y.readyState != 4) {
            var X = C("div");
            Y.parentNode.insertBefore(X, Y);
            X.parentNode.replaceChild(g(Y), X);
            Y.style.display = "none";
            (function () {
                if (Y.readyState == 4) {
                    Y.parentNode.removeChild(Y)
                } else {
                    setTimeout(arguments.callee, 10)
                }
            })()
        } else {
            Y.parentNode.replaceChild(g(Y), Y)
        }
    }

    function g(ab) {
        var aa = C("div");
        if (M.win && M.ie) {
            aa.innerHTML = ab.innerHTML
        } else {
            var Y = ab.getElementsByTagName(r)[0];
            if (Y) {
                var ad = Y.childNodes;
                if (ad) {
                    var X = ad.length;
                    for (var Z = 0; Z < X; Z++) {
                        if (!(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM") && !(ad[Z].nodeType == 8)) {
                            aa.appendChild(ad[Z].cloneNode(true))
                        }
                    }
                }
            }
        }
        return aa
    }

    function u(ai, ag, Y) {
        var X, aa = c(Y);
        if (M.wk && M.wk < 312) {
            return X
        }
        if (aa) {
            if (typeof ai.id == D) {
                ai.id = Y
            }
            if (M.ie && M.win) {
                var ah = "";
                for (var ae in ai) {
                    if (ai[ae] != Object.prototype[ae]) {
                        if (ae.toLowerCase() == "data") {
                            ag.movie = ai[ae]
                        } else {
                            if (ae.toLowerCase() == "styleclass") {
                                ah += ' class="' + ai[ae] + '"'
                            } else {
                                if (ae.toLowerCase() != "classid") {
                                    ah += " " + ae + '="' + ai[ae] + '"'
                                }
                            }
                        }
                    }
                }
                var af = "";
                for (var ad in ag) {
                    if (ag[ad] != Object.prototype[ad]) {
                        af += '<param name="' + ad + '" value="' + ag[ad] + '" />'
                    }
                }
                aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>";
                N[N.length] = ai.id;
                X = c(ai.id)
            } else {
                var Z = C(r);
                Z.setAttribute("type", q);
                for (var ac in ai) {
                    if (ai[ac] != Object.prototype[ac]) {
                        if (ac.toLowerCase() == "styleclass") {
                            Z.setAttribute("class", ai[ac])
                        } else {
                            if (ac.toLowerCase() != "classid") {
                                Z.setAttribute(ac, ai[ac])
                            }
                        }
                    }
                }
                for (var ab in ag) {
                    if (ag[ab] != Object.prototype[ab] && ab.toLowerCase() != "movie") {
                        e(Z, ab, ag[ab])
                    }
                }
                aa.parentNode.replaceChild(Z, aa);
                X = Z
            }
        }
        return X
    }

    function e(Z, X, Y) {
        var aa = C("param");
        aa.setAttribute("name", X);
        aa.setAttribute("value", Y);
        Z.appendChild(aa)
    }

    function y(Y) {
        var X = c(Y);
        if (X && X.nodeName == "OBJECT") {
            if (M.ie && M.win) {
                X.style.display = "none";
                (function () {
                    if (X.readyState == 4) {
                        b(Y)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            } else {
                X.parentNode.removeChild(X)
            }
        }
    }

    function b(Z) {
        var Y = c(Z);
        if (Y) {
            for (var X in Y) {
                if (typeof Y[X] == "function") {
                    Y[X] = null
                }
            }
            Y.parentNode.removeChild(Y)
        }
    }

    function c(Z) {
        var X = null;
        try {
            X = j.getElementById(Z)
        } catch (Y) {
        }
        return X
    }

    function C(X) {
        return j.createElement(X)
    }

    function i(Z, X, Y) {
        Z.attachEvent(X, Y);
        I[I.length] = [Z, X, Y]
    }

    function F(Z) {
        var Y = M.pv, X = Z.split(".");
        X[0] = parseInt(X[0], 10);
        X[1] = parseInt(X[1], 10) || 0;
        X[2] = parseInt(X[2], 10) || 0;
        return(Y[0] > X[0] || (Y[0] == X[0] && Y[1] > X[1]) || (Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2])) ? true : false
    }

    function v(ac, Y, ad, ab) {
        if (M.ie && M.mac) {
            return
        }
        var aa = j.getElementsByTagName("head")[0];
        if (!aa) {
            return
        }
        var X = (ad && typeof ad == "string") ? ad : "screen";
        if (ab) {
            n = null;
            G = null
        }
        if (!n || G != X) {
            var Z = C("style");
            Z.setAttribute("type", "text/css");
            Z.setAttribute("media", X);
            n = aa.appendChild(Z);
            if (M.ie && M.win && typeof j.styleSheets != D && j.styleSheets.length > 0) {
                n = j.styleSheets[j.styleSheets.length - 1]
            }
            G = X
        }
        if (M.ie && M.win) {
            if (n && typeof n.addRule == r) {
                n.addRule(ac, Y)
            }
        } else {
            if (n && typeof j.createTextNode != D) {
                n.appendChild(j.createTextNode(ac + " {" + Y + "}"))
            }
        }
    }

    function w(Z, X) {
        if (!m) {
            return
        }
        var Y = X ? "visible" : "hidden";
        if (J && c(Z)) {
            c(Z).style.visibility = Y
        } else {
            v("#" + Z, "visibility:" + Y)
        }
    }

    function L(Y) {
        var Z = /[\\\"<>\.;]/;
        var X = Z.exec(Y) != null;
        return X && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y
    }

    var d = function () {
        if (M.ie && M.win) {
            window.attachEvent("onunload", function () {
                var ac = I.length;
                for (var ab = 0; ab < ac; ab++) {
                    I[ab][0].detachEvent(I[ab][1], I[ab][2])
                }
                var Z = N.length;
                for (var aa = 0; aa < Z; aa++) {
                    y(N[aa])
                }
                for (var Y in M) {
                    M[Y] = null
                }
                M = null;
                for (var X in swfobject) {
                    swfobject[X] = null
                }
                swfobject = null
            })
        }
    }();
    return{registerObject:function (ab, X, aa, Z) {
        if (M.w3 && ab && X) {
            var Y = {};
            Y.id = ab;
            Y.swfVersion = X;
            Y.expressInstall = aa;
            Y.callbackFn = Z;
            o[o.length] = Y;
            w(ab, false)
        } else {
            if (Z) {
                Z({success:false, id:ab})
            }
        }
    }, getObjectById:function (X) {
        if (M.w3) {
            return z(X)
        }
    }, embedSWF:function (ab, ah, ae, ag, Y, aa, Z, ad, af, ac) {
        var X = {success:false, id:ah};
        if (M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y) {
            w(ah, false);
            K(function () {
                ae += "";
                ag += "";
                var aj = {};
                if (af && typeof af === r) {
                    for (var al in af) {
                        aj[al] = af[al]
                    }
                }
                aj.data = ab;
                aj.width = ae;
                aj.height = ag;
                var am = {};
                if (ad && typeof ad === r) {
                    for (var ak in ad) {
                        am[ak] = ad[ak]
                    }
                }
                if (Z && typeof Z === r) {
                    for (var ai in Z) {
                        if (typeof am.flashvars != D) {
                            am.flashvars += "&" + ai + "=" + Z[ai]
                        } else {
                            am.flashvars = ai + "=" + Z[ai]
                        }
                    }
                }
                if (F(Y)) {
                    var an = u(aj, am, ah);
                    if (aj.id == ah) {
                        w(ah, true)
                    }
                    X.success = true;
                    X.ref = an
                } else {
                    if (aa && A()) {
                        aj.data = aa;
                        P(aj, am, ah, ac);
                        return
                    } else {
                        w(ah, true)
                    }
                }
                if (ac) {
                    ac(X)
                }
            })
        } else {
            if (ac) {
                ac(X)
            }
        }
    }, switchOffAutoHideShow:function () {
        m = false
    }, ua:M, getFlashPlayerVersion:function () {
        return{major:M.pv[0], minor:M.pv[1], release:M.pv[2]}
    }, hasFlashPlayerVersion:F, createSWF:function (Z, Y, X) {
        if (M.w3) {
            return u(Z, Y, X)
        } else {
            return undefined
        }
    }, showExpressInstall:function (Z, aa, X, Y) {
        if (M.w3 && A()) {
            P(Z, aa, X, Y)
        }
    }, removeSWF:function (X) {
        if (M.w3) {
            y(X)
        }
    }, createCSS:function (aa, Z, Y, X) {
        if (M.w3) {
            v(aa, Z, Y, X)
        }
    }, addDomLoadEvent:K, addLoadEvent:s, getQueryParamValue:function (aa) {
        var Z = j.location.search || j.location.hash;
        if (Z) {
            if (/\?/.test(Z)) {
                Z = Z.split("?")[1]
            }
            if (aa == null) {
                return L(Z)
            }
            var Y = Z.split("&");
            for (var X = 0; X < Y.length; X++) {
                if (Y[X].substring(0, Y[X].indexOf("=")) == aa) {
                    return L(Y[X].substring((Y[X].indexOf("=") + 1)))
                }
            }
        }
        return""
    }, expressInstallCallback:function () {
        if (a) {
            var X = c(R);
            if (X && l) {
                X.parentNode.replaceChild(l, X);
                if (Q) {
                    w(Q, true);
                    if (M.ie && M.win) {
                        l.style.display = "block"
                    }
                }
                if (E) {
                    E(B)
                }
            }
            a = false
        }
    }}
}();
(function ($) {
    function _findIDByIndex(uploadId, index) {
        var queueId = uploadId + 'Queue';
        var queueSize = $('#' + queueId + ' .om-fileupload-queueitem').length;
        if (index == null || isNaN(index) || index < 0 || index >= queueSize) {
            return false;
        }
        var item = $('#' + queueId + ' .om-fileupload-queueitem:eq(' + index + ')');
        return item.attr('id').replace(uploadId, '');
    }

    ;
    $.omWidget('om.omFileUpload', {options:{swf:'/operamasks-ui/ui/om-fileupload.swf', action:'', actionData:{}, height:30, width:120, buttonImg:null, multi:false, autoUpload:false, fileDataName:'Filedata', method:'POST', queueSizeLimit:999, removeCompleted:true, fileExt:'*.*', fileDesc:null, sizeLimit:null, onSelect:function () {
    }, onQueueFull:function () {
    }, onCancel:function () {
    }, onError:function () {
    }, onProgress:function () {
    }, onComplete:function () {
    }, onAllComplete:function () {
    }}, upload:function (index) {
        var element = this.element;
        var id = element.attr('id'), fileId = null, queueId = element.attr('id') + 'Queue', uploaderId = element.attr('id') + 'Uploader';
        if (typeof(index) != 'undefined') {
            if ((fileId = _findIDByIndex(id, index)) === false)return;
        }
        document.getElementById(uploaderId).startFileUpload(fileId, false);
    }, cancel:function (index) {
        var element = this.element;
        var id = element.attr('id'), fileId = null, queueId = element.attr('id') + 'Queue', uploaderId = element.attr('id') + 'Uploader';
        if (typeof(index) != 'undefined') {
            if (isNaN(index)) {
                fileId = index;
            } else {
                if ((fileId = _findIDByIndex(element.attr('id'), index)) === false)return;
            }
            document.getElementById(uploaderId).cancelFileUpload(fileId, true, true, false);
        } else {
            document.getElementById(uploaderId).clearFileUploadQueue(false);
        }
    }, _setOption:function (key, value) {
        var uploader = document.getElementById(this.element.attr('id') + 'Uploader');
        if (key == 'actionData') {
            var actionDataString = '';
            for (var name in value) {
                actionDataString += '&' + name + '=' + value[name];
            }
            var cookieArray = document.cookie.split(';')
            for (var i = 0; i < cookieArray.length; i++) {
                if (cookieArray[i] !== '') {
                    actionDataString += '&' + cookieArray[i];
                }
            }
            value = encodeURI(actionDataString.substr(1));
            uploader.updateSettings(key, value);
            return;
        }
        var dynOpts = ['buttonImg', 'buttonText', 'fileDesc', 'fileExt', 'height', 'action', 'sizeLimit', 'width'];
        if ($.inArray(key, dynOpts) != -1) {
            uploader.updateSettings(key, value);
        }
    }, _create:function () {
        var self = this;
        var element = this.element;
        var settings = $.extend({}, this.options);
        settings.wmode = 'opaque';
        settings.expressInstall = null;
        settings.displayData = 'percentage';
        settings.folder = '';
        settings.simUploadLimit = 1;
        settings.scriptAccess = 'sameDomain';
        settings.queueID = false;
        settings.onInit = function () {
        };
        settings.onSelectOnce = function () {
        };
        settings.onClearQueue = function () {
        };
        settings.id = this.element.attr('id');
        $(element).data('settings', settings);
        var pagePath = location.pathname;
        pagePath = pagePath.split('/');
        pagePath.pop();
        pagePath = pagePath.join('/') + '/';
        var data = {};
        data.omFileUploadID = settings.id;
        data.pagepath = pagePath;
        if (settings.buttonImg)data.buttonImg = escape(settings.buttonImg);
        data.buttonText = encodeURI($.om.lang._get(settings, "omFileUpload", "buttonText"));
        if (settings.rollover)data.rollover = true;
        data.action = settings.action;
        data.folder = escape(settings.folder);
        var actionDataString = '';
        var cookieArray = document.cookie.split(';')
        for (var i = 0; i < cookieArray.length; i++) {
            actionDataString += '&' + cookieArray[i];
        }
        if (settings.actionData) {
            for (var name in settings.actionData) {
                actionDataString += '&' + name + '=' + settings.actionData[name];
            }
        }
        data.actionData = escape(encodeURI(actionDataString.substr(1)));
        data.width = settings.width;
        data.height = settings.height;
        data.wmode = settings.wmode;
        data.method = settings.method;
        data.queueSizeLimit = settings.queueSizeLimit;
        data.simUploadLimit = settings.simUploadLimit;
        if (settings.hideButton)data.hideButton = true;
        if (settings.fileDesc)data.fileDesc = settings.fileDesc;
        if (settings.fileExt)data.fileExt = settings.fileExt;
        if (settings.multi)data.multi = true;
        if (settings.autoUpload)data.autoUpload = true;
        if (settings.sizeLimit)data.sizeLimit = settings.sizeLimit;
        if (settings.checkScript)data.checkScript = settings.checkScript;
        if (settings.fileDataName)data.fileDataName = settings.fileDataName;
        if (settings.queueID)data.queueID = settings.queueID;
        if (settings.onInit() !== false) {
            element.css('display', 'none');
            element.after('<div id="' + element.attr('id') + 'Uploader"></div>');
            swfobject.embedSWF(settings.swf, settings.id + 'Uploader', settings.width, settings.height, '9.0.24', settings.expressInstall, data, {'quality':'high', 'wmode':settings.wmode, 'allowScriptAccess':settings.scriptAccess}, {}, function (event) {
                if (typeof(settings.onSWFReady) == 'function' && event.success)settings.onSWFReady();
            });
            if (settings.queueID == false) {
                $("#" + element.attr('id') + "Uploader").after('<div id="' + element.attr('id') + 'Queue" class="om-fileupload-queue"></div>');
            } else {
                $("#" + settings.queueID).addClass('om-fileupload-queue');
            }
        }
        if (typeof(settings.onOpen) == 'function') {
            element.bind("omFileUploadOpen", settings.onOpen);
        }
        element.bind("omFileUploadSelect", {'action':settings.onSelect, 'queueID':settings.queueID}, function (event, ID, fileObj) {
            if (self._trigger("onSelect", event, ID, fileObj) !== false) {
                var byteSize = Math.round(fileObj.size / 1024 * 100) * .01;
                var suffix = 'KB';
                if (byteSize > 1000) {
                    byteSize = Math.round(byteSize * .001 * 100) * .01;
                    suffix = 'MB';
                }
                var sizeParts = byteSize.toString().split('.');
                if (sizeParts.length > 1) {
                    byteSize = sizeParts[0] + '.' + sizeParts[1].substr(0, 2);
                } else {
                    byteSize = sizeParts[0];
                }
                if (fileObj.name.length > 20) {
                    fileName = fileObj.name.substr(0, 20) + '...';
                } else {
                    fileName = fileObj.name;
                }
                queue = '#' + $(this).attr('id') + 'Queue';
                if (event.data.queueID) {
                    queue = '#' + event.data.queueID;
                }
                $(queue).append('<div id="' + $(this).attr('id') + ID + '" class="om-fileupload-queueitem">\
                            <div class="cancel" onclick="$(\'#' + $(this).attr('id') + '\').omFileUpload(\'cancel\',\'' + ID + '\')">\
                            </div>\
                            <span class="fileName">' + fileName + ' (' + byteSize + suffix + ')</span><span class="percentage"></span>\
                            <div class="om-fileupload-progress">\
                                <div id="' + $(this).attr('id') + ID + 'ProgressBar" class="om-fileupload-progressbar"><!--Progress Bar--></div>\
                            </div>\
                        </div>');
            }
        });
        element.bind("omFileUploadSelectOnce", {'action':settings.onSelectOnce}, function (event, data) {
            self._trigger("onSelectOnce", event, data);
            if (settings.autoUpload) {
                $(this).omFileUpload('upload');
            }
        });
        element.bind("omFileUploadQueueFull", {'action':settings.onQueueFull}, function (event, queueSizeLimit) {
            if (self._trigger("onQueueFull", event, queueSizeLimit) !== false) {
                alert($.om.lang.omFileUpload.queueSizeLimitMsg + queueSizeLimit + '.');
            }
        });
        element.bind("omFileUploadCancel", {'action':settings.onCancel}, function (event, ID, fileObj, data, remove, clearFast) {
            if (self._trigger("onCancel", event, ID, fileObj, data) !== false) {
                if (remove) {
                    var fadeSpeed = (clearFast == true) ? 0 : 250;
                    $("#" + $(this).attr('id') + ID).fadeOut(fadeSpeed, function () {
                        $(this).remove()
                    });
                }
            }
        });
        element.bind("omFileUploadClearQueue", {'action':settings.onClearQueue}, function (event, clearFast) {
            var queueID = (settings.queueID) ? settings.queueID : $(this).attr('id') + 'Queue';
            if (clearFast) {
                $("#" + queueID).find('.om-fileupload-queueitem').remove();
            }
            if (self._trigger("onClearQueue", event, clearFast) !== false) {
                $("#" + queueID).find('.om-fileupload-queueitem').each(function () {
                    var index = $('.om-fileupload-queueitem').index(this);
                    $(this).delay(index * 100).fadeOut(250, function () {
                        $(this).remove()
                    });
                });
            }
        });
        var errorArray = [];
        element.bind("omFileUploadError", {'action':settings.onError}, function (event, ID, fileObj, errorObj) {
            if (self._trigger("onError", event, ID, fileObj, errorObj) !== false) {
                var fileArray = new Array(ID, fileObj, errorObj);
                errorArray.push(fileArray);
                $("#" + $(this).attr('id') + ID).find('.percentage').text(" - " + errorObj.type + " Error");
                $("#" + $(this).attr('id') + ID).find('.om-fileupload-progress').hide();
                $("#" + $(this).attr('id') + ID).addClass('om-fileupload-error');
            }
        });
        if (typeof(settings.onUpload) == 'function') {
            element.bind("omFileUploadUpload", settings.onUpload);
        }
        element.bind("omFileUploadProgress", {'action':settings.onProgress, 'toDisplay':settings.displayData}, function (event, ID, fileObj, data) {
            if (self._trigger("onProgress", event, ID, fileObj, data) !== false) {
                $("#" + $(this).attr('id') + ID + "ProgressBar").animate({'width':data.percentage + '%'}, 250, function () {
                    if (data.percentage == 100) {
                        $(this).closest('.om-fileupload-progress').fadeOut(250, function () {
                            $(this).remove()
                        });
                    }
                });
                if (event.data.toDisplay == 'percentage')displayData = ' - ' + data.percentage + '%';
                if (event.data.toDisplay == 'speed')displayData = ' - ' + data.speed + 'KB/s';
                if (event.data.toDisplay == null)displayData = ' ';
                $("#" + $(this).attr('id') + ID).find('.percentage').text(displayData);
            }
        });
        element.bind("omFileUploadComplete", {'action':settings.onComplete}, function (event, ID, fileObj, response, data) {
            if (self._trigger("onComplete", event, ID, fileObj, unescape(response), data) !== false) {
                $("#" + $(this).attr('id') + ID).find('.percentage').text(' - Completed');
                if (settings.removeCompleted) {
                    $("#" + $(event.target).attr('id') + ID).fadeOut(250, function () {
                        $(this).remove()
                    });
                }
                $("#" + $(event.target).attr('id') + ID).addClass('completed');
            }
        });
        if (typeof(settings.onAllComplete) == 'function') {
            element.bind("omFileUploadAllComplete", {'action':settings.onAllComplete}, function (event, data) {
                if (self._trigger("onAllComplete", event, data) !== false) {
                    errorArray = [];
                }
            });
        }
    }});
    $.om.lang.omFileUpload = {queueSizeLimitMsg:'文件上传队列已满，数量不能超过', buttonText:'选择文件'};
})(jQuery);
;
(function ($) {
    $.omWidget('om.omGrid', {options:{height:462, width:'100%', colModel:false, autoFit:false, showIndex:true, dataSource:false, extraData:{}, method:'GET', preProcess:false, limit:15, rowClasses:['oddRow', 'evenRow'], singleSelect:true, title:'', onRowSelect:function (rowIndex, rowData, event) {
    }, onRowDeselect:function (rowIndex, rowData, event) {
    }, onRowClick:function (rowIndex, rowData, event) {
    }, onRowDblClick:function (rowIndex, rowData, event) {
    }, onPageChange:function (type, newPage, event) {
    }, onSuccess:function (data, testStatus, XMLHttpRequest, event) {
    }, onError:function (XMLHttpRequest, textStatus, errorThrown, event) {
    }, onRefresh:function (nowPage, pageRecords, event) {
    }, _onRefreshCallbacks:[], _onResizableStopCallbacks:[], _onResizableCallbacks:[], _onResizeCallbacks:[], onBeforeRowSelect:function (rowIndex, rowData, event) {
        return true;
    }, onBeforeRowDeSelect:function (rowIndex, rowData, event) {
        return true;
    }}, _create:function () {
        var options = this.options, el = this.element.show().attr({cellPadding:0, cellSpacing:0, border:0}).empty().append('<tbody></tbody>');
        el.wrap('<div class="om-grid om-widget om-widget-content"><div class="bDiv" style="width:auto"></div></div>').closest('.om-grid');
        if (!$.isArray(this._getColModel())) {
            return;
        }
        this.hDiv = $('<div class="hDiv om-state-default"></div>').append('<div class="hDivBox"><table cellPadding="0" cellSpacing="0"></table></div>');
        el.parent().before(this.hDiv);
        this.pDiv = $('<div class="pDiv om-state-default"></div>');
        el.parent().after(this.pDiv);
        var grid = el.closest('.om-grid');
        this.loadMask = $('<div class="gBlock"><div align="center" class="gBlock-valignMiddle" ><div class="loadingImg" style="display:block"/></div></div>').mousedown(
            function (e) {
                return false;
            }).hide();
        grid.append(this.loadMask);
        this.titleDiv = $("<div class='titleDiv'></div>");
        grid.prepend(this.titleDiv);
        this.tbody = this.element.children().eq(0);
        this._guid = 0;
        options._onRefreshCallbacks.push(function () {
            this._refreshHeaderCheckBox();
        });
        this._bindScrollEnvent();
    }, _init:function () {
        var $el = this.element, ops = this.options, $grid = $el.closest('.om-grid');
        this._measure($grid, ops);
        if (!$.isArray(this._getColModel())) {
            return;
        }
        this._extraData = {};
        this.tbody.empty();
        $('table', this.hDiv).empty();
        this.pDiv.empty();
        this.titleDiv.empty();
        this._buildTableHead();
        this._buildPagingToolBar();
        this._buildLoadMask();
        this._bindSelectAndClickEnvent();
        this._makeColsResizable();
        this._buildTitle();
        this._resetHeight();
        this.pageData = {nowPage:1, totalPages:1};
        this._populate();
    }, resize:function (position) {
        var self = this, ops = this.options, $grid = this.element.closest('.om-grid'), width, height;
        position = position || {};
        ops.width = position.width || arguments[0] || ops.width;
        ops.height = position.height || arguments[1] || ops.height;
        this._measure($grid, ops);
        this._buildLoadMask();
        this._resetWidth();
        this._resetHeight();
        $.each(ops._onResizeCallbacks, function (index, fn) {
            fn.call(self);
        });
    }, _measure:function ($grid, ops) {
        $grid.outerWidth(ops.width === 'fit' ? $grid.parent().width() : ops.width);
        $grid.outerHeight(ops.height === 'fit' ? $grid.parent().height() : ops.height);
    }, _resetHeight:function () {
        var $el = this.element, $grid = $el.closest('.om-grid');
        var headerHeight = this.hDiv.outerHeight(true), pagerHeight = this.pDiv.is(":hidden") ? 0 : this.pDiv.outerHeight(true), titleHeight = this.titleDiv.is(":hidden") ? 0 : this.titleDiv.outerHeight(true);
        $grid.children('.bDiv').outerHeight($grid.height() - headerHeight - pagerHeight - titleHeight);
    }, _resetWidth:function () {
        var ops = this.options, cms = this._getColModel(), autoExpandColIndex = -1, $grid = this.element.closest('.om-grid'), $thead = $('thead', this.hDiv), allColsWidth = 0;
        $.each(cms, function (index, cm) {
            var cmWidth = cm.width || 60;
            if (cm.width == 'autoExpand') {
                cmWidth = 0;
                autoExpandColIndex = index;
            }
            $thead.find("th[axis='col" + index + "'] >div").width(cmWidth);
            allColsWidth += cmWidth;
        });
        this._fixHeaderWidth(autoExpandColIndex, allColsWidth);
        var headerWidth = {};
        $(this._getHeaderCols()).each(function () {
            headerWidth[$(this).attr("abbr")] = $('div', $(this)).width();
        });
        this.tbody.find("td[abbr]").each(function (index, td) {
            var name = $(td).prop("abbr");
            if (headerWidth[name] != null) {
                $(td).find(">div:first").width(headerWidth[name]);
            }
        });
    }, _getColModel:function () {
        return this.options.colModel;
    }, _buildTitle:function () {
        var $title = this.titleDiv;
        if (this.options.title) {
            $title.html("<div class='titleContent'>" + this.options.title + "</div>").show();
        } else {
            $title.empty().hide();
        }
    }, _fixHeaderWidth:function (autoExpandColIndex, allColsWidth) {
        var $grid = this.element.closest('.om-grid'), $thead = $('thead', this.hDiv), cms = this._getColModel(), ops = this.options;
        if (autoExpandColIndex != -1) {
            var tableWidth = $grid.width() - 32, toBeExpandedTh = $thead.find('th[axis="col' + autoExpandColIndex + '"] div');
            toBeExpandedTh.parent().hide();
            var usableWidth = tableWidth - $thead.width();
            toBeExpandedTh.parent().show();
            if (usableWidth <= 0) {
                toBeExpandedTh.css('width', 60);
            } else {
                toBeExpandedTh.css('width', usableWidth);
            }
        } else if (ops.autoFit) {
            var tableWidth = $grid.width() - 22, usableWidth = tableWidth - $thead.width(), percent = 1 + usableWidth / allColsWidth, toFixedThs = $thead.find('th[axis^="col"] >div');
            $.each(cms, function (index) {
                var $th = toFixedThs.eq(index);
                $th.width(parseInt($th.width() * percent));
            });
        }
    }, _buildTableHead:function () {
        var op = this.options, el = this.element, grid = el.closest('.om-grid'), cms = this._getColModel(), allColsWidth = 0, indexWidth = 0, checkboxWidth = 0, autoExpandColIndex = -1;
        thead = $('<thead></thead>');
        tr = $('<tr></tr>').appendTo(thead);
        if (op.showIndex) {
            var cell = $('<th></th>').attr({axis:'indexCol', align:'center'}).addClass('indexCol').append($('<div class="indexheader" style="text-align:center;width:25px;"></div>'));
            tr.append(cell);
            indexWidth = 25;
        }
        if (!op.singleSelect) {
            var cell = $('<th></th>').attr({axis:'checkboxCol', align:'center'}).addClass('checkboxCol').append($('<div class="checkboxheader" style="text-align:center;width:17px;"><span class="checkbox"/></div>'));
            tr.append(cell);
            checkboxWidth = 17;
        }
        for (var i = 0, len = cms.length; i < len; i++) {
            var cm = cms[i], cmWidth = cm.width || 60, cmAlign = cm.align || 'center';
            if (cmWidth == 'autoExpand') {
                cmWidth = 0;
                autoExpandColIndex = i;
            }
            var thCell = $('<div></div>').html(cm.header).css({'text-align':cmAlign, width:cmWidth});
            cm.wrap && thCell.addClass('wrap');
            var th = $('<th></th>').attr('axis', 'col' + i).addClass('col' + i).append(thCell);
            if (cm.name) {
                th.attr('abbr', cm.name);
            }
            if (cm.align) {
                th.attr('align', cm.align);
            }
            allColsWidth += cmWidth;
            tr.append(th);
        }
        el.prepend(thead);
        $('table', this.hDiv).append(thead);
        this._fixHeaderWidth(autoExpandColIndex, allColsWidth);
        this.thead = thead;
        thead = null;
    }, _buildPagingToolBar:function () {
        var op = this.options;
        if (op.limit <= 0) {
            this.pDiv.css("border-width", 0).hide();
            this.pager = this.pDiv;
            return;
        }
        var self = this, el = this.element, pDiv = this.pDiv;
        pDiv.show().html('<div class="pDiv2">' + '<div class="pGroup">' + '<div class="pFirst pButton om-icon"><span class="om-icon-seek-start"></span></div>' + '<div class="pPrev pButton om-icon"><span class="om-icon-seek-prev"></span></div>' + '</div>' + '<div class="btnseparator"></div>' + '<div class="pGroup"><span class="pControl"></span></div>' + '<div class="btnseparator"></div>' + '<div class="pGroup">' + '<div class="pNext pButton om-icon"><span class="om-icon-seek-next"></span></div>' + '<div class="pLast pButton om-icon"><span class="om-icon-seek-end"></span></div>' + '</div>' + '<div class="btnseparator"></div>' + '<div class="pGroup">' + '<div class="pReload pButton om-icon"><span class="om-icon-refresh"></span></div>' + '</div>' + '<div class="btnseparator"></div>' + '<div class="pGroup"><span class="pPageStat"></span></div>' + '</div>');
        var pageText = $.om.lang._get(op, "omGrid", "pageText").replace(/{totalPage}/, '<span>1</span>').replace(/{index}/, '<input type="text" size="4" value="1" />');
        $('.pControl', pDiv).html(pageText);
        el.parent().after(pDiv);
        $('.pReload', pDiv).click(function () {
            self._populate();
        });
        $('.pFirst', pDiv).click(function () {
            self._changePage('first');
        });
        $('.pPrev', pDiv).click(function () {
            self._changePage('prev');
        });
        $('.pNext', pDiv).click(function () {
            self._changePage('next');
        });
        $('.pLast', pDiv).click(function () {
            self._changePage('last');
        });
        $('.pControl input', pDiv).keydown(function (e) {
            if (e.keyCode == $.om.keyCode.ENTER) {
                self._changePage('input');
            }
        });
        $('.pButton', pDiv).hover(function () {
            $(this).addClass('om-state-hover');
        }, function () {
            $(this).removeClass('om-state-hover');
        });
        this.pager = pDiv;
    }, _buildLoadMask:function () {
        var grid = this.element.closest('.om-grid');
        this.loadMask.css({width:"100%", height:grid.height()});
    }, _changePage:function (ctype) {
        if (this.loading) {
            return true;
        }
        var el = this.element, op = this.options, grid = el.closest('.om-grid'), pageData = this.pageData, nowPage = pageData.nowPage, totalPages = pageData.totalPages, newPage = nowPage;
        this._oldPage = nowPage;
        switch (ctype) {
            case'first':
                newPage = 1;
                break;
            case'prev':
                if (nowPage > 1) {
                    newPage = nowPage - 1;
                }
                break;
            case'next':
                if (nowPage < totalPages) {
                    newPage = nowPage + 1;
                }
                break;
            case'last':
                newPage = totalPages;
                break;
            case'input':
                var nv = parseInt($('.pControl input', el.closest('.om-grid')).val());
                if (isNaN(nv)) {
                    nv = nowPage;
                }
                if (nv < 1) {
                    nv = 1;
                } else if (nv > totalPages) {
                    nv = totalPages;
                }
                $('.pControl input', this.pDiv).val(nv);
                newPage = nv;
                break;
            default:
                if (/\d/.test(ctype)) {
                    var nv = parseInt(ctype);
                    if (isNaN(nv)) {
                        nv = 1;
                    }
                    if (nv < 1) {
                        nv = 1;
                    } else if (nv > totalPages) {
                        nv = totalPages;
                    }
                    $('.pControl input', el.closest('.om-grid')).val(nv);
                    newPage = nv;
                }
        }
        if (newPage == nowPage) {
            return false;
        }
        if (this._trigger("onPageChange", null, ctype, newPage) === false) {
            return;
        }
        pageData.nowPage = newPage;
        this._populate();
    }, _populate:function (opts) {
        var self = this, el = this.element, grid = el.closest('.om-grid'), op = this.options, pageStat = $('.pPageStat', grid);
        if (!op.dataSource) {
            $('.pPageStat', grid).html(op.emptygMsg);
            return false;
        }
        //如果数据源是对象数组 qing1000
        if(op.dataSource && typeof op.dataSource == 'object'){
            self._addData(op.dataSource);
            return true;
        }
        //end qing1000
        if (this.loading) {
            return true;
        }
        var pageData = this.pageData, nowPage = pageData.nowPage || 1, loadMask = $('.gBlock', grid);
        this.loading = true;
        pageStat.html($.om.lang._get(op, "omGrid", "loadingMsg"));
        loadMask.show();
        var limit = (op.limit <= 0) ? 100000000 : op.limit;
        var param = $.extend(true, {}, this._extraData, op.extraData, {start:limit * (nowPage - 1), limit:limit, _time_stamp_:new Date().getTime()});
        $.ajax({type:op.method, url:op.dataSource, data:param, dataType:'json', success:function (data, textStatus, request) {
            var onSuccess = op.onSuccess;
            if (typeof(onSuccess) == 'function') {
                self._trigger("onSuccess", null, data, textStatus, request);
            }
            self._addData(data);
            for (var i = 0, len = op._onRefreshCallbacks.length; i < len; i++) {
                op._onRefreshCallbacks[i].call(self);
            }
            self._trigger("onRefresh", null, nowPage, data.rows);
            loadMask.hide();
            self.loading = false;
            if (!!opts && typeof opts.success === 'function')
                opts.success(data);
        }, error:function (XMLHttpRequest, textStatus, errorThrown) {
            pageStat.html($.om.lang._get(op, "omGrid", "errorMsg")).css('color', 'red');
            try {
                if (!!opts && typeof opts.error === 'function')
                    opts.error(XMLHttpRequest, textStatus, errorThrown);
                var onError = op.onError;
                if (typeof(onError) == 'function') {
                    onError(XMLHttpRequest, textStatus, errorThrown);
                }
            } catch (e) {
            } finally {
                loadMask.hide();
                self.loading = false;
                self.pageData.data = {rows:[], total:0};
                return false;
            }
        }});
    }, _addData:function (data) {
        var op = this.options, el = this.element, grid = el.closest('.om-grid'), pageStat = $('.pPageStat', grid), preProcess = op.preProcess, pageData = this.pageData;
        preProcess && (data = preProcess(data));
        pageData.data = data;
        pageData.totalPages = Math.ceil(data.total / op.limit);
        this._buildPager();
        this._renderDatas();
    }, _buildPager:function () {
        var op = this.options;
        if (op.limit <= 0) {
            return;
        }
        var el = this.element, pager = this.pager, pControl = $('.pControl', pager), pageData = this.pageData, nowPage = pageData.nowPage, totalPages = pageData.totalPages, data = pageData.data, from = op.limit * (nowPage - 1) + 1, to = from - 1 + data.rows.length, pageStat = '';
        if (data.total === 0) {
            pageStat = $.om.lang._get(op, "omGrid", "emptyMsg");
        } else {
            pageStat = $.om.lang._get(op, "omGrid", "pageStat").replace(/{from}/, from).replace(/{to}/, to).replace(/{total}/, data.total);
        }
        $('input', pControl).val(nowPage);
        $('span', pControl).html(totalPages);
        $('.pPageStat', pager).html(pageStat);
    }, _renderDatas:function () {
        var self = this, el = this.element, op = this.options, grid = el.closest('.om-grid'), gridHeaderCols = this._getHeaderCols(), rows = this.pageData.data.rows || [], colModel = this._getColModel(), rowClasses = op.rowClasses, tbody = $('tbody', el).empty(), isRowClassesFn = (typeof rowClasses === 'function'), pageData = this.pageData, start = (pageData.nowPage - 1) * op.limit, tdTmp = "<td align='$' abbr='$' class='$'><div align='$' class='innerCol $' style='width:$px'>$</div></td>", headerWidth = [], bodyContent = [], cols, j;
        if (!this.pageData.data.rows) {
            this.pageData.data.rows = [];
        }
        self.hDiv.scrollLeft(0);
        $(gridHeaderCols).each(function (index) {
            headerWidth[index] = $('div', $(this)).width();
        });
        $.each(rows, function (i, rowData) {
            var rowCls = isRowClassesFn ? rowClasses(i, rowData) : rowClasses[i % rowClasses.length];
            var rowValues = self._buildRowCellValues(colModel, rowData, i);
            bodyContent.push("<tr _grid_row_id=" + (self._guid++) + " class='om-grid-row " + rowCls + "'>");
            $(gridHeaderCols).each(function (index) {
                var axis = $(this).attr('axis'), wrap = false, html;
                if (axis == 'indexCol') {
                    html = i + start + 1;
                } else if (axis == 'checkboxCol') {
                    html = '<span class="checkbox"/>';
                } else if (axis.substring(0, 3) == 'col') {
                    var colIndex = axis.substring(3);
                    html = rowValues[colIndex];
                    if (colModel[colIndex].wrap) {
                        wrap = true;
                    }
                } else {
                    html = '';
                }
                cols = [this.align, this.abbr, axis, this.align, wrap ? 'wrap' : '', headerWidth[index], html];
                j = 0;
                bodyContent.push(tdTmp.replace(/\$/g, function () {
                    return cols[j++];
                }));
            });
            bodyContent.push("</tr>");
        });
        tbody.html(bodyContent.join(" "));
    }, _getHeaderCols:function () {
        return this.hDiv.find("th[axis]");
    }, _buildRowCellValues:function (colModel, rowData, rowIndex) {
        var len = colModel.length, values = [];
        for (var i = 0; i < len; i++) {
            var c = colModel[i], v, r = c.renderer;
            if (c.name.indexOf(".") > 0) {
                var properties = c.name.split("."), j = 1, length = properties.length, v = rowData[properties[0]];
                while (j < length && v && (v = v[properties[j++]]) != undefined) {
                }
            }
            if (v == undefined) {
                if (c.cache == undefined) {
                    v = rowData[c.name] == undefined ? "" : rowData[c.name];
                } else {
                    var vals = $.map(c.cache, function (o, i) {
                        return o.id == rowData[c.name] ? o.object_true_name : null;
                    });
                    v = vals.toString();
                }
            }
            if (typeof r === 'function') {
                v = r(v, rowData, rowIndex);
            }
            values[i] = v;
            v = null;
        }
        return values;
    }, _bindScrollEnvent:function () {
        var self = this;
        this.tbody.closest('.bDiv').scroll(function () {
            self.hDiv.scrollLeft($(this).scrollLeft());
        });
    }, _bindSelectAndClickEnvent:function () {
        var self = this;
        this.tbody.unbind();
        if (!this.options.singleSelect) {
            $('th.checkboxCol span.checkbox', this.thead).click(function (event) {
                var thCheckbox = $(this), trSize = self._getTrs().size();
                if (thCheckbox.hasClass('selected')) {
                    thCheckbox.removeClass('selected');
                    for (var i = 0; i < trSize; i++) {
                        if (!!self._trigger("onBeforeRowDeSelect", event, i, self._getRowData(i)) != false) {
                            self._rowDeSelect(i);
                        }
                    }
                } else {
                    thCheckbox.addClass('selected');
                    for (var i = 0; i < trSize; i++) {
                        if (!!self._trigger("onBeforeRowSelect", event, i, self._getRowData(i)) != false) {
                            self._rowSelect(i);
                        }
                    }
                }
            });
            this.tbody.delegate('tr.om-grid-row', 'click', function (event) {
                var row = $(this), index = self._getRowIndex(row);
                if (row.hasClass('om-state-highlight')) {
                    if (!!self._trigger("onBeforeRowDeSelect", event, index, self._getRowData(index)) != false) {
                        self._rowDeSelect(index);
                    }
                } else {
                    if (!!self._trigger("onBeforeRowSelect", event, index, self._getRowData(index)) != false) {
                        self._rowSelect(index);
                    }
                }
                self._refreshHeaderCheckBox();
                self._trigger("onRowClick", event, index, self._getRowData(index));
            });
            this.tbody.delegate('tr.om-grid-row', 'dblclick', function (event) {
                var row = $(this), index = self._getRowIndex(row);
                if (row.hasClass('om-state-highlight')) {
                } else {
                    self._rowSelect(index);
                    self._refreshHeaderCheckBox();
                }
                self._trigger("onRowDblClick", event, index, self._getRowData(index));
            });
        } else {
            this.tbody.delegate('tr.om-grid-row', 'click', function (event) {
                var row = $(this), index = self._getRowIndex(row);
                if (row.hasClass('om-state-highlight')) {
                } else {
                    var lastSelectedIndex = self._getRowIndex(self.tbody.find('tr.om-state-highlight:not(:hidden)'));
                    (lastSelectedIndex != -1) && self._rowDeSelect(lastSelectedIndex);
                    if (!!self._trigger("onBeforeRowSelect", event, index, self._getRowData(index)) != false) {
                        self._rowSelect(index);
                    }
                }
                self._trigger("onRowClick", event, index, self._getRowData(index));
            });
            this.tbody.delegate('tr.om-grid-row', 'dblclick', function (event) {
                var index = self._getRowIndex(this);
                self._trigger("onRowDblClick", event, index, self._getRowData(index));
            });
        }
    }, _getRowData:function (index) {
        return this.pageData.data.rows[index];
    }, _rowSelect:function (index) {
        var el = this.element, op = this.options, tbody = $('tbody', el), tr = this._getTrs().eq(index), chk = $('td.checkboxCol span.checkbox', tr);
        tr.addClass('om-state-highlight');
        chk.addClass('selected');
        this._trigger("onRowSelect", null, index, this._getRowData(index));
    }, _rowDeSelect:function (index) {
        var el = this.element, op = this.options, tbody = $('tbody', el), tr = this._getTrs().eq(index), chk = $('td.checkboxCol span.checkbox', tr);
        tr.removeClass('om-state-highlight');
        chk.removeClass('selected');
        this._trigger("onRowDeselect", null, index, this._getRowData(index));
    }, _refreshHeaderCheckBox:function () {
        var selects = this.getSelections(), $trs = this._getTrs(), headerCheckbox = $('th.checkboxCol span.checkbox', this.thead), len = $trs.length;
        headerCheckbox.toggleClass('selected', len > 0 && len == selects.length);
    }, _makeColsResizable:function () {
        var self = this, bDiv = self.tbody.closest('.bDiv'), grid = self.element.closest('.om-grid'), $titleDiv = this.titleDiv, differWidth;
        $('th[axis^="col"] div', self.thead).omResizable({handles:'e', containment:'document', minWidth:60, resize:function (ui, event) {
            var callbacks = self.options._onResizableCallbacks;
            for (var i = 0, len = callbacks.length; i < len; i++) {
                callbacks[i].call(self);
            }
            var _this = $(this), abbr = _this.parent().attr('abbr'), dataCells = $('td[abbr="' + abbr + '"] > div', self.tbody), hDiv = self.thead.closest('.hDiv');
            _this.width(ui.size.width).height('');
            dataCells.width(ui.size.width).height('');
            bDiv.height(grid.height() - ($titleDiv.is(":hidden") ? 0 : $titleDiv.outerHeight(true)) - hDiv.outerHeight(true) - (self.pDiv.is(":hidden") ? 0 : self.pDiv.outerHeight(true)));
            hDiv.scrollLeft(bDiv.scrollLeft());
        }, start:function (ui, event) {
            differWidth = $(this).parent().width();
        }, stop:function (ui, event) {
            var callbacks = self.options._onResizableStopCallbacks, $th = $(this).parent(), hDiv = self.thead.closest('.hDiv');
            differWidth = $th.width() - differWidth;
            for (var i = 0, len = callbacks.length; i < len; i++) {
                callbacks[i].call(self, $th, differWidth);
            }
            hDiv.scrollLeft(bDiv.scrollLeft());
        }});
    }, _getRowIndex:function (tr) {
        return this._getTrs().index(tr);
    }, _getTrs:function () {
        return this.tbody.find("tr.om-grid-row:not([_delete]=true)");
    }, setData:function (url, opts) {
        this.options.dataSource = url;
        this.pageData = {nowPage:1, totalPages:1};
        this._populate(opts);
    }, getData:function () {
        return this.pageData.data;
    }, refresh:function () {
        if (this.loading) {
            return true;
        }
        this.loading = true;
        var op = this.options;
        $('.pPageStat', this.pager).html($.om.lang._get(op, "omGrid", "loadingMsg"));
        this.loadMask.show();
        this._buildPager();
        this._renderDatas();
        this._trigger("onRefresh", null, this.pageData.nowPage || 1, this.pageData.data.rows);
        for (var i = 0, len = op._onRefreshCallbacks.length; i < len; i++) {
            op._onRefreshCallbacks[i].call(this);
        }
        this.loadMask.hide();
        this.loading = false;
    }, reload:function (page) {
        if (this.loading) {
            return true;
        }
        if (typeof page !== 'undefined') {
            page = parseInt(page) || 1;
            if (page < 0) {
                page = 1;
            }
            if (page > this.pageData.totalPages) {
                page = this.pageData.totalPages;
            }
            this.pageData.nowPage = page;
        }
        this._populate();
    }, setSelections:function (indexes) {
        var self = this;
        if (!$.isArray(indexes)) {
            indexes = [indexes];
        }
        var selected = this.getSelections();
        $(selected).each(function () {
            self._rowDeSelect(this);
        });
        $(indexes).each(function () {
            self._rowSelect(this);
        });
        self._refreshHeaderCheckBox();
    }, getSelections:function (needRecords) {
        var self = this, $trs = self._getTrs(), selectedTrs = $trs.filter('.om-state-highlight'), result = [];
        if (needRecords) {
            var rowsData = self.getData().rows;
            selectedTrs.each(function (index, tr) {
                result[result.length] = rowsData[$trs.index(tr)];
            });
        } else {
            selectedTrs.each(function (index, tr) {
                result[result.length] = $trs.index(tr);
            });
        }
        return result;
    }, destroy:function () {
        var $el = this.element;
        $el.closest('.om-grid').after($el).remove();
    }});
    $.om.lang.omGrid = {loadingMsg:'正在加载数据，请稍候...', emptyMsg:'没有数据', errorMsg:'取数出错', pageText:'第{index}页，共{totalPage}页', pageStat:'共{total}条数据，显示{from}-{to}条'};
})(jQuery);
;
(function ($) {
    $.omWidget('om.omMenu', {options:{contextMenu:false, maxWidth:200, minWidth:100, dataSource:'local'}, show:function (triggerEle) {
        var self = this, options = self.options, top, left, element = self.element;
        var offSet = $(triggerEle).offset();
        if (options.contextMenu) {
            top = triggerEle.pageY;
            left = triggerEle.pageX;
            triggerEle.preventDefault();
            triggerEle.stopPropagation();
            triggerEle.cancelBubble = true;
        } else {
            var buttomWidth = parseInt($(triggerEle).css('borderBottomWidth').replace('px', ''));
            top = offSet.top + $(triggerEle).height() + (buttomWidth != 'NaN' ? buttomWidth : 0) + 1;
            left = offSet.left + 1;
        }
        var parent = element.parent();
        while (parent.css('position') == 'static' && parent[0].nodeName != 'BODY') {
            parent = parent.parent();
        }
        top -= parent.offset().top;
        left -= parent.offset().left;
        if ((left + element.outerWidth()) > document.documentElement.clientWidth) {
            left = left - element.outerWidth() - 20;
        }
        $(element).css({"top":top, 'left':left}).show();
        $(element).children("ul.om-menu").show();
        var width = $(element).width() * 0.7;
        $(element).children("ul.om-menu").children().each(function (index, li) {
            if ($(li).find("span:first").hasClass('om-menu-item-sep')) {
                $(li).find("span:first").width('98%');
            } else {
                if ($(li).find("span:first").width() > width) {
                    $(li).find("span:first").width($(li).attr('aria-haspopup') ? width - 15 : width);
                }
            }
        });
    }, hide:function () {
        this._hide();
    }, disableItem:function (itemId) {
        this.element.find("#" + itemId).addClass("om-state-disabled").unbind(".menuItem");
    }, enableItem:function (itemId) {
        var self = this, element = self.element;
        var cli = element.find("#" + itemId);
        cli.removeClass("om-state-disabled");
        self._bindLiEvent(cli);
    }, destroy:function () {
        var $doc = $(document), handler;
        while (handler = this.globalEvent.pop()) {
            $doc.unbind(".omMenu", handler);
        }
    }, _create:function () {
        var self = this, options = self.options, $ele = self.element, source = options.dataSource;
        $ele.addClass('om-menu-container om-menu-content om-corner-all');
        $ele.css('position', 'absolute');
        if (source) {
            if (source != 'local') {
                if (typeof source == 'string') {
                    self._ajaxLoad($ele, source);
                } else if (typeof source == 'object') {
                    $ele.append(self._appendNodes.apply(self, [source]));
                    self._bindEvent();
                }
            } else {
                var firstMenu = $ele.children("ul").addClass("om-menu");
                self._parseDomMenu(firstMenu);
                self._bindEvent();
            }
        }
    }, _init:function () {
        var opts = this.options, $ele = this.element;
        $ele.css({"minWidth":opts.minWidth - 10, "maxWidth":opts.maxWidth - 10});
        if ($.browser.msie && $.browser.version == '6.0') {
            $ele.css("width", opts.minWidth + 30);
        }
        if ($.browser.msie && $.browser.version == '7.0') {
            $ele.css("width", opts.maxWidth - 10);
        }
    }, _ajaxLoad:function (target, source) {
        var self = this;
        $.ajax({url:source, method:'POST', dataType:'json', success:function (data) {
            target.append(self._appendNodes.apply(self, [data]));
            self._bindEvent();
        }});
    }, _appendNodes:function (source, index) {
        var self = this, menuHtml = [];
        var ulClass = (index == undefined) ? "om-menu" : "om-menu-content";
        var display = (index == undefined) ? "block" : "none";
        var imgClass = (index == undefined) ? "om-menu-icon" : "om-menu-icon om-menu-icon-child";
        menuHtml.push("<ul class=\"" + ulClass + " om-corner-all\" style=\"display:" + display + ";\">");
        var childrenHtml = [];
        $(source).each(function (index, item) {
            if (item.children != null) {
                if (item.disabled === true || item.disabled == "true") {
                    childrenHtml.push("<li id=\"" + item.id + "\" aria-haspopup=\"true\"  class=\"om-state-disabled\">");
                } else {
                    childrenHtml.push("<li id=\"" + item.id + "\"  aria-haspopup=\"true\">");
                }
                childrenHtml.push("<a href=\"javascript:void(0)\" class=\"om-corner-all om-menu-indicator\">");
                item.icon ? childrenHtml.push("<img class=\"" + imgClass + "\" src=\"" + item.icon + "\">") : null;
                item.icon ? childrenHtml.push("<span>" + item.label + "</span>") : childrenHtml.push("<span style=\"margin-left:2em;\">" + item.label + "</span>");
                childrenHtml.push("<span class=\"ui-icon-span\" role=\"popup\"></span>");
                childrenHtml.push("</a>");
                childrenHtml.push(self._appendNodes(item.children, index++));
                childrenHtml.push("</li>");
            } else {
                if (item.disabled === true || item.disabled == "true") {
                    childrenHtml.push("<li id=\"" + item.id + "\"  class=\"om-state-disabled\">");
                } else {
                    childrenHtml.push("<li id=\"" + item.id + "\" >");
                }
                childrenHtml.push("<a href=\"javascript:void(0)\" class=\"om-corner-all om-menu-indicator\">");
                item.icon ? childrenHtml.push("<img class=\"" + imgClass + "\" src=\"" + item.icon + "\">") : null;
                item.icon ? childrenHtml.push("<span>" + item.label + "</span>") : childrenHtml.push("<span style=\"margin-left:2em;\">" + item.label + "</span>");
                childrenHtml.push("</a>");
                childrenHtml.push("</li>");
            }
            if (item.seperator == "true" || item.seperator == true) {
                childrenHtml.push("<li class=\"om-menu-sep-li\"  ><span class=\"om-menu-item-sep\">&nbsp;</span></li>");
            }
            var li = $(self.element).attr('id') + "_" + item.id;
            $(self.element).data(li, item);
        });
        menuHtml.push(childrenHtml.join(""));
        menuHtml.push("</ul>");
        return menuHtml.join("");
    }, _parseDomMenu:function (element) {
        if (element.parent().attr("aria-haspopup") == "true") {
            element.addClass("om-menu-content om-corner-all");
        }
        element.css('display', 'none');
        var lis = element.children();
        for (var i = 0; i < lis.length; i++) {
            var li = $(lis[i]), liCul = li.children("ul");
            if (liCul.length > 0) {
                li.attr("aria-haspopup", "true");
                li.find("span[role='popup']").addClass("ui-icon-span");
                this._parseDomMenu(liCul);
            }
            li.find("a").addClass("om-corner-all om-menu-indicator");
            li.find("img").addClass("om-menu-icon");
        }
    }, _showChildren:function (li) {
        var self = this;
        if (li && li.length > 0) {
            var li_child_ul = li.children("ul").eq(0);
            li_child_ul.css({"minWidth":this.options.minWidth, "top":li.position().top});
            var left = li.width();
            if ((2 * left + li.offset().left) > document.documentElement.clientWidth) {
                left = -left;
            }
            li_child_ul.css("left", left);
            li_child_ul.show();
            li_child_ul.children().each(function (index, li) {
                if ($(li).find("span:first").hasClass('om-menu-item-sep')) {
                    $(li).find("span:first").width('98%');
                } else {
                    if (li_child_ul.width() > self.options.maxWidth) {
                        li_child_ul.width(self.options.maxWidth);
                        width = self.options.maxWidth * 0.6;
                    } else {
                        if (li_child_ul.attr('hasShow') == undefined) {
                            li_child_ul.width(li_child_ul.find('li:eq(0)>a:eq(0)').width() + 15);
                            li_child_ul.attr('hasShow', true);
                        }
                        width = li_child_ul.width() * 0.6;
                    }
                    $(li).find("span:first").width(width);
                }
            });
        }
    }, _hideChildren:function (li) {
        li.children("ul").eq(0).hide();
    }, _bindLiEvent:function (li) {
        var self = this, element = self.element, options = self.options;
        $(li).bind("mouseenter.menuItem",
            function () {
                var self_li = $(this);
                var width = self_li.parent().width();
                self_li.addClass("om-menu-item-hover");
                if ($.browser.msie && $.browser.version == '9.0') {
                    self_li.parent().width(width);
                }
                if (self_li.attr("aria-haspopup")) {
                    setTimeout(function () {
                        self._showChildren(self_li);
                    }, 200);
                }
            }).bind("mouseleave.menuItem",
            function () {
                var self_li = $(this);
                self_li.removeClass("om-menu-item-hover");
                setTimeout(function () {
                    self_li.children("ul").hide();
                }, 200);
            }).bind("mousedown.menuItem", function (event) {
                var item = $(element).data($(element).attr("id") + "_" + this.id);
                if (options.onSelect) {
                    self._trigger("onSelect", event, item);
                }
            });
    }, _bindEvent:function () {
        var self = this, element = self.element, uls = element.find("ul"), lis = element.find("li"), $doc = $(document), tempEvent;
        for (var i = 0; i < lis.length; i++) {
            if (!$(lis[i]).hasClass("om-state-disabled")) {
                self._bindLiEvent(lis[i]);
            }
        }
        ;
        for (var j = 0; j < uls.length; j++) {
            $(uls[j]).bind("mouseleave.menuContainer", function () {
                var ul = $(this);
                if (ul.parent().attr("aria-haspopup") == "true") {
                    ul.hide();
                }
            });
        }
        ;
        this.globalEvent = [];
        $doc.bind('mousedown.omMenu', tempEvent = function () {
            self._hide();
        });
        this.globalEvent.push(tempEvent);
        $doc.bind('keyup.omMenu', tempEvent = function (e) {
            var key = e.keyCode, keyEnum = $.om.keyCode;
            switch (key) {
                case keyEnum.DOWN:
                    self._selectNext();
                    break;
                case keyEnum.UP:
                    self._selectPrev();
                    break;
                case keyEnum.LEFT:
                    self._hideRight();
                    break;
                case keyEnum.RIGHT:
                    self._showRight();
                    break;
                case keyEnum.ENTER:
                    if (element.css("display") == "block")
                        self._backfill(element);
                    self._hide();
                    break;
                case keyEnum.ESCAPE:
                    self._hide();
                    break;
                default:
                    null;
            }
        });
        this.globalEvent.push(tempEvent);
        $doc.bind('keydown.omMenu', tempEvent = function (e) {
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                e.preventDefault();
            }
        });
        this.globalEvent.push(tempEvent);
    }, _hide:function () {
        var self = this, element = self.element;
        element.find("ul").css("display", "none");
        element.find("li.om-menu-item-hover").each(function (index, item) {
            $(item).removeClass("om-menu-item-hover");
        });
        element.hide();
    }, _findNext:function (liMenuItem) {
        var next, oldItem = liMenuItem;
        while ((next = liMenuItem.next("li")).length !== 0) {
            if (!next.hasClass("om-menu-sep-li") && !next.hasClass("om-state-disabled")) {
                return next;
            }
            liMenuItem = next;
        }
        var item = oldItem.parent().find("li:first");
        while (item.length !== 0 && item != oldItem) {
            if (!item.hasClass("om-menu-sep-li") && !item.hasClass("om-state-disabled")) {
                return item;
            }
            item = item.next("li");
        }
    }, _findPrev:function (liMenuItem) {
        var prev, oldItem = liMenuItem;
        while ((prev = liMenuItem.prev("li")).length !== 0) {
            if (!prev.hasClass("om-menu-sep-li") && !prev.hasClass("om-state-disabled")) {
                return prev;
            }
            liMenuItem = prev;
        }
        var ulChildren = oldItem.parent().children();
        var item = ulChildren.eq(ulChildren.length - 1);
        while (item.length !== 0 && item != oldItem) {
            if (!item.hasClass("om-menu-sep-li") && !item.hasClass("om-state-disabled")) {
                return item;
            }
            item = item.prev("li");
        }
    }, _selectNext:function () {
        var self = this, element = self.element, curLi;
        var menuItemHover = element.find("li.om-menu-item-hover");
        var hoverLast = menuItemHover.eq(menuItemHover.length - 1);
        if (menuItemHover.length == 0) {
            curLi = element.find("li").eq(0);
            while (curLi.hasClass('om-state-disabled')) {
                curLi = curLi.next('li');
            }
            curLi.addClass("om-menu-item-hover");
        } else {
            curLi = self._findNext(hoverLast);
            if (curLi.length <= 0)return;
            curLi.addClass("om-menu-item-hover");
            hoverLast.removeClass("om-menu-item-hover");
        }
        this._hideChildren(hoverLast);
        this._showChildren(curLi);
    }, _selectPrev:function () {
        var self = this, element = self.element, curLi;
        var menuItemHover = element.find("li.om-menu-item-hover");
        var hoverLast = menuItemHover.eq(menuItemHover.length - 1);
        curLi = element.find("ul.om-menu > li");
        if (menuItemHover.length == 0) {
            var lastLi = curLi.eq(curLi.length - 1), i = 1;
            while (lastLi.hasClass('om-state-disabled')) {
                lastLi = curLi.eq(curLi.length - (i++));
            }
            (curLi = lastLi).addClass("om-menu-item-hover");
        } else {
            curLi = self._findPrev(hoverLast);
            if (curLi.length <= 0)return;
            curLi.addClass("om-menu-item-hover");
            hoverLast.removeClass("om-menu-item-hover");
        }
        this._hideChildren(hoverLast);
        this._showChildren(curLi);
    }, _hideRight:function () {
        var self = this, element = self.element;
        var currentA = element.find("li.om-menu-item-hover"), hoverLast = currentA.eq(currentA.length - 1);
        hoverLast.removeClass("om-menu-item-hover");
        self._hideChildren(hoverLast);
    }, _showRight:function () {
        var self = this, element = self.element, curLi;
        var parentA = element.find("li.om-menu-item-hover"), parentLi = parentA.eq(parentA.length - 1);
        if (parentLi.attr("aria-haspopup") == "true") {
            curLi = parentLi.children("ul").find("li").eq(0);
            curLi.addClass("om-menu-item-hover");
        }
        self._showChildren(curLi);
    }, _backfill:function (element) {
        var curas = element.find("li.om-menu-item-hover");
        curas.eq(curas.length - 1).mousedown();
    }});
})(jQuery);
(function ($, undefined) {
    var tmpl = '<div class="om-messageBox om-widget om-widget-content om-corner-all" tabindex="-1">' + '<div class="om-messageBox-titlebar om-widget-header om-corner-top om-helper-clearfix">' + '<span class="om-messageBox-title"></span>' + '<a href="#" class="om-messageBox-titlebar-close om-corner-tr"><span class="om-icon om-icon-closethick"></span></a>' + '</div>' + '<div class="om-messageBox-content om-widget-content">' + '<table><tr vailgn="top">' + '<td class="om-messageBox-imageTd"><div class="om-messageBox-image"/>&nbsp;</td>' + '<td class="om-message-content-html"></td>' + '</tr></table>' + '</div>' + '<div class="om-messageBox-buttonpane om-widget-content om-corner-bottom om-helper-clearfix">' + '<div class="om-messageBox-buttonset"></div>' + '</div>' + '</div>';
    var _height = function () {
        if ($.browser.msie && $.browser.version < 7) {
            var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
            return(scrollHeight < offsetHeight) ? $(window).height() : scrollHeight;
        } else {
            return $(document).height();
        }
    };
    var _width = function () {
        if ($.browser.msie) {
            var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
            return(scrollWidth < offsetWidth) ? $(window).width() : scrollWidth;
        } else {
            return $(document).width();
        }
    };
    var close = function (messageBox, mask, handler, value) {
        if (messageBox.hasClass('om-messageBox-waiting')) {
            return;
        }
        handler ? handler(value, messageBox) : jQuery.noop();
        messageBox.remove();
        mask.remove();
    };
    var _show = function (config) {
        var onClose = config.onClose;
        var messageBox = $(tmpl).appendTo(document.body).css('z-index', 1500).position({of:window, collision:'fit'}).omDraggable({containment:'document', cursor:'move', handle:'.om-messageBox-titlebar'}).hide().keydown(function (event) {
            if (event.keyCode && event.keyCode === $.om.keyCode.ESCAPE) {
                close(messageBox, mask, null, false);
                event.preventDefault();
            }
        });
        var mask = $('<div class="om-widget-overlay"/>').appendTo(document.body).show().css({height:_height(), width:_width()});
        var closeBut = messageBox.find('span.om-messageBox-title').html(config.title).next().hover(
            function () {
                $(this).addClass('om-state-hover');
            },
            function () {
                $(this).removeClass('om-state-hover');
            }).focus(
            function () {
                $(this).addClass('om-state-focus');
            }).blur(
            function () {
                $(this).removeClass('om-state-focus');
            }).click(
            function (event) {
                close(messageBox, mask, null, false);
                return false;
            }).bind('mousedown mouseup', function () {
            $(this).toggleClass('om-state-mousedown');
        });
        messageBox.find('div.om-messageBox-image').addClass('om-messageBox-image-' + config.type);
        var content = config.content;
        if (config.type == 'prompt') {
            content = content || '';
            content += '<br/><input id="om-messageBox-prompt-input" type="text"/>';
        }
        messageBox.find('td.om-message-content-html').html(content);
        var buttonSet = messageBox.find('div.om-messageBox-buttonset');
        switch (config.type) {
            case'confirm':
                buttonSet.html('<button id="confirm">确定</button><button id="cancel">取消</button>');
                if ($.fn.omButton) {
                    buttonSet.find("button#confirm").omButton({width:60, onClick:function (event) {
                        close(messageBox, mask, onClose, true);
                    }});
                    buttonSet.find("button#cancel").omButton({width:60, onClick:function (event) {
                        close(messageBox, mask, onClose, false);
                    }});
                }
                break;
            case'prompt':
                buttonSet.html('<button id="confirm">确定</button><button id="cancel">取消</button>');
                if ($.fn.omButton) {
                    buttonSet.find("button#confirm").omButton({width:60, onClick:function (event) {
                        var returnValue = onClose ? onClose($('#om-messageBox-prompt-input').val(), messageBox) : jQuery.noop();
                        if (returnValue !== false) {
                            messageBox.remove();
                            mask.remove();
                        }
                    }});
                    buttonSet.find("button#cancel").omButton({width:60, onClick:function (event) {
                        close(messageBox, mask, onClose, false);
                    }});
                }
                break;
            case'waiting':
                messageBox.addClass('om-messageBox-waiting');
                mask.addClass('om-messageBox-waiting');
                closeBut.hide();
                buttonSet.parent().hide();
                messageBox.find(">.om-messageBox-content").addClass("no-button om-corner-bottom");
                break;
            default:
                buttonSet.html('<button id="confirm">确定</button>');
                if ($.fn.omButton) {
                    buttonSet.find("button#confirm").omButton({width:60, onClick:function (event) {
                        close(messageBox, mask, onClose, true);
                    }});
                }
        }
        var buts = $('button', buttonSet);
        buts.width("100%");
        messageBox.show();
        var okBut = buts.first()[0];
        okBut ? okBut.focus() : messageBox.focus();
        return messageBox;
    };
    $.omMessageBox = {alert:function (config) {
        config = config || {};
        config.title = config.title || '提示';
        config.type = config.type || 'alert';
        _show(config);
    }, confirm:function (config) {
        config = config || {};
        config.title = config.title || '确认';
        config.type = 'confirm';
        _show(config);
    }, prompt:function (config) {
        config = config || {};
        config.title = config.title || '请输入';
        config.type = 'prompt';
        _show(config);
    }, waiting:function (config) {
        if (config === 'close') {
            $('.om-messageBox-waiting').remove();
            return;
        }
        config = config || {};
        config.title = config.title || '请等待';
        config.type = 'waiting';
        _show(config);
    }};
}(jQuery));
(function ($, undefined) {
    $.omMessageTip = {show:function (config) {
        config = $.extend({title:'提醒', content:'&#160;', type:'alert'}, config);
        var html = '<div class="om-messageTip om-widget om-corner-all" tabindex="-1">' + '<div class="om-widget-header om-corner-top om-helper-clearfix">' + '<span class="om-messageTip-title">' + config.title + '</span>' + '<a href="#" class="om-messageTip-titlebar-close om-corner-tr"><span class="om-icon-closethick"></span></a>' + '</div>' + '<div class="om-messageTip-content om-widget-content om-corner-bottom">' + '<div class="om-messageTip-image om-messageTip-image-' + config.type + '"></div>' + '<div class="om-messageTip-content-body">' + config.content + '</div>' + '</div>' + '</div>';
        var messageTip = $(html).appendTo(document.body).css('z-index', 3000).hide();
        var result = {d:messageTip, l:config.onClose};
        messageTip.find('a.om-messageTip-titlebar-close').bind('mouseenter mouseleave',
            function () {
                $(this).toggleClass('om-state-hover');
            }).bind('focus blur',
            function () {
                $(this).toggleClass('om-state-focus');
            }).bind('mousedown mouseup',
            function () {
                $(this).toggleClass('om-state-mousedown');
            }).click(function (event) {
            $.omMessageTip._close(result);
            return false;
        });
        messageTip.slideDown('slow');
        var timer;

        function timeout(time) {
            timer = setTimeout(function () {
                $.omMessageTip._close(result);
            }, time);
        }

        if (config.timeout) {
            timeout(config.timeout);
        }
        messageTip.bind('mouseover',
            function () {
                clearTimeout(timer);
            }).bind('mouseout', function () {
            if (timer) {
                timeout(config.timeout);
            }
        });
        return messageTip;
    }, _close:function (result) {
        result.d.slideUp('slow');
        if (result.l) {
            result.l();
        }
        setTimeout(function () {
            result.d.remove();
        }, 1000);
    }};
}(jQuery));
(function ($) {
    var fixPrecision = function (value, c, p) {
        var v = value.indexOf(".");
        if (isNaN(value) && value != ".") {
            for (; isNaN(value);) {
                value = value.substring(0, value.length - 1);
            }
        }
        if (!p.allowNegative && value.indexOf("-") != -1) {
            var array = value.split("-");
            value = array.join("");
        }
        if (!p.allowDecimals && v != -1 || value.charAt(value.length - 1) === '.') {
            return value.substring(0, v);
        }
        if (v != -1) {
            value = value.substring(0, v + p.decimalPrecision + 1);
        }
        return value.length > 0 ? parseFloat(value) : "";
    };
    $.omWidget("om.omNumberField", {options:{allowDecimals:true, allowNegative:true, decimalPrecision:2, disabled:false, onBlur:function (value) {
    }, readOnly:false}, _create:function () {
        var options = this.options, self = this;
        this.element.addClass("om-numberfield om-widget om-state-default om-state-nobg").css("ime-mode", "disabled");
        this.element.keypress(
            function (e) {
                if (e.which == null && (e.charCode != null || e.keyCode != null)) {
                    e.which = e.charCode != null ? e.charCode : e.keyCode;
                }
                var k = e.which;
                if (k === 8 || (k == 46 && e.button == -1) || k === 0) {
                    return;
                }
                var character = String.fromCharCode(k);
                $.data(this, "character", character);
                var allowed = $.data(this, "allowed");
                if (allowed.indexOf(character) === -1 || ($(this).val().indexOf("-") !== -1 && character == "-") || ($(this).val().indexOf(".") !== -1 && character == ".")) {
                    e.preventDefault();
                }
            }).focus(
            function () {
                $(this).addClass('om-state-focus');
            }).blur(
            function (e) {
                $(this).removeClass('om-state-focus');
                var character = $.data(this, "character");
                this.value = fixPrecision(this.value, character, options);
                self._trigger("onBlur", e, this.value);
            }).keydown(
            function (e) {
                self._checkLast(this);
                if (229 === e.which) {
                    e.preventDefault();
                }
            }).keyup(
            function (e) {
                self._checkLast(this);
            }).bind('cut paste', function (e) {
                return false;
            });
    }, _init:function () {
        var $ele = this.element, opts = this.options;
        if (typeof opts.disabled !== "boolean") {
            opts.disabled = $ele.attr("disabled");
        }
        if (opts.readOnly) {
            $ele.attr("readonly", "readonly");
        }
        var character = $.data($ele[0], "character");
        this._buildAllowChars();
        if (opts.disabled) {
            this.disable();
        } else {
            this.enable();
        }
    }, _checkLast:function (self) {
        var v = self.value, len = v.length;
        if (v && $.data(self, "allowed").indexOf(v.charAt(len - 1)) === -1 || v.indexOf('.') != v.lastIndexOf('.') || v.indexOf('-') != v.lastIndexOf('-')) {
            self.value = v = v.substring(0, (len--) - 1);
        }
    }, _buildAllowChars:function () {
        var allowed = "0123456789";
        if (this.options.allowDecimals) {
            allowed = allowed + ".";
        }
        if (this.options.allowNegative) {
            allowed = allowed + "-";
        }
        if (this.options.readOnly) {
            allowed = "";
        }
        $.data(this.element[0], "allowed", allowed);
    }, disable:function () {
        this.element.attr("disabled", true).addClass("om-numberfield-disabled");
    }, enable:function () {
        this.element.attr("disabled", false).removeClass("om-numberfield-disabled");
    }});
})(jQuery);
(function ($) {
    $.omWidget('om.omSlider', {options:{autoPlay:true, interval:5000, directionNav:false, pauseOnHover:true, controlNav:true, activeNavCls:'nav-selected', effect:'fade', animSpeed:400, startSlide:0, delay:200, onBeforeSlide:function (index) {
    }, onAfterSlide:function (index) {
    }}, slideTo:function (index) {
        opts = this.element.data('omSlider:opts');
        this._slideTo(this.element, index);
    }, next:function () {
        opts = this.element.data('omSlider:opts');
        this._next(this.element);
    }, prev:function () {
        opts = this.element.data('omSlider:opts');
        this._prev(this.element);
    }, destroy:function () {
        var slider = this.element, opts = this.options, vars = this._getSliderVars(slider);
        clearTimeout(vars.slideTimer);
        clearInterval(vars.autoPlayTimer);
        if (vars.customNav) {
            $(opts.controlNav).children().unbind('.omSlider').removeData('sid').removeClass(opts.activeNavCls);
        }
    }, _getSliderVars:function (slider) {
        return slider.data('omSlider:vars');
    }, _runSlideEffect:function (slider, index, effect) {
        var _self = this, vars = this._getSliderVars(slider), $container = slider.find('ul.om-slider-content:first'), $item = $container.children(), opts = this.options, top = 0, left = 0;
        var effectnow = effect ? effect : opts.effect;
        if (opts.effect == 'random') {
            $container.addClass('om-slider-effect-' + effectnow);
        }
        $container.stop();
        if (effectnow == 'slide-v' || effectnow == 'slide-h') {
            var slideV = (effectnow == 'slide-v');
            if (opts.effect == 'random') {
                var cur = 0;
                $item.each(function (n) {
                    if (n !== vars.currentSlide) {
                        cur -= (slideV ? $(this).height() : $(this).width());
                    } else {
                        return false;
                    }
                });
                $container.css(slideV ? "top" : "left", cur);
            }
            $item.each(function (n) {
                if (n == index)return false;
                slideV ? top -= $(this).height() : left -= $(this).width();
            });
        } else {
            return false;
        }
        vars.running = true;
        $container.animate({top:top, left:left}, opts.animSpeed, function () {
            vars.running = false;
            _self._trigger("onAfterSlide", null, index);
        });
    }, _runFadeEffect:function (slider, index) {
        var _self = this, vars = this._getSliderVars(slider), items = slider.find('ul.om-slider-content:first').children(), opts = this.options;
        items.each(function (n) {
            var $child = $(this);
            if (n == index) {
                vars.running = true;
                $child.fadeIn(opts.animSpeed, function () {
                    vars.running = false;
                    _self._trigger("onAfterSlide", null, index);
                });
            } else if (n == vars.currentSlide) {
                $child.fadeOut(opts.animSpeed);
            }
        });
    }, _runNoEffect:function (slider, index) {
        var _self = this, vars = this._getSliderVars(slider), opts = this.options, items = slider.find('ul.om-slider-content:first').children();
        items.each(function (n) {
            var $child = $(this);
            if (n == index) {
                $child.show();
                _self._trigger("onAfterSlide", null, index);
            } else if (n == vars.currentSlide) {
                $child.hide();
            }
        });
    }, _toggleControlNav:function (slider, index) {
        var vars = this._getSliderVars(slider);
        var opts = this.options;
        var parent = slider;
        if (vars.customNav) {
            parent = $('body');
        }
        var navItems = parent.find(vars.controlNav).children();
        navItems.each(function (n) {
            $(this).toggleClass(opts.activeNavCls, n == index);
        });
    }, _slideTo:function (slider, index) {
        var vars = this._getSliderVars(slider), $container = slider.find('ul.om-slider-content:first');
        var opts = this.options, self = this;
        if (isNaN(index) || index < 0 || index >= vars.totalSlides) {
            return;
        }
        if (this._trigger("onBeforeSlide", null, index) === false) {
            return false;
        }
        if (opts.effect == 'random') {
            var array = ['fade', 'slide-h', 'slide-v'];
            var effect = array[Math.floor(Math.random() * 3)];
            $container.removeClass().addClass('om-slider-content');
            $container.removeAttr('style');
            $container.find('li').removeAttr('style');
            if (effect == 'slide-h' || effect == 'slide-v') {
                self._runSlideEffect(slider, index, effect);
            } else {
                self._runFadeEffect(slider, index);
            }
        } else if (opts.effect == 'slide-h' || opts.effect == 'slide-v') {
            self._runSlideEffect(slider, index);
        } else if (opts.effect == 'fade' || opts.effect === true) {
            self._runFadeEffect(slider, index);
        } else {
            self._runNoEffect(slider, index);
        }
        if (vars.controlNav) {
            self._toggleControlNav(slider, index);
        }
        vars.currentSlide = index;
        return slider;
    }, _next:function (slider) {
        var vars = this._getSliderVars(slider), next_index = 0;
        if (vars.currentSlide + 2 <= vars.totalSlides) {
            next_index = vars.currentSlide + 1;
        }
        return this._slideTo(slider, next_index);
    }, _prev:function (slider) {
        var vars = this._getSliderVars(slider), index = vars.totalSlides - 1;
        if (vars.currentSlide != 0) {
            index = vars.currentSlide - 1;
        }
        return this._slideTo(slider, index);
    }, _processDirectionNav:function (slider) {
        var vars = this._getSliderVars(slider), directionNav = $('<div class="om-slider-directionNav">').appendTo(slider), self = this;
        $('<a class="om-slider-prevNav"></a>').appendTo(directionNav).click(function () {
            if (vars.running)return false;
            self._prev(slider);
        });
        $('<a class="om-slider-nextNav"></a>').appendTo(directionNav).click(function () {
            if (vars.running)return false;
            self._next(slider);
        });
        slider.hover(function () {
            directionNav.show();
        }, function () {
            directionNav.hide();
        });
    }, _processControlNav:function (slider) {
        var vars = this._getSliderVars(slider), opts = this.options, self = this, n;
        if (opts.controlNav === true || opts.controlNav === 'classical') {
            var $nav = $('<ul class="om-slider-nav-classical"></ul>');
            vars.controlNav = '.om-slider-nav-classical';
            for (n = 0; n < vars.totalSlides; n++) {
                var $navItem = $('<li>' + (n + 1) + '</li>');
                $navItem.data('sid', n);
                var hTimer = 0;
                $navItem.click(function () {
                    self._slideTo(slider, $(this).data('sid'));
                });
                $navItem.hover(function () {
                    if (vars.running || vars.stop)return false;
                    var _self = $(this);
                    if (_self.hasClass(opts.activeNavCls))return false;
                    vars.slideTimer = hTimer = setTimeout(function () {
                        self._slideTo(slider, _self.data('sid'));
                    }, opts.delay);
                }, function () {
                    clearTimeout(hTimer);
                });
                $nav.append($navItem);
            }
            slider.append($nav);
        } else if (opts.controlNav === 'dot') {
            var $nav = $('<div class="om-slider-nav-dot"></div>');
            vars.controlNav = '.om-slider-nav-dot';
            for (n = 0; n < vars.totalSlides; n++) {
                var $navItem = $('<a href="javascript:void(0)">' + (n + 1) + '</a>');
                $navItem.data('sid', n);
                var hTimer = 0;
                $navItem.click(function () {
                    self._slideTo(slider, $(this).data('sid'));
                });
                $navItem.hover(function () {
                    if (vars.running || vars.stop)return false;
                    var _self = $(this);
                    if (_self.hasClass(opts.activeNavCls))return false;
                    vars.slideTimer = hTimer = setTimeout(function () {
                        self._slideTo(slider, _self.data('sid'));
                    }, opts.delay);
                }, function () {
                    clearTimeout(hTimer);
                });
                $nav.append($navItem);
            }
            $nav.appendTo(slider).css({marginLeft:-1 * $nav.width() / 2});
        } else {
            if ($(opts.controlNav).length > 0) {
                vars.controlNav = opts.controlNav;
                vars.customNav = true;
                var $nav = $(opts.controlNav);
                $nav.children().each(function (n) {
                    var $navItem = $(this);
                    $navItem.data('sid', n);
                    var hTimer = 0;
                    $navItem.bind("click.omSlider", function () {
                        self._slideTo(slider, $(this).data('sid'));
                    });
                    $navItem.bind("mouseover.omSlider",
                        function () {
                            if (vars.running || vars.stop)return false;
                            var _self = $(this);
                            if (_self.hasClass(opts.activeNavCls))return false;
                            vars.slideTimer = hTimer = setTimeout(function () {
                                self._slideTo(slider, _self.data('sid'));
                            }, opts.delay);
                        }).bind("mouseout.omSlider", function () {
                        clearTimeout(hTimer);
                    });
                });
            }
        }
    }, _create:function () {
        var timer = 0;
        var $this = this.element;
        var self = this;
        var opts = this.options;
        var vars = {currentSlide:0, totalSlides:0, running:false, paused:false, stop:false, controlNav:'.om-slider-nav-classical'};
        $this.data('omSlider', $this).data('omSlider:vars', vars).data('omSlider:opts', opts).addClass('om-slider');
        if (opts.startSlide > 0) {
            vars.currentSlide = opts.startSlide;
        }
        var kids = $this.children();
        kids.wrapAll('<ul class="om-slider-content"></ul>').wrap('<li class="om-slider-item"></li>');
        if (opts.effect == 'slide-v' || opts.effect == 'slide-h') {
            $this.find('.om-slider-content').addClass('om-slider-effect-' + opts.effect);
        }
        vars.totalSlides = kids.length;
        this._processControlNav($this);
        function _initSlider(slider, startSlide) {
            if (isNaN(startSlide) || startSlide < 0 || startSlide >= vars.totalSlides) {
                return;
            }
            var $container = slider.find('ul.om-slider-content:first'), $item = $container.children(), top = 0, left = 0;
            if (opts.effect == 'slide-h') {
                $item.each(function (n) {
                    if (n == startSlide)return false;
                    left -= $(this).width();
                });
                setTimeout(function () {
                    $container.css({left:left, top:top});
                }, 0);
            } else if (opts.effect == 'slide-v') {
                $item.each(function (n) {
                    if (n == startSlide)return false;
                    top -= $(this).height();
                });
                setTimeout(function () {
                    $container.css({left:left, top:top});
                }, 0);
            } else {
                $container.children().eq(startSlide).show();
            }
            if (vars.controlNav) {
                self._toggleControlNav(slider, startSlide);
            }
            if (opts.autoPlay) {
                vars.autoPlayTimer = timer = setInterval(function () {
                    self._next(slider);
                }, opts.interval);
            }
            if (opts.pauseOnHover) {
                slider.hover(function () {
                    vars.paused = true;
                    clearInterval(timer);
                }, function () {
                    vars.paused = false;
                    if (opts.autoPlay) {
                        vars.autoPlayTimer = timer = setInterval(function () {
                            self._next(slider);
                        }, opts.interval);
                    }
                });
            }
            if (opts.directionNav) {
                self._processDirectionNav(slider);
            }
        }

        if (opts.startSlide > 0 && (opts.effect == 'slide-h' || opts.effect == 'slide-v')) {
            $(window).load(function () {
                _initSlider($this, opts.startSlide);
            });
        } else {
            _initSlider($this, opts.startSlide);
        }
    }});
})(jQuery);
;
(function ($) {
    var suggestionRowClass = 'om-suggestion-list-row';
    var suggestionHighLightClass = 'om-state-hover';
    $.omWidget('om.omSuggestion', {options:{disabled:false, readOnly:false, minChars:1, delay:500, cacheSize:10, method:'GET', listMaxHeight:300, queryName:'key', crossDomain:false, preProcess:function (text, data) {
        return data;
    }, onBeforeSuggest:function (text, event) {
    }, onSuggesting:function (text, event) {
    }, onSuccess:function (data, textStatus, event) {
    }, onError:function (xmlHttpRequest, textStatus, errorThrown, event) {
    }, onSelect:function (rowData, text, index, event) {
    }}, _create:function () {
        this.element.addClass('om-suggestion om-widget om-state-default om-state-nobg');
        this.dropList = $('<div class="om-widget"><div class="om-widget-content om-droplist"></div></div>').css({position:'absolute', zIndex:2000}).appendTo(document.body).children().first().hide();
    }, _init:function () {
        var self = this, options = this.options, inputEl = this.element.attr('autocomplete', 'off'), dropList = this.dropList;
        if (options.minChars < 0) {
            options.minChars = 0;
        }
        if (options.cacheSize < 0) {
            options.cacheSize = 0;
        }
        if (options.delay < 0) {
            options.delay = 0;
        }
        options.disabled ? this.disable() : this.enable();
        options.readOnly ? inputEl.attr('readonly', 'readonly') : inputEl.removeAttr('readonly');
        inputEl.focus(
            function () {
                $(this).addClass("om-state-focus");
            }).blur(
            function () {
                $(this).removeClass("om-state-focus");
            }).keydown(
            function (e) {
                if (e.keyCode == $.om.keyCode.TAB) {
                    dropList.hide();
                }
            }).keyup(
            function (e) {
                var key = e.keyCode, keyEnum = $.om.keyCode;
                switch (key) {
                    case keyEnum.DOWN:
                        if (dropList.css('display') !== 'none') {
                            self._selectNext();
                        } else {
                            if (dropList.find('.' + suggestionRowClass).size() > 0) {
                                dropList.show();
                            }
                        }
                        break;
                    case keyEnum.UP:
                        if (dropList.css('display') !== 'none') {
                            self._selectPrev();
                        } else {
                            if (dropList.find('.' + suggestionRowClass).size() > 0) {
                                dropList.show();
                            }
                        }
                        break;
                    case keyEnum.ENTER:
                        if (dropList.css('display') === 'none') {
                            return;
                        }
                        dropList.hide();
                        self._triggerOnSelect(e);
                        return false;
                    case keyEnum.ESCAPE:
                        dropList.hide();
                        break;
                    case keyEnum.TAB:
                        break;
                    default:
                        if (options.disabled || options.readOnly) {
                            return false;
                        }
                        if (options.delay > 0) {
                            var delayTimer = $.data(inputEl, 'delayTimer');
                            if (delayTimer) {
                                clearTimeout(delayTimer);
                            }
                            delayTimer = setTimeout(function () {
                                self._suggest();
                            }, options.delay);
                            $.data(inputEl, 'delayTimer', delayTimer);
                        } else {
                            self._suggest();
                        }
                }
            }).mousedown(function (e) {
                e.stopPropagation();
            });
        dropList.mousedown(function (e) {
            e.stopPropagation();
        });
        $(document).bind('mousedown.omSuggestion', this.globalEvent = function () {
            dropList.hide();
        });
    }, clearCache:function () {
        $.removeData(this.element, 'cache');
    }, showMessage:function (message) {
        var inputEl = this.element;
        var dropList = this.dropList.empty().css('height', 'auto');
        $('<div>' + message + '<div>').appendTo(dropList);
        dropList.parent().css('left', inputEl.offset().left).css('top', inputEl.offset().top + inputEl.outerHeight());
        var listWidth = this.options.listWidth;
        if (!listWidth) {
            dropList.parent().width(inputEl.outerWidth());
        } else if (listWidth !== 'auto') {
            dropList.parent().width(listWidth);
        }
        dropList.show();
        var listMaxHeight = this.options.listMaxHeight;
        if (listMaxHeight !== 'auto') {
            if (dropList.height() > listMaxHeight) {
                dropList.height(listMaxHeight).css('overflow', 'auto');
            }
        }
        return this;
    }, disable:function () {
        this.options.disabled = true;
        return this.element.attr('disabled', 'disabled').addClass('om-state-disabled');
    }, enable:function () {
        this.options.disabled = false;
        return this.element.removeAttr('disabled').removeClass('om-state-disabled');
    }, setData:function (dataSource) {
        var options = this.options;
        if (dataSource) {
            options.dataSource = dataSource;
        }
        if (options.cacheSize > 0) {
            this.clearCache();
        }
    }, getData:function () {
        var returnValue = $.data(this.element, 'records');
        return returnValue || null;
    }, getDropList:function () {
        return this.dropList;
    }, destroy:function () {
        $(document).unbind('mousedown.omSuggestion', this.globalEvent);
        this.dropList.parent().remove();
    }, _clear:function () {
        this.element.val('');
        return this.dropList.find('.' + suggestionRowClass).removeClass(suggestionHighLightClass);
    }, _selectNext:function () {
        var dropList = this.dropList, index = dropList.find('.' + suggestionHighLightClass).index(), all = this._clear();
        index += 1;
        if (index >= all.size()) {
            index = 0;
        }
        this._scrollToAndSelect(all, index, dropList);
    }, _selectPrev:function () {
        var dropList = this.dropList, index = dropList.find('.' + suggestionHighLightClass).index(), all = this._clear();
        index -= 1;
        if (index < 0) {
            index = all.size() - 1;
        }
        this._scrollToAndSelect(all, index, dropList);
    }, _scrollToAndSelect:function (all, index, dropList) {
        if (all.size() < 1) {
            return;
        }
        var target = $(all.get(index)).addClass(suggestionHighLightClass);
        var targetTop = target.position().top;
        if (targetTop <= 0) {
            dropList.scrollTop(dropList.scrollTop() + targetTop);
        } else {
            var offset = targetTop + target.outerHeight() - dropList.height();
            if (offset > 0) {
                dropList.scrollTop(dropList.scrollTop() + offset);
            }
        }
        this._select(index);
    }, _select:function (index) {
        var inputEl = this.element;
        var records = $.data(inputEl, 'records');
        var rowData, text;
        if (records.valueField) {
            rowData = records.data[index];
            text = rowData[records.valueField];
        } else {
            rowData = records[index];
            text = rowData;
        }
        inputEl.val(text);
        $.data(inputEl, 'lastStr', text);
    }, _suggest:function () {
        var inputEl = this.element;
        var text = inputEl.val();
        var last = $.data(inputEl, 'lastStr');
        if (last && last === text) {
            return;
        }
        $.data(inputEl, 'lastStr', text);
        var options = this.options;
        var cache = $.data(inputEl, 'cache');
        if (text.length > 0 && text.length >= options.minChars) {
            if (cache) {
                var data = cache[text];
                if (data) {
                    $.data(inputEl, 'records', data);
                    this._buildDropList(data, text);
                    return;
                }
            }
            if (options.onBeforeSuggest) {
                if (this._trigger("onBeforeSuggest", null, text) === false) {
                    this.dropList.empty().hide();
                    return;
                }
            }
            var self = this;
            var requestOption = {url:options.dataSource, type:options.method, dataType:options.crossDomain ? 'jsonp' : 'json', data:{}, success:function (data, textStatus) {
                var onSuccess = options.onSuccess;
                if (onSuccess && self._trigger("onSuccess", null, data, textStatus) === false) {
                    return;
                }
                var preProcess = options.preProcess;
                if (preProcess) {
                    data = preProcess(text, data);
                }
                if (typeof data === 'undefined') {
                    data = [];
                }
                if (options.cacheSize > 0) {
                    var cache = $.data(inputEl, 'cache') || {___keys:[]};
                    var keys = cache.___keys;
                    if (keys.length == options.cacheSize) {
                        var k = keys[0];
                        cache.___keys = keys.slice(1);
                        cache[k] = undefined;
                    }
                    cache[text] = data;
                    cache.___keys.push(text);
                    $.data(inputEl, 'cache', cache);
                }
                $.data(inputEl, 'records', data);
                self._buildDropList(data, text);
            }, error:function (XMLHttpRequest, textStatus, errorThrown) {
                var onError = options.onError;
                if (onError) {
                    self._trigger("onError", null, XMLHttpRequest, textStatus, errorThrown);
                }
            }};
            requestOption.data[options.queryName] = text;
            $.ajax(requestOption);
            var onSuggesting = options.onSuggesting;
            if (onSuggesting) {
                self._trigger("onSuggesting", null, text);
            }
        } else {
            this.dropList.empty().hide();
        }
    }, _buildDropList:function (records, text) {
        var inputEl = this.element;
        var dropList = this.dropList.empty().css('height', 'auto');
        var isSimple = records.valueField ? false : true;
        var clientFormatter = this.options.clientFormatter;
        var self = this;
        if (isSimple) {
            if (clientFormatter) {
                $(records).each(function (index) {
                    self._addRow(clientFormatter(this, index), dropList);
                });
            } else {
                $(records).each(function (index) {
                    self._addRow(this, dropList);
                });
            }
        } else {
            if (clientFormatter) {
                $(records.data).each(function (index) {
                    self._addRow(clientFormatter(this, index), dropList);
                });
            }
        }
        var all = dropList.find('.' + suggestionRowClass);
        if (all.size() > 0) {
            dropList.parent().css('left', parseInt(inputEl.offset().left)).css('top', inputEl.offset().top + inputEl.outerHeight());
            var listWidth = this.options.listWidth;
            if (!listWidth) {
                dropList.parent().width(inputEl.outerWidth());
            } else if (listWidth !== 'auto') {
                dropList.parent().width(listWidth);
            }
            all.mouseover(
                function () {
                    all.removeClass(suggestionHighLightClass);
                    $(this).addClass(suggestionHighLightClass);
                }).mousedown(function (event) {
                var index = dropList.find('.' + suggestionHighLightClass).index();
                self._select(index);
                dropList.hide();
                self._triggerOnSelect(event);
            });
            dropList.show();
            var listMaxHeight = this.options.listMaxHeight;
            if (listMaxHeight !== 'auto') {
                if (dropList.height() > listMaxHeight) {
                    dropList.height(listMaxHeight).css('overflow', 'auto');
                }
            }
            dropList.scrollTop(0);
        }
    }, _addRow:function (html, dropList) {
        $('<div class="' + suggestionRowClass + '">' + html + '</div>').appendTo(dropList);
    }, _triggerOnSelect:function (event) {
        var onSelect = this.options.onSelect;
        if (onSelect) {
            var index = this.dropList.find('.' + suggestionHighLightClass).index();
            if (index < 0) {
                return;
            }
            var records = $.data(this.element, 'records'), rowData, text;
            if (records.valueField) {
                rowData = records.data[index];
                text = rowData[records.valueField];
            } else {
                rowData = records[index];
                text = rowData;
            }
            this._trigger("onSelect", event, rowData, text, index);
        }
    }});
})(jQuery);
(function () {
    var tabIdPrefix = 'om-tabs-' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-', id = 0;
    var activatedCls = "om-tabs-activated om-state-active", scrollDisabled = "om-tabs-scroll-disabled";

    function OmPanel(target, config) {
        if (config.content) {
            $(target).html(config.content);
        }
        return $(target).omPanel(config);
    }

    function isIE7() {
        return $.browser.msie && parseInt($.browser.version) == 7;
    }

    $.omWidget('om.omTabs', {options:{width:'auto', height:'auto', border:true, tabWidth:'auto', tabHeight:27, scrollable:true, closable:false, position:'top', switchMode:'click', autoPlay:false, interval:1000, active:0, lazyLoad:false, tabMenu:false, onBeforeActivate:function (n, event) {
    }, onActivate:function (n, event) {
    }, onBeforeClose:function (n, event) {
    }, onClose:function (n, event) {
    }, onBeforeCloseAll:function (event) {
    }, onCloseAll:function () {
    }, onAdd:function (config, event) {
    }, onBeforeAdd:function (config, event) {
    }, onLoadComplete:function (tabId, event) {
    }}, add:function (config) {
        this._add(config);
    }, close:function (n) {
        this._close(n);
    }, closeAll:function () {
        this._closeAll();
    }, activate:function (n) {
        this._activate(n);
    }, getAlter:function (id) {
        return this._getAlter(id);
    }, getActivated:function () {
        return this._getActivated();
    }, getLength:function () {
        return this._getLength();
    }, setDataSource:function (config) {
        if (config.index === undefined || (!config.url && !config.content)) {
            return;
        }
        this._setDataSource(config);
    }, reload:function (index, url, content) {
        this._reload(index, url, content);
    }, doLayout:function () {
        this._doLayout();
    }, _create:function () {
        this._makeSketch();
        this._collectItems();
        this.history = [];
    }, _init:function () {
        this._render();
        this._afterRender();
        this._buildEvent();
    }, _makeSketch:function () {
        this.element.addClass('om-tabs om-widget om-widget-content om-corner-all').append('<div class="om-tabs-panels om-widget-content om-corner-bottom" />').find('>ul').wrap('<div class="om-tabs-headers om-helper-reset om-helper-clearfix om-widget-header om-corner-all" />');
        this.$menu = $('<div></div>').appendTo($('body'));
    }, _collectItems:function () {
        var _self = this, $self = this.element, options = this.options, items = [], loadInfo = [];
        $self.find('>div.om-tabs-headers a').each(function () {
            var href = this.getAttribute('href', 2);
            var hrefBase = href.split("#")[0], baseEl;
            if (hrefBase && (hrefBase === location.toString().split("#")[0] || (baseEl = $("base")[0]) && hrefBase === baseEl.href)) {
                href = this.hash;
                this.href = href;
            }
            var anchor = $(this);
            var tabId = anchor.attr('tabId') || anchor.attr('id') || tabIdPrefix + id++;
            anchor.attr('tabId', tabId);
            var cfg = {tabId:tabId, title:anchor.text(), _closeMode:"visibility", header:false, closed:true, onSuccess:function (data, textStatus, xmlHttpRequest) {
                _self._trigger("onLoadComplete", null, cfg.tabId);
            }, onError:function (xmlHttpRequest, textStatus, errorThrown) {
                _self._trigger("onLoadComplete", null, cfg.tabId);
            }};
            var target = $('>' + href, $self)[0];
            if (!target && href.indexOf('#') != 0) {
                if (options.lazyLoad === false) {
                    cfg.url = href;
                } else {
                    loadInfo.push({tabId:tabId, url:href, loaded:false});
                }
            }
            var item = new OmPanel(target || $('<div></div>')[0], cfg);
            items.push(item);
        });
        $lis = $self.find('>div.om-tabs-headers ul li');
        $('<span class="left-placeholder"></span>').insertBefore($lis.eq(0));
        $('<span class="right-placeholder"></span>').insertAfter($lis.eq($lis.length - 1));
        if (loadInfo.length > 0) {
            this.loadInfo = loadInfo;
        }
        this.items = items;
    }, _render:function () {
        var self = this, $self = this.element, options = this.options, items = this.items, $headers = $self.find('>div.om-tabs-headers');
        if (typeof options.active == 'number') {
            if (options.active < 0) {
                options.active = 0;
            }
            if (options.active > items.length - 1) {
                options.active = items.length - 1;
            }
        }
        if (options.border !== false) {
            $self.children(':first').addClass("header-no-border");
        }
        if (options.width == 'fit') {
            $self.outerWidth($self.parent().width());
        } else if (options.width != 'auto') {
            $self.css('width', options.width);
            var isPercent = isNaN(options.width) && options.width.indexOf('%') != -1;
            $self.children(':first').outerWidth(isPercent ? '100%' : options.width);
        }
        if (options.height == 'fit') {
            $self.outerHeight($self.parent().height());
        } else if (options.height != 'auto') {
            $self.css('height', options.height);
        }
        if (options.closable && options.tabMenu && $.fn.omMenu) {
            var tabId = $self.attr('id');
            this.menu = this.$menu.omMenu({contextMenu:true, dataSource:[
                {id:tabId + '_001', label:'关闭'},
                {id:tabId + '_002', label:'关闭其它'},
                {id:tabId + '_003', label:'关闭所有'}
            ], onSelect:function (item, e) {
                if (item.id == tabId + '_001') {
                    self.close(self.getAlter($(self.$currentLi).find('a.om-tabs-inner').attr('tabid')));
                } else if (item.id == tabId + '_002') {
                    $headers.find('ul li').each(function (index, item) {
                        var currentLiId = $(self.$currentLi).find('a.om-tabs-inner').attr('tabid');
                        var itemId = $(item).find('a.om-tabs-inner').attr('tabid');
                        if (currentLiId === itemId)return;
                        self.close(self.getAlter(itemId));
                    });
                } else if (item.id == tabId + '_003') {
                    self.closeAll();
                }
            }});
        }
        this._renderHeader();
        this._renderBody();
    }, _renderHeader:function () {
        var $self = this.element, options = this.options, _history = this.history;
        $headers = $self.find('>div.om-tabs-headers'), $lis = $headers.find('ul li');
        $lis.addClass('om-state-default om-corner-top');
        $lis.each(function (n) {
            var $innera = $(this).find('a:first');
            if (isIE7()) {
                $innera.attr('hideFocus', 'true');
            }
            $innera.addClass('om-tabs-inner');
            if (n === options.active || options.active === $innera.attr('tabId')) {
                $(this).addClass(activatedCls);
                options.activeTabId = $innera.attr('tabId');
                options.active = n;
                if (!$.inArray(options.activeTabId, _history)) {
                    _history.push(options.activeTabId);
                }
            } else {
                $(this).removeClass(activatedCls);
            }
            $innera.css({'width':options.tabWidth, 'height':options.tabHeight});
            $('<span class="lileft"></span>').insertBefore($innera);
            if (options.closable === true || ($.isArray(options.closable) && -1 !== $.inArray(n, options.closable))) {
                if ($innera.next('.om-icon-close').length <= 0) {
                    $('<a class="om-icon om-icon-close"></a>').insertAfter($innera);
                }
                $('<span class="liright"></span>').insertAfter($innera.next('.om-icon-close'));
            } else {
                $innera.next().remove();
                $('<span class="liright"></span>').insertAfter($innera);
            }
        });
        var aHeight = $lis.find('a.om-tabs-inner').height();
        $lis.parent().css({'height':++aHeight, 'line-height':aHeight + 'px'});
        $headers.height(aHeight);
        this._checkScroller() && this._enableScroller();
    }, _renderBody:function () {
        var $self = this.element, options = this.options, items = this.items, $panels = $self.find('>div.om-tabs-panels');
        $panels.children().detach();
        if (options.height !== 'auto') {
            var omtabsHeight = $self.innerHeight(), headersHeight = $self.find('>div.om-tabs-headers').outerHeight();
            $panels.css('height', omtabsHeight - headersHeight);
        }
        $self.toggleClass('om-tabs-noborder', !options.border);
        var i = items.length;
        while (i--) {
            items[i].addClass("om-state-nobd").parent().prependTo($panels);
        }
    }, _afterRender:function () {
        var $self = this.element, options = this.options, items = this.items;
        var i = items.length;
        $self.children().each(function () {
            $(this).is('.om-tabs-headers,.om-tabs-panels') || $(this).remove();
        });
        if (!options.lazyLoad) {
            $(items).omPanel('reload');
        } else {
            var $target = $(items[options.active]);
            var tid = $target.omPanel('option', 'tabId');
            var url = this._getUnloadedUrl(tid);
            $target.omPanel('open');
            $target.omPanel("reload", url);
            this._removeLoadInfo(tid);
        }
        while (i--) {
            var $target = $(items[i]);
            if (i == options.active) {
                $target.omPanel('open');
            } else {
                $target.omPanel('close');
            }
        }
        $self.css('height', $self.height());
        $self.css('height', options.height);
    }, _buildEvent:function () {
        var that = this, $self = this.element, options = this.options, $closeIcon = $self.find('>div.om-tabs-headers a.om-icon-close');
        $closeIcon.unbind('click.omtabs').bind('click.omtabs', function (e) {
            var tabid = $(e.target).prev().attr('tabId');
            that._close(tabid);
            return false;
        });
        var $tabInner = $self.find('>div.om-tabs-headers a.om-tabs-inner');
        if (options.switchMode.indexOf('mouseover') != -1) {
            $tabInner.bind('mouseover.omtabs', function () {
                var tabId = $(this).attr('tabId'), timer = $.data($self, 'activateTimer');
                (typeof timer !== 'undefined') && clearTimeout(timer);
                timer = setTimeout(function () {
                    that._activate(tabId);
                    return false;
                }, 100);
                $.data($self, 'activateTimer', timer);
            });
        } else if (options.switchMode.indexOf('click') != -1) {
            $tabInner.bind('click.omtabs', function () {
                that._activate($(this).attr('tabId'));
            });
        }
        $tabInner.bind('click.omtabs', function () {
            return false;
        });
        if (options.autoPlay != false) {
            options.autoInterId = setInterval(function () {
                $self.omTabs('activate', 'next');
            }, options.interval);
        } else {
            clearInterval(options.autoInterId);
        }
        if (options.switchMode.indexOf("mouseover") == -1) {
            var $lis = $self.find('>div.om-tabs-headers li');
            var addState = function (state, $el) {
                if ($el.is(":not(.om-state-disabled)")) {
                    $el.addClass("om-state-" + state);
                }
            };
            var removeState = function (state, $el) {
                $el.removeClass("om-state-" + state);
            };
            $lis.bind("mouseover.omtabs", function () {
                addState("hover", $(this));
            });
            $lis.bind("mouseout.omtabs", function () {
                removeState("hover", $(this));
            });
            if (options.closable && options.tabMenu) {
                $lis.each(function (index, item) {
                    $(item).bind("contextmenu", function (e) {
                        if ($.fn.omMenu) {
                            that.$currentLi = this;
                            $(that.menu).omMenu('show', e);
                        }
                    });
                })
            }
        }
        $self.find('>div.om-tabs-headers >span').bind('click.omtabs', function (e) {
            if ($(this).hasClass('om-tabs-scroll-disabled')) {
                return false;
            }
            var dist = $(this).parent().find('ul').children('li:last').outerWidth(true);
            if ($(this).hasClass('om-tabs-scroll-left')) {
                that._scroll(dist, that._scrollCbFn());
            }
            if ($(this).hasClass('om-tabs-scroll-right')) {
                that._scroll(-dist, that._scrollCbFn());
            }
            return false;
        });
    }, _purgeEvent:function () {
        var $self = this.element, options = this.options;
        var $headers = $self.find('>div.om-tabs-headers');
        $headers.children().unbind('.omtabs');
        $headers.find('>ul >li >a').unbind('.omtabs');
        if (options.autoInterId) {
            clearInterval(options.autoInterId);
        }
    }, _activate:function (n) {
        var $self = this.element, options = this.options, items = this.items, url;
        var $ul = $self.find('>div.om-tabs-headers ul');
        if (options.activeTabId === n || options.active === n) {
            return false;
        }
        n = n || 0;
        var $anchor, tid = n;
        if (n == 'next') {
            n = (options.active + 1) % items.length;
        } else if (n == 'prev') {
            n = (options.active - 1) % items.length;
        }
        if (typeof n == 'number') {
            tid = this._getAlter(n);
        } else if (typeof n == 'string') {
            n = this._getAlter(n);
        }
        if (options.onBeforeActivate && this._trigger("onBeforeActivate", null, n) === false) {
            return false;
        }
        $anchor = $ul.find('li a[tabId=' + tid + ']');
        $anchor.parent().addClass(activatedCls).siblings().removeClass(activatedCls);
        options.activeTabId = tid;
        options.active = n;
        var i = items.length;
        for (i = items.length; i--; i >= 0) {
            var $target = items[i];
            if ($target.omPanel('option', 'tabId') == tid) {
                $target.omPanel('open');
                if (url = this._getUnloadedUrl(tid)) {
                    $target.omPanel("reload", url);
                    this._removeLoadInfo(tid);
                }
            }
        }
        for (i = items.length; i--; i >= 0) {
            var $target = items[i];
            if ($target.omPanel('option', 'tabId') != tid) {
                $target.omPanel('close');
            }
        }
        if (this._checkScroller()) {
            $ul.stop(true, true);
            $self.clearQueue();
            var $lScroller = $ul.prev();
            var $rScroller = $ul.next();
            var lBorder = $anchor.parent().offset().left;
            var rBorder = lBorder + $anchor.parent().outerWidth(true);
            var lDiff = $lScroller.offset().left + $lScroller.outerWidth(true) + 4 - lBorder;
            var rDiff = $rScroller.offset().left - rBorder;
            if (lDiff >= 0) {
                this._scroll(lDiff, this._scrollCbFn());
            } else if (rDiff <= 0) {
                this._scroll(rDiff, this._scrollCbFn());
            } else {
                this._scrollCbFn()();
            }
        }
        var his = this.history, index = $.inArray(tid, his);
        index === -1 ? his.push(tid) : his.push(his.splice(index, 1)[0]);
        options.onActivate && this._trigger("onActivate", null, n);
    }, _getUnloadedUrl:function (tid) {
        var infos = this.loadInfo;
        for (var i in infos) {
            if (infos[i].tabId === tid && infos[i].loaded === false) {
                return infos[i].url;
            }
        }
        return null;
    }, _removeLoadInfo:function (tid) {
        var loadInfo = this.loadInfo, len, info;
        if (loadInfo) {
            len = loadInfo.length;
            while (info = loadInfo[--len]) {
                if (info.tabId === tid) {
                    loadInfo.splice(len, 1);
                    break;
                }
            }
        }
    }, _addLoadInfo:function (tabId, url) {
        this.loadInfo.push({tabId:tabId, loaded:false, url:url});
    }, _getAlter:function (id) {
        var $self = this.element, rt;
        if (typeof id == 'number') {
            rt = $self.find('>div.om-tabs-headers li:eq(' + id + ') a.om-tabs-inner').attr('tabId');
        } else if (typeof id == 'string') {
            $self.find('>div.om-tabs-headers li a.om-tabs-inner').each(function (i) {
                if ($(this).attr('tabId') == id) {
                    rt = i;
                    return false;
                }
            });
        }
        return rt === undefined ? null : rt;
    }, _getActivated:function () {
        return this.options.activeTabId;
    }, _add:function (config) {
        var _self = this, $self = this.element, options = this.options, items = this.items;
        var $ul = $self.find('>div.om-tabs-headers ul');
        var tabId = config.tabId ? config.tabId : tabIdPrefix + id++;
        config.index = config.index || 'last';
        if (config.index == 'last' || config.index > items.length - 1) {
            config.index = items.length;
        }
        config.title = config.title || 'New Title ' + tabId;
        config.url = $.trim(config.url);
        config.content = $.trim(config.content);
        if (config.url) {
            config.content = undefined;
        } else {
            config.url = undefined;
            config.content = config.content || 'New Content ' + tabId;
        }
        if (options.onBeforeAdd && _self._trigger("onBeforeAdd", null, config) == false) {
            return false;
        }
        var $nHeader = $('<li class="om-state-default om-corner-top"> </li>');
        var $anchor = $('<a class="om-tabs-inner"></a>').html(config.title).attr({href:'#' + tabId, tabId:tabId}).css({width:options.tabWidth, height:options.tabHeight}).appendTo($nHeader);
        $('<span class="lileft"></span>').insertBefore($anchor);
        if (isIE7()) {
            $anchor.attr('hideFocus', 'true');
        }
        if ((config.closable === true) || (config.closable == undefined && options.closable)) {
            $anchor.after('<a class="om-icon om-icon-close"></a>');
            $('<span class="liright"></span>').insertAfter($anchor.next('.om-icon-close'));
        } else {
            $('<span class="liright"></span>').insertAfter($anchor);
        }
        var cfg = {tabId:tabId, title:$anchor.text(), _closeMode:"visibility", header:false, closed:true, onSuccess:function (data, textStatus, xmlHttpRequest) {
            _self._trigger("onLoadComplete", null, tabId);
        }, onError:function (xmlHttpRequest, textStatus, errorThrown) {
            _self._trigger("onLoadComplete", null, tabId);
        }};
        $.extend(cfg, config);
        if (config.url && (options.lazyLoad || config.lazyLoad)) {
            _self.loadInfo.push({tabId:tabId, url:config.url, loaded:false});
            cfg.url = null;
        }
        var $nPanel = new OmPanel($('<div>' + (config.content || '') + '</div>')[0], cfg);
        if (config.index == items.length) {
            items[config.index] = $nPanel;
            $nHeader.insertBefore($ul.find('span.right-placeholder'));
        } else {
            items.splice(config.index, 0, $nPanel);
            $ul.children().eq(config.index).before($nHeader);
        }
        if ($ul.innerWidth() - $nHeader.position().left < 500) {
            $ul.width($ul.width() + 500);
        }
        this._checkScroller() && this._enableScroller();
        items[config.index].addClass("om-state-nobd").parent().insertAfter(config.index > 0 ? $self.find('>div.om-tabs-panels').children().eq(config.index - 1) : 0);
        this._purgeEvent();
        this._buildEvent();
        this._trigger("onAdd", null, cfg);
        if (!(config.activateNew === false)) {
            this._activate(config.index);
        }
    }, _close:function (index) {
        var $self = this.element, options = this.options, items = this.items, $headers = $self.find('>div.om-tabs-headers'), $panels = $self.find('>div.om-tabs-panels'), omtabsHeight = $self.height(), tabId = index, his = this.history;
        index = (index === undefined ? options.active : index);
        if (typeof index == 'string') {
            index = this._getAlter(index);
        } else {
            tabId = this._getAlter(index);
        }
        if (options.onBeforeClose && this._trigger("onBeforeClose", null, index) == false) {
            return false;
        }
        this._removeLoadInfo(this._getAlter(index));
        $headers.find('li').eq(index).remove();
        $panels.children().find(">.om-panel-body").eq(index).empty().remove();
        items.splice(index, 1);
        if ($panels.children().length == 0) {
            $panels.css({height:omtabsHeight - $headers.outerHeight()});
        }
        for (var i = his.length - 1; i >= 0; i--) {
            if (tabId === his[i]) {
                his.splice(i, 1);
                break;
            }
        }
        options.onClose && this._trigger("onClose", null, index);
        if (items.length == 0) {
            options.active = -1;
            options.activeTabId = null;
            return;
        } else if (index == options.active) {
            options.active = -1;
            this._activate(his.length > 0 ? his.pop() : 0);
        } else {
            index < options.active && options.active--;
            this._checkScroller() && this._enableScroller();
        }
    }, _closeAll:function () {
        var $self = this.element, options = this.options, items = this.items, $headers = $self.find('>div.om-tabs-headers'), $panels = $self.find('>div.om-tabs-panels'), omtabsHeight = $self.height();
        if (options.onBeforeCloseAll && this._trigger("onBeforeCloseAll") === false) {
            return false;
        }
        for (var i = 0, len = items.length; i < len; i++) {
            this._removeLoadInfo(items[i].omPanel("option", "tabId"));
        }
        $headers.find('li').remove();
        $panels.empty();
        items.splice(0, items.length);
        $panels.css({height:omtabsHeight - $headers.outerHeight()});
        options.active = -1;
        options.activeTabId = null;
        this.history = [];
        options.onCloseAll && this._trigger("onCloseAll");
    }, _checkScroller:function () {
        var $self = this.element, options = this.options;
        if (!options.scrollable) {
            return false;
        }
        var $ul = $self.find('>div.om-tabs-headers ul');
        var totalWidth = 4;
        $ul.children().each(function () {
            totalWidth += $(this).outerWidth(true);
        });
        if (totalWidth > $ul.parent().innerWidth()) {
            if (!$ul.hasClass('om-tabs-scrollable')) {
                var $leftScr = $('<span></span>').insertBefore($ul).addClass('om-tabs-scroll-left');
                var $rightScr = $('<span></span>').insertAfter($ul).addClass('om-tabs-scroll-right');
                var mgn = ($ul.height() - $leftScr.height()) / 2;
                $ul.addClass('om-tabs-scrollable');
            }
            return true;
        } else {
            $ul.removeClass('om-tabs-scrollable').siblings().remove();
            return false;
        }
    }, _scrollCbFn:function () {
        var that = this;
        return function () {
            that._enableScroller();
        };
    }, _enableScroller:function () {
        var $headers = this.element.find('>div.om-tabs-headers'), $ul = $headers.children('ul'), $lScroller = $ul.prev(), $rScroller = $ul.next(), $li = $ul.children(':last'), lBorder = $headers.offset().left, rBorder = $rScroller.offset().left, ulLeft = $ul.offset().left, ulRight = $li.offset().left + $li.outerWidth(true);
        $lScroller.toggleClass(scrollDisabled + ' om-tabs-scroll-disabled-left', ulLeft >= lBorder);
        $rScroller.toggleClass(scrollDisabled + ' om-tabs-scroll-disabled-right', ulRight <= rBorder);
    }, _scroll:function (distance, fn) {
        var _self = this;
        $self = this.element, $ul = $self.find('>div.om-tabs-headers ul'), $li = $ul.children(':last');
        if (distance == 0) {
            return;
        }
        var scrOffset = distance > 0 ? $ul.prev().offset() : $ul.next().offset();
        var queuedFn = function (next) {
            if (distance > 0 && $ul.prev().hasClass(scrollDisabled) || distance < 0 && $ul.next().hasClass(scrollDisabled)) {
                $ul.stop(true, true);
                $self.clearQueue();
                return;
            }
            var flag = false;
            distance = (distance > 0) ? '+=' + Math.min(scrOffset.left - $ul.offset().left, distance) : '-=' + Math.min($li.offset().left + $li.outerWidth(true) - scrOffset.left, Math.abs(distance));
            _self.isScrolling = true;
            $ul.animate({left:distance + 'px'}, 'normal', 'swing', function () {
                !!fn && fn();
                _self.isScrolling = false;
                next();
            });
        };
        $self.queue(queuedFn);
        if ($self.queue().length == 1 && !_self.isScrolling) {
            $self.dequeue();
        }
    }, _getLength:function () {
        return this.items.length;
    }, _doLayout:function () {
        this._checkScroller() && this._enableScroller();
    }, _setDataSource:function (config) {
        var $self = this.element, items = this.items, options = this.options, tabId = this._getAlter(config.index);
        config.url = $.trim(config.url);
        config.content = $.trim(config.content);
        if (config.url) {
            if (options.lazyLoad !== false) {
                this._addLoadInfo(tabId, config.url);
                items[config.index].omPanel("option", "url", config.url);
            } else {
                this._removeLoadInfo(tabId);
                items[config.index].omPanel("reload", config.url);
            }
        } else {
            items[config.index].html(config.content);
        }
    }, _reload:function (index, url, content) {
        var $self = this.element, items = this.items, tabId = this._getAlter(index);
        if (url) {
            this._removeLoadInfo(tabId);
            items[index].omPanel("reload", url);
        } else if (content) {
            items[index].html(content);
        } else {
            items[index].omPanel("reload", this._getUnloadedUrl(tabId));
            this._removeLoadInfo(tabId);
        }
    }});
})(jQuery);
;
(function ($) {
    var CLASSES = {open:"open", closed:"closed", expandable:"expandable", expandableHitarea:"expandable-hitarea", lastExpandableHitarea:"lastExpandable-hitarea", collapsable:"collapsable", collapsableHitarea:"collapsable-hitarea", lastCollapsableHitarea:"lastCollapsable-hitarea", lastCollapsable:"lastCollapsable", lastExpandable:"lastExpandable", last:"last", hitarea:"hitarea"};
    $.omWidget("om.omTree", {_swapClass:function (target, c1, c2) {
        var c1Elements = target.filter('.' + c1);
        target.filter('.' + c2).removeClass(c2).addClass(c1);
        c1Elements.removeClass(c1).addClass(c2);
    }, _getParentNode:function (target) {
        if (target) {
            var $pnode = $(target).parent().parent();
            if ($pnode && $pnode.hasClass("om-tree-node")) {
                return $pnode;
            }
        }
        return null;
    }, _setParentCheckbox:function (node) {
        var pnode = this._getParentNode(node);
        if (pnode) {
            var checkbox = pnode.find(">ul >li >div.tree-checkbox");
            var allChild = checkbox.length;
            var full_len = checkbox.filter(".checkbox_full").length;
            var part_len = checkbox.filter(".checkbox_part").length;
            var pnode_checkbox = pnode.find(">div.tree-checkbox");
            pnode_checkbox.removeClass("checkbox_full checkbox_part");
            if (full_len == allChild) {
                pnode_checkbox.addClass("checkbox_full");
            } else if (full_len > 0 || part_len > 0) {
                pnode_checkbox.addClass("checkbox_part");
            }
            this._setParentCheckbox(pnode);
        }
    }, _setChildCheckbox:function (node, checked) {
        var childck = node.find(">ul").find('.tree-checkbox');
        childck.removeClass("checkbox_part checkbox_full");
        if (checked) {
            childck.addClass("checkbox_full");
        }
    }, _applyEvents:function (target) {
        var self = this, options = self.options, onClick = options.onClick, onDblClick = options.onDblClick, onRightClick = options.onRightClick, onDrag = options.onDrag, onSelect = options.onSelect, onDrop = options.onDrop;
        target.find("span").bind("click",
            function (e) {
                var node = self.element.data("nodes")[$(this).parent().attr("id")];
                onClick && self._trigger("onClick", e, node);
                self.select(node);
                return false;
            }).bind("dblclick",
            function (e) {
                var nDom = $(this).parent();
                var node = self.element.data("nodes")[nDom.attr("id")];
                if (nDom.hasClass("hasChildren")) {
                    nDom.find("span.folder").removeClass("folder").addClass("placeholder");
                }
                if (nDom.has("ul").length > 0 && $(e.target, this))
                    self.toggler(nDom);
                nDom.find("span.placeholder").removeClass("placeholder").addClass("folder");
                onDblClick && self._trigger("onDblClick", e, node);
            }).bind("contextmenu",
            function (e) {
                var node = self.element.data("nodes")[$(this).parent().attr("id")];
                onRightClick && self._trigger("onRightClick", e, node);
            }).bind("mouseover mouseout", function (e) {
                if (e.type == "mouseover") {
                    $(this).addClass("hover");
                }
                else if (e.type == "mouseout") {
                    $(this).removeClass("hover");
                }
                return false;
            });
        self._bindHitEvent(target);
        target.find("div.tree-checkbox").click(function (e) {
            var node = $(this).parent();
            var nodedata = self.findByNId(node.attr("id"));
            self._toggleCheck(node, self.isCheck(nodedata));
        });
        if (self.options.draggable) {
            target.omDraggable({revert:"invalid", onStart:function (ui, e) {
                var node = self.findByNId(ui.helper.attr("id"));
                onDrag && self._trigger("onDrag", e, node);
            }});
            target.omDroppable({greedy:true, accept:"li.om-tree-node", onDragOver:function (source, event) {
                var nodes = target.filter(".treenode-droppable");
                if (nodes.length > 0) {
                    nodes.removeClass("treenode-droppable");
                } else {
                    $(this).addClass("treenode-droppable");
                }
            }, onDragOut:function (source, event) {
                $(this).removeClass("treenode-droppable");
            }, onDrop:function (source, event) {
                var pnode, bnode, $item = source;
                var $drop = this;
                var $list = $drop.find(">ul");
                $(this).removeClass("treenode-droppable");
                $item.css("left", "");
                $item.css("top", "");
                var drop = self.findByNId($drop.attr("id"));
                var dragnode = self.findByNId($item.attr("id"));
                if ($drop.has("ul").length > 0) {
                    pnode = drop;
                } else {
                    bnode = drop;
                    dragnode.pid = drop.pid;
                }
                var node = self.findByNId($item.parent().find("li").attr("id"));
                self.remove(dragnode);
                self.insert(dragnode, pnode, bnode, true);
                onDrop && self._trigger("onDrop", event, node);
            }});
        }
        target.bind("mousedown", function (e) {
            e.stopPropagation();
        });
    }, _bindHitEvent:function (target) {
        var self = this;
        target.find("div.hitarea").click(function () {
            var node = $(this).parent();
            if (node.hasClass("hasChildren")) {
                node.find("span.folder").removeClass("folder").addClass("placeholder");
            }
            self.toggler(node);
            node.find("span.placeholder").removeClass("placeholder").addClass("folder");
        });
    }, options:{initExpandLevel:0, lineHover:false, showIcon:true, showLine:true, showCheckbox:false, cascadeCheck:true, draggable:false, filter:null, nodeCount:0, simpleDataModel:false}, _create:function () {
        this.element.data("nodes", []).data("selected", "").data("init_dataSource", []).addClass("om-tree om-widget");
    }, updateNode:function (target) {
        var self = this, options = self.options;
        var branches = target.find("li");
        self._applyEvents(branches);
        if (options.control) {
            self._treeController(self, options.control);
        }
    }, toggler:function (target) {
        var self = this, options = self.options;
        var nid = target.attr("id");
        var node = self.findByNId(nid);
        var hidden = target.hasClass(CLASSES.expandable);
        if (hidden) {
            var onBeforeExpand = options.onBeforeExpand;
            if (onBeforeExpand && false === self._trigger("onBeforeExpand", null, node)) {
                return self;
            }
        } else {
            var onBeforeCollapse = options.onBeforeCollapse;
            if (onBeforeCollapse && false === self._trigger("onBeforeCollapse", null, node)) {
                return self;
            }
        }
        var hitarea = target.find(target.find(">.hitarea"));
        self._swapClass(hitarea, CLASSES.collapsableHitarea, CLASSES.expandableHitarea);
        self._swapClass(hitarea, CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea);
        self._swapClass(target, CLASSES.collapsable, CLASSES.expandable);
        self._swapClass(target, CLASSES.lastCollapsable, CLASSES.lastExpandable);
        target.find(">ul").each(function () {
            if (hidden) {
                $(this).show();
                var onExpand = options.onExpand;
                onExpand && self._trigger("onExpand", null, node);
            } else {
                $(this).hide();
                var onCollapse = options.onCollapse;
                onCollapse && self._trigger("onCollapse", null, node);
            }
        });
    }, _init:function () {
        var self = this, options = self.options, target = self.element, source = options.dataSource;
        target.empty();
        if (source) {
            if (typeof source == 'string') {
                self._ajaxLoad(target, source);
            } else if (typeof source == 'object') {
                if (options.simpleDataModel) {
                    source = self._transformToNodes(source);
                }
                target.data("init_dataSource", source);
                self._appendNodes.apply(self, [target, source]);
                self.updateNode(target);
            }
        }
    }, _ajaxLoad:function (target, url) {
        var self = this, options = this.options, onBeforeLoad = options.onBeforeLoad, onSuccess = options.onSuccess, onError = options.onError;
        onBeforeLoad && self._trigger("onBeforeLoad", null, self.findByNId(target.parent().attr("id")));
        $.ajax({url:url, method:'POST', dataType:'json', cache:false, success:function (data) {
            if (options.simpleDataModel) {
                data = self._transformToNodes(data);
            }
            target.data("init_dataSource", data);
            self._appendNodes.apply(self, [target, data]);
            self.updateNode(target);
            onSuccess && self._trigger("onSuccess", null, data);
        }, error:function (XMLHttpRequest, textStatus, errorThrown) {
            onError && self._trigger("onError", null, XMLHttpRequest, textStatus, errorThrown);
        }});
    }, check:function (target) {
        this._toggleCheck($("#" + target.nid), false);
    }, uncheck:function (target) {
        this._toggleCheck($("#" + target.nid), true);
    }, _toggleCheck:function (target, checked) {
        var checkbox_item = target.find(">div.tree-checkbox"), self = this, options = self.options, onCheck = options.onCheck;
        if (checked) {
            checkbox_item.removeClass("checkbox_part checkbox_full");
        } else {
            checkbox_item.removeClass("checkbox_part").addClass("checkbox_full");
        }
        if (self.options.cascadeCheck) {
            self._setChildCheckbox(target, !checked);
            self._setParentCheckbox(target);
        }
        onCheck && self._trigger("onCheck", null, self.findByNId(target.attr("id")));
    }, checkAll:function (checked) {
        if (checked) {
            this.element.find(".tree-checkbox").removeClass("checkbox_part").addClass("checkbox_full");
        } else {
            this.element.find(".tree-checkbox").removeClass("checkbox_part checkbox_full");
        }
    }, isCheck:function (target) {
        return $("#" + target.nid).find(">div.tree-checkbox").hasClass("checkbox_full");
    }, getChecked:function (checked) {
        var self = this, nodes = [];
        var filter_config = checked ? ".checkbox_full" : ":not(.checkbox_full)";
        this.element.find(".tree-checkbox").filter(filter_config).each(function (i, name) {
            nodes.push(self.element.data("nodes")[$(this).parent().attr("id")]);
        });
        return nodes;
    }, select:function (target) {
        var self = this, options = this.options, onBeforeSelect = options.onBeforeSelect, onSelect = options.onSelect;
        if (onBeforeSelect && false === self._trigger("onBeforeSelect", null, target)) {
            return self;
        }
        var node = $("#" + target.nid);
        $(" >span", node).addClass("selected");
        var oldSelected = self.element.data("selected");
        var curSelected = node.attr("id");
        if (oldSelected != "" && !(oldSelected == curSelected)) {
            $("#" + oldSelected + " >span").removeClass("selected");
        }
        self.element.data("selected", curSelected);
        onSelect && self._trigger("onSelect", null, target);
    }, unselect:function (target) {
        var self = this;
        var node = $("#" + target.nid);
        $(" >span", node).removeClass("selected");
        var oldSelected = self.element.data("selected");
        var curSelected = node.attr("id");
        if (oldSelected == curSelected) {
            self.element.data("selected", "");
        }
    }, getSelected:function () {
        var selected = this.element.data("selected");
        return selected ? this.element.data("nodes")[selected] : null;
    }, findNodes:function (key, value, pNode, deep) {
        var result = [], len;
        var data = pNode ? pNode.children : this.element.data("init_dataSource");
        deep = (deep != false) ? true : deep;
        if (data && (len = data.length) > 0) {
            for (var i = 0; i < len; i++) {
                result = this._searchNode.apply(data[i], [key, value, this._searchNode, result, false, deep]);
            }
        }
        return result.length > 0 ? result : null;
    }, findNode:function (key, value, pNode, deep) {
        var res, len, data = pNode ? pNode.children : this.element.data("init_dataSource");
        deep = (deep != false) ? true : deep;
        if (data && (len = data.length) > 0) {
            for (var i = 0; i < len; i++) {
                res = this._searchNode.apply(data[i], [key, value, this._searchNode, [], true, deep]);
                if (res != null) {
                    return res;
                }
            }
        }
        return null;
    }, findByNId:function (nid) {
        return this.element.data("nodes")[nid] || null;
    }, findNodesBy:function (fn, pNode, deep) {
        var res, data = pNode ? pNode.children : this.element.data("init_dataSource");
        deep = (deep != false) ? true : deep;
        var result = [];
        if (data && (len = data.length) > 0) {
            for (var i = 0; i < len; i++) {
                if (fn.call(data[i], data[i]) === true) {
                    result.push(data[i]);
                }
                if (deep && data[i].children) {
                    res = this.findNodesBy(fn, data[i], deep);
                    if (res) {
                        result = result.concat(res);
                    }
                }
            }
        }
        return result.length > 0 ? result : null;
    }, findNodeBy:function (fn, pNode, deep) {
        var res, data = pNode ? pNode.children : this.element.data("init_dataSource");
        deep = (deep != false) ? true : deep;
        if (data && (len = data.length) > 0) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (fn.call(data[i], data[i]) === true) {
                    return data[i];
                }
                if (deep) {
                    res = this.findNodeBy(fn, data[i], deep);
                    if (res != null) {
                        return res;
                    }
                }
            }
        }
        return null;
    }, _searchNode:function (key, value, _searchNode, result, isSingle, deep) {
        if (isSingle) {
            if (this[key] == value)
                return this;
            if (this.children && this.children.length && deep) {
                for (var i in this.children) {
                    var temp = _searchNode.apply(this.children[i], [key, value, _searchNode, [], true, deep]);
                    if (temp)return temp;
                }
            }
        } else {
            if (this[key] == value) {
                result.push(this);
            }
            if (this.children && this.children.length && deep) {
                $.each(this.children, _searchNode, [key, value, _searchNode, result, false, deep]);
            }
            return result;
        }
    }, getParent:function (target) {
        var pid = this.element.data("nodes")["pid" + target.nid];
        return pid ? this.findByNId(pid) : null;
    }, getChildren:function (target) {
        return target.children;
    }, getData:function () {
        return this.options.dataSource;
    }, setData:function (data) {
        this.options.dataSource = data;
    }, expand:function (target) {
        if (target.nid) {
            var filter = CLASSES.expandable, node = $("#" + target.nid);
            var targetNodes = $(">div." + CLASSES.hitarea, node).filter(
                function () {
                    return filter ? $(this).parent("." + filter).length : true;
                }).parent().parentsUntil(this.element).andSelf().filter(function () {
                return $(this).filter("li").hasClass(filter);
            });
            this.toggler(targetNodes);
        }
    }, collapse:function (target) {
        if (target.nid) {
            this._collapseHandler(CLASSES.collapsable, $("#" + target.nid));
        }
    }, expandAll:function () {
        this._collapseHandler(CLASSES.expandable, this.element, true);
    }, collapseAll:function () {
        this._collapseHandler(CLASSES.collapsable, this.element, true);
    }, _collapseHandler:function (filter, target, allPosterity) {
        var condition = (allPosterity ? "" : ">") + "div." + CLASSES.hitarea;
        this.toggler($(condition, target).filter(
            function () {
                return filter ? $(this).parent("." + filter).length : true;
            }).parent());
    }, refresh:function (target) {
        var self = this, tree = self.element;
        var data = self.getData();
        if (!target) {
            tree.empty();
            if (typeof data == 'string') {
                self._ajaxLoad(tree, data);
            } else if (typeof data == 'object') {
                self.setData([]);
                for (var i = 0, len = data.length; i < len; i++) {
                    self.insert(data[i]);
                }
            }
        } else {
            var nextNode = $("#" + target.nid).next();
            var pid = tree.data("nodes")["pid" + target.nid];
            self.remove(target);
            self.insert(target, self.findByNId(pid), self.findByNId(nextNode.attr("id")));
        }
    }, _transformToNodes:function (data) {
        var i, l;
        if (!data)return[];
        var r = [];
        var tmpMap = [];
        for (i = 0, l = data.length; i < l; i++) {
            tmpMap[data[i]["id"]] = data[i];
        }
        for (i = 0, l = data.length; i < l; i++) {
            if (tmpMap[data[i]["pid"]]) {
                var pid = data[i]["pid"];
                if (!tmpMap[pid]["children"])
                    tmpMap[pid]["children"] = [];
                tmpMap[pid]["children"].push(data[i]);
            } else {
                r.push(data[i]);
            }
        }
        return r;
    }, _appendNodes:function (target, nodes, bNode, isDrop) {
        var self = this, ht = [];
        var checkable = self.options.showCheckbox;
        var treeid = self.element.attr("id") ? self.element.attr("id") : ("treeId" + parseInt(Math.random() * 1000));
        self.element.attr("id", treeid);
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i], isLastNode = (i == (nodes.length - 1));
            var nodeClass = "om-tree-node " + (checkable ? "treenode-checkable " : "") + (node.hasChildren ? "hasChildren " : "");
            var nid = treeid + "_" + (++self.options.nodeCount);
            node.nid = nid;
            var caches = self.element.data("nodes");
            caches[node.nid] = node;
            if (typeof target == "string") {
                caches["pid" + node.nid] = target;
                if (isLastNode) {
                    target = null;
                }
            } else {
                caches["pid" + node.nid] = target.parent("li").attr("id");
            }
            var childHtml = [];
            if (node.children && node.children.length > 0) {
                childHtml.push((self._appendNodes(node.nid, node.children)).join(""));
            }
            var len = 0;
            if (node.children && (len = node.children.length) > 0 || node.hasChildren) {
                if (node.expanded) {
                    nodeClass = nodeClass + "open " + CLASSES.collapsable + " " + (isLastNode ? CLASSES.lastCollapsable : "");
                } else {
                    nodeClass = nodeClass + CLASSES.expandable + " " + (isLastNode ? CLASSES.lastExpandable : "");
                }
            } else {
                nodeClass = nodeClass + (isLastNode ? CLASSES.last : "");
            }
            ht.push("<li id='", node.nid, "' class='", nodeClass, "'>");
            if (node.hasChildren || len > 0) {
                var classes = "";
                $.each(nodeClass.split(" "), function () {
                    classes += this + "-hitarea ";
                });
                ht.push("<div class='", CLASSES.hitarea + " " + classes, "'/>");
            }
            if (checkable) {
                ht.push("<div class='tree-checkbox'/>");
            }
            var spanClass = (node.classes ? node.classes : "");
            if (self.options.showIcon) {
                if (node.hasChildren || node.children && node.children.length > 0) {
                    spanClass = spanClass + " folder ";
                } else {
                    spanClass = spanClass + " file ";
                }
            }
            ht.push("<span class='", spanClass, "'>", "<a href='#'>", node.text, "</a></span>");
            if (node.hasChildren || len > 0) {
                ht.push("<ul", " style='display:", (node.expanded ? "block" : "none"), "'>");
                ht.push(childHtml.join(''));
                ht.push("</ul>");
            }
            ht.push("</li>");
        }
        if (bNode) {
            if (isDrop) {
                $("#" + bNode.nid).after(ht.join(""));
            } else {
                $("#" + bNode.nid).before(ht.join(""));
            }
        } else if (target) {
            target.append(ht.join(""));
        }
        return ht;
    }, remove:function (target, pNode) {
        var flag, self = this, data = pNode ? pNode.children : self.element.data("init_dataSource");
        for (var i in data) {
            if (data[i] == target) {
                var ids = [];
                ids = self._findChildrenId(target, ids);
                ids.push(target.nid);
                for (var n = 0, len = ids.length; n < len; n++) {
                    delete self.element.data("nodes")[ids[n]];
                    delete self.element.data("nodes")["pid" + ids[n]];
                }
                if (target.nid == self.element.data("selected")) {
                    this.element.data("selected", null);
                }
                var pre = $("#" + target.nid).prev();
                if ($("#" + target.nid).next().length < 1 && pre.length > 0) {
                    if (pre.hasClass(CLASSES.collapsable)) {
                        pre.addClass(CLASSES.lastCollapsable);
                        pre.find("div.hitarea").first().addClass(CLASSES.lastCollapsableHitarea);
                    } else if (pre.hasClass(CLASSES.expandable)) {
                        pre.addClass(CLASSES.lastExpandable);
                        pre.find("div.hitarea").first().addClass(CLASSES.lastExpandableHitarea);
                    } else {
                        pre.addClass(CLASSES.last);
                    }
                }
                $("#" + target.nid).remove();
                data.splice(i, 1);
                if (pNode && pNode.nid && data.length < 1) {
                    self._changeToFolderOrFile(pNode, false);
                }
                return true;
            } else if (data[i].children) {
                flag = self.remove(target, data[i]);
                if (flag) {
                    return true;
                }
            }
        }
        return false;
    }, _findChildrenId:function (target, ids) {
        if (target.children) {
            for (var i = 0, children = target.children, len = children.length; i < len; i++) {
                ids.push(children[i].nid);
                if (children[i].children) {
                    this._findChildrenId(children[i], ids);
                }
            }
        }
        return ids;
    }, insert:function (target, pNode, bNode, isDrop) {
        if (!target) {
            return;
        }
        var self = this, nodes = [], parent, otherChildren, flag = $.isArray(target);
        if (flag) {
            nodes = target;
        } else {
            nodes.push(target);
        }
        if (bNode) {
            pNode = pNode || self.findByNId(self.element.data("nodes")["pid" + bNode.nid]);
        }
        var index, data = pNode ? pNode.children : self.element.data("init_dataSource");
        if (pNode && (!pNode.children || pNode.children.length < 1)) {
            if (!pNode.hasChildren) {
                self._changeToFolderOrFile(pNode, true);
                self._bindHitEvent($("#" + pNode.nid));
            }
            data = pNode.children = [];
        }
        parent = pNode ? $("#" + pNode.nid).children("ul").first() : self.element;
        otherChildren = parent.find("li");
        if (bNode && ((index = $.inArray(bNode, data)) >= 0)) {
            self._appendNodes(parent, nodes, bNode, isDrop);
            data.splice(index, 0, target);
        } else {
            self._appendNodes(parent, nodes, bNode, isDrop);
            if (flag) {
                $.merge(data, target);
            } else {
                data.push(target);
            }
        }
        var m = parent.find("li").filter("." + CLASSES.last + ",." + CLASSES.lastCollapsable + ",." + CLASSES.lastExpandable).not(parent.find("li").filter(":last-child:not(ul)"));
        m.removeClass(CLASSES.last + " " + CLASSES.lastCollapsable + " " + CLASSES.lastExpandable);
        m.find(" >div").removeClass(CLASSES.lastCollapsableHitarea + " " + CLASSES.lastExpandableHitarea);
        var tdom = parent.find("li").not(otherChildren);
        self._applyEvents(tdom);
    }, _changeToFolderOrFile:function (node, isToFolder) {
        var nDom = $("#" + node.nid), self = this;
        if (isToFolder) {
            var parent = $("<ul/>").css("display", "block").appendTo(nDom);
            nDom.addClass("open " + CLASSES.collapsable);
            self._swapClass(nDom, CLASSES.last, CLASSES.lastCollapsable);
            node.children = [];
        } else {
            nDom.find("ul").remove();
            nDom.find("div." + CLASSES.hitarea).remove();
            nDom.filter("." + CLASSES.lastCollapsable + ",." + CLASSES.lastExpandable).removeClass(CLASSES.lastCollapsable + " " + CLASSES.lastExpandable).addClass(CLASSES.last);
            nDom.removeClass("open " + CLASSES.collapsable + " " + CLASSES.expandable);
        }
        if (self.options.showIcon) {
            self._swapClass(nDom.children("span"), "file", "folder");
        }
        var hitarea = nDom.filter(":has(>ul)").prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea);
        hitarea.each(function () {
            var classes = "";
            $.each($(this).parent().attr("class").split(" "), function () {
                classes += this + "-hitarea ";
            });
            $(this).addClass(classes);
        });
    }, modify:function (target, newNode, pNode) {
        if (target && newNode) {
            var self = this, nextNode = $("#" + target.nid).next(), bNode;
            pNode = pNode || this.findByNId(self.element.data("nodes")["pid" + target.nid]);
            if (nextNode.is("ul") || nextNode.is("li"))
                bNode = self.findByNId(nextNode.attr("id"));
            self.remove(target, pNode);
            self.insert(newNode, pNode, bNode);
        }
    }, disable:function () {
    }, enable:function () {
    }});
})(jQuery);
;
(function ($) {
    $.extend($.fn, {validate:function (options) {
        if (!this.length) {
            options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
            return;
        }
        var validator = $.data(this[0], 'validator');
        if (validator) {
            return validator;
        }
        validator = new $.validator(options, this[0]);
        $.data(this[0], 'validator', validator);
        if (validator.settings.onsubmit) {
            this.find("input, button").filter(".cancel").click(function () {
                validator.cancelSubmit = true;
            });
            if (validator.settings.submitHandler) {
                this.find("input, button").filter(":submit").click(function () {
                    validator.submitButton = this;
                });
            }
            this.submit(function (event) {
                if (validator.settings.debug)
                    event.preventDefault();
                function handle() {
                    if (validator.settings.submitHandler) {
                        if (validator.submitButton) {
                            var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                        }
                        validator.settings.submitHandler.call(validator, validator.currentForm);
                        if (validator.submitButton) {
                            hidden.remove();
                        }
                        return false;
                    }
                    return true;
                }

                if (validator.cancelSubmit) {
                    validator.cancelSubmit = false;
                    return handle();
                }
                if (validator.form()) {
                    if (validator.pendingRequest) {
                        validator.formSubmitted = true;
                        return false;
                    }
                    return handle();
                } else {
                    validator.focusInvalid();
                    return false;
                }
            });
        }
        return validator;
    }, valid:function () {
        if ($(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = $(this[0].form).validate();
            this.each(function () {
                valid &= validator.element(this);
            });
            return valid;
        }
    }, removeAttrs:function (attributes) {
        var result = {}, $element = this;
        $.each(attributes.split(/\s/), function (index, value) {
            result[value] = $element.attr(value);
            $element.removeAttr(value);
        });
        return result;
    }, rules:function (command, argument) {
        var element = this[0];
        if (command) {
            var settings = $.data(element.form, 'validator').settings;
            var staticRules = settings.rules;
            var existingRules = $.validator.staticRules(element);
            switch (command) {
                case"add":
                    $.extend(existingRules, $.validator.normalizeRule(argument));
                    staticRules[element.name] = existingRules;
                    if (argument.messages)
                        settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
                    break;
                case"remove":
                    if (!argument) {
                        delete staticRules[element.name];
                        return existingRules;
                    }
                    var filtered = {};
                    $.each(argument.split(/\s/), function (index, method) {
                        filtered[method] = existingRules[method];
                        delete existingRules[method];
                    });
                    return filtered;
            }
        }
        var data = $.validator.normalizeRules($.extend({}, $.validator.metadataRules(element), $.validator.classRules(element), $.validator.attributeRules(element), $.validator.staticRules(element)), element);
        if (data.required) {
            var param = data.required;
            delete data.required;
            data = $.extend({required:param}, data);
        }
        return data;
    }});
    $.extend($.expr[":"], {blank:function (a) {
        return!$.trim("" + a.value);
    }, filled:function (a) {
        return!!$.trim("" + a.value);
    }, unchecked:function (a) {
        return!a.checked;
    }});
    $.validator = function (options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };
    $.validator.format = function (source, params) {
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    };
    $.extend($.validator, {defaults:{validateOnEmpty:false, messages:{}, groups:{}, rules:{}, errorClass:'error', validClass:'valid', errorElement:'label', focusInvalid:true, focusCleanup:false, errorContainer:$([]), errorLabelContainer:$([]), onsubmit:true, ignore:[], ignoreTitle:false, onfocusin:function (element) {
        this.lastActive = element;
        if (this.settings.focusCleanup && !this.blockFocusCleanup) {
            this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
            this.addWrapper(this.errorsFor(element)).hide();
        }
    }, onfocusout:function (element) {
        if (this.settings.validateOnEmpty) {
            if (!this.checkable(element) || (element.name in this.submitted)) {
                this.element(element);
            }
        } else {
            if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                this.element(element);
            }
        }
    }, onkeyup:function (element) {
        if (element.name in this.submitted || element == this.lastElement) {
            this.element(element);
        }
    }, onclick:function (element) {
        if (element.name in this.submitted)
            this.element(element); else if (element.parentNode.name in this.submitted)
            this.element(element.parentNode);
    }, highlight:function (element, errorClass, validClass) {
        if (element.type === 'radio') {
            this.findByName(element.name).addClass(errorClass).removeClass(validClass);
        } else {
            $(element).addClass(errorClass).removeClass(validClass);
        }
    }, unhighlight:function (element, errorClass, validClass) {
        if (element.type === 'radio') {
            this.findByName(element.name).removeClass(errorClass).addClass(validClass);
        } else {
            $(element).removeClass(errorClass).addClass(validClass);
        }
    }}, setDefaults:function (settings) {
        $.extend($.validator.defaults, settings);
    }, messages:{required:"This field is required.", remote:"Please fix this field.", email:"Please enter a valid email address.", url:"Please enter a valid URL.", date:"Please enter a valid date.", number:"Please enter a valid number.", digits:"Please enter only digits.", equalTo:"Please enter the same value again.", accept:"Please enter a value with a valid extension.", maxlength:$.validator.format("Please enter no more than {0} characters."), minlength:$.validator.format("Please enter at least {0} characters."), rangelength:$.validator.format("Please enter a value between {0} and {1} characters long."), range:$.validator.format("Please enter a value between {0} and {1}."), max:$.validator.format("Please enter a value less than or equal to {0}."), min:$.validator.format("Please enter a value greater than or equal to {0}.")}, autoCreateRanges:false, prototype:{init:function () {
        this.labelContainer = $(this.settings.errorLabelContainer);
        this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
        this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
        this.submitted = {};
        this.valueCache = {};
        this.pendingRequest = 0;
        this.pending = {};
        this.invalid = {};
        this.reset();
        var groups = (this.groups = {});
        $.each(this.settings.groups, function (key, value) {
            $.each(value.split(/\s/), function (index, name) {
                groups[name] = key;
            });
        });
        var rules = this.settings.rules;
        $.each(rules, function (key, value) {
            rules[key] = $.validator.normalizeRule(value);
        });
        function delegate(event) {
            var validator = $.data(this[0].form, "validator"), eventType = "on" + event.type.replace(/^validate/, "");
            validator.settings[eventType] && validator.settings[eventType].call(validator, this[0]);
        }

        $(this.currentForm).validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", delegate).validateDelegate(":radio, :checkbox, select, option", "click", delegate);
        if (this.settings.invalidHandler)
            $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
    }, form:function () {
        this.checkForm();
        $.extend(this.submitted, this.errorMap);
        this.invalid = $.extend({}, this.errorMap);
        if (!this.valid())
            $(this.currentForm).triggerHandler("invalid-form", [this]);
        this.showErrors();
        return this.valid();
    }, checkForm:function () {
        this.prepareForm();
        for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
            this.check(elements[i]);
        }
        return this.valid();
    }, element:function (element) {
        element = this.clean(element);
        this.lastElement = element;
        this.prepareElement(element);
        this.currentElements = $(element);
        var result = this.check(element);
        if (result) {
            delete this.invalid[element.name];
        } else {
            this.invalid[element.name] = true;
        }
        if (!this.numberOfInvalids()) {
            this.toHide = this.toHide.add(this.containers);
        }
        this.showErrors();
        return result;
    }, showErrors:function (errors) {
        if (errors) {
            $.extend(this.errorMap, errors);
            this.errorList = [];
            for (var name in errors) {
                this.errorList.push({message:errors[name], element:this.findByName(name)[0]});
            }
            this.successList = $.grep(this.successList, function (element) {
                return!(element.name in errors);
            });
        }
        this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors();
    }, resetForm:function () {
        if ($.fn.resetForm)
            $(this.currentForm).resetForm();
        this.submitted = {};
        this.prepareForm();
        this.hideErrors();
        this.elements().removeClass(this.settings.errorClass);
    }, numberOfInvalids:function () {
        return this.objectLength(this.invalid);
    }, objectLength:function (obj) {
        var count = 0;
        for (var i in obj)
            count++;
        return count;
    }, hideErrors:function () {
        this.addWrapper(this.toHide).hide();
    }, valid:function () {
        return this.size() == 0;
    }, size:function () {
        return this.errorList.length;
    }, focusInvalid:function () {
        if (this.settings.focusInvalid) {
            try {
                $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin");
            } catch (e) {
            }
        }
    }, findLastActive:function () {
        var lastActive = this.lastActive;
        return lastActive && $.grep(this.errorList,
            function (n) {
                return n.element.name == lastActive.name;
            }).length == 1 && lastActive;
    }, elements:function () {
        var validator = this, rulesCache = {};
        return $(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () {
            !this.name && validator.settings.debug && window.console && console.error("%o has no name assigned", this);
            if (this.name in rulesCache || !validator.objectLength($(this).rules()))
                return false;
            rulesCache[this.name] = true;
            return true;
        });
    }, clean:function (selector) {
        return $(selector)[0];
    }, errors:function () {
        return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext);
    }, reset:function () {
        this.successList = [];
        this.errorList = [];
        this.errorMap = {};
        this.toShow = $([]);
        this.toHide = $([]);
        this.currentElements = $([]);
    }, prepareForm:function () {
        this.reset();
        this.toHide = this.errors().add(this.containers);
    }, prepareElement:function (element) {
        this.reset();
        this.toHide = this.errorsFor(element);
    }, check:function (element) {
        element = this.clean(element);
        if (this.checkable(element)) {
            element = this.findByName(element.name).not(this.settings.ignore)[0];
        }
        var rules = $(element).rules();
        var dependencyMismatch = false;
        for (var method in rules) {
            var rule = {method:method, parameters:rules[method]};
            try {
                var result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters);
                if (result == "dependency-mismatch") {
                    dependencyMismatch = true;
                    continue;
                }
                dependencyMismatch = false;
                if (result == "pending") {
                    this.toHide = this.toHide.not(this.errorsFor(element));
                    return;
                }
                if (!result) {
                    this.formatAndAdd(element, rule);
                    return false;
                }
            } catch (e) {
                this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
                    + ", check the '" + rule.method + "' method", e);
                throw e;
            }
        }
        if (dependencyMismatch)
            return;
        if (this.objectLength(rules))
            this.successList.push(element);
        return true;
    }, customMetaMessage:function (element, method) {
        if (!$.metadata)
            return;
        var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();
        return meta && meta.messages && meta.messages[method];
    }, customMessage:function (name, method) {
        var m = this.settings.messages[name];
        return m && (m.constructor == String ? m : m[method]);
    }, findDefined:function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] !== undefined)
                return arguments[i];
        }
        return undefined;
    }, defaultMessage:function (element, method) {
        return this.findDefined(this.customMessage(element.name, method), this.customMetaMessage(element, method), !this.settings.ignoreTitle && element.title || undefined, $.validator.messages[method], "<strong>Warning: No message defined for " + element.name + "</strong>");
    }, formatAndAdd:function (element, rule) {
        var message = this.defaultMessage(element, rule.method), theregex = /\$?\{(\d+)\}/g;
        if (typeof message == "function") {
            message = message.call(this, rule.parameters, element);
        } else if (theregex.test(message)) {
            message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
        }
        this.errorList.push({message:message, element:element});
        this.errorMap[element.name] = message;
        this.submitted[element.name] = message;
    }, addWrapper:function (toToggle) {
        if (this.settings.wrapper)
            toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
        return toToggle;
    }, defaultShowErrors:function () {
        for (var i = 0; this.errorList[i]; i++) {
            var error = this.errorList[i];
            this.settings.highlight && this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
            this.showLabel(error.element, error.message);
        }
        if (this.errorList.length) {
            this.toShow = this.toShow.add(this.containers);
        }
        if (this.settings.success) {
            for (var i = 0; this.successList[i]; i++) {
                this.showLabel(this.successList[i]);
            }
        }
        if (this.settings.unhighlight) {
            for (var i = 0, elements = this.validElements(); elements[i]; i++) {
                this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
            }
        }
        this.toHide = this.toHide.not(this.toShow);
        this.hideErrors();
        this.addWrapper(this.toShow).show();
    }, validElements:function () {
        return this.currentElements.not(this.invalidElements());
    }, invalidElements:function () {
        return $(this.errorList).map(function () {
            return this.element;
        });
    }, showLabel:function (element, message) {
        var label = this.errorsFor(element);
        if (label.length) {
            label.removeClass().addClass(this.settings.errorClass);
            label.attr("generated") && label.html(message);
        } else {
            label = $("<" + this.settings.errorElement + "/>").attr({"for":this.idOrName(element), generated:true}).addClass(this.settings.errorClass).html(message || "");
            if (this.settings.wrapper) {
                label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
            }
            if (!this.labelContainer.append(label).length)
                this.settings.errorPlacement ? this.settings.errorPlacement(label, $(element)) : label.insertAfter(element);
        }
        if (!message && this.settings.success) {
            label.text("");
            typeof this.settings.success == "string" ? label.addClass(this.settings.success) : this.settings.success(label);
        }
        this.toShow = this.toShow.add(label);
    }, errorsFor:function (element) {
        var name = this.idOrName(element);
        return this.errors().filter(function () {
            return $(this).attr('for') == name;
        });
    }, idOrName:function (element) {
        return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
    }, checkable:function (element) {
        return/radio|checkbox/i.test(element.type);
    }, findByName:function (name) {
        var form = this.currentForm;
        return $(document.getElementsByName(name)).map(function (index, element) {
            return element.form == form && element.name == name && element || null;
        });
    }, getLength:function (value, element) {
        switch (element.nodeName.toLowerCase()) {
            case'select':
                return $("option:selected", element).length;
            case'input':
                if (this.checkable(element))
                    return this.findByName(element.name).filter(':checked').length;
        }
        return value.length;
    }, depend:function (param, element) {
        return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
    }, dependTypes:{"boolean":function (param, element) {
        return param;
    }, "string":function (param, element) {
        return!!$(param, element.form).length;
    }, "function":function (param, element) {
        return param(element);
    }}, optional:function (element) {
        return!$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
    }, startRequest:function (element) {
        if (!this.pending[element.name]) {
            this.pendingRequest++;
            this.pending[element.name] = true;
        }
    }, stopRequest:function (element, valid) {
        this.pendingRequest--;
        if (this.pendingRequest < 0)
            this.pendingRequest = 0;
        delete this.pending[element.name];
        if (valid && this.pendingRequest == 0 && this.formSubmitted && this.form()) {
            $(this.currentForm).submit();
            this.formSubmitted = false;
        } else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
            $(this.currentForm).triggerHandler("invalid-form", [this]);
            this.formSubmitted = false;
        }
    }, previousValue:function (element) {
        return $.data(element, "previousValue") || $.data(element, "previousValue", {old:null, valid:true, message:this.defaultMessage(element, "remote")});
    }}, classRuleSettings:{required:{required:true}, email:{email:true}, url:{url:true}, date:{date:true}, number:{number:true}, digits:{digits:true}, creditcard:{creditcard:true}}, addClassRules:function (className, rules) {
        className.constructor == String ? this.classRuleSettings[className] = rules : $.extend(this.classRuleSettings, className);
    }, classRules:function (element) {
        var rules = {};
        var classes = $(element).attr('class');
        classes && $.each(classes.split(' '), function () {
            if (this in $.validator.classRuleSettings) {
                $.extend(rules, $.validator.classRuleSettings[this]);
            }
        });
        return rules;
    }, attributeRules:function (element) {
        var rules = {};
        var $element = $(element);
        for (var method in $.validator.methods) {
            var value = $element.attr(method);
            if (value) {
                rules[method] = value;
            }
        }
        if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
            delete rules.maxlength;
        }
        return rules;
    }, metadataRules:function (element) {
        if (!$.metadata)return{};
        var meta = $.data(element.form, 'validator').settings.meta;
        return meta ? $(element).metadata()[meta] : $(element).metadata();
    }, staticRules:function (element) {
        var rules = {};
        var validator = $.data(element.form, 'validator');
        if (validator.settings.rules) {
            rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
        }
        return rules;
    }, normalizeRules:function (rules, element) {
        $.each(rules, function (prop, val) {
            if (val === false) {
                delete rules[prop];
                return;
            }
            if (val.param || val.depends) {
                var keepRule = true;
                switch (typeof val.depends) {
                    case"string":
                        keepRule = !!$(val.depends, element.form).length;
                        break;
                    case"function":
                        keepRule = val.depends.call(element, element);
                        break;
                }
                if (keepRule) {
                    rules[prop] = val.param !== undefined ? val.param : true;
                } else {
                    delete rules[prop];
                }
            }
        });
        $.each(rules, function (rule, parameter) {
            rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
        });
        $.each(['minlength', 'maxlength', 'min', 'max'], function () {
            if (rules[this]) {
                rules[this] = Number(rules[this]);
            }
        });
        $.each(['rangelength', 'range'], function () {
            if (rules[this]) {
                rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
            }
        });
        if ($.validator.autoCreateRanges) {
            if (rules.min && rules.max) {
                rules.range = [rules.min, rules.max];
                delete rules.min;
                delete rules.max;
            }
            if (rules.minlength && rules.maxlength) {
                rules.rangelength = [rules.minlength, rules.maxlength];
                delete rules.minlength;
                delete rules.maxlength;
            }
        }
        if (rules.messages) {
            delete rules.messages;
        }
        return rules;
    }, normalizeRule:function (data) {
        if (typeof data == "string") {
            var transformed = {};
            $.each(data.split(/\s/), function () {
                transformed[this] = true;
            });
            data = transformed;
        }
        return data;
    }, addMethod:function (name, method, message) {
        $.validator.methods[name] = method;
        $.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
        if (method.length < 3) {
            $.validator.addClassRules(name, $.validator.normalizeRule(name));
        }
    }, methods:{required:function (value, element, param) {
        if (!this.depend(param, element))
            return"dependency-mismatch";
        switch (element.nodeName.toLowerCase()) {
            case'select':
                var val = $(element).val();
                return val && val.length > 0;
            case'input':
                if (this.checkable(element))
                    return this.getLength(value, element) > 0;
            default:
                return $.trim(value).length > 0;
        }
    }, remote:function (value, element, param) {
        if (this.optional(element))
            return"dependency-mismatch";
        var previous = this.previousValue(element);
        if (!this.settings.messages[element.name])
            this.settings.messages[element.name] = {};
        previous.originalMessage = this.settings.messages[element.name].remote;
        this.settings.messages[element.name].remote = previous.message;
        param = typeof param == "string" && {url:param} || param;
        if (this.pending[element.name]) {
            return"pending";
        }
        if (previous.old === value) {
            return previous.valid;
        }
        previous.old = value;
        var validator = this;
        this.startRequest(element);
        var data = {};
        data[element.name] = value;
        $.ajax($.extend(true, {url:param, mode:"abort", port:"validate" + element.name, dataType:"json", data:data, success:function (response) {
            validator.settings.messages[element.name].remote = previous.originalMessage;
            var valid = response === true;
            if (valid) {
                var submitted = validator.formSubmitted;
                validator.prepareElement(element);
                validator.formSubmitted = submitted;
                validator.successList.push(element);
                validator.showErrors();
            } else {
                var errors = {};
                var message = response || validator.defaultMessage(element, "remote");
                errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                validator.showErrors(errors);
            }
            previous.valid = valid;
            validator.stopRequest(element, valid);
        }}, param));
        return"pending";
    }, minlength:function (value, element, param) {
        return this.optional(element) || this.getLength($.trim(value), element) >= param;
    }, maxlength:function (value, element, param) {
        return this.optional(element) || this.getLength($.trim(value), element) <= param;
    }, rangelength:function (value, element, param) {
        var length = this.getLength($.trim(value), element);
        return this.optional(element) || (length >= param[0] && length <= param[1]);
    }, min:function (value, element, param) {
        return this.optional(element) || value >= param;
    }, max:function (value, element, param) {
        return this.optional(element) || value <= param;
    }, range:function (value, element, param) {
        return this.optional(element) || (value >= param[0] && value <= param[1]);
    }, email:function (value, element) {
        return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
    }, url:function (value, element) {
        return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    }, date:function (value, element) {
        return this.optional(element) || !/Invalid|NaN/.test(new Date(Date.parse(value.replace(/-/g, '/'))));
    }, number:function (value, element) {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
    }, digits:function (value, element) {
        return this.optional(element) || /^\d+$/.test(value);
    }, accept:function (value, element, param) {
        param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
        return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
    }, equalTo:function (value, element, param) {
        var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
            $(element).valid();
        });
        return value == target.val();
    }}});
    $.format = $.validator.format;
})(jQuery);
;
(function ($) {
    var pendingRequests = {};
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function (settings, _, xhr) {
            var port = settings.port;
            if (settings.mode == "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        var ajax = $.ajax;
        $.ajax = function (settings) {
            var mode = ("mode"in settings ? settings : $.ajaxSettings).mode, port = ("port"in settings ? settings : $.ajaxSettings).port;
            if (mode == "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                return(pendingRequests[port] = ajax.apply(this, arguments));
            }
            return ajax.apply(this, arguments);
        };
    }
})(jQuery);
;
(function ($) {
    if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
        $.each({focus:'focusin', blur:'focusout'}, function (original, fix) {
            $.event.special[fix] = {setup:function () {
                this.addEventListener(original, handler, true);
            }, teardown:function () {
                this.removeEventListener(original, handler, true);
            }, handler:function (e) {
                arguments[0] = $.event.fix(e);
                arguments[0].type = fix;
                return $.event.handle.apply(this, arguments);
            }};
            function handler(e) {
                e = $.event.fix(e);
                e.type = fix;
                return $.event.handle.call(this, e);
            }
        });
    }
    ;
    $.extend($.fn, {validateDelegate:function (delegate, type, handler) {
        return this.bind(type, function (event) {
            var target = $(event.target);
            if (target.is(delegate)) {
                return handler.apply(target, arguments);
            }
        });
    }});
})(jQuery);
;
(function ($) {
    $.omWidget("om.omProgressbar", {options:{value:0, text:"{value}%", width:"auto", max:100}, min:0, _create:function () {
        var $ele = this.element;
        $ele.addClass("om-progressbar om-widget om-widget-content om-corner-all");
        this.textDiv = $("<div class='om-progressbar-text'></div>").appendTo($ele);
        this.valueDiv = $("<div class='om-progressbar-value om-widget-header om-corner-left'></div>").appendTo($ele);
    }, _init:function () {
        var width = this.element.width();
        if (typeof(this.options.width) == "number") {
            width = this.options.width;
            this.element.width(width);
        }
        this.textDiv.width(Math.floor(width));
        this.oldValue = this._value();
        this._refreshValue();
    }, value:function (newValue) {
        if (newValue === undefined) {
            return this._value();
        }
        this.options.value = newValue;
        this._refreshValue();
    }, _value:function () {
        var val = this.options.value;
        if (typeof val !== "number") {
            val = 0;
        }
        return Math.min(this.options.max, Math.max(this.min, val));
    }, _percentage:function () {
        return 100 * this._value() / this.options.max;
    }, _refreshValue:function () {
        var self = this, value = self.value(), onChange = self.options.onChange;
        var percentage = self._percentage();
        var text = self.options.text, label = "";
        self.valueDiv.toggle(value > self.min).toggleClass("om-corner-right", value === self.options.max).width(percentage.toFixed(0) + "%");
        if (typeof(text) == "function") {
            label = text.call(value, value);
        } else if (typeof(text) == "string") {
            label = text.replace("{value}", value);
        }
        self.textDiv.html(label);
        if (self.oldValue !== value) {
            onChange && self._trigger("onChange", null, value, self.oldValue);
            self.oldValue = value;
        }
    }});
})(jQuery);
;
(function ($) {
    $.omWidget('om.omTooltip', {options:{width:'auto', minWidth:null, maxWidth:null, height:'auto', maxHeight:null, minHeight:null, delay:300, anchor:false, trackMouse:false, showOn:"mouseover", lazyLoad:false, url:null, offset:[5, 5], anchorOffset:0, region:null, html:null, contentEL:null}, _create:function () {
        this.tipContent = $('<div class="tip-body"></div>');
        this.tipAnchor = $('<div class="tip-anchor"></div>');
        this.regionMap = {'right':'left', 'top':'bottom', 'left':'right', 'bottom':'top'};
        this.tip = $('<div class="tip"></div>').append(this.tipContent);
    }, _init:function () {
        var self = this, options = self.options;
        this.tipContent.empty();
        this.tip.find('div.tip-anchor').remove();
        if (options.anchor) {
            self.tip.append(self.tipAnchor);
        }
        self.adjustWidth = 6;
        self.adjustHeight = 6;
        if (options.width != 'auto') {
            this.tip.css('width', options.width - self.adjustWidth);
        } else {
            this.tip.css('width', 'auto');
        }
        if (options.height != 'auto') {
            this.tip.css('height', options.height - self.adjustHeight);
        } else {
            this.tip.css('height', 'auto');
        }
        if (options.minWidth) {
            this.tip.css('minWidth', options.minWidth - self.adjustWidth);
        }
        if (options.maxWidth) {
            this.tip.css('maxWidth', options.maxWidth - self.adjustWidth);
        }
        if (options.maxHeight) {
            this.tip.css('maxHeight', options.maxHeight - self.adjustHeight);
        }
        if (options.minHeight) {
            this.tip.css('minHeight', options.minHeight - self.adjustHeight);
        }
        if (options.url && !options.lazyLoad) {
            self._ajaxLoad(options.url);
        } else if (options.html) {
            this.tip.find('.tip-body').append(options.html);
        } else {
            var contentElClone = $(options.contentEL).clone();
            $(options.contentEL).remove();
            this.tip.find('.tip-body').append(contentElClone.show());
        }
        this._bindEvent();
    }, _ajaxLoad:function (url) {
        var self = this;
        $.ajax({url:url, method:'POST', dataType:'html', success:function (data, textStatus) {
            self.tip.find('.tip-body').append(data);
        }, error:function (XMLHttpRequest, textStatus, errorThrown) {
            self.tip.find('.tip-body').append($.om.lang.omTooltip.FailedToLoad);
        }});
    }, _bindEvent:function () {
        var self = this, options = self.options, element = self.element;
        if (options.showOn == 'mouseover') {
            element.bind('mouseover.tooltip', function (e) {
                if (self.showTime)clearTimeout(self.showTime);
                self.showTime = setTimeout(function () {
                    self.show(e);
                }, options.delay);
            });
        } else if (options.showOn == 'click') {
            self.showTime = element.bind('click.tooltip', function (e) {
                setTimeout(function () {
                    self.show(e);
                }, options.delay);
            });
        }
        if (options.trackMouse) {
            element.bind('mousemove.tooltip', function (e) {
                self._adjustPosition(e);
            });
        }
        element.bind('mouseleave.tooltip', function () {
            if (self.showTime)clearTimeout(self.showTime);
            self.hideTime = setTimeout(function () {
                self.hide();
            }, options.delay);
        });
        self.tip.bind('mouseover.tooltip',
            function () {
                if (self.hideTime) {
                    clearTimeout(self.hideTime);
                }
            }).bind('mouseleave.tooltip', function () {
            setTimeout(function () {
                self.hide();
            }, options.delay);
        });
    }, show:function (e) {
        var self = this, options = self.options;
        if ($(document.body).find(self.tip).length <= 0) {
            if (options.url && options.lazyLoad) {
                self._ajaxLoad(options.url);
            }
            self.tip.appendTo(document.body).fadeIn();
            self._adjustPosition(e);
        } else {
            self._adjustPosition(e);
            self.tip.fadeIn();
        }
    }, _adjustPosition:function (event) {
        var self = this, options = self.options, element = self.element, top, left, offSet = $(element).offset();
        if (event && !options.region) {
            top = event.pageY + options.offset[0];
            left = event.pageX + options.offset[1];
            self.tip.find('.tip-anchor').css({'top':options.anchorOffset + 3, 'left':'-9px'}).addClass('tip-anchor-left');
        } else {
            var bottomWidth = parseInt($(element).css('borderBottomWidth').replace('px', ''));
            top = offSet.top + $(element).height() + (isNaN(bottomWidth) ? 0 : bottomWidth) + options.offset[0];
            left = offSet.left + options.offset[1];
            if (options.region == 'right') {
                left = offSet.left + options.offset[1] + $(element).width() + self.adjustWidth;
                top = top - self.element.height() + self.adjustHeight + options.offset[0];
                self.tip.find('.tip-anchor').css({'top':options.anchorOffset + 3, 'left':'-9px'});
            } else if (options.region == 'left') {
                left = offSet.left - self.tip.width() - self.adjustWidth - options.offset[1] - 2;
                top = top - self.element.height() - self.adjustHeight - options.offset[0];
                self.tip.find('.tip-anchor').css({'top':options.anchorOffset + 3, 'left':self.tip.outerWidth() - 2});
            } else if (options.region == 'top') {
                top = top - (self.element.height() + self.tip.height() + self.adjustHeight + 2) - options.offset[0];
                left = left + options.offset[1];
                self.tip.find('.tip-anchor').css({'top':self.tip.outerHeight() - 3, 'left':options.anchorOffset + 3});
            } else if (options.region == 'bottom') {
                top = top + options.offset[0];
                left = left + options.offset[1];
                self.tip.find('.tip-anchor').css({'top':-9, 'left':options.anchorOffset + 3});
            }
            self.tip.find('.tip-anchor').addClass('tip-anchor-' + self.regionMap[options.region]);
        }
        if ((left + self.tip.width()) > document.documentElement.clientWidth) {
            left = left - self.tip.width() - 20;
        }
        if ((top + self.tip.height()) > document.documentElement.clientHeight) {
            top = top - (self.element.height() + self.tip.height()) - 20;
        }
        self.tip.css({'top':top - $(document).scrollTop(), 'left':left - $(document).scrollLeft()});
    }, hide:function () {
        this.tip.hide();
    }, destroy:function () {
        clearTimeout(this.showTime);
        clearTimeout(this.hideTime);
        this.element.unbind('.tooltip');
        this.tip.remove();
    }});
    $.om.lang.omTooltip = {FailedToLoad:'加载提示信息出错！'};
})(jQuery);
;
(function ($) {
    $.omWidget('om.omItemSelector', {options:{width:'300px', height:'300px', dataSource:[], value:[], clientFormatter:false, autoSort:false, preProcess:function (data) {
        return data;
    }, onError:jQuery.noop, onSuccess:jQuery.noop, onBeforeItemSelect:jQuery.noop, onBeforeItemDeselect:jQuery.noop, onItemSelect:jQuery.noop, onItemDeselect:jQuery.noop}, _create:function () {
        this.element.addClass('om-itemselector om-widget').html('<table style="height:100%;width:100%" cellpadding="0" cellspacing="0"><tr><td class="om-itemselector-leftpanel"></td><td class="om-itemselector-toolbar"></td><td class="om-itemselector-rightpanel"></td></tr></table>');
        var tds = $('td', this.element);
        var thead = $('<thead></thead>');
        var cell = $('<th></th>').attr({axis:'checkboxCol', align:'center'}).append($('<div class="header"><span class="checkbox"/><span class="om-itemselector-title"/></div>'));
        $('<tr></tr>').append(cell).appendTo(thead);
        this.leftPanel = $('<table cellspacing="0" cellpadding="0"></table>').append(thead).append('<tr><td><div class="om-itemselector-up"><span class="upbtn"/></div><div class="om-itemselector-items"><dl></dl></div><div class="om-itemselector-down"><span class="downbtn"/></div></tr></td>').appendTo(tds.eq(0));
        this.toolbar = $('<div></div>').appendTo(tds.eq(1));
        this.rightPanel = this.leftPanel.clone().appendTo(tds.eq(2));
    }, _init:function () {
        var op = this.options, dataSource = op.dataSource;
        this.leftPanel.find(".om-itemselector-title").html($.om.lang._get(op, "omItemSelector", "availableTitle"));
        this.rightPanel.find(".om-itemselector-title").html($.om.lang._get(op, "omItemSelector", "selectedTitle"));
        this.element.css({width:op.width, height:op.height});
        this._buildToolbar();
        this._resizePanel();
        this._bindEvents();
        if (typeof dataSource === 'string') {
            var self = this;
            $.ajax({url:dataSource, method:'GET', dataType:'json', success:function (data, textStatus) {
                if (self._trigger("onSuccess", null, data, textStatus) === false) {
                    return;
                }
                data = op.preProcess(data);
                op.dataSource = data;
                self._buildList();
            }, error:function (XMLHttpRequest, textStatus, errorThrown) {
                self._trigger("onError", null, XMLHttpRequest, textStatus, errorThrown);
            }});
        } else {
            this._buildList();
        }
        this._refreshPageButton(this.leftPanel);
        this._refreshPageButton(this.rightPanel);
    }, _buildToolbar:function () {
        var html = '', ALL_ICONS = ['add', 'space', 'remove'];
        for (var i = 0, len = ALL_ICONS.length; i < len; i++) {
            var icon = ALL_ICONS[i];
            html += '<div class="om-icon om-itemselector-tbar-' + icon + '"' + ' title="' + ($.om.lang._get({}, "omItemSelector", icon + 'IconTip') || '') + '"></div>';
        }
        this.toolbar.html(html);
    }, _resizePanel:function () {
        var self = this, lp = self.leftPanel, rp = self.rightPanel, leftItemsContainer = $('.om-itemselector-items', lp), rightItemsContainer = $('.om-itemselector-items', rp), H = lp.parent().innerHeight() - leftItemsContainer.offset().top + lp.offset().top, W = ($('tr', self.element).innerWidth() - self.toolbar.outerWidth()) / 2, innerW = lp.outerWidth(W).innerWidth();
        leftItemsContainer.outerHeight(H).width(innerW);
        rightItemsContainer.outerHeight(H).width(innerW);
        self.element.data("dltop", $('.om-itemselector-items >dl', lp).offset().top);
    }, _buildList:function () {
        var op = this.options;
        dataSource = op.dataSource, value = op.value, fmt = op.clientFormatter, leftHtml = '', rightHtml = '', inArray = function (data, valueArr) {
            for (var i = 0, len = valueArr.length; i < len; i++) {
                if (data.value === valueArr[i]) {
                    return true;
                }
            }
            return false;
        }, buildHtml = fmt ? function (index, data) {
            return'<dt _index="' + index + '">' + '<span class="checkbox"/>' + fmt(data, index) + '</dt>';
        } : function (index, data) {
            return'<dt _index="' + index + '">' + '<span class="checkbox"/>' + data.text + '</dt>';
        };
        if ($.isArray(dataSource) && jQuery.isArray(value)) {
            $.each(dataSource, function (index, data) {
                if (inArray(data, value)) {
                    rightHtml += buildHtml(index, data);
                } else {
                    leftHtml += buildHtml(index, data);
                }
            });
        }
        $('.om-itemselector-items>dl', this.leftPanel).html(leftHtml);
        $('.om-itemselector-items>dl', this.rightPanel).html(rightHtml);
        var items = $('.om-itemselector-items'), itemdtH = $('>dl>dt', items).outerHeight(), h = items.outerHeight(), offset = itemdtH - h % itemdtH;
        items.outerHeight(h + offset);
    }, _bindEvents:function () {
        var self = this, toolbar = self.toolbar;
        self.leftPanel.delegate('.om-itemselector-items>dl>dt', 'click.omItemSelector', function (e) {
            $(this).toggleClass('om-state-highlight');
            self._refreshHeaderCheckbox(self.leftPanel);
        });
        self.rightPanel.delegate('.om-itemselector-items>dl>dt', 'click', function (e) {
            $(this).toggleClass('om-state-highlight');
            self._refreshHeaderCheckbox(self.rightPanel);
        });
        this.leftPanel.delegate('.om-itemselector-items>dl>dt', 'dblclick', function () {
            $('.om-itemselector-items>dl>dt', self.element).removeClass('om-state-highlight');
            $(this).addClass('om-state-highlight');
            self._moveItemsToTarget('.om-state-highlight', true);
        });
        this.rightPanel.delegate('.om-itemselector-items>dl>dt', 'dblclick', function () {
            $('.om-itemselector-items>dl>dt', self.element).removeClass('om-state-highlight');
            $(this).addClass('om-state-highlight');
            self._moveItemsToTarget('.om-state-highlight', false);
        });
        $('.om-itemselector-tbar-add', toolbar).click(function () {
            self._moveItemsToTarget('.om-state-highlight', true);
        });
        $('.om-itemselector-tbar-remove', toolbar).click(function () {
            self._moveItemsToTarget('.om-state-highlight', false);
        });
        $('.header span.checkbox', self.leftPanel).click(function () {
            var panel = self.leftPanel, $dt = $('.om-itemselector-items>dl>dt', panel);
            $(this).toggleClass("selected");
            if ($('div.om-itemselector-up:visible', panel).length > 0) {
                $dt = $(self._getPageItems(panel, $dt));
            }
            if ($(this).hasClass("selected")) {
                $dt.addClass("om-state-highlight");
            } else {
                $dt.removeClass("om-state-highlight");
            }
        });
        $('.header span.checkbox', self.rightPanel).click(function () {
            var panel = self.rightPanel, $dt = $('.om-itemselector-items>dl>dt', panel);
            $(this).toggleClass("selected");
            if ($('div.om-itemselector-up:visible', panel).length > 0) {
                $dt = $(self._getPageItems(panel, $dt));
            }
            if ($(this).hasClass("selected")) {
                $dt.addClass("om-state-highlight");
            } else {
                $dt.removeClass("om-state-highlight");
            }
        });
        self.element.delegate('div.om-itemselector-up:not([disabled])', 'click', function () {
            self._page($(this), true);
            self._refreshHeaderCheckbox($(this).parentsUntil('table').last().parent());
        });
        self.element.delegate('div.om-itemselector-down:not([disabled])', 'click', function () {
            self._page($(this), false);
            self._refreshHeaderCheckbox($(this).parentsUntil('table').last().parent());
        });
    }, _page:function (btn, isup) {
        var $items = isup ? btn.next() : btn.prev(), $dl = $items.children("dl"), h = $items.outerHeight() - 2, dlH = $dl.outerHeight(), dltop = $dl.offset().top, nextbtn, top = this.element.data("dltop") + 20;
        if (isup) {
            $dl.offset({top:dltop + h});
            nextbtn = $items.next();
            if ((dltop = $dl.offset().top) > 0 || ($dl.outerHeight() - dltop - top) > h) {
                nextbtn.removeAttr("disabled").removeClass("om-itemselector-down-disabled");
            }
            if (dltop > 0 && dltop < h) {
                btn.attr("disabled", "disabled").addClass("om-itemselector-up-disabled");
            }
        } else {
            $dl.offset({top:dltop - h});
            nextbtn = $items.prev();
            nextbtn.removeAttr("disabled").removeClass("om-itemselector-up-disabled");
            if ((dltop = $dl.offset().top) < 0 && (dlH + dltop - top) <= h) {
                btn.attr("disabled", "disabled").addClass("om-itemselector-down-disabled");
            }
        }
    }, _refreshHeaderCheckbox:function (panel) {
        var $dt = $('.om-itemselector-items>dl>dt', panel);
        $dt = $(this._getPageItems(panel, $dt));
        var selects = $dt.filter('.om-state-highlight').length;
        $('.header span.checkbox', panel).toggleClass("selected", selects > 0 && $dt.length === selects);
    }, _refreshPageButton:function (panel) {
        var $items = $('.om-itemselector-items', panel), $dl = $('.om-itemselector-items >dl', panel), $up = $('.om-itemselector-up', panel), $down = $('.om-itemselector-down', panel), itemsH = $items.outerHeight(), dlH = $dl.outerHeight(), dltop = $dl.offset().top, top = this.element.data("dltop") + 20;
        if (dlH > 20 && (top - dltop) >= dlH) {
            $dl.offset({top:dltop + itemsH});
            dltop = $dl.offset().top;
        }
        if (dlH > itemsH) {
            if ($up.is(":hidden")) {
                $items.outerHeight(itemsH - $up.outerHeight() * 2);
                $up.show();
                $down.show();
            }
            if (dltop > 0 && dltop < itemsH) {
                $up.attr("disabled", "disabled").addClass("om-itemselector-up-disabled");
            } else {
                $up.removeAttr("disabled").removeClass("om-itemselector-up-disabled");
            }
            if (dltop > 0 || (dlH + dltop - top) > (itemsH)) {
                $down.removeAttr("disabled").removeClass("om-itemselector-down-disabled");
            } else {
                $down.attr("disabled", "disabled").addClass("om-itemselector-down-disabled");
            }
        } else {
            if ($up.is(":visible")) {
                $items.outerHeight(itemsH + $up.outerHeight() * 2);
                $up.hide();
                $down.hide();
            }
        }
    }, _getPageItems:function (panel, $dt) {
        var items = $(".om-itemselector-items", panel), itemsH = items.outerHeight(), $dl = $(">dl", items), pageItems = [], hasPageButton = items.next(":visible").length > 0, dtH = $dt.outerHeight(), num = itemsH / dtH, dltop = $dl.offset().top, top = this.element.data("dltop");
        dltop = hasPageButton ? top - dltop + 20 : top - dltop;
        pageItems = $.grep($dt, function (n, i) {
            return i < num * (dltop / itemsH + 1) - 1 && i >= num * (dltop / itemsH);
        });
        return pageItems;
    }, select:function (indexs) {
        if (!$.isArray(indexes)) {
            indexes = [indexes];
        }
        for (var i = 0, len = indexs.length; i < len; i++) {
            $('.om-itemselector-items>dl>dt[_index="' + indexs[i] + '"]').addClass("om-state-highlight");
        }
    }, _moveItemsToTarget:function (selector, isLeftToRight) {
        var self = this, fromPanel = isLeftToRight ? this.leftPanel : this.rightPanel, selectedItems = $('.om-itemselector-items>dl>dt' + selector, fromPanel);
        if (selectedItems.size() == 0)
            return;
        var toPanel = isLeftToRight ? this.rightPanel : this.leftPanel, op = this.options, itemData = [];
        selectedItems.each(function () {
            itemData.push(op.dataSource[$(this).attr('_index')]);
        });
        if (isLeftToRight) {
            if (self._trigger("onBeforeItemSelect", null, itemData) === false) {
                return;
            }
            selectedItems.appendTo($('.om-itemselector-items>dl', toPanel)).removeClass("om-state-highlight");
            self._trigger("onItemSelect", null, itemData);
        } else {
            if (self._trigger("onBeforeItemDeselect", null, itemData) === false) {
                return;
            }
            selectedItems.appendTo($('.om-itemselector-items>dl', toPanel)).removeClass("om-state-highlight");
            self._trigger("onItemDeselect", null, itemData);
        }
        self._refreshHeaderCheckbox(fromPanel);
        self._refreshPageButton(fromPanel);
        self._refreshPageButton(toPanel);
    }, value:function (newValue) {
        if (arguments.length == 0) {
            var op = this.options, selectedItems = $('.om-itemselector-items>dl>dt', this.rightPanel), returnValue = [];
            selectedItems.each(function () {
                returnValue.push(op.dataSource[$(this).attr('_index')].value);
            });
            return returnValue;
        } else {
            if ($.isArray(newValue)) {
                this.options.value = newValue;
                this._buildList();
            }
        }
    }});
    $.om.lang.omItemSelector = {availableTitle:'可选项', selectedTitle:'已选项', addIconTip:'右移', removeIconTip:'左移'};
})(jQuery);
(function ($) {
    $.omWidget("om.omBorderLayout", {options:{fit:false, spacing:5, hideCollapsBtn:false, onBeforeDrag:function (element, event) {
    }, onAfterDrag:function (element, event) {
    }}, _create:function () {
        if (!this.options.panels)return;
        this._minWidth = 50;
        this._minHeight = 28;
        this._buildRegion();
        this._resizeRegion(true);
        $(window).resize($.proxy(this, "_resizeRegion"));
    }, _getRegionSize:function (region) {
        var $region = this._getRegion(region), $proxy = this._getRegionProxy(region), size = {};
        size.width = this._regionVisible($region) ? $region.outerWidth(true) : (this._regionVisible($proxy) ? $proxy.outerWidth(true) : 0);
        size.height = this._regionVisible($region) ? $region.outerHeight(true) : (this._regionVisible($proxy) ? $proxy.outerHeight(true) : 0);
        return size;
    }, _resizeRegion:function (init) {
        var $centerRegion = this._getRegion("center"), $northRegion = this._getRegion("north"), $southRegion = this._getRegion("south"), $westRegion = this._getRegion("west"), $eastRegion = this._getRegion("east"), $northProxy = this._getRegionProxy("north"), $southProxy = this._getRegionProxy("south"), $westProxy = this._getRegionProxy("west"), $eastProxy = this._getRegionProxy("east"), northHeight = this._getRegionSize("north").height;
        southHeight = this._getRegionSize("south").height;
        westWidth = this._getRegionSize("west").width;
        eastWidth = this._getRegionSize("east").width;
        centerWidth = this._getRegionSize("center").width;
        layoutWidth = this.element.width();
        layoutHeight = this.element.height();
        westOpt = this._getPanelOpts("west");
        eastOpt = this._getPanelOpts("east");
        $centerRegion.css({top:northHeight, left:westWidth});
        $centerRegion.find(">.om-panel-body").omPanel("resize", {height:layoutHeight - northHeight - southHeight});
        if (!init) {
            $centerRegion.find(">.om-panel-body").omPanel("resize", {width:layoutWidth - westWidth - eastWidth});
        }
        var centerHeight = $centerRegion.outerHeight(true);
        if ($northRegion) {
            var northWidth = layoutWidth - (westOpt.expandToTop ? westWidth : 0) - (eastOpt.expandToTop ? eastWidth : 0);
            $northRegion.find(">.om-panel-body").omPanel("resize", {width:northWidth});
            $northRegion.css({left:westOpt.expandToTop ? westWidth : 0});
            if ($northProxy) {
                $northProxy.outerWidth(northWidth).css({left:westOpt.expandToTop ? westWidth : 0});
            }
        }
        if ($southRegion) {
            var southWidth = layoutWidth - (westOpt.expandToBottom ? westWidth : 0) - (eastOpt.expandToBottom ? eastWidth : 0);
            $southRegion.find(">.om-panel-body").omPanel("resize", {width:southWidth});
            $southRegion.css({top:layoutHeight - $southRegion.outerHeight(true), left:westOpt.expandToBottom ? westWidth : 0});
            if ($southProxy) {
                $southProxy.outerWidth(southWidth).css({left:westOpt.expandToBottom ? westWidth : 0});
            }
        }
        if ($westRegion) {
            var westTop = westOpt.expandToTop ? 0 : northHeight;
            var westHeight = centerHeight + (westOpt.expandToBottom ? southHeight : 0) + (westOpt.expandToTop ? northHeight : 0);
            $westRegion.css({top:westTop});
            $westRegion.find(">.om-panel-body").omPanel("resize", {height:westHeight});
            if ($westProxy) {
                $westProxy.css({top:westTop});
                $westProxy.outerHeight(westHeight);
            }
        }
        if ($eastRegion) {
            var eastTop = eastOpt.expandToTop ? 0 : northHeight;
            var eastHeight = centerHeight + (eastOpt.expandToBottom ? southHeight : 0) + (eastOpt.expandToTop ? northHeight : 0);
            $eastRegion.css({top:eastTop});
            $eastRegion.find(">.om-panel-body").omPanel("resize", {height:eastHeight});
            if ($eastProxy) {
                $eastProxy.css({top:eastTop});
                $eastProxy.outerHeight(eastHeight);
            }
        }
        if (init) {
            var fitEastWidth = this._getPanelOpts("east") && !this._getPanelOpts("east").width;
            var fitWestWidth = this._getPanelOpts("west") && !this._getPanelOpts("west").width;
            var fitCenterWidth = !this._getPanelOpts("center").width;
            if (fitEastWidth || fitWestWidth || fitCenterWidth) {
                if (!fitCenterWidth && fitEastWidth && fitWestWidth) {
                    eastWidth = westWidth = (layoutWidth - centerWidth) / 2;
                } else if (fitCenterWidth && !fitEastWidth && fitWestWidth) {
                    centerWidth = westWidth = (layoutWidth - eastWidth) / 2;
                } else if (fitCenterWidth && fitEastWidth && !fitWestWidth) {
                    centerWidth = eastWidth = (layoutWidth - westWidth) / 2;
                } else if (fitCenterWidth && fitEastWidth && fitWestWidth) {
                    eastWidth = westWidth = centerWidth = layoutWidth / 3;
                }
            }
            if (fitCenterWidth) {
                $centerRegion.find(">.om-panel-body").omPanel("resize", {width:Math.floor(layoutWidth - westWidth - eastWidth)});
            }
            if (fitEastWidth) {
                $eastRegion.find(">.om-panel-body").omPanel("resize", {width:Math.ceil(layoutWidth - westWidth - centerWidth) - this.options.spacing});
            }
            if (fitWestWidth) {
                $westRegion.find(">.om-panel-body").omPanel("resize", {width:Math.ceil(layoutWidth - eastWidth - centerWidth) - this.options.spacing});
                $centerRegion.css({left:$westRegion.width() + this.options.spacing});
            }
        }
    }, _regionVisible:function ($region) {
        return $region && $region.css("display") != "none";
    }, _createRegionProxy:function (panel, showCollapsTrigger) {
        var _self = this;
        var proxyHtml = "";
        if (showCollapsTrigger) {
            proxyHtml = "<div class=\"om-borderlayout-proxy om-borderlayout-trigger-proxy-" + panel.region + "\" proxy=\"" + panel.region + "\">" + "<div class=\"om-borderlayout-expand-trigger\">" + "</div>" + "</div>";
            var $proxy = $(proxyHtml);
            if (panel.region == "west" || panel.region == "east") {
                $proxy.width(_self.options.spacing);
            } else if (panel.region == "north" || panel.region == "south") {
                $proxy.height(_self.options.spacing);
            }
            (function (panel) {
                $proxy.find(".om-borderlayout-expand-trigger").click(function () {
                    _self.expandRegion(panel.region);
                });
            })(panel);
        } else {
            proxyHtml = "<div class=\"om-borderlayout-proxy om-borderlayout-proxy-" + panel.region + "\" proxy=\"" + panel.region + "\">" + "<div class=\"om-panel-title\"></div>" + "<div class=\"om-panel-tool\">" + "<div class=\"om-icon panel-tool-expand\">" + "</div>" + "</div>" + "</div>";
            var $proxy = $(proxyHtml);
            (function (panel) {
                $proxy.find(".panel-tool-expand").hover(
                    function () {
                        $(this).toggleClass("panel-tool-expand-hover");
                    }).click(function () {
                    _self.expandRegion(panel.region);
                });
            })(panel);
        }
        $proxy.hover(
            function () {
                $(this).toggleClass("om-borderlayout-proxy-hover");
            }).appendTo(this.element);
    }, _buildRegion:function () {
        var _self = this;
        var $layout = this.element;
        this.element.addClass("om-borderlayout");
        if (this.options.hideCollapsBtn) {
            this.element.addClass("om-borderlayout-hide-collaps-btn");
        }
        if (this.options.fit) {
            $layout.css({"width":"100%", "height":"100%"});
        }
        for (var i = 0; i < this.options.panels.length; i++) {
            var panel = $.extend({}, this.options.panels[i]);
            var $panelEl = this.element.find("#" + panel.id);
            var showCollapsTrigger = panel.collapsible && _self.options.hideCollapsBtn;
            if (panel.collapsible && panel.region != "center") {
                this._createRegionProxy(panel, showCollapsTrigger);
            }
            if (panel.collapsible) {
                $.extend(panel, {collapsible:false});
                if (!_self.options.hideCollapsBtn) {
                    $.extend(panel, {tools:[
                        {iconCls:["panel-tool-collapse", "panel-tool-collapse-hover"], handler:function (widget) {
                            _self.collapseRegion(widget.element.parent().attr("region"));
                        }}
                    ]});
                }
            }
            if (panel.closable) {
                var oldPanelOnClose = panel.onClose;
                $.extend(panel, {onClose:function () {
                    oldPanelOnClose && oldPanelOnClose.call($panelEl[0]);
                    _self._resizeRegion();
                }});
            }
            $panelEl.omPanel(panel);
            if (panel.region == "north" || panel.region == "south") {
                $panelEl.omPanel("resize", {"width":$layout.width()});
            }
            var margin = "0", spacing = this.options.spacing + "px";
            if (panel.resizable && panel.region != "center") {
                var handles = "";
                handleClass = {};
                if (panel.region == "west") {
                    handles = "e";
                    handleClass.width = spacing;
                    handleClass.right = "-" + spacing;
                } else if (panel.region == "east") {
                    handles = "w";
                    handleClass.width = spacing;
                    handleClass.left = "-" + spacing;
                } else if (panel.region == "south") {
                    handles = "n";
                    handleClass.height = spacing;
                    handleClass.top = "-" + spacing;
                } else if (panel.region == "north") {
                    handles = "s";
                    handleClass.height = spacing;
                    handleClass.bottom = "-" + spacing;
                }
                $panelEl.parent().omResizable({handles:handles, helper:"om-borderlayout-resizable-helper-" + handles, stop:function (ui, event) {
                    $layout.find(">.om-borderlayout-mask").remove();
                    ui.element.find(">.om-panel-body").omPanel("resize", ui.size);
                    _self._resizeRegion();
                    _self.options.onAfterDrag && _self._trigger("onAfterDrag", null, ui.element);
                }, start:function (ui, event) {
                    var helper = ui.element.omResizable("option", "helper");
                    $("body").find("." + helper).css("border-width", _self.options.spacing);
                    var region = ui.element.attr("region"), maxWidth = $layout.width() - 2 * _self._minWidth, maxHeight = $layout.height() - 2 * _self._minHeight;
                    if (region == "west") {
                        maxWidth = $layout.width() - (_self._getRegionSize("east").width + _self._minWidth);
                        ui.element.omResizable("option", "maxWidth", maxWidth);
                    } else if (region == "east") {
                        maxWidth = $layout.width() - (_self._getRegionSize("west").width + _self._minWidth);
                        ui.element.omResizable("option", "maxWidth", maxWidth);
                    } else if (region == "north") {
                        maxHeight = $layout.height() - (_self._getRegionSize("south").height + _self._minHeight + _self.options.spacing);
                        ui.element.omResizable("option", "maxHeight", maxHeight);
                    } else if (region == "south") {
                        maxHeight = $layout.height() - (_self._getRegionSize("north").height + _self._minHeight + _self.options.spacing);
                        ui.element.omResizable("option", "maxHeight", maxHeight);
                    }
                    $('<div class="om-borderlayout-mask"></div>').css({width:$layout.width(), height:$layout.height()}).appendTo($layout);
                    _self.options.onBeforeDrag && _self._trigger("onBeforeDrag", null, ui.element);
                }, minWidth:_self._minWidth, minHeight:_self._minHeight});
                $panelEl.parent().find(".om-resizable-handle").css(handleClass);
                margin = (panel.region == "south" ? spacing : 0) + " " +
                    (panel.region == "west" ? spacing : 0) + " " +
                    (panel.region == "north" ? spacing : 0) + " " +
                    (panel.region == "east" ? spacing : 0);
                if (showCollapsTrigger) {
                    var $collapsTrigger = $("<div class='om-borderlayout-collaps-trigger-" + panel.region + "'></div>");
                    (function ($panel) {
                        $collapsTrigger.click(function () {
                            _self.collapseRegion($panel.attr("region"));
                        });
                    })($panelEl.parent());
                    $panelEl.parent().find(".om-resizable-handle").append($collapsTrigger);
                }
            }
            $panelEl.parent().addClass("om-borderlayout-region").addClass("om-borderlayout-region-" + panel.region).css("margin", margin).attr("region", panel.region);
            $panelEl.addClass("om-borderlayout-region-body");
            $panelEl.prev().addClass("om-borderlayout-region-header");
        }
    }, _getRegion:function (region) {
        var $regionEl = this.element.find(">[region=\"" + region + "\"]");
        return $regionEl.size() > 0 ? $regionEl : false;
    }, _getRegionProxy:function (region) {
        var $proxyEl = this.element.find(">[proxy=\"" + region + "\"]");
        return $proxyEl.size() > 0 ? $proxyEl : false;
    }, _getPanelOpts:function (region) {
        for (var i = 0; i < this.options.panels.length; i++) {
            if (region == this.options.panels[i].region) {
                return this.options.panels[i];
            }
        }
        return false;
    }, collapseRegion:function (region) {
        var panel = this._getPanelOpts(region);
        if (!panel || !panel.collapsible) {
            return;
        }
        var $region = this._getRegion(region);
        $body = $region.find(">.om-panel-body");
        if ($region) {
            var panelInstance = $.data($body[0], "omPanel");
            if (panelInstance.options.closed)return;
            if (panel.onBeforeCollapse && panelInstance._trigger("onBeforeCollapse") === false) {
                return false;
            }
            $region.hide();
            panel.onCollapse && panelInstance._trigger("onCollapse");
            this._getRegionProxy(region).show();
            this._resizeRegion();
        }
    }, expandRegion:function (region) {
        var panel = this._getPanelOpts(region);
        if (!panel || !panel.collapsible) {
            return;
        }
        var $region = this._getRegion(region);
        $body = $region.find(">.om-panel-body");
        if ($region) {
            var panelInstance = $.data($body[0], "omPanel");
            if (panelInstance.options.closed)return;
            if (panel.onBeforeExpand && panelInstance._trigger("onBeforeExpand") === false) {
                return false;
            }
            $region.show();
            panel.onExpand && panelInstance._trigger("onExpand");
            this._getRegionProxy(region).hide();
            this._resizeRegion();
        }
    }, closeRegion:function (region) {
        var panel = this._getPanelOpts(region);
        if (!panel || !panel.closable) {
            return;
        }
        var $region = this._getRegion(region);
        $body = $region.find(">.om-panel-body");
        if ($region) {
            var panelInstance = $.data($body[0], "omPanel");
            if (panelInstance.options.closed)return;
            $region.find(">.om-panel-body").omPanel("close");
            this._getRegionProxy(region).hide();
            this._resizeRegion();
        }
    }, openRegion:function (region) {
        var panel = this._getPanelOpts(region);
        if (!panel || !panel.closable) {
            return;
        }
        var $region = this._getRegion(region);
        $body = $region.find(">.om-panel-body");
        if ($region) {
            var panelInstance = $.data($body[0], "omPanel");
            if (!panelInstance.options.closed)return;
            $region.find(">.om-panel-body").omPanel("open");
            this._getRegionProxy(region).hide();
            this._resizeRegion();
        }
    }});
})(jQuery);
(function ($) {
    $.omWidget("om.omScrollbar", {options:{thick:8}, _create:function () {
        var ops = this.options;
        this._vScrollbar = $("<div class='om-widget om-scrollbar om-corner-all'></div>").width(ops.thick).appendTo("body").hide();
        this._vScrollbar.type = "v";
        this._hScrollbar = $("<div class='om-widget om-scrollbar om-corner-all'></div>").height(ops.thick).appendTo("body").hide();
        this._hScrollbar.type = "h";
    }, _init:function () {
        this.element.css("overflow", "hidden");
        this._buildEvent();
    }, destroy:function () {
        this._vScrollbar.remove();
        this._hScrollbar.remove();
    }, _buildEvent:function () {
        var self = this, $elem = this.element, bars = [this._vScrollbar, this._hScrollbar];
        $(bars).each(function (index, $bar) {
            $bar._hover = false;
            $bar._enable = true;
            var type = $bar.type;
            var startPos = 0;
            $bar.omDraggable({axis:type === 'v' ? "y" : "x", containment:$elem, onStart:function (ui, event) {
                startPos = type === 'v' ? $elem.scrollTop() : $elem.scrollLeft();
            }, onDrag:function (ui, event) {
                var p = ui.position, op = ui.originalPosition;
                type == 'v' ? $elem.scrollTop(startPos + self._getInt((p.top - op.top) * $elem.innerHeight() / $bar.outerHeight())) : $elem.scrollLeft(startPos + self._getInt((p.left - op.left) * $elem.innerWidth() / $bar.outerWidth()));
            }}).hover(function () {
                $(bars).each(function (index, $bar) {
                    $bar._hover = true;
                    clearTimeout($bar._timer);
                });
                $(this).addClass("scrollbar-state-hover");
            }, function () {
                $(bars).each(function (index, $bar) {
                    $bar._hover = false;
                    self._setTimer($bar.type);
                });
                $(this).removeClass("scrollbar-state-hover");
            });
        });
        var eventName = $.browser.mozilla ? "DOMMouseScroll" : "mousewheel";
        $elem.bind(eventName, function (e) {
            self._mousewheelListener.call(self, e);
        });
        $(bars).each(function (index, $bar) {
            $bar.bind(eventName, function (e) {
                self._mousewheelListener.call(self, e);
            });
        });
        $elem.hover(function () {
            $(bars).each(function (index, $bar) {
                $bar._hover = true;
                clearTimeout($bar._timer);
                self._resize($bar);
                if ($bar._enable) {
                    $bar.fadeIn("fast");
                }
            });
        }, function () {
            $(bars).each(function (index, $bar) {
                $bar._hover = false;
                self._setTimer($bar.type);
            });
        });
    }, _mousewheelListener:function (event) {
        var self = this;
        if (!self._vScrollbar._enable) {
            return;
        }
        var delta = 0;
        if (event.wheelDelta) {
            delta = -event.wheelDelta;
        } else {
            delta = event.detail * 40;
        }
        var differ = delta / 120 * 10, $bar = self._vScrollbar, $elem = self.element, elemTop = $elem.offset().top + self._getInt($elem.css("border-top-width")) + self._getInt($elem.css("padding-top")) + self._getInt($elem.css("padding-top-width")), barCurTop = $bar.position().top - elemTop, contentHeight = $elem.height(), distance = contentHeight - $bar.outerHeight();
        if (differ + barCurTop < 0) {
            $bar.css("top", elemTop);
            $elem.scrollTop(0);
        } else if (differ + barCurTop > distance) {
            $bar.css("top", elemTop + distance);
            $elem.scrollTop($elem[0].scrollHeight - $elem.height());
        } else {
            $bar.css("top", "+=" + differ);
            $elem.scrollTop($elem.scrollTop() + parseInt(differ * $elem.innerHeight() / $bar.outerHeight()));
        }
        event.preventDefault();
    }, _getScrollbar:function (type) {
        return'h' === type ? this._hScrollbar : this._vScrollbar;
    }, _setTimer:function (type) {
        var self = this;
        clearTimeout(this._getScrollbar(type)._timer);
        (function (type) {
            setTimeout(function () {
                var $bar = self._getScrollbar(type);
                if (!$bar._hover) {
                    $bar.fadeOut("fast");
                }
            }, 200);
        })(type);
    }, refresh:function () {
        var bars = [this._vScrollbar, this._hScrollbar], self = this;
        $(bars).each(function (index, $bar) {
            self._resize($bar);
        });
    }, _resize:function ($bar) {
        var $elem = this.element, type = $bar.type, size = 0, offset = $elem.offset(), w = $elem.width(), h = $elem.height(), ow = $elem.outerWidth(), oh = $elem.outerHeight(), bl = this._getInt($elem.css("border-left-width")), br = this._getInt($elem.css("border-right-width")), bt = this._getInt($elem.css("border-top-width")), bb = this._getInt($elem.css("border-bottom-width")), pl = this._getInt($elem.css("padding-left")), pt = this._getInt($elem.css("padding-top"));
        if ('v' === type) {
            size = $elem[0].scrollHeight;
            if (size > h) {
                $bar._enable = true;
                $bar.outerHeight(this._getInt(h * $elem.innerHeight() / size));
                $bar.css({"left":offset.left + ow - $bar.outerWidth() - br, "top":offset.top + bt + pt + this._getInt($elem.scrollTop() * h / size)});
            } else {
                $bar._enable = false;
            }
        } else if ('h' === type) {
            size = $elem[0].scrollWidth;
            if (size > $elem.innerWidth()) {
                $bar._enable = true;
                $bar.outerWidth(this._getInt((pl + w) * w / size));
                $bar.css({"left":offset.left + bl + pl + this._getInt($elem.scrollLeft() * w / size), "top":offset.top + oh - $bar.outerHeight() - bb});
            } else {
                $bar._enable = false;
            }
        }
        $bar._enable ? $bar.fadeIn("fast") : $bar.fadeOut("fast");
    }, _getInt:function (number) {
        return parseInt(number) || 0;
    }});
})(jQuery);
;
(function ($) {
    $.omWidget('om.omButtonbar', {options:{width:null}, _create:function () {
        this.element.addClass("om-buttonbar");
        $("<span></span>").addClass("om-buttonbar-null").appendTo(this.element);
    }, _init:function () {
        var self = this, options = this.options, element = this.element;
        var oldStyle = element.attr("style") ? element.attr("style") : "";
        if (oldStyle) {
            oldStyle = oldStyle.substr(oldStyle.length - 1, oldStyle.length) == ";" ? oldStyle : oldStyle + ";";
        }
        if (options.width) {
            element.attr("style", oldStyle + "width:" + (options.width - 2) + "px;");
        }
        $.each(options.btns, function (index, props) {
            if (!props.separtor) {
                var btnId = props.id || element.attr("id") + "_" + index;
                var button = $("<button type=\"button\"></button>").attr('id', btnId).appendTo(element);
                if ($.fn.omButton) {
                    button.omButton(props);
                }
            } else {
                $("<span class=\"om-buttonbar-sep\"></span>").appendTo(element);
            }
        });
    }});
})(jQuery);
(function ($) {
    var pagerNvg = [
        {cls:"pFirst", type:"first"},
        {cls:"pPrev", type:"prev"},
        {cls:"pNext", type:"next"},
        {cls:"pLast", type:"last"},
        {cls:"pReload", type:"reload"}
    ];

    function needChange(self, type) {
        var oldPage = self._oldPage, nowPage = self.pageData.nowPage;
        if ("input" === type) {
            return oldPage != $('.pControl input', self.element.closest('.om-grid')).val();
        } else if ("reload" === type) {
            return true;
        } else {
            return oldPage != nowPage;
        }
    }

    $.omWidget.addInitListener('om.omGrid', function () {
        var self = this, cm = this._getColModel(), tds = this._getHeaderCols().filter("[axis^='col']"), $pDiv = this.pDiv;
        $(tds).each(function (index) {
            var sortFn = cm[index].sort;
            if (sortFn) {
                var _this = $(this).click(function () {
                    var sortCol = cm[index].name;
                    var removeClass = _this.hasClass('asc') ? 'asc' : _this.hasClass('desc') ? 'desc' : null;
                    var sortDir = (removeClass == 'asc' ? 'desc' : 'asc');
                    tds.removeClass('asc desc');
                    _this.addClass(sortDir);
                    var extraData = self._extraData;
                    delete extraData.sortBy;
                    delete extraData.sortDir;
                    switch (sortFn) {
                        case'serverSide':
                            extraData.sortBy = sortCol;
                            extraData.sortDir = sortDir;
                            self.reload();
                            return;
                        case'clientSide':
                            sortFn = function (obj1, obj2) {
                                var v1 = obj1[sortCol], v2 = obj2[sortCol];
                                return v1 == v2 ? 0 : v1 > v2 ? 1 : -1;
                            };
                            break;
                        default:
                    }
                    var datas = self.pageData.data;
                    if (removeClass == null) {
                        datas.rows = datas.rows.sort(sortFn);
                    } else {
                        datas.rows = datas.rows.reverse();
                    }
                    self.refresh();
                });
                _this.children().first().append('<img class="om-grid-sortIcon" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="></img>');
            }
        });
        for (var i = 0, len = pagerNvg.length; i < len; i++) {
            (function (i) {
                $pDiv.find("." + pagerNvg[i].cls).click(function () {
                    var change = needChange(self, pagerNvg[i].type);
                    tds.each(function (index) {
                        var $headerCol = $(this);
                        if (change && ($headerCol.hasClass('asc') || $headerCol.hasClass('desc')) && "serverSide" !== cm[index].sort) {
                            $headerCol.removeClass('asc desc');
                        }
                    });
                });
            })(i);
        }
        $('.pControl input', $pDiv).keydown(function (e) {
            var change = needChange(self, "input");
            if (e.keyCode == $.om.keyCode.ENTER) {
                tds.each(function (index) {
                    var $headerCol = $(this);
                    if (change && ($headerCol.hasClass('asc') || $headerCol.hasClass('desc')) && "serverSide" !== cm[index].sort) {
                        $headerCol.removeClass('asc desc');
                    }
                });
            }
        });
        this.clearSort = function () {
            var extraData = this._extraData;
            extraData.sortBy = undefined;
            extraData.sortDir = undefined;
            this._getHeaderCols().removeClass('asc desc');
        };
    });
})(jQuery);
(function ($) {
    $.omWidget.addInitListener('om.omGrid', function () {
        var self = this, ops = this.options, rdp = ops.rowDetailsProvider, cm = ops.colModel, $thead = this.thead;
        if (!(rdp && cm.length > 0)) {
            return;
        }
        ops._onResizableCallbacks.push(_resizeRowExpander);
        ops._onResizableStopCallbacks.push(_resizeRowExpander);
        $thead.find("th:first").before('<th align="center" axis="expenderCol" class="expenderCol" rowspan='
            + ($.isArray(cm[0]) ? cm.length : 1) + '><div style="text-align: center; width: 14px;"></div></th>');
        var autoExpandColIndex = -1, allColsWidth = 0;
        cm = this._getColModel();
        $(cm).each(function (i) {
            if (cm[i].width == 'autoExpand') {
                autoExpandColIndex = i;
            } else {
                allColsWidth += cm[i].width;
            }
        });
        var expenderWidth = $thead.find('th[axis="expenderCol"]').width();
        if (autoExpandColIndex != -1) {
            $thead.find('th[axis="col' + autoExpandColIndex + '"] >div').css("width", "-=" + expenderWidth);
        } else if (ops.autoFit) {
            var percent = expenderWidth / allColsWidth;
            $thead.find('th[axis^="col"] >div').each(function (i) {
                $(this).css('width', "-=" + parseInt(cm[i].width * percent));
            });
        }
        var colCount = this._getHeaderCols().size();
        this.tbody.delegate('td.expenderCol >div', 'click', function (event) {
            var _this = $(this), $row = _this.closest('tr'), $next = $row.next('tr');
            if ($next.hasClass('rowExpand-rowDetails')) {
                $next.toggle();
            } else {
                var rowIndex = self._getTrs().index($row);
                rowData = self._getRowData(rowIndex), rowDetails = rdp ? rdp(rowData, rowIndex) : '&#160;';
                $row.after('<tr class="rowExpand-rowDetails"><td colspan="' + (colCount - 1) + '"><div class="rowExpand-rowDetails-content" style="overflow:auto;">' + rowDetails + '</div></td></tr>');
            }
            _this.toggleClass('rowExpand-expanded').parent().attr('rowspan', _this.hasClass('rowExpand-expanded') ? 2 : 1);
            _resizeRowExpander.call(self);
            return false;
        });
    });
    function _resizeRowExpander() {
        var $grid = this.element;
        var $rowExpander = $grid.find("tr.rowExpand-rowDetails");
        if ($rowExpander.length == 0) {
            return;
        }
        var $ht = this.hDiv.find("table");
        var width = $ht.width() - $ht.find("th.expenderCol").outerWidth() - parseInt($rowExpander.find("> td").css("border-right-width"));
        $rowExpander.each(function () {
            $(this).find(".rowExpand-rowDetails-content").outerWidth(width);
        });
    }
})(jQuery);
(function ($) {
    var own = Object.prototype.hasOwnProperty;
    $.omWidget.addInitListener('om.omGrid', function () {
        var self = this, $elem = self.element, ops = self.options, cm = this._getColModel();
        self._triggered = false;
        self._globalEditable = false;
        ops.editMode = ops.editMode || "all";
        self._allEditMode = ops.editMode == "all";
        for (var i = 0, len = cm.length; i < len; i++) {
            self._globalEditable = cm[i]["editor"] ? true : false;
            if (self._globalEditable) {
                break;
            }
        }
        if (!_isEditable(self)) {
            return;
        }
        self._editComps = {};
        self._errorHolders = {};
        self._colWidthResize;
        ops._onRefreshCallbacks.push(_onRefresh);
        ops._onResizableStopCallbacks.push(_onResizable);
        ops._onResizeCallbacks.push(_onResize);
        this.tbody.delegate('tr.om-grid-row', 'dblclick', function (event) {
            editRenderer.call(this, self);
        });
        this.tbody.delegate('tr.om-grid-row', 'click', function (event) {
            if (self._triggered && self._editView.editing) {
                if (self._validator) {
                    self._validator.valid() && editRenderer.call(this, self);
                } else {
                    editRenderer.call(this, self);
                }
            }
        });
        var btnScrollTimer;
        $elem.parent().scroll(function () {
            if (self._triggered) {
                if (btnScrollTimer) {
                    clearTimeout(btnScrollTimer);
                }
                btnScrollTimer = setTimeout(function () {
                    var pos = _getEditBtnPosition(self);
                    self._editView.editBtn.animate({"left":pos.left, "top":pos.top}, self._editView.editing ? "fast" : 0);
                    btnScrollTimer = null;
                }, 300);
            }
        });
        $.extend(this, {cancelEdit:function (cancelBtn) {
            var $ev = this._editView, ops = this.options;
            if (!_isEditable(this) || !this._triggered || (this._triggered && !$ev.editing)) {
                return;
            }
            $ev.view.hide();
            $ev.editing = false;
            if (this._rowAdding) {
                this.deleteRow(this._getTrs().index(this.tbody.find("tr[_grid_row_id='" + self._editView.rowId + "']")));
                this._rowAdding = false;
            }
            _resetForm(this);
            cancelBtn && $(cancelBtn).blur();
            ops.onCancelEdit && ops.onCancelEdit.call(this);
        }, cancelChanges:function () {
            this.cancelEdit();
            if (_noChanges(this)) {
                return;
            }
            _clearCache(this);
            _resetForm(this);
            this.refresh();
        }, editRow:function (index) {
            if (!_isEditable(this)) {
                return;
            }
            editRenderer.call(this._getTrs().eq(index)[0], this);
        }, deleteRow:function (index) {
            if (!_isEditable(this) || (this._triggered && this._editView.editing)) {
                return;
            }
            var $trs = this._getTrs(), self = this;
            if (!$.isArray(index)) {
                index = [index];
            }
            index.sort(function (first, second) {
                return second - first;
            });
            $(index).each(function (i, value) {
                var $tr = $trs.eq(value), $next = $tr.next(), rowId = _getRowId($tr);
                if ($tr.attr("_insert")) {
                    delete self._changeData["insert"][rowId];
                    $tr.remove();
                    if ($next.hasClass("rowExpand-rowDetails")) {
                        $next.remove();
                    }
                } else {
                    self._changeData["delete"][rowId] = self._rowIdDataMap[rowId];
                    $tr.attr("_delete", "true").hide();
                    if ($next.hasClass("rowExpand-rowDetails")) {
                        $next.hide();
                    }
                }
            });
            this._refreshHeaderCheckBox();
        }, getChanges:function (type) {
            var data = {"update":[], "insert":[], "delete":[]}, reqType = type ? type : "update", cData = this._changeData, i;
            if (reqType === "update") {
                var uData = cData[reqType];
                for (i in uData) {
                    own.call(uData, i) && data[reqType].push($.extend(true, {}, this._rowIdDataMap[i], uData[i]));
                }
                reqType = type ? type : "insert";
            }
            if (reqType === "insert") {
                var iData = cData[reqType];
                for (i in iData) {
                    own.call(iData, i) && data[reqType].push(iData[i]);
                }
                reqType = type ? type : "delete";
            }
            if (reqType === "delete") {
                var dData = cData[reqType];
                for (i in dData) {
                    own.call(dData, i) && data[reqType].push(dData[i]);
                }
            }
            if (type) {
                return data[type];
            } else {
                return data;
            }
        }, insertRow:function (index, rowData, forceAdd) {
            var ops = this.options, cm = this._getColModel(), $elem = this.element;
            if (!_isEditable(this) || this._rowAdding) {
                return;
            }
            if ($.isPlainObject(index)) {
                rowData = index;
                index = 0;
            }
            if (index === true) {
                rowData = {};
                index = 0;
                forceAdd = true;
            }
            var $trs = this._getTrs(), rd = {};
            index = ("begin" == index || index == undefined) ? 0 : ("end" == index ? $trs.length : index);
            for (var i = 0, len = cm.length; i < len; i++) {
                rd[cm[i]["name"]] = "";
            }
            this._changeData["insert"][this._guid] = $.extend(true, rd, rowData);
            var rowValues = this._buildRowCellValues(cm, rd, index), trContent = [], rowClasses = ops.rowClasses;
            isRowClassesFn = (typeof rowClasses === 'function'), rowCls = isRowClassesFn ? rowClasses(index, rd) : rowClasses[index % rowClasses.length], tdTmp = "<td align='$' abbr='$' class='grid-cell-dirty $'><div align='$' class='$' style='width:$px'>$</div></td>";
            trContent.push("<tr class='om-grid-row " + rowCls + "' _grid_row_id=" + (this._guid++) + " _insert='true'>");
            this._getHeaderCols().each(function (i) {
                var axis = $(this).attr('axis'), wrap = false, html, cols, j;
                if (axis == 'indexCol') {
                    html = "<a class='om-icon'>新行</a>";
                } else if (axis == 'checkboxCol') {
                    html = '<span class="checkbox"/>';
                } else if (axis.substring(0, 3) == 'col') {
                    var colIndex = axis.substring(3);
                    html = rowValues[colIndex];
                    if (cm[colIndex].wrap) {
                        wrap = true;
                    }
                } else {
                    html = '';
                }
                cols = [this.align, this.abbr, axis, this.align, wrap ? 'wrap' : '', $('div', $(this)).width(), html];
                j = 0;
                trContent.push(tdTmp.replace(/\$/g, function () {
                    return cols[j++];
                }));
            });
            trContent.push("</tr>");
            var $tr = $(trContent.join(" ")), $destTr, $next;
            if (index == 0) {
                $tr.prependTo($elem.find(">tbody"));
            } else {
                $destTr = $trs.eq(index - 1);
                $next = $destTr.next();
                $destTr = $next.hasClass("rowExpand-rowDetails") ? $next : $destTr;
                $destTr.after($tr);
            }
            if (!forceAdd) {
                this.editRow(index);
                this._rowAdding = true;
            }
        }, saveChanges:function () {
            this.cancelEdit();
            if (_noChanges(this)) {
                return;
            }
            var uData = this._changeData["update"], $trs = this.element.find("tr.om-grid-row"), newRowsData = [];
            for (var i in uData) {
                if (own.call(uData, i)) {
                    $.extend(true, this._rowIdDataMap[i], uData[i]);
                }
            }
            var self = this;
            $trs.each(function (index, tr) {
                var $tr = $(tr);
                if ($tr.attr("_delete")) {
                    $tr.remove();
                } else {
                    newRowsData.push(_getRowData(self, tr));
                }
            });
            this.pageData.data.rows = newRowsData;
            _clearCache(this);
            _resetForm(this);
            this.refresh();
        }, onBeforeEdit:function (rowIndex, rowData) {
        }, onAfterEdit:function (rowIndex, rowData) {
        }, onCancelEdit:function () {
        }, getData:function () {
            var result = this.pageData.data, $trs = this._getTrs(), self = this;
            if (_isEditable(this) && _hasChange(this)) {
                result = {total:result.total};
                result.rows = [];
                $trs.each(function (index, tr) {
                    result.rows.push(self._getRowData(index));
                });
            }
            return result;
        }, _getRowData:function (index) {
            var $tr = this._getTrs().eq(index), rowId = _getRowId($tr), rowData;
            if (_noChanges(this)) {
                return this.pageData.data.rows[index];
            }
            if ($tr.attr("_insert")) {
                rowData = this._changeData.insert[rowId];
            } else {
                var origRowData = this._rowIdDataMap[rowId], uData = this._changeData["update"];
                rowData = origRowData;
                if (uData[rowId]) {
                    rowData = $.extend(true, {}, origRowData, uData[rowId]);
                }
            }
            return rowData;
        }});
    });
    function editRenderer(self) {
        var $tr = $(this), $elem = self.element, $editRow, $editForm, scrollLeft, cm = self._getColModel(), editComp, lastValue, ops = self.options;
        if (!_isEditable(self)) {
            return;
        }
        if (!self._allEditMode && !$tr.attr("_insert")) {
            return;
        }
        if (self._triggered && self._editView.editing && _getRowId($tr) == self._editView.rowId) {
            return;
        }
        if (self._rowAdding) {
            return;
        }
        var rowIndex = self._getTrs().index($tr), rowData = self._getRowData(rowIndex);
        if (ops.onBeforeEdit && ops.onBeforeEdit.call(self, rowIndex, rowData) === false) {
            return;
        }
        _showEditView(self, $tr);
        $editRow = self._editView.editRow;
        $editForm = $editRow.find(">.grid-edit-form");
        scrollLeft = $elem.parent().scrollLeft();
        self._getHeaderCols().each(function (index) {
            var axis = $(this).attr('axis'), model, $cell = $tr.find("td:eq(" + index + ")"), name, compKey;
            if (axis.substring(0, 3) == 'col') {
                var colIndex = axis.substring(3);
                model = cm[colIndex];
            } else {
                if ($.isEmptyObject(self._editComps)) {
                    $editRow.css("padding-left", parseInt($editRow.css("padding-left")) + $cell.outerWidth());
                }
                return;
            }
            var editor = model.editor;
            if (!self._triggered) {
                if (!editor || (editor && (editor.editable === false || ($.isFunction(editor.editable) && editor.editable() === false)))) {
                    var renderer = editor && editor.renderer;
                    model.editor = editor = {};
                    editor.type = "text";
                    if (renderer) {
                        editor.renderer = renderer;
                        editor.type = "custom";
                    }
                    editor.editable = false;
                } else {
                    editor.type = editor.type || "text";
                    editor.editable = true;
                    if (editor.rules) {
                        self._validate = true;
                    }
                }
                compKey = model.editor.name || model.name;
                editor.options = editor.options || {};
                self._editComps[compKey] = {};
            } else {
                compKey = model.editor.name || model.name;
            }
            editComp = self._editComps[compKey];
            lastValue = (lastValue = _getLastValue(self, $tr, model)) == undefined ? "" : lastValue;
            if (!self._triggered && editor.editable && editor.rules) {
                self._errorHolders[compKey] = $("<div class='errorContainer' style='display:none'></div>").appendTo($elem.parent());
            }
            var $ins = editComp.instance, $wrapper, type = editor.type;
            if (!$ins) {
                $wrapper = $("<div style='position:absolute'></div>").css({left:$cell.position().left + scrollLeft, top:3}).appendTo($editForm).addClass("grid-edit-wrapper");
                $ins = editComp.instance = $("<input></input>").attr({"name":compKey, "id":compKey}).appendTo($wrapper);
                if ("text" != type && "custom" != type) {
                    $ins[type](editor.options);
                }
                if ("omCalendar" == type || "omCombo" == type) {
                    var $parent = $ins.parent();
                    if ("omCalendar" == type) {
                        $ins.val(lastValue).width($cell.outerWidth() - 24);
                        $ins.width($cell.outerWidth(true) - ($parent.outerWidth(true) - $ins.width()));
                    } else {
                        $ins.next("input").attr({id:$ins.prop("id"), name:$ins.prop("name")});
                        $ins.attr({id:"", name:""});
                        $ins.next("input").width($cell.outerWidth(true) - ($parent.outerWidth(true) - $ins.next("input").width()));
                    }
                } else {
                    if ("text" == type) {
                        $ins.addClass("grid-edit-text");
                        if (!editor.editable) {
                            $ins.attr("readonly", "readonly").addClass("readonly-text");
                        }
                    }
                    if ("custom" == type) {
                        $ins = editComp.instance = $wrapper.html(editor.renderer.call(self, lastValue, rowData));
                    }
                    $ins.width($cell.outerWidth(true) - ($ins.outerWidth(true) - $ins.width()));
                }
                editComp.model = model;
                editComp.type = type;
                editComp.id = model.name;
                if ("custom" != type) {
                    var $target = "omCombo" == type ? $ins.next() : $ins;
                    $target.blur(function (event) {
                        var eHolder = self._errorHolders[compKey];
                        eHolder && eHolder.hide();
                    });
                }
            }
            switch (type) {
                case"omCalendar":
                    $ins = $ins.val(lastValue).omCalendar();
                    break;
                case"omNumberField":
                    $ins.val(lastValue).trigger("blur");
                    break;
                case"omCombo":
                    $ins.omCombo("value", lastValue);
                    break;
                case"text":
                    $ins.val(lastValue);
                    break;
                case"custom":
                    $ins.html(editor.renderer.call(self, lastValue, rowData));
                default:
                    ;
            }
        });
        !self._triggered && self._validate && _bindValidation(self);
        self._validator && self._validator.form();
        self._triggered = true;
    }

    function _clearCache(self) {
        self._changeData = {"update":{}, "insert":{}, "delete":{}};
    }

    function _noChanges(self) {
        return!_isEditable(self) || !_hasChange(self);
    }

    function _getEditBtnPosition(self) {
        var $elem = self.element, $bDiv = $elem.parent(), ev = self._editView, $editView = ev.view, $editBtn = ev.editBtn, $editRow = ev.editRow, pos = {};
        pos.top = $editRow.height();
        if ($elem.width() < $bDiv.width()) {
            pos.left = $elem.width() / 2 - $editBtn.width() / 2;
        } else {
            pos.left = $bDiv.scrollLeft() + $bDiv.width() / 2 - $editBtn.width() / 2;
        }
        return pos;
    }

    function _onRefresh() {
        if (_isEditable(this)) {
            _clearCache(this);
            _buildRowIdDataMap(this);
            if (this._triggered) {
                _resetForm(this);
                this._editView.view.hide();
                this._editView.editing = false;
                this.hDiv.scrollLeft(0);
                this.element.parent().scrollLeft(0);
            }
        }
    }

    function _isEditable(self) {
        return!self._allEditMode || self._globalEditable;
    }

    function _buildRowIdDataMap(self) {
        var rowsData = self.getData().rows;
        self._rowIdDataMap = {};
        self._getTrs().each(function (index, tr) {
            self._rowIdDataMap[_getRowId(tr)] = rowsData[index];
        });
    }

    function _resetForm(self) {
        if (self._validator) {
            self._validator.resetForm();
            $.each(self._errorHolders, function (name, holder) {
                holder.empty().hide();
            });
        }
    }

    function _hasChange(self) {
        var changeData = self._changeData;
        return!($.isEmptyObject(changeData["update"]) && $.isEmptyObject(changeData["insert"]) && $.isEmptyObject(changeData["delete"]));
    }

    function _showEditView(self, tr) {
        var $elem = self.element, $editView = $elem.next(".grid-edit-view"), $editBtn, $editRow, position = $(tr).position(), scrollTop = $elem.parent().scrollTop(), ops = self.options;
        if ($editView.length == 0) {
            $editView = $("<div class='grid-edit-view'><div class='body-wrapper'><div class='grid-edit-row'><form class='grid-edit-form'></form></div>"
                + "<div class='gird-edit-btn'><input type='button' class='ok' value='确定'/><input type='button' class='cancel' value='取消'/></div></div></div>").width($elem.outerWidth()).insertAfter($elem);
            var $editBtn = $editView.find(".gird-edit-btn"), $editRow = $editBtn.prev(".grid-edit-row"), pos;
            self._editView = {view:$editView, editRow:$editRow, editBtn:$editBtn};
            pos = _getEditBtnPosition(self);
            $editBtn.css({"left":pos.left, "top":pos.top});
            var $okBtn = $editBtn.find("input.ok").omButton(), $cancelBtn = $editBtn.find("input.cancel").omButton();
            $okBtn.click(function () {
                if (self._validator && !self._validator.form()) {
                    return;
                }
                var $tr = $elem.find("tr[_grid_row_id='" + self._editView.rowId + "']");
                _saveEditValue(self, $tr);
                $editView.hide();
                self._editView.editing = false;
                $okBtn.blur();
                if (self._rowAdding) {
                    self._refreshHeaderCheckBox();
                    self._rowAdding = false;
                }
                var rowIndex = self._getTrs().index($tr);
                ops.onAfterEdit && ops.onAfterEdit.call(self, rowIndex, self._getRowData(rowIndex));
            });
            $cancelBtn.click(function () {
                self.cancelEdit(this);
            });
        }
        self._editView.rowId = _getRowId(tr);
        if (self._editView.editing) {
            $editView.animate({"top":position.top + scrollTop}, "fast");
        } else {
            $editView.css({"top":position.top + scrollTop});
            self._editView.editing = true;
            $editView.show();
            if (self._colWidthResize) {
                _resizeView(self);
                self._colWidthResize = false;
            }
        }
    }

    function _onResize() {
        if (!_isEditable(this) || !this._triggered) {
            return;
        }
        if (this._editView.editing) {
            this.element.parent().scrollLeft(0);
            var self = this;
            setTimeout(function () {
                _resizeView(self);
            }, 0);
        } else {
            this._colWidthResize = true;
        }
    }

    function _resizeView(self, $col, differWidth) {
        var $elem = self.element, view = self._editView, $editView = view.view, scrollLeft = $elem.parent().scrollLeft(), $editBtn = view.editBtn, updated;
        $editView.width($elem.outerWidth());
        self._getHeaderCols().each(function (index, th) {
            var id = $(th).attr("abbr"), $th = $(th), target = $col && $col.prop("abbr") === $th.prop("abbr");
            if (target) {
                updated = true;
            }
            if ($col && !updated) {
                return;
            }
            $.each(self._editComps, function (name, comp) {
                var $ins = comp.instance, type = comp.type;
                if (id == comp.id) {
                    if (!target && $col) {
                        $ins.closest("div.grid-edit-wrapper").css("left", "+=" + differWidth);
                        return false;
                    }
                    if (!target) {
                        $ins.closest("div.grid-edit-wrapper").width($th.outerWidth()).css("left", $th.position().left + scrollLeft);
                    }
                    if ("omCalendar" == type || "omCombo" == type) {
                        var $parent = $ins.parent();
                        if ("omCalendar" == type) {
                            $ins.width($th.outerWidth() - 24);
                            $ins.width($th.outerWidth(true) - ($parent.outerWidth(true) - $ins.width()));
                        } else {
                            $ins.next("input").width($th.outerWidth(true) - ($parent.outerWidth(true) - $ins.next("input").width()));
                        }
                    } else {
                        $ins.width($th.outerWidth(true) - ($ins.outerWidth(true) - $ins.width()));
                    }
                }
            });
        });
        var pos = _getEditBtnPosition(self);
        if ($col) {
            $editBtn.animate({"left":pos.left, "top":pos.top}, "fast");
        } else {
            $editBtn.css({"left":pos.left, "top":pos.top});
        }
    }

    function _onResizable($th, differWidth) {
        if (!_isEditable(this) || !this._triggered || !this._editView.editing) {
            this._colWidthResize = true;
            return;
        }
        _resizeView(this, $th, differWidth);
    }

    function _saveEditValue(self, tr) {
        var $tr = $(tr), $editRow = self._editView.editRow, comps = self._editComps, rowId = _getRowId($tr), index = self._getTrs().index($tr), rowData = self._getRowData(index);
        $.each(comps, function (name, comp) {
            var key = comp.model.name, newValue = _getCompValue(self, $tr, comp), originalValue, html, updateRowData;
            if ($tr.attr("_insert")) {
                self._changeData.insert[rowId][key] = newValue;
            } else {
                originalValue = _getRowData(self, tr)[key];
                updateRowData = self._changeData.update[rowId];
                if (String(newValue) === String(originalValue)) {
                    _toggleDirtyFlag($tr, comp.model, false);
                    updateRowData && delete updateRowData[key];
                    $.isEmptyObject(updateRowData) && delete self._changeData.update[rowId];
                } else {
                    _toggleDirtyFlag($tr, comp.model, true);
                    updateRowData = self._changeData.update[rowId] = updateRowData || {};
                    updateRowData[key] = newValue;
                }
            }
            if (comp.model.renderer) {
                html = comp.model.renderer(newValue, rowData, index);
            } else {
                html = newValue == undefined ? "" : newValue;
            }
            $tr.find("td[abbr='" + key + "'] >div").html(html);
        });
    }

    function _toggleDirtyFlag($tr, model, show) {
        $tr.find("td[abbr='" + model.name + "']").toggleClass("grid-cell-dirty", show);
    }

    function _getRowId(tr) {
        return $(tr).attr("_grid_row_id");
    }

    function _getCompValue(self, $tr, comp) {
        var value, rowData = _getRowData(self, $tr), $ins = comp.instance;
        switch (comp.type) {
            case"omCalendar":
                value = $ins.val();
            case"omNumberField":
                value = $ins.val();
                break;
            case"omCombo":
                value = $ins.omCombo("value");
                break;
            case"text":
                value = $ins.val();
                break;
            case"custom":
                if (comp.model.editor.getValue) {
                    return comp.model.editor.getValue.call($ins, rowData, comp.model.name);
                }
            default:
                break;
        }
        return value;
    }

    function _getLastValue(self, $tr, model) {
        var value, name = model.name;
        if ($tr.attr("_insert")) {
            value = _getRowData(self, $tr)[name];
        } else {
            var updateData = self._changeData.update[_getRowId($tr)];
            if (updateData && updateData[name] != null) {
                value = updateData[name];
            } else {
                value = _getRowData(self, $tr)[name];
            }
        }
        return value;
    }

    function _getRowData(self, tr) {
        var rowId = _getRowId(tr);
        return $(tr).attr("_insert") ? self._changeData.insert[rowId] : self._rowIdDataMap[rowId];
    }

    function _bindValidation(self) {
        var $editForm = self._editView.editRow.find(">.grid-edit-form"), valiCfg = {}, rules = valiCfg.rules = {}, messages = valiCfg.messages = {}, colModel = self._getColModel();
        $.each(colModel, function (index, model) {
            var customRules = model.editor.rules;
            if (customRules) {
                var r = rules[model.editor.name || model.name] = {}, msg = messages[model.editor.name || model.name] = {};
                if (customRules.length > 0 && !$.isArray(customRules[0])) {
                    var temp = [];
                    temp.push(customRules);
                    customRules = temp;
                }
                for (var i = 0, len = customRules.length; i < len; i++) {
                    var name = customRules[i][0];
                    r[name] = customRules[i][1] == undefined ? true : customRules[i][1];
                    if (customRules[i][2]) {
                        msg[name] = customRules[i][2];
                    }
                }
            }
        });
        $.extend(valiCfg, {onkeyup:function (element) {
            this.element(element);
        }, errorPlacement:function (error, element) {
        }, showErrors:function (errorMap, errorList) {
            if (errorList && errorList.length > 0) {
                $.each(errorList, function (index, obj) {
                    var $elem = $(obj.element), name = $elem.attr("name");
                    var errorHolder = self._errorHolders[name];
                    if (errorHolder) {
                        var docPos = $elem.offset(), tablePos = self.element.offset();
                        errorHolder.css({left:docPos.left - tablePos.left + $elem.outerWidth(), top:docPos.top - tablePos.top + $elem.outerHeight()}).html(obj.message);
                        if ($elem.is(":focus")) {
                            errorHolder.show();
                        }
                    }
                });
            } else {
                $.each(this.currentElements, function (index, elem) {
                    var errorHolder = self._errorHolders[$(elem).attr("name")];
                    errorHolder && errorHolder.empty().hide();
                });
            }
            var $okBtn = self._editView.editBtn.find("input.ok"), correct = true;
            $.each(self._errorHolders, function (name, errorHolder) {
                if (!errorHolder.is(":empty")) {
                    return correct = false;
                }
            });
            correct ? $okBtn.omButton("enable") : $okBtn.omButton("disable");
            this.defaultShowErrors();
        }});
        self._validator = $editForm.validate(valiCfg);
        $.each(self._editComps, function (name, comp) {
            var editor = comp.model.editor;
            if (editor.editable && editor.rules) {
                var key = editor.name || comp.model.name, errorHolder = self._errorHolders[key], $target = comp.type == "omCombo" ? comp.instance.next("input") : comp.instance;
                $target.mouseover(
                    function () {
                        if (errorHolder && !errorHolder.is(":empty")) {
                            errorHolder.show();
                        }
                    }).mouseout(function () {
                    errorHolder && errorHolder.hide();
                });
            }
        });
    }
})(jQuery);
(function ($) {
    $.omWidget.addBeforeInitListener('om.omGrid', function () {
        var cm = this._getColModel();
        if (!$.isArray(cm) || cm.length <= 0 || !$.isArray(cm[0])) {
            return;
        }
        _buildBasicColModel(this);
        this.hDiv.addClass("hDiv-group-header");
        $.extend(this, {_getColModel:function () {
            return this._colModel;
        }, _getHeaderCols:function () {
            var result = [], op = this.options, $hDiv = this.hDiv, $ths = $hDiv.find("th[axis^='col']");
            $($ths).each(function () {
                result.push(this);
            });
            result.sort(function (first, second) {
                return first.axis.slice(3) - second.axis.slice(3);
            });
            !op.singleSelect && result.unshift($hDiv.find("th[axis='checkboxCol']")[0]);
            op.showIndex && result.unshift($hDiv.find("th[axis='indexCol']")[0]);
            op.rowDetailsProvider && result.unshift($hDiv.find("th[axis='expenderCol']")[0]);
            return $(result);
        }, _buildTableHead:function () {
            var op = this.options, $elem = this.element, $grid = $elem.closest('.om-grid'), cm = op.colModel, allColsWidth = 0, autoExpandColIndex = -1, tmp = "<th class='$' $ $ $ $ $><div class='$' style='text-align:$; $'>$</div></th>", content = ["<thead>"], cols, item, rowHeader, $thead;
            for (var i = 0, row = cm.length; i < row; i++) {
                content.push("<tr>");
                if (i == 0) {
                    if (op.showIndex) {
                        content.push("<th class='indexCol data-header-" + row + "' align='center' axis='indexCol' rowspan=" + row + "><div class='indexheader' style='text-align:center;width:25px;' /></th>");
                    }
                    if (!op.singleSelect) {
                        content.push("<th class='checkboxCol data-header-" + row + "' align='center' axis='checkboxCol' rowspan=" + row + "><div class='checkboxheader' style='text-align:center;width:17px;'><span class='checkbox'/></div></th>");
                    }
                }
                rowHeader = cm[i];
                for (var j = 0, col = rowHeader.length; j < col; j++) {
                    item = rowHeader[j];
                    var cmWidth = item.width || 60, cmAlign = item.align || 'center', name = item.name;
                    if (item.name && cmWidth == 'autoExpand') {
                        cmWidth = 0;
                        autoExpandColIndex = _getColIndex(this, item);
                    }
                    var cls = item.wrap ? "wrap" : "";
                    cls += (item.name ? " data-header-" : " group-header-") + (item.rowspan ? item.rowspan : 1);
                    cols = [cls, item.align ? "align=" + item.align : "", name ? "axis=col" + _getColIndex(this, item) : "", name ? "abbr=" + name : "", item.rowspan ? "rowspan=" + item.rowspan : "", item.colspan ? "colspan=" + item.colspan : "", item.wrap ? "wrap" : "", cmAlign, name ? "width:" + cmWidth + "px" : "", item.header];
                    _buildTh(content, cols, tmp);
                    if (item.name) {
                        allColsWidth += cmWidth;
                    }
                }
                content.push("</tr>");
            }
            content.push("</thead>");
            $('table', this.hDiv).html(content.join(""));
            $thead = $('thead', this.hDiv);
            this._fixHeaderWidth(autoExpandColIndex, allColsWidth);
            this.thead = $thead;
            $thead = null;
        }});
    });
    function _getColIndex(self, header) {
        var cm = self._getColModel();
        for (var i = 0, len = cm.length; i < len; i++) {
            if (cm[i].name == header.name) {
                return i;
            }
        }
    }

    function _buildTh(content, cols, tmp) {
        var j = 0;
        content.push(tmp.replace(/\$/g, function () {
            return cols[j++];
        }));
    }

    function _buildBasicColModel(self) {
        self._colModel = [];
        var cm = self._getColModel(), matrix = [], realRowHeader = [], rows = 1, cols = 1, rowHeader, item, colIndex, len = cm.length;
        for (var i = 0; i < len; i++) {
            matrix[i] = [];
        }
        for (var i = 0, row = len; i < row; i++) {
            rowHeader = cm[i];
            for (var j = 0, col = rowHeader.length; j < col; j++) {
                item = rowHeader[j];
                rows = item.rowspan || 1;
                cols = item.colspan || 1;
                colIndex = _checkMatrix(matrix, i, rows, cols);
                if (item.name) {
                    realRowHeader.push({header:item, colIndex:colIndex});
                }
            }
        }
        realRowHeader.sort(function (first, second) {
            return first.colIndex - second.colIndex;
        });
        i = 0;
        while (realRowHeader[i] && self._colModel.push(realRowHeader[i++].header));
    }

    function _checkMatrix(matrix, index, rows, cols) {
        var i = 0;
        while (matrix[index][i] && ++i);
        for (var j = index; j < index + rows; j++) {
            for (var k = i; k < i + cols; k++) {
                matrix[j][k] = true;
            }
        }
        return i;
    }
})(jQuery);

(function($) {
    /**
     * 直接加载json格式的数据
     */
    $.omWidget.addInitListener('om.omGrid',function(){
        var self = this,
            el = this.element,
            op = this.options;
        if (this.loading) {
            return true;
        }
        var grid = el.closest('.om-grid'),
            loadMask = $('.gBlock',grid);
        self.setSimpleData=function(data){
            var pageData = this.pageData;
            var nowPage = pageData.nowPage || 1,
                data=data || {"rows":[],"total":0};
            this.loading = true;
            loadMask.show();
            try {
                self._addData(data);
                for(var i=0 , len=op._onRefreshCallbacks.length; i<len; i++){
                    op._onRefreshCallbacks[i].call(self);
                }
                self._trigger("onRefresh",null,nowPage,data.rows||[]);
            }finally{
                loadMask.hide();
                this.loading = false;
            }
        }
    });
})(jQuery);

