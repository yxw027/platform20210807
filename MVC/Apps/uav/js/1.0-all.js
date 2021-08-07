﻿/*
 * 全局对象
 */
var viewer = null;
var handler = null;


var tree = layui.tree;
var form = layui.form;
var table = layui.table;
var util = layui.util;
var date = layui.laydate;
var elem = layui.element;


var uavprojectaddlayerindex = null;     //项目（新建）模块
var uavprojectviewlayerindex = null;    //项目（查看）模块
var uavprojecteditlayerindex = null;    //项目（编辑）模块


var selectroutetypelayerindex = null;   //航线（选择）模块
var uavrouteaddlayerindex = null;       //航线（新建）模块
var uavrouteviewlayerindex = null;      //航线（查看）模块
var uavrouteeditlayerindex = null;      //航线（编辑）模块



var uav_project_list_all = [];//用户全部项目列表


var current_project_id = null;//当前项目
var current_project_title = null;//当前项目标题（用于高亮显示）
var current_waypoint_title = null;//当前航点标题（用于高亮显示）
var current_project_tile = null;//当前模型
var current_project_pointcloudid = null;//当前点云

var current_entities_route = [];//当前路径

//TODO var current_primitives = [];//当前模型




/*
 * 图标常量
 */
var TAKEOFFICON = '<span style="margin-right:2px;"><img src="../../../Resources/img/uav/takeoff.png" style="width:14px;height:14px;"/></span>';
var LANDINGICON = '<span style="margin-right:2px;"><img src="../../../Resources/img/uav/landing.png" style="width:14px;height:14px;"/></span>';
var TARGETICON = '<span style="margin-right:2px;"><img src="../../../Resources/img/uav/target.png" style="width:14px;height:14px;"/></span>';
var AVOIDICON = '<span style="margin-right:2px;"><img src="../../../Resources/img/uav/avoid.png" style="width:14px;height:14px;"/></span>';
var TARGETAREAICON = '<span style="margin-right:2px;"><img src="../../../Resources/img/uav/targetarea.png" style="width:14px;height:14px;"/></span>';


/*
 * 默认参数
 */
var routespeed = 5;             //(默认值)航线速度，单位m/s
var takeoffheight = 100;         //(默认值)起飞点高度，单位m
var avoidheight = 100;           //(默认值)避障点高度，单位m
var landingheight = 100;         //(默认值)降落点高度，单位m
var adjustdistance = 5;         //(默认值)调整距离，单位m
var photodistance = 50;           //(默认值)拍照距离，单位m
var adjustspeed = 1;            //(默认值)调整速度，单位m/s
var hovertime = 3000;           //(默认值)悬停时间，单位ms
var yawangle = 180;             //(默认值)偏航角，单位°  [-180,180]
var pitchangle = 0;             //(默认值)偏航角，单位°    [-90,0]

var target_offset_x = 5;        //(默认值)目标点x轴范围，单位m
var target_offset_y = 5;        //(默认值)目标点y轴范围，单位m
var target_offset_z = 5;        //(默认值)目标点z轴范围，单位m


var gsd = 1;                    //地面分辨率，单位cm
var forwardoverlap = 80;        //航向重叠度，百分比
var sideoverlap = 70;           //旁向重叠度，百分比
var multiangle = true;          //首末航向多角度
var doublegrid = false;         //井字形
var directmodify = false;       //方向修正（计算第二次自定义平面坐标系y正轴点出错导致的方向错误）

var level = true;              //是否水平



































//GUID
function NewGuid() {
    return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
};

//高亮节点
function MarkNode() {
    //选中节点高亮
    var nodes = document.getElementsByClassName("layui-tree-txt");
    for (var i = 0; i < nodes.length; i++) {
        if ((nodes[i].innerHTML === current_project_title) || (nodes[i].innerHTML === current_waypoint_title)) {
            nodes[i].style.color = "#009688";
            nodes[i].style.fontSize = "15px";
            nodes[i].style.fontWeight = "bold";
        }
        else {
            nodes[i].style.color = "#555555";
            nodes[i].style.fontSize = "14px";
            nodes[i].style.fontWeight = "normal";
        }
    }
};

//清除string中html元素
function ClearHtml(str) {
    if (str == undefined || str == null) return '';
    return str.replace(/&nbsp&#59/g, '').replace(/<br \/>/g, '\n').replace(/<br>/g, '\n').replace(/&nbsp;/g, " ").replace(/&rdquo/g, '').replace(/&ldquo/g, '').replace(/&rarr/g, '').replace(/&hellip;/g, '').replace(/&#59;/g, '').replace(/&mdash/g, '').replace(/&alpha/g, 'α').replace(/<p>/g, '').
        replace('</p>', '').replace(/<br\/>/g, '\n').replace(/<.+?>/g, '');
};

//关闭指定图层
function CloseLayer(layerindex) {
    if (layerindex != null) {
        layer.close(layerindex);
        layerindex = null;
    }
};

//关闭所有图层
function CloseAllLayer() {
    if (uavprojectaddlayerindex != null) {
        layer.close(uavprojectaddlayerindex);
        uavprojectaddlayerindex = null;
    }
    if (uavprojectviewlayerindex != null) {
        layer.close(uavprojectviewlayerindex);
        uavprojectviewlayerindex = null;
    }
    if (uavprojecteditlayerindex != null) {
        layer.close(uavprojecteditlayerindex);
        uavprojecteditlayerindex = null;
    }

    if (selectroutetypelayerindex != null) {
        layer.close(selectroutetypelayerindex);
        selectroutetypelayerindex = null;
    }

    if (uavrouteaddlayerindex != null) {
        layer.close(uavrouteaddlayerindex);
        uavrouteaddlayerindex = null;
    }
    if (uavrouteviewlayerindex != null) {
        layer.close(uavrouteviewlayerindex);
        uavrouteviewlayerindex = null;
    }
    if (uavrouteeditlayerindex != null) {
        layer.close(uavrouteeditlayerindex);
        uavrouteeditlayerindex = null;
    }


    //TODO
};

