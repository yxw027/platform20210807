
var handler;
var scene = viewer.scene;
var canvas = scene.canvas;
var isPoint = false;                        //坐标量测
var isLength = false;                     //长度量测
var isHeight = false;                       //高度量测
var isAraa = false;                         //面积量测
var isAzimuth = false;                      //方位角量测
var isRedo = false;                         //继续绘制
var isPointLabel = false;                   //点标注
var isPolylineLabel = false;                //线标注
var isPolygonLabel = false;                 //面标注
var isOccurrence = false;                   //产状
var isWindowZiDingyi = false;                  //迹线
var points = [];                            //临时点集
var pointLabelCount = 0;
var curId = "0";
var linepoints = [];
var linepointcount = 0;
var polylineId = 0;
var lineId = "0";
var areapoints = [];
var areapointcount = 0;
var polygonId = 0;
var areaId = "0";
var takeoffpoint = null;
var landingpoint = null;
var waypoints = [];
var newwaypoints = [];
var projectinfos = [];
var curproject = "";
var curpointclound = "";
var tileset = null;
var isModelLine = true;                        //是否贴模型
var sideLength = 5;//初始化的5
var trem = [];//装测区
var time = new Date();
var y = time.getFullYear();
var mouth = time.getMonth() + 1;
var d = time.getDate();
var collector = null;//采集人
var eyespoints = [];
var jielitext = null;//节理弹出框
var cequList = [];
var botiaoValue = null;
var pointPic = null;//图片地质
var pointColor = '#079b8c';//图标颜色
console.log(mouth);
//绘制widget
function LoadDrawLayer() {


    var drawlayerindex = layer.open({
        type: 1
        , title: ['绘制', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
        , area: ['500px', '500px']
        , shade: 0
        , offset: 'auto'
        , closeBtn: 1
        , maxmin: true
        , moveOut: true
        , content: ''
        , zIndex: layer.zIndex
        , success: function (layero) {
            //置顶
            layer.setTop(layero);
        }
    });






}
//显示/隐藏功能面板
var isOpenMenu = false;
function openMenu() {
    isOpenMenu = !isOpenMenu;

    if (isOpenMenu) {
        document.getElementById("menu").style.visibility = "visible";
        document.getElementById("openmenu").style.right = "247px";
        document.getElementById("openmenu").src = "../../../Resources/img/icon/right.png";
        document.getElementById("openmenu").title = "收起功能面板";
    }
    else {
        document.getElementById("menu").style.visibility = "hidden";
        document.getElementById("openmenu").style.right = "20px";
        document.getElementById("openmenu").src = "../../../Resources/img/icon/left.png";
        document.getElementById("openmenu").title = "展开功能面板";
    }
}
//显示/隐藏鹰眼视图
var isOpenOverview = false;
function openOverview() {
    isOpenOverview = !isOpenOverview;

    if (isOpenOverview) {
        document.getElementById("overview").style.visibility = "visible";
        document.getElementById("openoverview").style.bottom = "260px";
        document.getElementById("openoverview").style.right = "260px";
        document.getElementById("openoverview").src = "image/icon/narrow.png";
        document.getElementById("openoverview").title = "隐藏鹰眼视图";
        //document.getElementById("openoverview").style.backgroundColor = "rgba(255,255,255,0.5)";
    }
    else {
        document.getElementById("overview").style.visibility = "hidden";
        document.getElementById("openoverview").style.bottom = "0px";
        document.getElementById("openoverview").style.right = "0px";
        document.getElementById("openoverview").src = "image/icon/expand.png";
        document.getElementById("openoverview").title = "显示鹰眼视图";
    }
}

//清除
function Clear() {
    ClearAction();
    ClearTemp();
}

//清除动作
function ClearAction() {
    if (handler != undefined) {
        handler.destroy();
    }
}

//清除临时图形
function ClearTemp() {
    var count = 0;
    console.log(viewer.entities);
    while (count < 40) {
        for (var i = 0; i < viewer.entities._entities._array.length; i++) {
            if ((viewer.entities._entities._array[i]._name) && ((viewer.entities._entities._array[i]._name.indexOf("temppoint") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("temppolygon") > -1)


                || (viewer.entities._entities._array[i]._name.indexOf("ptMeasue") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("ptlMeasue") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("plMeasue") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("pllMeasue") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("pyMeasue") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("pylMeasue") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("alMeasue") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("ptOccurrence") > -1)
                || (viewer.entities._entities._array[i]._name.indexOf("positonPoint") > -1))


            ) {
                viewer.entities.remove(viewer.entities._entities._array[i]);
            }
        }
        count++
    }
    if (viewer.entities.getById("line_temp9999") != null) {
        viewer.entities.removeById("line_temp9999");
    }
    if (viewer.entities.getById("line_temp9998") != null) {
        viewer.entities.removeById("line_temp9998");
    }
    //if (viewer.scene.primitives._primitives.length>2)
    //{
    //    for (var i = 2; i < viewer.scene.primitives._primitives.length; i++) {
    //        viewer.scene.primitives.remove(viewer.scene.primitives._primitives[i]);
    //    }
    //}

    points = [];
    eyespoints = [];
}
//坐标量测
function biaozhuMangan() {
    //判断一下模型。项目
    if (currentprojectid == null) {
        layer.msg('请先选择项目');
        return;
    }
    if (modleInfo == null) {
        layer.msg('请先选择模型');
        return;
    }
    if (projectlayerlistlayerindex != null) {
        layer.msg('已打开标注窗口');
        return;
    }
    //添加点标注，弹出框
    projectlayerlistlayerindex = layer.open({
        type: 1
        , title: ['标注管理', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
        , area: ['300px', '500px']
        , shade: 0
        , offset: ['85px', '260px']
        , closeBtn: 1
        , maxmin: true
        , moveOut: true
        , content: dianBiaozhuHtml
       , zIndex: layer.zIndex
        , success: function (layero) {
            LoadBiaozhunListLayer();
           //layer.min(projectindex)
            //置顶
            layer.setTop(layero);
            $(window).resize();

        }
        , end: function () {
            projectlayerlistlayerindex = null;
            //删除图层数据

        }
    });

       //开启全功能
        colorpicker.render({
            elem: '#test-all'
            , color: '#079b8c'
            , format: 'RGB'
            , predefine: true
            , alpha: true
            , done: function (color) {
                $('#test-all-input').val(color); //向隐藏域赋值
               // layer.tips('给指定隐藏域设置了颜色值：' + color, this.elem);
                pointColor = color;
              

                color || this.change(color); //清空时执行 change

            }
            , change: function (color) {
                //给当前页面头部和左侧设置主题色
                $('.header-demo,.layui-side .layui-nav').css('background-color', color);
                console.log(color);
                console.log(pointColor);
            }
    });
    
    elem.on('tab(biaozhuguanli)', function (data) {

        location.hash = 'biaozhuguanli=' + this.getAttribute('lay-id');
        if (this.getAttribute('lay-id') == "4") {
            ClearAction();
            document.getElementsByClassName("yanseShoiw")[0].style = "display:none";          //修改工具栏样式
            if (modleInfo != null) {
                if (modleInfo.id.split('_')[1] != moidsendhist || biaoLayers.length == 0) {

                    LoadBiaozhunListLayer();
                }
            } else {
                for (var i = 0; i < biaoLayers.length; i++) {
                    for (var j = 0; j < biaoLayers[i].children.length; j++) {
                        viewer.entities.removeById(biaoLayers[i].children[j].id);
                        viewer.entities.removeById(biaoLayers[i].children[j].id + "_LABEL");
                    }
                }
                biaoLayers = [];
                tree.reload('prjbiaoZhuListid', { data: biaoLayers });

            }


        } else if (this.getAttribute('lay-id') == "1") {
            pointMeasure();
            document.getElementsByClassName("yanseShoiw")[0].style = "display: block";          //修改工具栏样式
        } else if (this.getAttribute('lay-id') == "2") {
            lengthMeasure();
            document.getElementsByClassName("yanseShoiw")[0].style = "display: block";          //修改工具栏样式
          //  AddTargetAreaModel();
        } else if (this.getAttribute('lay-id') == "3") {
            areaMeasure();
            document.getElementsByClassName("yanseShoiw")[0].style = "display: block";          //修改工具栏样式
        }
       
       
    })
    pointMeasure();

    
};
function pointMeasure() {
    ClearTemp();

    isPoint = true;
    isLength = false;
    isHeight = false;
    isAraa = false;
    isAzimuth = false;
    isRedo = false;
    isPointLabel = false;
    isPolylineLabel = false;
    isPolygonLabel = false;
    isOccurrence = false;
    isWindowZiDingyi = false;


    if (isPoint) {
        if (handler != undefined) {
            handler.destroy();
        }
        handler = new Cesium.ScreenSpaceEventHandler(canvas);

        //左击
        handler.setInputAction(function (leftclick) {
            if (pointPic == null) {
                layer.msg('请先选择图标');
                return;
            }
            if (pointColor.length == 0) {
                layer.msg('请先选择颜色');
                return;
            }
            if (isPoint) {
                var pickedOject = scene.pick(leftclick.position);
                if (pickedOject != undefined) {
                    var position = scene.pickPosition(leftclick.position);
                    if (position != undefined) {
                        var cartesian3 = Cesium.Cartographic.fromCartesian(position);                        //笛卡尔XYZ

                        if (cartesian3.height > 0) {

                            if (Cesium.defined(position)) {
                                //var drowinfoAddlayerindex = null;                           //画点新增，弹出框
                                DrowHuaHua("point", cartesian3, position);
                                // ClearTemp();

                                //针对移动设备
                                if (isMobile.any()) {
                                    if (handler != undefined) {
                                        handler.destroy();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}
//生成随机数
function NewGuid() {
    return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
}

//长度量测
function lengthMeasure() {
    if (pointColor.length == 0) {
        layer.msg('请先选择线的颜色');
        return;
    }
    ClearTemp();

    isPoint = false;
    isLength = true;
    isHeight = false;
    isAraa = false;
    isAzimuth = false;
    isRedo = false;
    isPointLabel = false;
    isPolylineLabel = false;
    isPolygonLabel = false;
    isOccurrence = false;
    isWindowZiDingyi = false;

    if (isLength) {
        if (handler != undefined) {
            handler.destroy();
        }

        handler = new Cesium.ScreenSpaceEventHandler(canvas);
        viewer._container.style.cursor = "crosshair";//修改鼠标样式
        //左击
        handler.setInputAction(function (leftclik) {
            if (isRedo) {
                ClearTemp();
                isRedo = false;
                linepoints = [];
                points = [];
            }

            var pickedOject = scene.pick(leftclik.position);
            if (pickedOject != undefined) {
                var position = scene.pickPosition(leftclik.position);
                if (position != undefined) {
                    if (Cesium.defined(position)) {
                        var cartesian3 = new Cesium.Cartesian3(position.x, position.y, position.z);
                        linepoints.push(Cesium.Cartographic.fromCartesian(position));
                        points.push(position);

                        viewer.entities.add({
                            name: "ptMeasue" + NewGuid(),
                            position: position,
                            point: {
                                pixelSize: 10,
                                color: Cesium.Color.YELLOW,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            }
                        });

                        if (points.length > 1) {
                            var point = points[points.length - 2];
                                //polylineOnModel("plMeasue" + NewGuid(), [point, position], 0.05, 10, Cesium.Color.AQUAMARINE);             
                            viewer.entities.add({
                                name: "plMeasue" + NewGuid(),
                                polyline: {
                                    positions: [point, position],
                                    width: 2,
                                    arcType: Cesium.ArcType.RHUMB,
                                    material: Cesium.Color.fromCssColorString(pointColor),
                                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.fromCssColorString(pointColor),
                                    }),
                                }
                            });
                        }
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //移动
        handler.setInputAction(function (move) {
            if (points.length > 0) {
                //清除多边形临时边线

                var pick = viewer.scene.pick(move.endPosition);
                if (pick != undefined) {
                    var XYZ = viewer.scene.pickPosition(move.endPosition);
                    if (XYZ != undefined) {
                        //删除
                        if (viewer.entities.getById("line_temp9999")!=null) {
                            viewer.entities.removeById("line_temp9999");
                        }
                        
                        //绘制多边形临时边线
                        viewer.entities.add({
                            id: "line_temp9999",
                            polyline: {
                                positions: [points[points.length - 1], XYZ],
                                width: 2,
                                arcType: Cesium.ArcType.RHUMB,
                                material: Cesium.Color.fromCssColorString(pointColor),
                                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                    color: Cesium.Color.fromCssColorString(pointColor),
                                }),
                            }
                        });
                        
                    }
                }
            }

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
       //右击
        if (isMobile.any()) {//双指
            handler.setInputAction(function (pinch) {
                if (viewer.entities.getById("line_temp9999") != null) {
                    viewer.entities.removeById("line_temp9999");
                }
                if (handler != undefined) {
                    handler.destroy();
                }
                viewer._container.style.cursor = "default";//还原鼠标样式
                if (points.length > 1) {
                    DrowHuaHua("line", linepoints, points);
                }

            }, Cesium.ScreenSpaceEventType.PINCH_START);
        }
        else {//右击
            
            handler.setInputAction(function (rightclik) {
                if (viewer.entities.getById("line_temp9999") != null) {
                    viewer.entities.removeById("line_temp9999");
                }
                if (handler != undefined) {
                    handler.destroy();
                }
                viewer._container.style.cursor = "default";//还原鼠标样式
                if (points.length > 1) {
                    DrowHuaHua("line", linepoints, points);

                }

            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
    }
};

//面积测量
/*
面积计算包括表面积、投影面积计算
投影面积计算过程：
（1）获取空间直角坐标XYZ
（2）转换为大地坐标BLH
（3）转换为平面直角坐标xy
（4）计算面积
*/
function areaMeasure() {
    //本面积计算方法为：将所有点转换为大地坐标BLH，然后将H赋值为最大H，再转换为空间直角坐标XYZ，取XY计算面积
    ClearTemp();
    if (currentprojectid == null) {
        layer.msg('请先选择项目');
        return;
    }
    if (modleInfoList.length == 0) {
        layer.msg('请先选择模型');
        return;
    }
    isPoint = false;
    isLength = false;
    isHeight = false;
    isAraa = true;
    isAzimuth = false;
    isRedo = false;
    isPointLabel = false;
    isPolylineLabel = false;
    isPolygonLabel = false;
    isOccurrence = false;
    isWindowZiDingyi = false;

    if (isAraa) {
        if (handler != undefined) {
            handler.destroy();
        }

        handler = new Cesium.ScreenSpaceEventHandler(canvas);

        //左击
        handler.setInputAction(function (leftclik) {
            if (isRedo) {
                ClearTemp();
                isRedo = false;
                linepoints = [];
                points = [];
            }

            var pickedOject = scene.pick(leftclik.position);
            if (pickedOject != undefined) {
                var position = scene.pickPosition(leftclik.position);
                if (position != undefined) {
                    if (Cesium.defined(position)) {
                        
                        points.push(position);
                        viewer.entities.add({
                            name: "ptMeasue" + NewGuid(),
                            position: position,
                            point: {
                                pixelSize: 10,
                                color: Cesium.Color.YELLOW,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            }
                        });

                        if (points.length > 1) {
                            var point = points[points.length - 2];
                            //polylineOnModel("plMeasue" + NewGuid(), [point, position], 0.05, 10, Cesium.Color.AQUAMARINE);             
                            viewer.entities.add({
                                name: "plMeasue" + NewGuid(),
                                polyline: {
                                    positions: [point, position],
                                    width: 2,
                                    arcType: Cesium.ArcType.RHUMB,
                                    material: Cesium.Color.fromCssColorString(pointColor),
                                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.fromCssColorString(pointColor),
                                    }),
                                }
                            });
                        }

                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //移动
        handler.setInputAction(function (move) {
            if (points.length > 0) {
                //清除多边形临时边线

                var pick = viewer.scene.pick(move.endPosition);
                if (pick != undefined) {
                    var XYZ = viewer.scene.pickPosition(move.endPosition);
                    if (XYZ != undefined) {
                        //删除
                        if (viewer.entities.getById("line_temp9999") != null) {
                            viewer.entities.removeById("line_temp9999");
                        }
                        
                        //绘制多边形临时边线
                        viewer.entities.add({
                            id: "line_temp9999",
                            polyline: {
                                positions: [points[points.length - 1], XYZ],
                                width: 2,
                                arcType: Cesium.ArcType.RHUMB,
                                material: Cesium.Color.fromCssColorString(pointColor),
                                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                    color: Cesium.Color.fromCssColorString(pointColor),
                                }),
                            }
                        });
                        
                        if (points.length > 1) {
                            //绘制多边形临时闭合线
                            if (viewer.entities.getById("line_temp9998") != null) {
                                viewer.entities.removeById("line_temp9998");
                            }
                            viewer.entities.add({
                                id: "line_temp9998",
                                polyline: {
                                    positions: [points[0], XYZ],
                                    width: 2,
                                    arcType: Cesium.ArcType.RHUMB,
                                    material: Cesium.Color.fromCssColorString(pointColor),
                                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.fromCssColorString(pointColor),
                                    }),
                                }
                            });
                        }
                    }
                }
            }

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        if (isMobile.any()) {
            //双指
            handler.setInputAction(function (pinch) {
                if (points.length > 2) {
                    if (viewer.entities.getById("line_temp9999") != null) {
                        viewer.entities.removeById("line_temp9999");
                    }
                    if (viewer.entities.getById("line_temp9998") != null) {
                        viewer.entities.removeById("line_temp9998");
                    }
                    if (handler != undefined) {
                        handler.destroy();
                    }
                    DrowHuaHua("area", linepoints, points);


                }

            }, Cesium.ScreenSpaceEventType.PINCH_START);
        }
        else {
            //右击
            handler.setInputAction(function (rightclik) {
                if (points.length > 2) {
                    if (viewer.entities.getById("line_temp9999") != null) {
                        viewer.entities.removeById("line_temp9999");
                    }
                    if (viewer.entities.getById("line_temp9998") != null) {
                        viewer.entities.removeById("line_temp9998");
                    }
                    if (handler != undefined) {
                        handler.destroy();
                    }
                    DrowHuaHua("area", linepoints, points);
                }

            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
    }
};


var wPosition = [];

//方位角量测
function azimuthMeasure() {
    ClearTemp();

    isPoint = false;
    isLength = false;
    isHeight = false;
    isAraa = false;
    isAzimuth = true;
    isRedo = false;
    isPointLabel = false;
    isPolylineLabel = false;
    isPolygonLabel = false;
    isOccurrence = false;
    isWindowZiDingyi = false;

    if (isAzimuth) {
        if (handler != undefined) {
            handler.destroy();
        }

        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        //左击
        handler.setInputAction(function (leftclik) {
            if (isRedo) {
                ClearTemp();
                isRedo = false;
                wPosition = [];
            }

            wPosition.push(new Cesium.Cartesian2(leftclik.position.x, leftclik.position.y));

            var pickedOject = scene.pick(leftclik.position);
            if (pickedOject != undefined) {
                var xyz = scene.pickPosition(leftclik.position);
                if (xyz != undefined) {
                    var rblh = Cesium.Cartographic.fromCartesian(xyz);

                    //viewer.entities.add({
                    //    name: "ptMeasue" + NewGuid(),
                    //    position: xyz,
                    //    point: {
                    //        pixelSize: 8,
                    //        color: Cesium.Color.YELLOW
                    //    }
                    //});
                    viewer.entities.add({
                        name: "ptMeasue" + NewGuid(),
                        position: xyz,
                        billboard: {
                            image: 'image/survey/marker.png',
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            width: 24,
                            height: 24,
                        }
                    });
                    points.push(xyz);

                    if (points.length == 2) {
                        var point = points[0];
                        if (false) {
                            //绘制贴模型线
                            //polylineOnModel("plMeasue" + NewGuid(), [point, xyz], 0.5, 5, Cesium.Color.WHITE);

                            viewer.entities.add({
                                name: "plMeasue" + NewGuid(),
                                polyline: {
                                    positions: [point, xyz],
                                    width: 5,
                                    arcType: Cesium.ArcType.RHUMB,
                                    material: Cesium.Color.YELLOW,
                                    show: true,
                                    clampToGround: true,
                                    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                                }
                            });
                        }
                        else {
                            //viewer.entities.add({
                            //    name: "plMeasue" + NewGuid(),
                            //    polyline: {
                            //        positions: [point, xyz],
                            //        width: 5,
                            //        material: Cesium.Color.YELLOW,
                            //    }
                            //});

                            var start = wPosition[0];
                            var end = wPosition[1];

                            var count = Math.ceil(Cesium.Cartesian2.distance(start, end) / 1);
                            var cartesians = [];
                            cartesians.push(scene.pickPosition(start));


                            for (var i = 0; i < count; ++i) {
                                var offset = i / (count - 1);
                                //cartesians[i] = Cesium.Cartesian2.lerp(start, end, offset, new Cesium.Cartesian2());
                                cartesians.push(scene.pickPosition(Cesium.Cartesian2.lerp(start, end, offset, new Cesium.Cartesian2())));
                            }

                            cartesians.push(scene.pickPosition(end));
                            viewer.entities.add({
                                name: "plMeasue" + NewGuid(),
                                polyline: {
                                    positions: cartesians,
                                    width: 10,
                                    material: Cesium.Color.YELLOW,
                                }
                            });




                        }

                        var rblh1 = Cesium.Cartographic.fromCartesian(point);//第一个点
                        var rblh2 = Cesium.Cartographic.fromCartesian(xyz);//第二个点

                        //计算方位角
                        var r = Math.atan((rblh2.longitude * 180 / Math.PI - rblh1.longitude * 180 / Math.PI) * Math.cos(rblh2.latitude) / (rblh2.latitude * 180 / Math.PI - rblh1.latitude * 180 / Math.PI)) * 180 / Math.PI;

                        //判断
                        if ((rblh1.latitude > rblh2.latitude) && (rblh1.longitude > rblh2.longitude)) {
                            r += 180;
                        }
                        else if ((rblh1.latitude > rblh2.latitude) && (rblh1.longitude == rblh2.longitude)) {
                            r = 180;
                        }
                        else if ((rblh1.latitude > rblh2.latitude) && (rblh1.longitude < rblh2.longitude)) {
                            r += 180;
                        }
                        else if ((rblh1.latitude == rblh2.latitude) && (rblh1.longitude > rblh2.longitude)) {
                            r = 270;
                        }
                        else if ((rblh1.latitude == rblh2.latitude) && (rblh1.longitude < rblh2.longitude)) {
                            r = 90;
                        }
                        else if ((rblh1.latitude < rblh2.latitude) && (rblh1.longitude > rblh2.longitude)) {
                            r += 360;
                        }
                        else if ((rblh1.latitude < rblh2.latitude) && (rblh1.longitude == rblh2.longitude)) {
                            r = 0;
                        }
                        else if ((rblh1.latitude < rblh2.latitude) && (rblh1.longitude < rblh2.longitude)) {
                            //r
                        }
                        else {
                            //error:不存在两点经纬度均相同的情况
                        }

                        viewer.entities.add({
                            name: "alMeasue" + NewGuid(),
                            position: Cesium.Cartesian3.fromElements((point.x + xyz.x) / 2, (point.y + xyz.y) / 2, (point.z + xyz.z) / 2),
                            label: {
                                text: '方位角：' + r.toFixed(2) + '度',
                                showBackground: true,
                                backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                font: '24px Times New Roman',
                                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                pixelOffset: new Cesium.Cartesian2(0.0, -60),
                            }
                        });

                        isRedo = true;
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}



//测窗自定义
/*
测窗大小由自己确定
（1）获取空间直角坐标XYZ
（2）转换为大地坐标BLH
（3）转换为平面直角坐标xy
（4）计算面积
*/
function windowInfoZiDingYi() {
    //本面积计算方法为：将所有点转换为大地坐标BLH，然后将H赋值为最大H，再转换为空间直角坐标XYZ，取XY计算面积
    ClearTemp();
    if (currentprojectid == null) {
        layer.msg('请先选择项目');
        return;
    }
    if (modleInfoList.length == 0) {
        layer.msg('请先选择模型');
        return;
    }
    isPoint = false;
    isLength = false;
    isHeight = false;
    isAraa = false;
    isAzimuth = false;
    isRedo = false;
    isPointLabel = false;
    isPolylineLabel = false;
    isPolygonLabel = false;
    isOccurrence = false;
    isWindowZiDingyi = true;

    if (isWindowZiDingyi) {
        if (handler != undefined) {
            handler.destroy();
        }

        handler = new Cesium.ScreenSpaceEventHandler(canvas);

        //左击
        handler.setInputAction(function (leftclik) {
            if (isRedo) {
                ClearTemp();
                isRedo = false;
                linepoints = [];
                points = [];
                eyespoints = [];
            }

            var pickedOject = scene.pick(leftclik.position);
            console.log(pickedOject);
            console.log(leftclik.position);
            //这个屏幕坐标反算
            if (pickedOject != undefined) {
                var position = scene.pickPosition(leftclik.position);
                if (position != undefined) {
                    // 模型点
                    linepoints.push(position);
                    // 眼睛点
                    eyespoints.push(new Cesium.Cartesian3(viewer.camera.position.x, viewer.camera.position.y, viewer.camera.position.z));
                    console.log(eyespoints);
                    points.push(position);//三维坐标，反算屏幕坐标

                    



                    if (Cesium.defined(position)) {
                        viewer.entities.add({
                            name: "ptMeasue" + NewGuid(),
                            position: position,
                            point: {
                                pixelSize: 5,
                                color: Cesium.Color.RED
                            }
                        });
                       
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        if (isMobile.any()) {
            //双指
            handler.setInputAction(function (pinch) {
                if (points.length > 2) {

                   // DrowHuaHua("zidingyi", linepoints, points);


                }

            }, Cesium.ScreenSpaceEventType.PINCH_START);
        }
        else {
            //右击
            handler.setInputAction(function (rightclik) {

                //newwindow
                if (points.length > 2) {

                    DrowHuaHua("newwindow", points, eyespoints);


                }
                //  加载  
               
                //整理数据

            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
    }
};


//测试标注
function testLabel() {
    var scene = viewer.scene;
    var canvas = scene.canvas;
    var pinBuilder = new Cesium.PinBuilder();

    var groceryPin = Cesium.when(pinBuilder.fromUrl('App/Cesium1.54/Assets/Textures/maki/basketball.png', Cesium.Color.GREEN, 48), function (canvas) {
        var entity = viewer.entities.add({
            name: 'Amway Center',
            position: Cesium.Cartesian3.fromDegrees(107.1390014, 28.9414251, 1856.38),
            billboard: {
                image: canvas.toDataURL(),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
            show: false,
            description:
                '<img width="50%" style="float:left; margin: 0 1em 1em 0;" src="Resources/AmwayCenterCourt.jpg"/>\n' +
                '<p>The <b>Amway Center</b> is a sports and entertainment venue in Orlando, Florida, located in the Downtown area. It is part of Downtown Orlando Master Plan 3: a plan that also involves improvements to the Citrus Bowl and a new performing arts center. The arena is home to the <a href="http://www.nba.com/magic/" target="_blank">Orlando Magic</a> of the NBA, the <a href="www.orlandopredators.com/" target="_blank">Orlando Predators</a> of the Arena Football League, the <a href="www.orlandosolarbearshockey.com/" target="_blank">Orlando Solar Bears</a> of the ECHL, and hosted the 2012 NBA All-Star Game, plus the 2015 ECHL All-Star Game.</p>\n' +
                '<p>Source: <a href="https://en.wikipedia.org/wiki/Amway_Center" target="_blank">Wikipedia</a>.</p>'
        });

        entity.show = true;
    });
}

//获取点标注样式
function getPointStyle(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var pointstyle = document.elementFromPoint(e.clientX, e.clientY);
    if ((pointstyle.id == "p1") || (pointstyle.id == "p2") || (pointstyle.id == "p3") || (pointstyle.id == "p4") || (pointstyle.id == "p5")
        || (pointstyle.id == "p6") || (pointstyle.id == "p7") || (pointstyle.id == "p8") || (pointstyle.id == "p9") || (pointstyle.id == "p10")
        || (pointstyle.id == "p11") || (pointstyle.id == "p12") || (pointstyle.id == "p13") || (pointstyle.id == "p14") || (pointstyle.id == "p15")) {

        pointPic = pointstyle.src;
        console.log(pointPic);
        var pointPicture = document.getElementById("pointpic");
        var childs = pointPicture.childNodes;
        var count = 0;
        while (childs.length > 0) {
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].id != undefined) {
                    //childs[i].style.border = "";
                    childs[i].style.background = "";
                }
            }
            count++;
            if (count > 500) {
                break;
            }
        }

        //pointstyle.style.border = "1px solid #DA2527";
        pointstyle.style.background = "#004689";
    }
}

//获取线标注样式
function getLineStyle(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var linestyle = document.elementFromPoint(e.clientX, e.clientY);
    if ((linestyle.id == "l1") || (linestyle.id == "l2") || (linestyle.id == "l3") || (linestyle.id == "l4")) {
        document.getElementById("l0").src = linestyle.src;
    }
}
//添加线标注
function addLineLabel() {

    isPoint = false;
    isLength = false;
    isHeight = false;
    isAraa = false;
    isAzimuth = false;
    isPointLabel = false;
    isPolylineLabel = true;
    isPolygonLabel = false;

    linepoints = [];
    linepointcount = 0;

    if (isPolylineLabel) {
        if (handler != undefined) {
            handler.destroy();
        }
        handler = new Cesium.ScreenSpaceEventHandler(canvas);

        //左击
        handler.setInputAction(function (leftclik) {
            var pickedOject = scene.pick(leftclik.position);
            if (pickedOject != undefined) {
                var position = scene.pickPosition(leftclik.position);
                if (position != undefined) {
                    if (Cesium.defined(position)) {
                        linepoints.push(position);
                        linepointcount++;

                        viewer.entities.add({
                            name: "linepoint" + linepointcount,
                            position: position,
                            point: {
                                pixelSize: 1,
                                color: Cesium.Color.YELLOW
                            }
                        });

                        var line0 = document.getElementById('l0').src;
                        var material = Cesium.Color.fromCssColorString(document.getElementById("linecolor").value);
                        if ((line0.indexOf("l2.png") > -1) || (line0.indexOf("l4.png") > -1)) {
                            material = new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.fromCssColorString(document.getElementById("linecolor").value) });
                        }

                        if (linepoints.length > 1) {
                            var point = linepoints[linepoints.length - 2];
                            if (isModelLine) {
                                //绘制贴模型线
                                //polylineOnModel("linesegment" + linepointcount, [point, position], 0.5, document.getElementById("linewidth").value, material);

                                viewer.entities.add({
                                    name: "linesegment" + linepointcount,
                                    polyline: {
                                        positions: [point, position],
                                        width: document.getElementById("linewidth").value,
                                        arcType: Cesium.ArcType.RHUMB,
                                        material: material,
                                        show: true,
                                        clampToGround: true,
                                        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                                    }
                                });
                            }
                            else {
                                material
                                viewer.entities.add({
                                    name: "linesegment" + linepointcount,
                                    polyline: {
                                        positions: [point, position],
                                        width: document.getElementById("linewidth").value,
                                        material: material
                                    }
                                });
                            }
                        }
                    }

                }
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        if (isMobile.any()) {
            //双指
            handler.setInputAction(function (pinch) {
                if (linepoints.length > 1) {
                    var line = [];
                    for (var i = 0; i < linepoints.length; i++) {
                        line.push(linepoints[i]);
                    }

                    polylineId++;

                    var line0 = document.getElementById('l0').src;
                    var material = Cesium.Color.fromCssColorString(document.getElementById("linecolor").value);
                    if (line0.indexOf("l2.png") > -1) {
                        material = new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.fromCssColorString(document.getElementById("linecolor").value) });
                    }
                    else if (line0.indexOf("l3.png") > -1) {
                        material = new Cesium.PolylineArrowMaterialProperty(Cesium.Color.fromCssColorString(document.getElementById("linecolor").value));
                    }
                    else { }

                    if (isModelLine) {
                        //绘制贴模型线
                        viewer.entities.add({
                            name: "polyline" + polylineId,
                            polyline: {
                                positions: line,
                                width: document.getElementById("linewidth").value,
                                arcType: Cesium.ArcType.RHUMB,
                                material: material,
                                show: true,
                                clampToGround: true,
                                classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                            }
                        });
                    }
                    else {

                        viewer.entities.add({
                            name: "polyline" + polylineId,
                            polyline: {
                                positions: line,
                                width: document.getElementById("linewidth").value,
                                material: material
                            }
                        });
                    }

                    viewer.entities.add({
                        name: "polylinelabel" + polylineId,
                        position: linepoints[linepoints.length - 1],
                        label: {
                            text: "polylinelabel" + polylineId,
                            font: '20px Times New Roman',
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                            pixelOffset: new Cesium.Cartesian2(0.0, -32),
                        }
                    });

                    var count = 0;
                    while (count < 100) {
                        for (var i = 0; i < viewer.entities._entities._array.length; i++) {
                            if ((viewer.entities._entities._array[i]._name.indexOf("linepoint") > -1) || (viewer.entities._entities._array[i]._name.indexOf("linesegment") > -1)) {
                                viewer.entities.remove(viewer.entities._entities._array[i]);
                            }
                        }

                        count++
                    }

                    var lineLabels = document.getElementById("lineLabel");
                    var lI = '<img id="li' + polylineId + '" src="' + document.getElementById("l0").src + '" width="24" height="24" style="vertical-align: middle" />';
                    var lT = '<input id="lt' + polylineId + '" value="' + 'polylinelabel' + polylineId + '" type="text" style="background-color: rgba(255,255,255,0);border:0px;width: 150px;vertical-align: middle;text-overflow:ellipsis" />';
                    var lR = '<img id="lr' + polylineId + '" src="image/survey/remove.png" width="20" height="20" style="vertical-align: middle" />'
                    var lBr = '<br id="lbr' + polylineId + '" />';
                    lineLabels.innerHTML += lI + lT + lR + lBr;
                    lineLabels.className = "divborder";

                    linepoints = [];
                    linepointcount = 0;

                    //针对移动设备
                    if (isMobile.any()) {
                        if (handler != undefined) {
                            handler.destroy();
                        }
                    }
                }
                else {

                }

            }, Cesium.ScreenSpaceEventType.PINCH_START);
        }
        else {
            //右击
            handler.setInputAction(function (rightclik) {
                if (linepoints.length > 1) {
                    var line = [];
                    for (var i = 0; i < linepoints.length; i++) {
                        line.push(linepoints[i]);
                    }

                    polylineId++;

                    var line0 = document.getElementById('l0').src;
                    var material = Cesium.Color.fromCssColorString(document.getElementById("linecolor").value);
                    if (line0.indexOf("l2.png") > -1) {
                        material = new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.fromCssColorString(document.getElementById("linecolor").value) });
                    }
                    else if (line0.indexOf("l3.png") > -1) {
                        material = new Cesium.PolylineArrowMaterialProperty(Cesium.Color.fromCssColorString(document.getElementById("linecolor").value));
                    }
                    else { }

                    if (isModelLine) {
                        //绘制贴模型线
                        //polylineOnModel("polyline" + polylineId, line, 0.5, document.getElementById("linewidth").value, material);

                        viewer.entities.add({
                            name: "polyline" + polylineId,
                            polyline: {
                                positions: line,
                                width: document.getElementById("linewidth").value,
                                arcType: Cesium.ArcType.RHUMB,
                                material: material,
                                show: true,
                                clampToGround: true,
                                classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                            }
                        });
                    }
                    else {
                        viewer.entities.add({
                            name: "polyline" + polylineId,
                            polyline: {
                                positions: line,
                                width: document.getElementById("linewidth").value,
                                material: material
                            }
                        });
                    }

                    viewer.entities.add({
                        name: "polylinelabel" + polylineId,
                        position: linepoints[linepoints.length - 1],
                        label: {
                            text: "polylinelabel" + polylineId,
                            font: '24px Times New Roman',
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                            pixelOffset: new Cesium.Cartesian2(0.0, -60),
                        }
                    });

                    var count = 0;
                    while (count < 100) {
                        for (var i = 0; i < viewer.entities._entities._array.length; i++) {
                            if ((viewer.entities._entities._array[i]._name.indexOf("linepoint") > -1) || (viewer.entities._entities._array[i]._name.indexOf("linesegment") > -1)) {
                                viewer.entities.remove(viewer.entities._entities._array[i]);
                            }
                        }

                        count++
                    }

                    var lineLabels = document.getElementById("lineLabel");
                    var lI = '<img id="li' + polylineId + '" src="' + document.getElementById("l0").src + '" width="24" height="24" style="vertical-align: middle" />';
                    var lT = '<input id="lt' + polylineId + '" value="' + 'polylinelabel' + polylineId + '" type="text" style="background-color: rgba(255,255,255,0);border:0px;width: 150px;vertical-align: middle;text-overflow:ellipsis" />';
                    var lR = '<img id="lr' + polylineId + '" src="image/survey/remove.png" width="20" height="20" style="vertical-align: middle" />'
                    var lBr = '<br id="lbr' + polylineId + '" />';
                    lineLabels.innerHTML += lI + lT + lR + lBr;
                    lineLabels.className = "divborder";

                    linepoints = [];
                    linepointcount = 0;
                }
                else {

                }

            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        }

        //中键
        handler.setInputAction(function (middleclik) {
            if (handler != undefined) {
                handler.destroy();
            }

        }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
    }

}
//删除线标注
function deleteLineLabel(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var lineLabel = document.elementFromPoint(e.clientX, e.clientY);
    var curID = lineLabel.id.toString();
    if (curID.indexOf("lr") > -1) {
        var lineL = document.getElementById("lineLabel");
        var childs = lineL.childNodes;

        var count = 0;

        while (count < 10) {
            for (var i = 0; i < childs.length; i++) {
                if ((childs[i].id == curID) || (childs[i].id == curID.replace("lr", "li")) || (childs[i].id == curID.replace("lr", "lt")) || (childs[i].id == curID.replace("lr", "lbr"))) {
                    lineL.removeChild(childs[i]);
                }
            }

            count++;
        }

        count = 0;
        while (count < 50) {
            for (var i = 0; i < viewer.entities._entities._array.length; i++) {
                if ((viewer.entities._entities._array[i]._name == "polyline" + curID.replace("lr", "")) || (viewer.entities._entities._array[i]._name == "polylinelabel" + curID.replace("lr", ""))) {
                    viewer.entities.remove(viewer.entities._entities._array[i]);
                }
            }
            count++
        }

    }
    else if (curID.indexOf("lt") > -1) {
        lineId = curID.replace("lt", "");

        if (lineId != "0") {
            for (var i = 0; i < viewer.entities._entities._array.length; i++) {
                if (viewer.entities._entities._array[i]._name.indexOf("polyline" + lineId) > -1) {
                    viewer.zoomTo(viewer.entities._entities._array[i]);
                }
            }
        }

    }
    else { }

    if (document.getElementById("lineLabel").innerHTML == "") {
        document.getElementById("lineLabel").className = "";

    }

}
//修改线标注
function modiftyLineLabel(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        if (lineId != "0") {
            for (var i = 0; i < viewer.entities._entities._array.length; i++) {
                if (viewer.entities._entities._array[i]._name.indexOf("polylinelabel" + lineId) > -1) {
                    var oldvalue = viewer.entities._entities._array[i]._label._text._value;
                    viewer.entities._entities._array[i]._label._text._value = document.getElementById("lt" + lineId).value;
                    document.getElementById("lineLabel").innerHTML = document.getElementById("lineLabel").innerHTML.replace(oldvalue, document.getElementById("lt" + lineId).value);
                }
            }
        }
    }
}
//删除全部线标注
function deleteAllLineLabel() {
    var polylineL = document.getElementById("lineLabel");
    var childs = polylineL.childNodes;
    var count = 0;
    while (childs.length > 0) {
        for (var i = 0; i < childs.length; i++) {
            polylineL.removeChild(childs[i]);
        }
        count++;
        if (count > 50) {
            break;
        }
    }

    count = 0;
    while (count < 50) {
        for (var i = 0; i < viewer.entities._entities._array.length; i++) {
            if ((viewer.entities._entities._array[i]._name.indexOf("polyline") > -1) || (viewer.entities._entities._array[i]._name.indexOf("polylineLabel") > -1)) {
                viewer.entities.remove(viewer.entities._entities._array[i]);
            }
        }
        count++
    }

    polylineId = 0;
    document.getElementById("lineLabel").className = "";
}

//添加侧窗
function addAreaLabel() {
    if (currentprojectid == null) {
        layer.msg('请先选择项目');
        return;
    }
    if (modleInfoList.length == 0) {
        layer.msg('请先选择模型');
        return;
    }
    ClearTemp();
    isPoint = false;
    isLength = false;
    isHeight = false;
    isAraa = false;
    isAzimuth = false;
    isPointLabel = false;
    isPolylineLabel = false;
    isPolygonLabel = true;

    areapoints = [];
    areapointcount = 0;
    linepoints = [];
    points = [];
    eyespoints = [];
    if (isPolygonLabel) {
        if (handler != undefined) {
            handler.destroy();
        }
        var sideLength = 1.8;
        //var sideLength = document.getElementById("side_length").value;
        //console.log(sideLength.length == 0);
        //if (sideLength.length == 0 || sideLength > 15 || sideLength < 5) {
        //    layer.msg('请输入正确的边长 5-15');
        //    return;
        //}

        handler = new Cesium.ScreenSpaceEventHandler(canvas);

        //左击
        handler.setInputAction(function (leftclik) {

            var pickedOject = scene.pick(leftclik.position);
            if (pickedOject != undefined) {
                var position = scene.pickPosition(leftclik.position);
                if (position != undefined) {


                    var tempx = new Cesium.Cartesian2(leftclik.position.x + 1, leftclik.position.y)
                    var tempy = new Cesium.Cartesian2(leftclik.position.x, leftclik.position.y)
                    var bilici = Cesium.Cartesian3.distance(scene.pickPosition(tempy), scene.pickPosition(tempx));

                    var canshu = sideLength / bilici;

                    var tempb = new Cesium.Cartesian2(leftclik.position.x + canshu, leftclik.position.y);//b点，加了5.
                    var tempc = new Cesium.Cartesian2(leftclik.position.x + canshu, leftclik.position.y + canshu);//c点两边都
                    var tempd = new Cesium.Cartesian2(leftclik.position.x, leftclik.position.y + canshu);//屏幕参数

                    trem = [];
                    trem.push(scene.pickPosition(tempy));
                    trem.push(scene.pickPosition(tempb));
                    trem.push(scene.pickPosition(tempc));
                    trem.push(scene.pickPosition(tempd));
                    var cartesian3a = new Cesium.Cartesian3(trem[0].x, trem[0].y, trem[0].z);
                    var cartesian3b = new Cesium.Cartesian3(trem[3].x, trem[3].y, trem[3].z);
                    var eyepostion = new Cesium.Cartesian3(viewer.camera.position.x, viewer.camera.position.y, viewer.camera.position.z);

                    var tremlist = [];
                    tremlist.push(eyepostion);
                    tremlist.push(eyepostion);
                    tremlist.push(eyepostion);
                    tremlist.push(eyepostion);
                    //视野点四下
                
                    linepoints = trem;
                    // 眼睛点
                    eyespoints = tremlist;
                    points = trem;

                    var distancev = Cesium.Cartesian3.distance(cartesian3a, cartesian3b);
                    if (distancev > sideLength * 2) {
                        layer.msg('选择的点形成的测区超过了模型范围，请重新选择！');
                        return;
                    }
                    if (Cesium.defined(position)) {

                        DrowHuaHua('newwindow', points, 'guding');

                    }

                }

            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


        //中键
        handler.setInputAction(function (middleclik) {
            if (handler != undefined) {
                handler.destroy();
            }

        }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
    }
}
//删除面标注
function deleteAreaLabel(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var areaLabel = document.elementFromPoint(e.clientX, e.clientY);
    var curID = areaLabel.id.toString();
    if (curID.indexOf("ar") > -1) {
        var areaL = document.getElementById("areaLabel");
        var childs = areaL.childNodes;

        var count = 0;

        while (count < 10) {
            for (var i = 0; i < childs.length; i++) {
                if ((childs[i].id == curID) || (childs[i].id == curID.replace("ar", "aa")) || (childs[i].id == curID.replace("ar", "at")) || (childs[i].id == curID.replace("ar", "abr"))) {
                    areaL.removeChild(childs[i]);
                }
            }

            count++;
        }

        count = 0;
        while (count < 50) {
            for (var i = 0; i < viewer.entities._entities._array.length; i++) {
                if ((viewer.entities._entities._array[i]._name == "polygon" + curID.replace("ar", "")) || (viewer.entities._entities._array[i]._name == "polygonlabel" + curID.replace("ar", ""))) {
                    viewer.entities.remove(viewer.entities._entities._array[i]);
                }
            }
            count++
        }

    }
    else if (curID.indexOf("at") > -1) {
        areaId = curID.replace("at", "");

        if (areaId != "0") {
            for (var i = 0; i < viewer.entities._entities._array.length; i++) {
                if (viewer.entities._entities._array[i]._name.indexOf("polygonlabel" + areaId) > -1) {
                    viewer.zoomTo(viewer.entities._entities._array[i]);
                }
            }
        }

    }
    else { }

    if (document.getElementById("areaLabel").innerHTML == "") {
        document.getElementById("areaLabel").className = "";
    }
}
//修改面标注
function modiftyAreaLabel(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) {
        if (areaId != "0") {
            for (var i = 0; i < viewer.entities._entities._array.length; i++) {
                if (viewer.entities._entities._array[i]._name.indexOf("polygonlabel" + areaId) > -1) {
                    var oldvalue = viewer.entities._entities._array[i]._label._text._value;
                    viewer.entities._entities._array[i]._label._text._value = document.getElementById("at" + areaId).value;
                    document.getElementById("areaLabel").innerHTML = document.getElementById("areaLabel").innerHTML.replace(oldvalue, document.getElementById("at" + areaId).value);
                }
            }
        }
    }
}

//删除全部面标注
function deleteAllAreaLabel() {
    var polygonL = document.getElementById("areaLabel");
    var childs = polygonL.childNodes;
    var count = 0;
    while (childs.length > 0) {
        for (var i = 0; i < childs.length; i++) {
            polygonL.removeChild(childs[i]);
        }
        count++;
        if (count > 50) {
            break;
        }
    }

    count = 0;
    while (count < 50) {
        for (var i = 0; i < viewer.entities._entities._array.length; i++) {
            if (viewer.entities._entities._array[i]._name.indexOf("polygon") > -1) {
                viewer.entities.remove(viewer.entities._entities._array[i]);
            }
        }

        count++
    }

    polygonId = 0;
    document.getElementById("areaLabel").className = "";
}



//画点弹出框
function DrowHuaHua(flag, cartesian3, position) {

    if (flag == "point") {
            //
        console.log(modleInfo);
            console.log(pointColor);
            var strtempList = pointPic.split('Resources');
            var pointPicSrc = 'Resources' + strtempList[1];
            var data = {};
            data.cookie = document.cookie;
            data.position = JSON.stringify(position);
            data.projectId = currentprojectid;
            data.type = "1";
            data.modleId = modleInfo.id.split('_')[1];
            data.modleTime = modleInfo.title.substring(0,10);
            data.colour = pointColor;
            data.src = pointPicSrc;
            data.remarks = "点标注";
        console.log(data);
           var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });
            
            $.ajax({
                url: servicesurl + "/api/RockData/AddRockPoint", type: "post", data: data,
                success: function (result) {

                    layer.close(loadingceindex);
                    //创建失败
                    if (isNaN(result)) {//true ,失败，成功返回id
                        layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                    } else {
                        
                        //关闭
                        layer.msg("保存成功", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                        ClearTemp();
                        var modleFlag = false;
                        if (biaoLayers.length == 0) {

                            //var rockpointlayer = new Object;
                            //rockpointlayer.title = "点数据";
                            //rockpointlayer.type = "ROCKPOINT";
                            //rockpointlayer.checked = true;
                            //rockpointlayer.spread = true;
                            //rockpointlayer.showCheckbox = true;//显示复选框
                            //var rockpointlayerchild = [];

                            //var rockpoint = new Object;
                            //rockpoint.title = result;
                            //rockpoint.id = "ROCKPOINT_" + result;
                            //rockpoint.type = "ROCKPOINT";
                            //rockpoint.remarks = "点标注";
                            //rockpoint.src = "../../" + pointPicSrc;
                            //rockpoint.colour = pointColor;
                            //rockpoint.postion = position;
                            //rockpoint.checked = true;
                            //rockpoint.spread = true;
                            //rockpoint.showCheckbox = true;//显示复选框

                            //rockpoint.datas = data;
                            //rockpointlayerchild.push(rockpoint);


                            //rockpointlayer.children = rockpointlayerchild;
                            //biaoLayers.push(rockpointlayer);
                           // tree.reload('prjbiaoZhuListid', { data: biaoLayers });
                            LoadBiaozhunListLayer();
                            elem.tabChange('biaozhuguanli', 4); //跳转地址图层列表
                            
                        } else {
                            var xiabiao1 = 0;
                            for (var m in biaoLayers) {
                                if (biaoLayers[m].type == "ROCKPOINT") {
                                    modleFlag = true;
                                    xiabiao1 = m;
                                }
                            }
                            if (modleFlag) {
                                var rockpoint = new Object;
                                rockpoint.title = result;
                                rockpoint.id = "ROCKPOINT_" + result;
                                rockpoint.type = "ROCKPOINT";
                                rockpoint.remarks = "点标注";
                                rockpoint.src = "../../" + pointPicSrc;
                                rockpoint.colour = pointColor;
                                rockpoint.postion = position;
                                
                                rockpoint.checked = true;
                                rockpoint.spread = true;
                                rockpoint.showCheckbox = true;//显示复选框

                                rockpoint.datas = data;
                                biaoLayers[xiabiao1].checked = true;
                                biaoLayers[xiabiao1].spread = true;
                                biaoLayers[xiabiao1].children.push(rockpoint);
                                
                            } else {//没有，就是新增
                                var rockpointlayer = new Object;
                                rockpointlayer.title = "点数据";
                                rockpointlayer.type = "ROCKPOINT";
                                rockpointlayer.checked = true;
                                rockpointlayer.spread = true;
                                rockpointlayer.showCheckbox = true;//显示复选框
                                var rockpointlayerchild = [];

                                var rockpoint = new Object;
                                rockpoint.title = result;
                                rockpoint.id = "ROCKPOINT_" + result;
                                rockpoint.type = "ROCKPOINT";
                                rockpoint.remarks = "点标注";
                                rockpoint.src = "../../" + pointPicSrc;
                                rockpoint.colour = pointColor;
                                rockpoint.postion = position;
                                rockpoint.checked = true;
                                rockpoint.spread = true;
                                rockpoint.showCheckbox = true;//显示复选框

                                rockpoint.datas = data;
                                rockpointlayerchild.push(rockpoint);


                                rockpointlayer.children = rockpointlayerchild;
                                biaoLayers.push(rockpointlayer);

                            }
                            console.log(biaoLayers);
                            tree.reload('prjbiaoZhuListid', { data: biaoLayers });
                            elem.tabChange('biaozhuguanli', 4); //跳转地址图层列表
                        } 
                        
                        
                    }

                }, datatype: "json"
            });

    } else if (flag == "line") {
        if (drowinfoAddlayerindex == null) {
            //
            drowinfoAddlayerindex = layer.open({
                type: 1
                , title: ['线元素新增', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: addLinebiaozhuhtml
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();

                    form.on('submit(addpointinfosubmit)', function (data) {
                        var positList = position;
                      
                        var loadingminindex = layer.load(0, { shade: 0.3, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });
                        
                  
                        
                        data.field.cookie = document.cookie;
                        data.field.position = JSON.stringify(position);
                        data.field.projectId = currentprojectid;
                        data.field.type = "2";
                        data.field.modleId = modleInfo.id.split('_')[1];
                        data.field.modleTime = modleInfo.title.substring(0, 10);
                        data.field.colour = pointColor;
                        console.log(data);


                        $.ajax({
                            url: servicesurl + "/api/RockData/AddRockPoint", type: "post", data: data.field,
                            success: function (result) {
                                layer.close(loadingminindex);

                                if (isNaN(result)) {
                                    layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                } else {
                                    //关闭
                                    layer.msg("保存成功", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                    ClearTemp();
                                    layer.close(drowinfoAddlayerindex);


                                    var xSum = 0;//求一个平均点，用于定位
                                    var ySum = 0;
                                    var zSum = 0;
                                    for (var m = 0; m < positList.length; m++) {
                                        xSum = xSum + parseFloat(positList[m].x);
                                        ySum = ySum + parseFloat(positList[m].y);
                                        zSum = zSum + parseFloat(positList[m].z);
                                    }
                                    

                                    var modleFlag = false;
                                    if (biaoLayers.length == 0) {

                                        //var rocklinelayer = new Object;
                                        //rocklinelayer.title = "线数据";
                                        //rocklinelayer.type = "ROCKLINE";
                                        //rocklinelayer.checked = true;
                                        //rocklinelayer.spread = true;
                                        //rocklinelayer.showCheckbox = true;//显示复选框
                                        //var rocklinelayerchild = [];

                                        //var rockline = new Object;
                                        //rockline.title = data.field.name;
                                        //rockline.id = "ROCKLINE_" + result;
                                        //rockline.type = "ROCKLINE";
                                        //rockline.remarks = data.field.remarks;
                                        //rockline.lineSize = data.field.lineSize;
                                        //rockline.colour = pointColor;
                                        //rockline.postion = position;
                                        //rockline.Centerx = xSum / positList.length;
                                        //rockline.Centery = ySum / positList.length;
                                        //rockline.Centerz = zSum / positList.length;
                                        //rockline.pointList = positList;
                                        //rockline.checked = true;
                                        //rockline.spread = true;
                                        //rockline.showCheckbox = true;//显示复选框

                                        //rockline.datas = data;
                                        //rocklinelayerchild.push(rockline);


                                        //rocklinelayer.children = rocklinelayerchild;
                                        //biaoLayers.push(rocklinelayer);

                                        LoadBiaozhunListLayer();
                                        elem.tabChange('biaozhuguanli', 4); //跳转地址图层列表
                                    } else {
                                        var xiabiao1 = 0;
                                        for (var m in biaoLayers) {
                                            if (biaoLayers[m].type == "ROCKLINE") {
                                                modleFlag = true;
                                                xiabiao1 = m;
                                            }
                                        }
                                        if (modleFlag) {
                                            var rockline = new Object;
                                            rockline.title = data.field.name;
                                            rockline.id = "ROCKLINE_" + result;
                                            rockline.type = "ROCKLINE";
                                            rockline.remarks = data.field.remarks;
                                            rockline.lineSize = data.field.lineSize;
                                            rockline.colour = pointColor;
                                            rockline.postion = position;
                                            rockline.Centerx = xSum / positList.length;
                                            rockline.Centery = ySum / positList.length;
                                            rockline.Centerz = zSum / positList.length;

                                            rockline.pointList = positList;
                                            rockline.checked = true;
                                            rockline.spread = true;
                                            rockline.showCheckbox = true;//显示复选框

                                            rockline.datas = data;
                                            biaoLayers[xiabiao1].checked = true;
                                            biaoLayers[xiabiao1].spread = true;
                                            biaoLayers[xiabiao1].children.push(rockline);

                                        } else {//没有，就是新增
                                            var rocklinelayer = new Object;
                                            rocklinelayer.title = "线数据";
                                            rocklinelayer.type = "ROCKLINE";
                                            rocklinelayer.checked = true;
                                            rocklinelayer.spread = true;
                                            rocklinelayer.showCheckbox = true;//显示复选框
                                            var rocklinelayerchild = [];

                                            var rockline = new Object;
                                            rockline.title = data.field.name;
                                            rockline.id = "ROCKLINE_" + result;
                                            rockline.type = "ROCKLINE";
                                            rockline.remarks = data.field.remarks;
                                            rockline.lineSize = data.field.lineSize;
                                            rockline.colour = pointColor;
                                            rockline.postion = position;
                                            rockline.pointList = positList;
                                            rockline.Centerx = xSum / positList.length;
                                            rockline.Centery = ySum / positList.length;
                                            rockline.Centerz = zSum / positList.length;
                                            rockline.checked = true;
                                            rockline.spread = true;
                                            rockline.showCheckbox = true;//显示复选框

                                            rockline.datas = data.field;
                                            rocklinelayerchild.push(rockline);


                                            rocklinelayer.children = rocklinelayerchild;
                                            biaoLayers.push(rocklinelayer);

                                        }
                                        console.log(biaoLayers);
                                        tree.reload('prjbiaoZhuListid', { data: biaoLayers });
                                        elem.tabChange('biaozhuguanli', 4); //跳转地址图层列表
                                    }
                                    
                                    isRedo = true;
                                    points = [];
                                    linepoints = [];
                                }


                            }, datatype: "json"
                        });
                        return false;
                    });

                }
                , end: function () {
                    drowinfoAddlayerindex = null;
                }, cancel: function () {//取消按钮

                    //取消画的图和点
                    if (handler != undefined) {
                        handler.destroy();
                    }
                    isRedo = true;
                    points = [];
                    linepoints = [];
                }
            });
        }

    } else if (flag == "window") {//测区.老测区
        if (drowinfoAddlayerindex == null) {
            //
            drowinfoAddlayerindex = layer.open({
                type: 1
                , title: ['测区新增', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: '<form class="layui-form" style="margin-top:5px;margin-right:25px;" lay-filter="addpointinfoform"><div class="layui-form-item" style="margin-top:15px;margin-right:5px;"><div class="layui-row"><div class="layui-col-md6"><div class="grid-demo grid-demo-bg1"><label class="layui-form-label">测区名称</label><div class="layui-input-block"><input type="text" name="name" lay-verify="required" autocomplete="off" placeholder="请输入" class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">描述</label><div class="layui-input-block"><input type="text" name="remarks" lay-verify="required" autocomplete="off" placeholder="请输入"  class="layui-input" style="width:160px;"  /></div></div></div></div></div><div class="layui-form-item" style="margin-top:15px"><div style="position:absolute;right:15px;"><button type="reset" class="layui-btn layui-btn-primary" style="width:100px">重置</button><button type="submit" class="layui-btn" lay-submit="" lay-filter="addpointinfosubmit" style="width:100px">提交</button></div></div></form>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();

                    form.on('submit(addpointinfosubmit)', function (data) {
                        var positList = position;
                        //var temp = ""

                        //for (var i = 0; i < positList.length; i++) {

                        //    var temps = Cesium.Cartographic.fromCartesian(positList[i])
                        //    var longitude = Cesium.Math.toDegrees(temps.longitude);                         //经度
                        //    var latitude = Cesium.Math.toDegrees(temps.latitude);                           //纬度
                        //    var height = temps.height;
                        //    //高度
                        //    if (i == positList.length - 1) {
                        //        temp = temp + longitude + "@" + latitude + "@" + height;
                        //    } else {
                        //        temp = temp + longitude + "@" + latitude + "@" + height + "&";//点与点用&隔开，经纬度用@分割
                        //    }
                        //}
                        // var mianji=jisumianji(positList);
                        // console.log(mianji);
                        // return false;
                        data.field.cookie = document.cookie;
                        data.field.points = JSON.stringify(positList);//直接存吧
                        data.field.projectId = currentprojectid;
                        data.field.creatTime = y + '-' + (mouth < 10 ? '0' + mouth : mouth) + '-' + (d < 10 ? '0' + d : d);
                        data.field.sideLength = cartesian3;//边长

                        $.ajax({
                            url: servicesurl + "/api/FlzWindowInfo/AddFlzWindow", type: "post", data: data.field,
                            success: function (result) {


                                if (isNaN(result)) {
                                    layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                } else {
                                    //关闭
                                    layer.close(drowinfoAddlayerindex);
                                    //更改layer
                                    var flzWindowLayer = new Object;

                                    var xSum = 0;//求一个平均点，用于定位
                                    var ySum = 0;
                                    var zSum = 0;
                                    for (var m = 0; m < positList.length; m++) {
                                        xSum = xSum + parseFloat(positList[m].x);
                                        ySum = ySum + parseFloat(positList[m].y);
                                        zSum = zSum + parseFloat(positList[m].z);
                                    }
                                    flzWindowLayer.Centerx = xSum / positList.length;
                                    flzWindowLayer.Centery = ySum / positList.length;
                                    flzWindowLayer.Centerz = zSum / positList.length;

                                    flzWindowLayer.title = data.field.name;
                                    flzWindowLayer.type = "FLZWINDOW";
                                    flzWindowLayer.id = "FLZWINDOW_" + result;
                                    flzWindowLayer.datas = data.field;
                                    flzWindowLayer.pointList = positList;
                                    flzWindowLayer.checked = true;
                                    flzWindowLayer.showCheckbox = true;//显示复选框
                                    flzWindowLayer.children = [];
                                    layers[0].children.push(flzWindowLayer);
                                    layers[0].spread = true;
                                    console.log(layers);

                                    data.field.id = result;
                                    windowInfoList.push(data.field);
                                    console.log(windowInfoList);
                                    tree.reload('prjlayerlistid', { data: layers });

                                    if (handler != undefined) {
                                        handler.destroy();
                                    }

                                    isRedo = true;
                                    points = [];
                                    linepoints = [];
                                }

                            }, datatype: "json"
                        });
                        return false;
                    });

                }
                , end: function () {
                    drowinfoAddlayerindex = null;
                }, cancel: function () {//取消按钮

                    //取消画的图和点
                    if (handler != undefined) {
                        handler.destroy();
                    }
                    isRedo = true;
                    points = [];
                    linepoints = [];
                }
            });
        }

    } else if (flag == "newwindow") {//新测区
        if (drowinfoAddlayerindex == null) {
            //
            drowinfoAddlayerindex = layer.open({
                type: 1
                , title: ['测区新增', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: '<form class="layui-form" style="margin-top:5px;margin-right:25px;" lay-filter="addpointinfoform"><div class="layui-form-item" style="margin-top:15px;margin-right:5px;"><div class="layui-row"><div class="layui-col-md6"><div class="grid-demo grid-demo-bg1"><label class="layui-form-label">测区名称</label><div class="layui-input-block"><input type="text" name="name" lay-verify="required" autocomplete="off" placeholder="请输入" class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">描述</label><div class="layui-input-block"><input type="text" name="remarks" lay-verify="required" autocomplete="off" placeholder="请输入"  class="layui-input" style="width:160px;"  /></div></div></div></div></div><div class="layui-form-item" style="margin-top:15px"><div style="position:absolute;right:15px;"><button type="reset" class="layui-btn layui-btn-primary" style="width:100px">重置</button><button type="submit" class="layui-btn" lay-submit="" lay-filter="addpointinfosubmit" style="width:100px">提交</button></div></div></form>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();

                    form.on('submit(addpointinfosubmit)', function (data) {
                        //先调用方法计算
                      
                        var maxX = viewer.scene.cartesianToCanvasCoordinates(points[0]).x;
                        var minX = viewer.scene.cartesianToCanvasCoordinates(points[0]).x;
                        var maxY = viewer.scene.cartesianToCanvasCoordinates(points[0]).y;
                        var minY = viewer.scene.cartesianToCanvasCoordinates(points[0]).y;
                        for (var i in points) {
                            if (viewer.scene.cartesianToCanvasCoordinates(points[i]).x > maxX) {
                                maxX = viewer.scene.cartesianToCanvasCoordinates(points[i]).x;
                            }
                            if (viewer.scene.cartesianToCanvasCoordinates(points[i]).x < minX) {
                                minX = viewer.scene.cartesianToCanvasCoordinates(points[i]).x;
                            }
                            if (viewer.scene.cartesianToCanvasCoordinates(points[i]).y > maxY) {
                                maxY = viewer.scene.cartesianToCanvasCoordinates(points[i]).y;
                            }
                            if (viewer.scene.cartesianToCanvasCoordinates(points[i]).y < minY) {
                                minY = viewer.scene.cartesianToCanvasCoordinates(points[i]).y;
                            }
                        }
                        // 最大100个点
                        var xxishu = (maxX - minX) / 10;
                        var yxishu = (maxY - minY) / 10;
                        var jimiList = [];
                        for (var x = 0; x < 11; x++) {
                            for (var m = 0; m < 11; m++) {

                                var temp = new Cesium.Cartesian2(minX + xxishu * x, minY + yxishu * m);//b点，加了5.

                                jimiList.push(scene.pickPosition(temp));
                            }
                        }
                        console.log(jimiList);
                        var sendDate = {};


                        sendDate.bpsList = JSON.stringify(linepoints);
                        sendDate.eyesList = JSON.stringify(eyespoints);
                        sendDate.spsList = JSON.stringify(jimiList);
                        sendDate.cookie = document.cookie;
                        console.log(sendDate);
                        var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });

                        $.ajax({
                            url: servicesurl + "/api/FlzWindowInfo/getWindowInfo", type: "post", data: sendDate,//后台发送请求
                            success: function (result) {


                                layer.close(loadingceindex);
                                //关闭
                                var windowInfos = JSON.parse(result);
                                console.log(windowInfos);
                                if (windowInfos == null) {
                                    layer.close(drowinfoAddlayerindex);
                                    layer.msg("调用接口计算失败，请重新选择位置，所选的点不能形成平面", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                    ClearTemp();
                                    tree.reload('prjlayerlistid', { data: layers });

                                    if (handler != undefined) {
                                        handler.destroy();
                                    }

                                    isRedo = true;
                                    points = [];
                                    linepoints = [];
                                    return false;
                                }
                                if (windowInfos=="") {
                                    layer.msg("调用接口结算失败，请稍后再试", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                    //出来画图，显示测春哥
                                    

                                    var flzWindowLayer = new Object;

                                    var xSum = 0;//求一个平均点，用于定位
                                    var ySum = 0;
                                    var zSum = 0;
                                    for (var m = 0; m < positList.length; m++) {
                                        xSum = xSum + parseFloat(positList[m].x);
                                        ySum = ySum + parseFloat(positList[m].y);
                                        zSum = zSum + parseFloat(positList[m].z);
                                    }
                                    flzWindowLayer.Centerx = xSum / positList.length;
                                    flzWindowLayer.Centery = ySum / positList.length;
                                    flzWindowLayer.Centerz = zSum / positList.length;

                                    flzWindowLayer.title = "测窗";
                                    flzWindowLayer.type = "FLZWINDOW";
                                    flzWindowLayer.id = "FLZWINDOW_" + "1";
                                    // flzWindowLayer.datas = data.field;
                                    flzWindowLayer.pointList = positList;
                                    flzWindowLayer.checked = true;
                                    flzWindowLayer.showCheckbox = true;//显示复选框
                                    flzWindowLayer.children = [];
                                    layers[0].children.push(flzWindowLayer);
                                    layers[0].spread = true;
                                    console.log(layers);

                                    //  data.field.id = result;
                                    //  windowInfoList.push(data.field);
                                    console.log(windowInfoList);
                                    tree.reload('prjlayerlistid', { data: layers });

                                    if (handler != undefined) {
                                        handler.destroy();
                                    }

                                    isRedo = true;
                                    points = [];
                                    linepoints = [];


                                    // viewer.Scene.sampleHeight();

                                } else {
                                    if (position == 'guding') {
                                        if (windowInfos.L1-2 > 0.1 || windowInfos.L2-2 > 0.1) {
                                            layer.msg("请旋转模型到最佳位置", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                            return false;
                                        } else {
                                            data.field.sideLength = 2;//边长1
                                            data.field.sidebLength = 2;//边长2  AxisX
                                        }
                                    } else {
                                        data.field.sideLength = parseInt(windowInfos.L1);//边长1
                                        data.field.sidebLength = parseInt(windowInfos.L2);//边长2  AxisX
                                    }
                                    var BLHList = windowInfos.Vertices3D1;
                                    var positList = [];
                                    var maxHeihts = 0;
                                    for (var i in BLHList) {
                                        if (BLHList[i].L=="NaN") {
                                            layer.msg("请旋转模型到合适位置", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                            return false;
                                        }
                                        var postions = new Cesium.Cartographic(Math.PI / 180 * BLHList[i].L, Math.PI / 180 * BLHList[i].B);
                                        var Heights = viewer.scene.sampleHeight(postions);
                                        if (Heights > maxHeihts) {
                                            maxHeihts = Heights;
                                        }
                                        //经纬度，现在的坐标，转换三维。
                                        positList.push(new Cesium.Cartesian3.fromDegrees(BLHList[i].L, BLHList[i].B, Heights));
                                    }
                                    data.field.cookie = document.cookie;
                                    data.field.points = JSON.stringify(positList);//直接存吧
                                    data.field.projectId = currentprojectid;
                                    data.field.creatTime = y + '-' + (mouth < 10 ? '0' + mouth : mouth) + '-' + (d < 10 ? '0' + d : d);
                                    
                                    data.field.axisx = JSON.stringify(windowInfos.AxisX);//x轴
                                    data.field.axisy = JSON.stringify(windowInfos.AxisY);//y轴   Normal Origin Vertices2D Vertices3D Vertices3D1
                                    data.field.normal = JSON.stringify(windowInfos.Normal);//法向量
                                    data.field.origin = JSON.stringify(windowInfos.Origin);//原点
                                    data.field.vertices2d = JSON.stringify(windowInfos.Vertices2D);//平，面
                                    data.field.vertices3d = JSON.stringify(windowInfos.Vertices3D);//空间执教
                                    data.field.vertices3dlbh = JSON.stringify(windowInfos.Vertices3D1);//大地坐标
                                    //我算一个倾角不，倾角算出来，倾向，倾角。
                                    var tempList = [];
                                    tempList.push(positList[0]);
                                    tempList.push(positList[1]);
                                    tempList.push(positList[2]);
                                    var chanzhuang = getChanzhuang(positList);
                                    var qingXiang = parseFloat(chanzhuang.qingXiang)-180;
                                    var qingJiao = parseFloat(chanzhuang.qingJiao) - 90;
                                    data.field.level = qingXiang.toFixed(2);
                                    data.field.vertical = qingJiao.toFixed(2);
                                    data.field.height = maxHeihts.toFixed(2);
                                    
                                    
                                    
                                    $.ajax({
                                        url: servicesurl + "/api/FlzWindowInfo/AddFlzWindow", type: "post", data: data.field,
                                        success: function (result) {
                                            if (isNaN(result)) {
                                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                            } else {
                                                //关闭
                                                layer.close(drowinfoAddlayerindex);
                                                //更改layer
                                                var flzWindowLayer = new Object;

                                                var xSum = 0;//求一个平均点，用于定位
                                                var ySum = 0;
                                                var zSum = 0;
                                                for (var m = 0; m < positList.length; m++) {
                                                    xSum = xSum + parseFloat(positList[m].x);
                                                    ySum = ySum + parseFloat(positList[m].y);
                                                    zSum = zSum + parseFloat(positList[m].z);
                                                }
                                                flzWindowLayer.Centerx = xSum / positList.length;
                                                flzWindowLayer.Centery = ySum / positList.length;
                                                flzWindowLayer.Centerz = zSum / positList.length;

                                                flzWindowLayer.title = data.field.name;
                                                flzWindowLayer.type = "FLZWINDOW";
                                                flzWindowLayer.id = "FLZWINDOW_" + result;
                                                flzWindowLayer.datas = data.field;
                                                flzWindowLayer.pointList = positList;
                                                flzWindowLayer.checked = true;
                                                flzWindowLayer.showCheckbox = true;//显示复选框
                                                flzWindowLayer.children = [];
                                                layers[0].children.push(flzWindowLayer);
                                                layers[0].spread = true;
                                                console.log(layers);

                                                data.field.id = result;
                                                windowInfoList.push(data.field);
                                                console.log(windowInfoList);
                                                ClearTemp();
                                                tree.reload('prjlayerlistid', { data: layers });
                                                
                                                if (handler != undefined) {
                                                    handler.destroy();
                                                }

                                                isRedo = true;
                                                points = [];
                                                linepoints = [];
                                            }

                                        }, datatype: "json"
                                    });
                                    return false;
                                }

                            }, datatype: "json"
                        });
                        return false;
                        //然后再存
                        
                    });

                }
                , end: function () {
                    drowinfoAddlayerindex = null;
                    ClearTemp();
                }, cancel: function () {//取消按钮

                    //取消画的图和点
                    if (handler != undefined) {
                        handler.destroy();
                    }
                    isRedo = true;
                    points = [];
                    linepoints = [];
                    ClearTemp();
                }
            });
        }

    } else if (flag == "area") {
        if (drowinfoAddlayerindex == null) {
            //
            drowinfoAddlayerindex = layer.open({
                type: 1
                , title: ['面标注', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
               , content: addbiaozhuareaHtml
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();

                    form.on('submit(addpointinfosubmit)', function (data) {
                        var positList = position;
                        data.field.cookie = document.cookie;
                        data.field.position = JSON.stringify(position);
                        data.field.projectId = currentprojectid;
                        data.field.type = "3";
                        data.field.modleId = modleInfo.id.split('_')[1];
                        data.field.modleTime = modleInfo.title.substring(0, 10);
                        data.field.colour = pointColor;
                        console.log(data);

                        var loadingminindex = layer.load(0, { shade: 0.3, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });
                        $.ajax({
                            url: servicesurl + "/api/RockData/AddRockPoint", type: "post", data: data.field,
                            success: function (result) {
                                layer.close(loadingminindex);
                                
                                if (isNaN(result)) {
                                    layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                } else {
                                    //关闭
                                    layer.msg("保存成功", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                    ClearTemp();
                                    layer.close(drowinfoAddlayerindex);

                                    var xSum = 0;//求一个平均点，用于定位
                                    var ySum = 0;
                                    var zSum = 0;
                                    for (var m = 0; m < positList.length; m++) {
                                        xSum = xSum + parseFloat(positList[m].x);
                                        ySum = ySum + parseFloat(positList[m].y);
                                        zSum = zSum + parseFloat(positList[m].z);
                                    }


                                    var modleFlag = false;
                                    if (biaoLayers.length == 0) {

                                        //var rockarealayer = new Object;
                                        //rockarealayer.title = "面标注";
                                        //rockarealayer.type = "ROCKAREA";
                                        //rockarealayer.checked = true;
                                        //rockarealayer.spread = true;
                                        //rockarealayer.showCheckbox = true;//显示复选框
                                        //var rockarealayerchild = [];

                                        //var rockline = new Object;
                                        //rockline.title = data.field.name;
                                        //rockline.id = "ROCKAREA_" + result;
                                        //rockline.type = "ROCKAREA";
                                        //rockline.remarks = data.field.remarks;
                                        //rockline.lineType = data.field.lineType;
                                        //rockline.colour = pointColor;
                                        //rockline.postion = position;
                                        //rockline.Centerx = xSum / positList.length;
                                        //rockline.Centery = ySum / positList.length;
                                        //rockline.Centerz = zSum / positList.length;
                                        //rockline.pointList = positList;
                                        //rockline.checked = true;
                                        //rockline.spread = true;
                                        //rockline.showCheckbox = true;//显示复选框

                                        //rockline.datas = data;
                                        //rockarealayerchild.push(rockline);


                                        //rockarealayer.children = rockarealayerchild;
                                        //biaoLayers.push(rockarealayer);
                                        LoadBiaozhunListLayer();
                                        elem.tabChange('biaozhuguanli', 4); //跳转地址图层列表
                                    } else {
                                        var xiabiao1 = 0;
                                        for (var m in biaoLayers) {
                                            if (biaoLayers[m].type == "ROCKAREA") {
                                                modleFlag = true;
                                                xiabiao1 = m;
                                            }
                                        }
                                        if (modleFlag) {
                                            var rockline = new Object;
                                            rockline.title = data.field.name;
                                            rockline.id = "ROCKAREA_" + result;
                                            rockline.type = "ROCKAREA";
                                            rockline.remarks = data.field.remarks;
                                            rockline.lineType = data.field.lineType;
                                            rockline.colour = pointColor;
                                            rockline.postion = position;
                                            rockline.Centerx = xSum / positList.length;
                                            rockline.Centery = ySum / positList.length;
                                            rockline.Centerz = zSum / positList.length;

                                            rockline.pointList = positList;
                                            rockline.checked = true;
                                            rockline.spread = true;
                                            rockline.showCheckbox = true;//显示复选框

                                            rockline.datas = data;
                                            biaoLayers[xiabiao1].checked = true;
                                            biaoLayers[xiabiao1].spread = true;
                                            biaoLayers[xiabiao1].children.push(rockline);

                                        } else {//没有，就是新增
                                            var rockarealayer = new Object;
                                            rockarealayer.title = "面标注";
                                            rockarealayer.type = "ROCKAREA";
                                            rockarealayer.checked = true;
                                            rockarealayer.spread = true;
                                            rockarealayer.showCheckbox = true;//显示复选框
                                            var rockarealayerchild = [];

                                            var rockline = new Object;
                                            rockline.title = data.field.name;
                                            rockline.id = "ROCKAREA_" + result;
                                            rockline.type = "ROCKAREA";
                                            rockline.remarks = data.field.remarks;
                                            rockline.lineType = data.field.lineType;
                                            rockline.colour = pointColor;
                                            rockline.postion = position;
                                            rockline.pointList = positList;
                                            rockline.Centerx = xSum / positList.length;
                                            rockline.Centery = ySum / positList.length;
                                            rockline.Centerz = zSum / positList.length;
                                            rockline.checked = true;
                                            rockline.spread = true;
                                            rockline.showCheckbox = true;//显示复选框

                                            rockline.datas = data.field;
                                            rockarealayerchild.push(rockline);


                                            rockarealayer.children = rockarealayerchild;
                                            biaoLayers.push(rockarealayer);

                                        }
                                        console.log(biaoLayers);


                                        tree.reload('prjbiaoZhuListid', { data: biaoLayers });
                                        elem.tabChange('biaozhuguanli', 4); //跳转地址图层列表
                                    }

                                    
                                    //if (handler != undefined) {
                                    //    handler.destroy();
                                    // }
                                   
                                    isRedo = true;
                                    points = [];
                                    linepoints = [];
                                }


                            }, datatype: "json"
                        });
                        return false;
                    });

                }
                , end: function () {
                    drowinfoAddlayerindex = null;
                    console.log(1111);
                }, cancel: function () {//取消按钮

                    //取消画的图和点
                    if (handler != undefined) {
                        handler.destroy();
                    }
                    isRedo = true;
                    points = [];
                    linepoints = [];
                }
            });
        }

    } else if (flag == "zidingyi") {
        if (drowinfoAddlayerindex == null) {
            //
            drowinfoAddlayerindex = layer.open({
                type: 1
                , title: ['面元素新增', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0.3
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                //, content: '/Apps/flz/widget/addinfoPoint.html'
                , content: '<form class="layui-form" style="margin-top:5px;margin-right:25px;" lay-filter="addpointinfoform"><div class="layui-form-item" style="margin-top:15px;margin-right:5px;"><div class="layui-row"><div class="layui-col-md6"><div class="grid-demo grid-demo-bg1"><label class="layui-form-label">面名称</label><div class="layui-input-block"><input type="text" name="name" lay-verify="required" autocomplete="off" placeholder="请输入" class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">描述</label><div class="layui-input-block"><input type="text" name="remarks" lay-verify="required" autocomplete="off" placeholder="请输入"  class="layui-input" style="width:160px;"  /></div></div></div></div></div><div class="layui-form-item" style="margin-top:15px"><div style="position:absolute;right:15px;"><button type="reset" class="layui-btn layui-btn-primary" style="width:100px">重置</button><button type="submit" class="layui-btn" lay-submit="" lay-filter="addpointinfosubmit" style="width:100px">提交</button></div></div></form>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();

                    form.on('submit(addpointinfosubmit)', function (data) {
                        var positList = position;
                        var linepointList = cartesian3;
                        var temp = ""
                        for (var i = 0; i < linepointList.length; i++) {
                            var longitude = Cesium.Math.toDegrees(linepointList[i].longitude);                         //经度
                            var latitude = Cesium.Math.toDegrees(linepointList[i].latitude);                           //纬度
                            var height = linepointList[i].height;
                            //高度
                            if (i == linepointList.length - 1) {
                                temp = temp + longitude + "@" + latitude + "@" + height;
                            } else {
                                temp = temp + longitude + "@" + latitude + "@" + height + "&";//点与点用&隔开，经纬度用@分割
                            }
                        }
                        data.field.cookie = document.cookie;
                        data.field.position = temp;
                        data.field.projectId = currentprojectid;
                        data.field.type = "3";//线
                        $.ajax({
                            url: servicesurl + "/api/FlzData/AddFlzPoint", type: "post", data: data.field,
                            success: function (result) {

                                //创建失败
                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                if (true) {


                                    //关闭
                                    layer.close(drowinfoAddlayerindex);

                                    //

                                    var cartesian3s = [];
                                    var newcartesian3s = [];
                                    var maxHeight = linepointList[0].height;
                                    var minHeight = linepointList[0].height;
                                    var bSum = 0;
                                    var lSum = 0;
                                    for (var i = 0; i < points.length; i++) {
                                        var cartesian3 = points[i];
                                        cartesian3s.push(cartesian3);
                                        var rblh = Cesium.Cartographic.fromCartesian(points[i]);
                                        var blh = new Cesium.Cartesian3(rblh.latitude * 180 / Math.PI, rblh.longitude * 180 / Math.PI, rblh.height);
                                        newcartesian3s.push(blh);
                                        bSum += rblh.latitude * 180 / Math.PI;
                                        lSum += rblh.longitude * 180 / Math.PI;
                                        if (rblh.height < minHeight) {
                                            minHeight = rblh.height;
                                        }
                                        if (rblh.height > maxHeight) {
                                            maxHeight = rblh.height;
                                        }
                                    }

                                    viewer.entities.add({
                                        name: "pyMeasue" + NewGuid(),
                                        polygon: {
                                            hierarchy: {
                                                positions: points
                                            },
                                            material: Cesium.Color.YELLOW.withAlpha(0.5),
                                            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
                                        }
                                    });

                                    //计算面积
                                    var cartesian2s = [];
                                    for (var i = 0; i < newcartesian3s.length; i++) {
                                        var cartesian3 = Cesium.Cartesian3.fromDegrees(newcartesian3s[i].y, newcartesian3s[i].x, maxHeight);
                                        var cartesian2 = new Cesium.Cartesian2(cartesian3.x, cartesian3.y);
                                        cartesian2s.push(cartesian2);
                                    }
                                    console.log(cartesian3);
                                    console.log(cartesian2);
                                    cartesian2s.push(cartesian2s[0]);
                                    var area = 0;
                                    for (var i = 0; i < cartesian2s.length - 1; i++) {
                                        area += (cartesian2s[i].x - cartesian2s[0].x) * (cartesian2s[i + 1].y - cartesian2s[0].y) - (cartesian2s[i].y - cartesian2s[0].y) * (cartesian2s[i + 1].x - cartesian2s[0].x);
                                    }
                                    area = Math.abs(area);

                                    //计算重心
                                    viewer.entities.add({
                                        name: "pylMeasue" + NewGuid(),
                                        position: Cesium.Cartesian3.fromDegrees(lSum / points.length, bSum / points.length, maxHeight + 1),
                                        label: {
                                            text: data.field.name + '面积：' + area.toFixed(2) + '平方米',
                                            showBackground: true,
                                            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                            font: '24px Times New Roman',
                                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                            pixelOffset: new Cesium.Cartesian2(0.0, -10),
                                        }
                                    });

                                    if (handler != undefined) {
                                        handler.destroy();
                                    }

                                    isRedo = true;
                                    points = [];
                                    linepoints = [];
                                }

                            }, datatype: "json"
                        });
                        return false;
                    });

                }
                , end: function () {
                    drowinfoAddlayerindex = null;
                    console.log(1111);
                }, cancel: function () {//取消按钮

                    //取消画的图和点
                    if (handler != undefined) {
                        handler.destroy();
                    }
                    isRedo = true;
                    points = [];
                    linepoints = [];
                }
            });
        }

    } else if (flag == "jieli") {//节理
        var data = {};
        var positList = position;
        var linepointList = linepoints;
        //var temp = ""
        //for (var i = 0; i < linepointList.length; i++) {
        //    var longitude = Cesium.Math.toDegrees(linepointList[i].longitude);                         //经度
        //    var latitude = Cesium.Math.toDegrees(linepointList[i].latitude);                           //纬度
        //    var height = linepointList[i].height;
        //    //高度
        //    if (i == linepointList.length - 1) {
        //        temp = temp + longitude + "@" + latitude + "@" + height;
        //    } else {
        //        temp = temp + longitude + "@" + latitude + "@" + height + "&";//点与点用&隔开，经纬度用@分割
        //    }
        //}

        //
        data.cookie = document.cookie;
        data.position = JSON.stringify(position);//直接存吧;
     // data.position = positList;//直接存吧;
        data.projectId = currentprojectid;
        data.type = "3";//面

        var sum = Cesium.Cartesian3.distance(positList[0], positList[positList.length - 1]);
        for (var i = 0; i < positList.length - 1; i++) {
            var point1 = positList[i];
            var point2 = positList[i + 1];

            var distance = Cesium.Cartesian3.distance(point1, point2)
            if (distance == NaN) {
                sum = 0;
                break;
            }
            else {
                sum += distance;
            }
        }
        data.traceLength = (sum / 2).toFixed(4);
        data.creatTime = y + '-' + (mouth < 10 ? '0' + mouth : mouth) + '-' + (d < 10 ? '0' + d : d);
        data.windowId = windouinfo.id;//测窗id，
        data.modleId = modleInfo.id.split("_")[1];//模型id
        data.modleTime = modleInfo.title;//模型时间
        console.log(modleInfo);
        //计算面积，
        points = [];
        var cartesian3s = [];
        var newcartesian3s = [];
        var maxHeight = linepointList[0].height;
        var minHeight = linepointList[0].height;
        var bSum = 0;
        var lSum = 0;
        points = positList;
        for (var i = 0; i < points.length; i++) {
            var cartesian3 = points[i];
            cartesian3s.push(cartesian3);
            var rblh = Cesium.Cartographic.fromCartesian(points[i]);
            var blh = new Cesium.Cartesian3(rblh.latitude * 180 / Math.PI, rblh.longitude * 180 / Math.PI, rblh.height);
            newcartesian3s.push(blh);
            bSum += rblh.latitude * 180 / Math.PI;
            lSum += rblh.longitude * 180 / Math.PI;
            if (rblh.height < minHeight) {
                minHeight = rblh.height;
            }
            if (rblh.height > maxHeight) {
                maxHeight = rblh.height;
            }
        }
        //计算面积
        var cartesian2s = [];
        for (var i = 0; i < newcartesian3s.length; i++) {
            var cartesian3 = Cesium.Cartesian3.fromDegrees(newcartesian3s[i].y, newcartesian3s[i].x, maxHeight);
            var cartesian2 = new Cesium.Cartesian2(cartesian3.x, cartesian3.y);
            cartesian2s.push(cartesian2);
        }
        cartesian2s.push(cartesian2s[0]);
        var area = 0;
        for (var i = 0; i < cartesian2s.length - 1; i++) {
            area += (cartesian2s[i].x - cartesian2s[0].x) * (cartesian2s[i + 1].y - cartesian2s[0].y) - (cartesian2s[i].y - cartesian2s[0].y) * (cartesian2s[i + 1].x - cartesian2s[0].x);
        }
        area = Math.abs(area);

        //data.field.measure = (area / Math.cos(qingJiao * Math.PI / 180)).toFixed(6);
        data.measure = area.toFixed(6);
        data.remarks = "节理";
        data.avgOpening = (data.measure / data.traceLength).toFixed(4);
        data.collector = collector;
        //计算迹长，
        var loadingjieliindex = layer.load(0, { shade: 0.3, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });

        $.ajax({
            url: servicesurl + "/api/FlzData/AddFlzPoint", type: "post", data: data,
            success: function (result) {
                layer.close(loadingjieliindex);
                if (isNaN(result)) {
                    layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                } else {
                    //关闭
                    layer.msg("保存成功", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                    for (var j in layers[0].children) {
                        if (layers[0].children[j].type == "FLZWINDOW" && layers[0].children[j].id == ("FLZWINDOW_" + windouinfo.id)) {
                            var flzline = new Object;
                            var xSum = 0;//求一个平均点，用于定位
                            var ySum = 0;
                            var zSum = 0;
                            for (var m = 0; m < positList.length; m++) {
                                xSum = xSum + parseFloat(positList[m].x);
                                ySum = ySum + parseFloat(positList[m].y);
                                zSum = zSum + parseFloat(positList[m].z);
                            }
                            flzline.Centerx = xSum / positList.length;
                            flzline.Centery = ySum / positList.length;
                            flzline.Centerz = zSum / positList.length;
                            flzline.title = "节理" + (parseInt(result) - 1);
                            flzline.id = "FLZJIELI_" + result;
                            flzline.type = "FLZJIELI";
                            flzline.remarks = data.remarks;
                            flzline.datas = data;
                            flzline.datas.pointList = positList;
                            flzline.datas.name = flzline.title;
                            flzline.pointList = positList;
                            flzline.checked = true;
                            flzline.spread = true;
                            flzline.showCheckbox = true;//显示复选框spread = true
                            layers[0].children[j].children.push(flzline);
                            layers[0].children[j].spread = true;
                            layers[0].spread = true;

                        }
                    }
                    tree.reload('prjlayerlistid', { data: layers });
                    //if (handler != undefined) {
                    //    handler.destroy();
                    // }
                    for (var m in points) {
                        viewer.entities.removeById("jielitemp" + m);
                    }

                    isRedo = true;
                    points = [];
                    linepoints = [];
                }

            }, datatype: "json"
        });



    } else if (flag == "jiegou") {//结构面
        var data = {};
        var positList = position;
        var linepointList = linepoints;
        var temp = ""
       

        var tem = getChanzhuang(positList);
        var qingXiang = tem.qingXiang;
        var qingJiao = tem.qingJiao;
        
        data.cookie = document.cookie;
        data.position = JSON.stringify(positList);
        data.projectId = currentprojectid;
        data.type = "4";//优势结构面
        data.inclination = qingXiang.toFixed(2);//倾向
        data.dipAngle = qingJiao.toFixed(2);//倾角

        if ((parseFloat(qingXiang) + 90) > 360) {
            data.trend = (parseFloat(qingXiang) - 270).toFixed(2);//走向
        } else {
            data.trend = (parseFloat(qingXiang) + 90).toFixed(2);//走向
        }

        
        data.creatTime = y + '-' + (mouth < 10 ? '0' + mouth : mouth) + '-' + (d < 10 ? '0' + d : d);
        data.modleId = modleInfo.id.split("_")[1];//模型id
        data.modleTime = modleInfo.title;//模型时间
        data.remarks = "结构面";//模型时间
        //计算迹长，

        $.ajax({
            url: servicesurl + "/api/FlzData/AddFlzPoint", type: "post", data: data,
            success: function (result) {
                if (isNaN(result)) {
                    layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                } else {
                    //关闭
                    layer.msg("保存成功", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                    layer.close(drowinfoAddlayerindex);
                    console.log(layers);
                    var isDomdtrpla = true;//查看是否有优势结构面
                    for (var j in layers[0].children) {
                        if (layers[0].children[j].type == "DOMSTRPLA") {
                            isDomdtrpla = false;
                            var flzline = new Object;
                            var xSum = 0;//求一个平均点，用于定位
                            var ySum = 0;
                            var zSum = 0;
                            for (var m = 0; m < positList.length; m++) {
                                xSum = xSum + parseFloat(positList[m].x);
                                ySum = ySum + parseFloat(positList[m].y);
                                zSum = zSum + parseFloat(positList[m].z);
                            }
                            flzline.Centerx = xSum / positList.length;
                            flzline.Centery = ySum / positList.length;
                            flzline.Centerz = zSum / positList.length;
                            flzline.title = (parseInt(result) - 1);
                            flzline.id = "YOUSHIMIAN_" + result;
                            flzline.type = "YOUSHIMIAN";
                            flzline.remarks = data.remarks;
                            flzline.datas = data;
                            flzline.datas.name = flzline.title;
                            flzline.datas.pointList = positList;
                            flzline.pointList = positList;
                            flzline.checked = true;
                            flzline.spread = true;
                            flzline.showCheckbox = true;//显示复选框spread = true
                            layers[0].children[j].children.push(flzline);
                            layers[0].children[j].spread = true;
                            layers[0].spread = true;

                        }
                    }
                    if (isDomdtrpla) {//根本没有又是结构面的时候，

                    }
                    tree.reload('prjlayerlistid', { data: layers });
                    if (handler != undefined) {
                        handler.destroy();
                    }
                    for (var m in points) {
                        viewer.entities.removeById("jielitemp" + m);
                    }

                    isRedo = true;
                    points = [];
                    linepoints = [];
                }

            }, datatype: "json"
        });



        //取消画的图和点
        if (handler != undefined) {
            handler.destroy();
        }
        for (var m in points) {
            viewer.entities.removeById("jiegoutemp" + m);
        }
        isRedo = true;
        points = [];
        linepoints = [];
    }

}
function jisumianji(postList) {
    var cartesian3s = [];
    var newcartesian3s = [];
    var maxHeight = 0;
    var minHeight = 2000;
    for (var i = 0; i < postList.length; i++) {
        var cartesian3 = postList[i];
        cartesian3s.push(cartesian3);
        var rblh = Cesium.Cartographic.fromCartesian(postList[i]);
        var blh = new Cesium.Cartesian3(rblh.latitude * 180 / Math.PI, rblh.longitude * 180 / Math.PI, rblh.height);
        newcartesian3s.push(blh);
        if (rblh.height < minHeight) {
            minHeight = rblh.height;
        }
        if (rblh.height > maxHeight) {
            maxHeight = rblh.height;
        }
    }
    //计算面积
    var cartesian2s = [];
    var cartesian2sb = [];
    for (var i = 0; i < newcartesian3s.length; i++) {
        var cartesian3 = Cesium.Cartesian3.fromDegrees(newcartesian3s[i].y, newcartesian3s[i].x, maxHeight);//转到一个平面
        var cartesian2 = new Cesium.Cartesian2(cartesian3.x, cartesian3.y);
        cartesian2s.push(cartesian2);
        cartesian2sb.push(new Cesium.Cartesian2(postList[i].x, postList[i].y));

    }
    cartesian2s.push(cartesian2s[0]);
    var area = 0;
    for (var i = 0; i < cartesian2s.length - 1; i++) {
        area += (cartesian2s[i].x - cartesian2s[0].x) * (cartesian2s[i + 1].y - cartesian2s[0].y) - (cartesian2s[i].y - cartesian2s[0].y) * (cartesian2s[i + 1].x - cartesian2s[0].x);
    }
    area = Math.abs(area);

    var areacartesian2sb = 0;
    for (var i = 0; i < cartesian2sb.length - 1; i++) {
        areacartesian2sb += (cartesian2sb[i].x - cartesian2sb[0].x) * (cartesian2sb[i + 1].y - cartesian2sb[0].y) - (cartesian2sb[i].y - cartesian2sb[0].y) * (cartesian2sb[i + 1].x - cartesian2sb[0].x);
    }
    areacartesian2sb = Math.abs(areacartesian2sb);

    var sum = Cesium.Cartesian3.distance(postList.length - 1, postList[0]);
    for (var i = 0; i < postList.length - 1; i++) {
        var point1 = postList[i];
        var point2 = postList[i + 1];

        var distance = Cesium.Cartesian3.distance(point1, point2)
        if (distance == NaN) {
            break;
        }
        else {
            sum += distance;
        }
    }
    console.log(area);
    console.log(postList);
    console.log(sum);
    console.log(areacartesian2sb);
    return area;
}


//坐标量测
//function pointMeasure2() {
//    ClearTemp();

//    isPoint = true;
//    isLength = false;
//    isHeight = false;
//    isAraa = false;
//    isAzimuth = false;
//    isRedo = false;
//    isPointLabel = false;
//    isPolylineLabel = false;
//    isPolygonLabel = false;
//    isOccurrence = false;
//    isWindowZiDingyi = false;

//    if (isPoint) {
//        if (handler != undefined) {
//            handler.destroy();
//        }
//        handler = new Cesium.ScreenSpaceEventHandler(canvas);

//        //左击
//        handler.setInputAction(function (leftclick) {
//            if (isPoint) {
//                var pickedOject = scene.pick(leftclick.position);
//                if (pickedOject != undefined) {
//                    var position = scene.pickPosition(leftclick.position);
//                    if (position != undefined) {
//                        var cartesian3 = Cesium.Cartographic.fromCartesian(position);                        //笛卡尔XYZ
//                        var longitude = Cesium.Math.toDegrees(cartesian3.longitude);                         //经度
//                        var latitude = Cesium.Math.toDegrees(cartesian3.latitude);                           //纬度
//                        var height = cartesian3.height;                                                      //高度




//                        if (height > 0) {
//                            showCeliang = " 位置:" + "\n"+" X:" + position.x.toFixed(6) + "\n" + " Y:" + position.y.toFixed(6) + "\n" + " Z:" + position.z.toFixed(6);
//                            if (Cesium.defined(position)) {
//                                ClearTemp();

//                                viewer.entities.add({
//                                    name: "ptMeasue" + NewGuid(),
//                                    position: position,
//                                    point: {
//                                        pixelSize: 12,
//                                        color: Cesium.Color.RED,
//                                        disableDepthTestDistance: Number.POSITIVE_INFINITY
//                                    }
//                                });
                                

//                                //测试用
//                                viewer.entities.add({
//                                    name: "ptlMeasue" + NewGuid(),
//                                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
//                                    label: {
//                                        text: '经纬度(' + longitude.toFixed(2) + ',' + latitude.toFixed(2) + ',' + height.toFixed(2) + ')',
//                                        showBackground: true,
//                                        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
//                                        font: '14px Times New Roman',
//                                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
//                                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
//                                        verticalOrigin: Cesium.VerticalOrigin.CENTER,
//                                        pixelOffset: new Cesium.Cartesian2(0.0, -60),
                                        
//                                    }
//                                });
//                                if (showCeliang != null) {
//                                    form.val("celianginfoform", {
//                                        "desc": showCeliang
//                                    });
//                                }
//                                //针对移动设备
//                                if (isMobile.any()) {
//                                    if (handler != undefined) {
//                                        handler.destroy();
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//    }
//};
//长度量测
function lengthMeasure2() {
    ClearTemp();

    isPoint = false;
    isLength = true;
    isHeight = false;
    isAraa = false;
    isAzimuth = false;
    isRedo = false;
    isPointLabel = false;
    isPolylineLabel = false;
    isPolygonLabel = false;
    isOccurrence = false;
    isWindowZiDingyi = false;

    if (isLength) {
        if (handler != undefined) {
            handler.destroy();
        }

        handler = new Cesium.ScreenSpaceEventHandler(canvas);

        //左击
        handler.setInputAction(function (leftclik) {
            if (isRedo) {
                ClearTemp();
                isRedo = false;
                linepoints = [];
                points = [];
            }

            var pickedOject = scene.pick(leftclik.position);
            if (pickedOject != undefined) {
                var position = scene.pickPosition(leftclik.position);
                if (position != undefined) {
                    if (Cesium.defined(position)) {
                        var cartesian3 = new Cesium.Cartesian3(position.x, position.y, position.z);
                        linepoints.push(Cesium.Cartographic.fromCartesian(position));
                        points.push(cartesian3);

                        viewer.entities.add({
                            name: "ptMeasue" + NewGuid(),
                            position: position,
                            point: {
                                pixelSize: 2,
                                color: Cesium.Color.YELLOW
                            }
                        });

                        if (points.length > 1) {
                            var point = points[points.length - 2];
                            if (isModelLine) {
                                //绘制贴模型线
                                //polylineOnModel("plMeasue" + NewGuid(), [point, position], 0.05, 10, Cesium.Color.AQUAMARINE);

                                viewer.entities.add({
                                    name: "plMeasue" + NewGuid(),
                                    polyline: {
                                        positions: [point, position],
                                        width: 1,
                                        arcType: Cesium.ArcType.RHUMB,
                                        material: Cesium.Color.YELLOW,
                                        show: true,
                                        clampToGround: true,
                                        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
                                    }
                                });
                            }
                            else {
                                //绘制空中直接连线
                                viewer.entities.add({
                                    name: "plMeasue" + NewGuid(),
                                    polyline: {
                                        positions: [point, position],
                                        width: 1,
                                        material: Cesium.Color.YELLOW,
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);



        if (isMobile.any()) {//双指
            handler.setInputAction(function (pinch) {
                if (points.length > 1) {
                    var sum = 0;
                    for (var i = 0; i < points.length - 1; i++) {
                        var point1 = points[i];
                        var point2 = points[i + 1];

                        var distance = Cesium.Cartesian3.distance(point1, point2)
                        if (distance == NaN) {
                            sum = 0;
                            break;
                        }
                        else {
                            sum += distance;
                        }
                    }

                    viewer.entities.add({
                        name: "pllMeasue" + NewGuid(),
                        position: points[points.length - 1],
                        label: {
                            text: '长度：' + sum.toFixed(4) + '米',
                            showBackground: true,
                            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                            font: '24px Times New Roman',
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                            pixelOffset: new Cesium.Cartesian2(0.0, -60),
                        }
                    });

                    if (handler != undefined) {
                        handler.destroy();
                    }

                    isRedo = true;
                }

            }, Cesium.ScreenSpaceEventType.PINCH_START);
        }
        else {//右击
            handler.setInputAction(function (rightclik) {
                if (points.length > 1) {
                    var sum = 0;
                    for (var i = 0; i < points.length - 1; i++) {
                        var point1 = points[i];
                        var point2 = points[i + 1];

                        var distance = Cesium.Cartesian3.distance(point1, point2)
                        if (distance == NaN) {
                            sum = 0;
                            break;
                        }
                        else {
                            sum += distance;
                        }
                    }

                    viewer.entities.add({
                        name: "pllMeasue" + NewGuid(),
                        position: points[points.length - 1],
                        label: {
                            text: '长度：' + sum.toFixed(4) + '米',
                            showBackground: true,
                            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                            font: '24px Times New Roman',
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                            pixelOffset: new Cesium.Cartesian2(0.0, -60),
                        }
                    });

                    isRedo = true;
                }

            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
    }
};



//三点法产状计算
/*
//产状计算得到倾角和倾向，使用时请以顺时针顺序选取特征点
产状计算过程：
（1）获取空间直角坐标XYZ（ECEF）
（2）选择目标坐标系原点，取其大地经度大地纬度作为转换参数
（3）转换为ENU坐标系（https://en.wikipedia.org/wiki/Geographic_coordinate_conversion）
（4）计算产状
*/
function getOccurrence() {

    ClearTemp();

    isPoint = false;
    isLength = false;
    isHeight = false;
    isAraa = false;
    isAzimuth = false;
    isRedo = false;
    isPointLabel = false;
    isPolylineLabel = false;
    isPolygonLabel = false;

    isOccurrence = true;
    isWindowZiDingyi = false;

    if (isOccurrence) {
        if (handler != undefined) {
            handler.destroy();
        }

        handler = new Cesium.ScreenSpaceEventHandler(canvas);

        //左击
        handler.setInputAction(function (leftclik) {
            if (isRedo) {
                ClearTemp();
                isRedo = false;
            }

            var pickedOject = scene.pick(leftclik.position);
            if (pickedOject != undefined) {
                var position = scene.pickPosition(leftclik.position);//返回值为空间直角坐标
                if (position != undefined) {
                    var cartesian = Cesium.Cartographic.fromCartesian(position);//返回BLH

                    if (Cesium.defined(position)) {
                        viewer.entities.add({
                            name: "ptMeasue" + NewGuid(),
                            position: position,
                            point: {
                                pixelSize: 10,
                                color: Cesium.Color.YELLOW,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            }
                        });
                        points.push(position);
                    }
                    if (points.length > 1) {
                        var point = points[points.length - 2];
                        viewer.entities.add({
                            name: "plMeasue" + NewGuid(),
                            polyline: {
                                positions: [point, position],
                                width: 2,
                                arcType: Cesium.ArcType.RHUMB,
                                material: Cesium.Color.RED,
                                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                    color: Cesium.Color.RED,
                                }),
                            }
                        });
                    }

                    if (points.length == 3) {
                        var cartesian3s = [];
                        //var newcartesian3s = [];
                        var bSum = 0;
                        var lSum = 0;
                        var hSum = 0;
                        var minx = points[0].x;
                        var miny = points[0].y;
                        var minz = points[0].z;
                        var maxHeight = Cesium.Cartographic.fromCartesian(points[0]).height;
                        var minHeight = Cesium.Cartographic.fromCartesian(points[0]).height;
                        for (var i = 0; i < points.length; i++) {
                            var cartesian3 = points[i];
                            cartesian3s.push(cartesian3);
                            if (points[i].x < minx) {
                                minx = points[i].x;
                            }
                            if (points[i].y < miny) {
                                miny = points[i].y;
                            }
                            if (points[i].z < minz) {
                                minz = points[i].z;
                            }
                            var rblh = Cesium.Cartographic.fromCartesian(points[i]);
                            bSum += rblh.latitude * 180 / Math.PI;
                            lSum += rblh.longitude * 180 / Math.PI;
                            hSum += rblh.height;
                            if (rblh.height > maxHeight) {
                                maxHeight = rblh.height;
                            }
                            if (rblh.height < minHeight) {
                                minHeight = rblh.height;
                            }
                        }
                        var bAvg = bSum * Math.PI / 180 / points.length;
                        var lAvg = lSum * Math.PI / 180 / points.length;
                        var hAvg = hSum / points.length;

                        var opblh = new Cesium.Cartographic(lAvg, bAvg, hAvg);
                        //转换后的坐标原点
                        var opxyz = Cesium.Cartesian3.fromDegrees(opblh.longitude, opblh.latitude, opblh.height);

                        
                            
                            viewer.entities.add({
                                name: "plMeasue" + NewGuid(),
                                polyline: {
                                    positions: [points[0], points[2]],
                                    width: 2,
                                    arcType: Cesium.ArcType.RHUMB,
                                    material: Cesium.Color.RED,
                                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.RED,
                                    }),
                                }
                            });
                        //viewer.entities.add({
                        //    name: "ptOccurrence" + NewGuid(),
                        //    polygon: {
                        //        hierarchy: {
                        //            positions: points
                        //        },
                        //        material: Cesium.Color.ORANGE.withAlpha(0.5),
                        //    }
                        //});


                        //var ccc = 0;     调试用
                        var cartesian3f = [];
                        //cartesian3f = cartesian3s; //调试用
                        for (var i = 0; i < cartesian3s.length; i++) {
                            var newx = -Math.sin(lAvg) * (cartesian3s[i].x - opxyz.x) + Math.cos(lAvg) * (cartesian3s[i].y - opxyz.y);
                            var newy = -Math.sin(bAvg) * Math.cos(lAvg) * (cartesian3s[i].x - opxyz.x) - Math.sin(bAvg) * Math.sin(lAvg) * (cartesian3s[i].y - opxyz.y) + Math.cos(bAvg) * (cartesian3s[i].z - opxyz.z);
                            var newz = Math.cos(bAvg) * Math.cos(lAvg) * (cartesian3s[i].x - opxyz.x) + Math.cos(bAvg) * Math.sin(lAvg) * (cartesian3s[i].y - opxyz.y) + Math.sin(bAvg) * (cartesian3s[i].z - opxyz.z);
                            var cartesian33 = new Cesium.Cartesian3(newx, newy, newz);
                            //ccc = newx;
                            cartesian3f.push(cartesian33);
                        }


                        //求取产状要素
                        var qingXiang = 0;
                        var qingJiao = 0;
                        //设拟合面的表达式为Ax+By+Cz+D = 0
                        var A = (cartesian3f[1].y - cartesian3f[0].y) * (cartesian3f[2].z - cartesian3f[0].z) - (cartesian3f[1].z - cartesian3f[0].z) * (cartesian3f[2].y - cartesian3f[0].y);
                        var B = (cartesian3f[1].z - cartesian3f[0].z) * (cartesian3f[2].x - cartesian3f[0].x) - (cartesian3f[1].x - cartesian3f[0].x) * (cartesian3f[2].z - cartesian3f[0].z);
                        var C = (cartesian3f[1].x - cartesian3f[0].x) * (cartesian3f[2].y - cartesian3f[0].y) - (cartesian3f[1].y - cartesian3f[0].y) * (cartesian3f[2].x - cartesian3f[0].x);

                        var nx = A / Math.sqrt(A * A + B * B + C * C);
                        var ny = B / Math.sqrt(A * A + B * B + C * C);
                        var nz = C / Math.sqrt(A * A + B * B + C * C);

                        if (nz == 0) {
                            qingJiao = 0.5 * Math.PI;
                            if (nx < 0) {
                                qingXiang = 2 * Math.PI - Math.acos(ny / Math.sqrt(nx * nx + ny * ny));
                            }
                            else {
                                qingXiang = Math.acos(ny / Math.sqrt(nx * nx + ny * ny));
                            }
                        }
                        else if (nz > 0) {
                            qingJiao = Math.acos(nz);
                            if (nx < 0) {
                                qingXiang = 2 * Math.PI - Math.acos(ny / Math.sqrt(nx * nx + ny * ny));
                            }
                            else {
                                qingXiang = Math.acos(ny / Math.sqrt(nx * nx + ny * ny));
                            }
                        }
                        else {
                            qingJiao = Math.acos(-nz);
                            if (nx < 0) {
                                qingXiang = 2 * Math.PI - Math.acos(-ny / Math.sqrt(nx * nx + ny * ny));
                            }
                            else {
                                qingXiang = Math.acos(-ny / Math.sqrt(nx * nx + ny * ny));
                            }
                        }
                        qingXiang = qingXiang * 180 / Math.PI;
                        qingJiao = qingJiao * 180 / Math.PI;

                      
                        //计算重心
                        viewer.entities.add({
                            name: "ptOccurrence" + NewGuid(),
                            //position: points[0],
                            position: Cesium.Cartesian3.fromDegrees(lSum / points.length, bSum / points.length, hSum / points.length),
                            label: {
                                text: '倾角为' + qingJiao.toFixed(2) + '度 \n 倾向为' + qingXiang.toFixed(2) + '度',
                                font: '14px Times New Roman',
                                showBackground: true,
                                backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            }
                        });
                        showCeliang = '倾角为' + qingJiao.toFixed(2) + '度， \n倾向为' + qingXiang.toFixed(2) + '度';
                        if (showCeliang != null) {
                            form.val("celianginfoform", {
                                "desc": showCeliang
                            });
                        }
                        isRedo = true;
                        points = [];
                    }

                }

            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        if (isMobile.any()) {
            //双指
            handler.setInputAction(function (pinch) {
                isRedo = true;
                clearAll();
            }, Cesium.ScreenSpaceEventType.PINCH_START);
        }
        else {
            //右击
            handler.setInputAction(function (rightclik) {
                isRedo = true;
                clearAll();
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }

    }

}

function getChanzhuang(positList) {
    points = positList;
    var cartesian3s = [];
    //var newcartesian3s = [];
    var bSum = 0;
    var lSum = 0;
    var hSum = 0;
    var minx = points[0].x;
    var miny = points[0].y;
    var minz = points[0].z;
    var maxHeight = Cesium.Cartographic.fromCartesian(points[0]).height;
    var minHeight = Cesium.Cartographic.fromCartesian(points[0]).height;
    for (var i = 0; i < points.length; i++) {
        var cartesian3 = points[i];
        cartesian3s.push(cartesian3);
        if (points[i].x < minx) {
            minx = points[i].x;
        }
        if (points[i].y < miny) {
            miny = points[i].y;
        }
        if (points[i].z < minz) {
            minz = points[i].z;
        }
        var rblh = Cesium.Cartographic.fromCartesian(points[i]);
        bSum += rblh.latitude * 180 / Math.PI;
        lSum += rblh.longitude * 180 / Math.PI;
        hSum += rblh.height;
        if (rblh.height > maxHeight) {
            maxHeight = rblh.height;
        }
        if (rblh.height < minHeight) {
            minHeight = rblh.height;
        }
    }
    var bAvg = bSum * Math.PI / 180 / points.length;
    var lAvg = lSum * Math.PI / 180 / points.length;
    var hAvg = hSum / points.length;

    var opblh = new Cesium.Cartographic(lAvg, bAvg, hAvg);
    //转换后的坐标原点
    var opxyz = Cesium.Cartesian3.fromDegrees(opblh.longitude, opblh.latitude, opblh.height);





    //var ccc = 0;     调试用
    var cartesian3f = [];
    //cartesian3f = cartesian3s; //调试用
    for (var i = 0; i < cartesian3s.length; i++) {
        var newx = -Math.sin(lAvg) * (cartesian3s[i].x - opxyz.x) + Math.cos(lAvg) * (cartesian3s[i].y - opxyz.y);
        var newy = -Math.sin(bAvg) * Math.cos(lAvg) * (cartesian3s[i].x - opxyz.x) - Math.sin(bAvg) * Math.sin(lAvg) * (cartesian3s[i].y - opxyz.y) + Math.cos(bAvg) * (cartesian3s[i].z - opxyz.z);
        var newz = Math.cos(bAvg) * Math.cos(lAvg) * (cartesian3s[i].x - opxyz.x) + Math.cos(bAvg) * Math.sin(lAvg) * (cartesian3s[i].y - opxyz.y) + Math.sin(bAvg) * (cartesian3s[i].z - opxyz.z);
        var cartesian33 = new Cesium.Cartesian3(newx, newy, newz);
        //ccc = newx;
        cartesian3f.push(cartesian33);
    }

    //求取产状要素
    var qingXiang = 0;
    var qingJiao = 0;
    //设拟合面的表达式为Ax+By+Cz+D = 0
    var A = (cartesian3f[1].y - cartesian3f[0].y) * (cartesian3f[2].z - cartesian3f[0].z) - (cartesian3f[1].z - cartesian3f[0].z) * (cartesian3f[2].y - cartesian3f[0].y);
    var B = (cartesian3f[1].z - cartesian3f[0].z) * (cartesian3f[2].x - cartesian3f[0].x) - (cartesian3f[1].x - cartesian3f[0].x) * (cartesian3f[2].z - cartesian3f[0].z);
    var C = (cartesian3f[1].x - cartesian3f[0].x) * (cartesian3f[2].y - cartesian3f[0].y) - (cartesian3f[1].y - cartesian3f[0].y) * (cartesian3f[2].x - cartesian3f[0].x);

    var nx = A / Math.sqrt(A * A + B * B + C * C);
    var ny = B / Math.sqrt(A * A + B * B + C * C);
    var nz = C / Math.sqrt(A * A + B * B + C * C);

    if (nz == 0) {
        qingJiao = 0.5 * Math.PI;
        if (nx < 0) {
            qingXiang = 2 * Math.PI - Math.acos(ny / Math.sqrt(nx * nx + ny * ny));
        }
        else {
            qingXiang = Math.acos(ny / Math.sqrt(nx * nx + ny * ny));
        }
    }
    else if (nz > 0) {
        qingJiao = Math.acos(nz);
        if (nx < 0) {
            qingXiang = 2 * Math.PI - Math.acos(ny / Math.sqrt(nx * nx + ny * ny));
        }
        else {
            qingXiang = Math.acos(ny / Math.sqrt(nx * nx + ny * ny));
        }
    }
    else {
        qingJiao = Math.acos(-nz);
        if (nx < 0) {
            qingXiang = 2 * Math.PI - Math.acos(-ny / Math.sqrt(nx * nx + ny * ny));
        }
        else {
            qingXiang = Math.acos(-ny / Math.sqrt(nx * nx + ny * ny));
        }
    }
    qingXiang = qingXiang * 180 / Math.PI;
    qingJiao = qingJiao * 180 / Math.PI;
    var tenp = {};
    tenp.qingXiang = qingXiang;
    tenp.qingJiao = qingJiao;
    return tenp;
}


function gotoJieli() {
    if (currentprojectid == null) {
        layer.msg('请先选择项目');
        return;
    }
    if (modleInfo == null) {
        layer.msg('请先选择模型');
        return;
    }
    if (jielitext!=null) {
        layer.msg('已打开节理窗口');
        return;
    }
    jielitext = layer.open({
        type: 1
        , title: ['节理采集', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
        , area: ['300px', '250px']
        , shade: 0
        , offset: ['130px', '260px']//头部，左边
        , closeBtn: 1
        , anim: 0
        , maxmin: true
        , moveOut: true
        , content: pdfjieli
        , zIndex: layer.zIndex
        , success: function (layero) {
            layer.setTop(layero);
            if (windowInfoList.length > 0) {
                for (var i in windowInfoList) {
                    document.getElementById("jieliIdSelectpdf").innerHTML += '<option value="' + windowInfoList[i].id + '">' + windowInfoList[i].name + '</option>';
                }
            };
           
            form.render();
            form.render('select');
            form.on('submit(querypdfjielisubmit)', function (data) {
                console.log(data);
                collector = data.field.collector;
                for (var i in windowInfoList) {
                    if (windowInfoList[i].id == data.field.jieliId) {
                        for (var j in layers[0].children) {
                            if (layers[0].children[j].type && layers[0].children[j].type == "FLZWINDOW" && layers[0].children[j].id == ("FLZWINDOW_" + data.field.jieliId)) {
                                windouinfo = windowInfoList[i];
                                console.log(windouinfo);
                                cequList = JSON.parse(windouinfo.vertices3dlbh);
                                var entityFater = viewer.entities.getById(layers[0].children[j].id);
                                if (entityFater == undefined) {

                                    //自己自己去实现，
                                    layers[0].spread = true;
                                    layers[0].children[j].spread = true;
                                    layers[0].children[j].checked = true;
                                    //功能强大
                                    tree.reload('prjlayerlistid', { data: layers });
                                    viewer.zoomTo(viewer.entities.getById(layers[0].children[j].id + "_LABEL"), new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-(parseFloat(layers[0].children[j].datas.level))), Cesium.Math.toRadians(parseFloat(layers[0].children[j].datas.vertical)), 40));
                                } else {
                                    viewer.zoomTo(viewer.entities.getById(layers[0].children[j].id + "_LABEL"), new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-(parseFloat(layers[0].children[j].datas.level))), Cesium.Math.toRadians(parseFloat(layers[0].children[j].datas.vertical)), 40));
                                }
                                break;
                            }
                        }

                    }
                }
                if (handler != undefined) {
                    handler.destroy();
                }
                handler = new Cesium.ScreenSpaceEventHandler(canvas);

                linepoints = [];
                //左击
                handler.setInputAction(function (leftclik) {
                    if (isRedo) {
                        ClearTemp();
                        isRedo = false;
                        points = [];
                        for (i = 0; i < 50; i++) {
                            viewer.entities.removeById("jielitemp" + i);
                        }
                    }
                    if (cequList.length == 0) {
                        layer.msg("请选择测区");
                        return;
                    }
                    var maxL = cequList[0].L;
                    var maxB = cequList[0].B;
                    var minL = cequList[0].L;
                    var minB = cequList[0].B;

                    for (var n in cequList) {
                        if (cequList[n].L > maxL) {
                            maxL = cequList[n].L;
                        }
                        if (cequList[n].L < minL) {
                            minL = cequList[n].L;
                        }
                        if (cequList[n].B > maxB) {
                            maxB = cequList[n].B;
                        }
                        if (cequList[n].B < minB) {
                            minB = cequList[n].B;
                        }

                    }
                    var pickedOject = scene.pick(leftclik.position);
                    if (pickedOject != undefined) {
                        var position = scene.pickPosition(leftclik.position);
                        var cartesian3 = Cesium.Cartographic.fromCartesian(position);                        //笛卡尔XYZ
                        var longitude = Cesium.Math.toDegrees(cartesian3.longitude);                         //经度
                        var latitude = Cesium.Math.toDegrees(cartesian3.latitude);
                        if (longitude < minL || longitude > maxL || latitude < minB || latitude > maxB) {
                            //判断点在测区外，
                            layer.msg('该点在测窗外了');
                            return;
                        }

                        if (position != undefined) {
                            linepoints.push(Cesium.Cartographic.fromCartesian(position));
                            if (Cesium.defined(position)) {
                                viewer.entities.add({
                                    id: "jielitemp" + points.length,
                                    position: position,
                                    point: {
                                        pixelSize: 3,
                                        color: Cesium.Color.RED
                                    }
                                });
                                points.push(position);
                            }
                        }
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                if (isMobile.any()) {
                    //双指
                    handler.setInputAction(function (pinch) {
                        if (points.length > 2) {

                            DrowHuaHua("jieli", linepoints, points);


                        }

                    }, Cesium.ScreenSpaceEventType.PINCH_START);
                }
                else {
                    //右击
                    handler.setInputAction(function (rightclik) {
                        if (points.length > 2) {

                            DrowHuaHua("jieli", linepoints, points);
                        }

                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
                }
                return false;
            });
            
        }
        , end: function () {
            jielitext = null;
        }
    });
    
}
