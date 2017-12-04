//通用业务逻辑
var zpid;                      //用于图片空间
var workFlowType = "frame";  //工作流弹出风格
var hasHandleSubmit = true;

function getWorkflowType(){
    return workFlowType;
}

function setWorkflowType(value){
    workFlowType = value;
}

function setZpid(c) {
    zpid = c;
}
function getZpid() {
    return zpid;
}

window.property = null;      //工作流设计器属性缓存

function setNodeValue(nodeInfo, ifrWin) {
    window.property = nodeInfo;
}

function getNodeValue() {
    return property;
}

function currentNode() {
    return property;
}

layer.config({
    extend: 'extend/layer.ext.js'
});
