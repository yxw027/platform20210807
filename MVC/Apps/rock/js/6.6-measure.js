//测量widget
//测量。
var projectlayerlistceliangindex = null;   //测量模块
var handler;
var scene = viewer.scene;
var canvas = scene.canvas;
var isRedo = false;  
var points = [];          
var showCeliang = null;
function celiang() {
    if (projectlayerlistceliangindex != null) {
        layer.msg('已打开测量窗口');
        return;
    }
    //添加点标注，弹出框
    projectlayerlistceliangindex = layer.open({
        type: 1
        , title: ['测量', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
        , area: ['300px', '350px']
        , shade: 0
        , offset: ['85px', '260px']
        , closeBtn: 1
        //, maxmin: true
        , moveOut: true
        //, btn: ['坐标', '距离', '面积', '产状', '体积']
        , content: celinghtml
        , zIndex: layer.zIndex
        , success: function (layero) {
            //地形测量把深度监测设置为TRUE
           // viewer.scene.globe.depthTestAgainstTerrain = true;
            form.render();
            form.val("celianginfoform", {
                "desc": "",
                "celiangfangfa": "请选择测量方法"
            });
           // layer.min(projectindex)
            //置顶
        }, yes: function (index, layero) {

            form.val("celianginfoform", {
                "desc": "",
                "celiangfangfa":"请选择测量方法"
            });
            pointMeasure2();
            return false
        }
        , btn2: function (index, layero) {
            //按钮【按钮二】的回调
            //lengthMeasure2();

            form.val("celianginfoform", {
                "desc": ""
            });
            heightMeasure();
            return false
        }
        , btn3: function (index, layero) {
            //按钮【按钮三】的回调
            form.val("celianginfoform", {
                "desc": ""
            });

            areaMeasure2();

            return false
        }, btn4: function (index, layero) {
            //按钮【按钮二】的回调

            form.val("celianginfoform", {
                "desc": ""


            });
            getOccurrence();
            return false
        }
        , btn5: function (index, layero) {
            form.val("celianginfoform", {
                "desc": "待优化"
            });
            return false
        }
        , end: function () {
            viewer.scene.globe.depthTestAgainstTerrain = false;
            projectlayerlistceliangindex = null;
            //删除图层数据

        }
    });
};
//坐标量测
function pointMeasure2() {
        
    ClearCeliangTemp();
    form.val("celianginfoform", {
        "desc": "单击模型选择位置",
        "celiangfangfa": "坐标测量",
    });
        if (handler != undefined) {
            handler.destroy();
        }
        handler = new Cesium.ScreenSpaceEventHandler(canvas);

        //左击
        handler.setInputAction(function (leftclick) {
            var pickedOject = scene.pick(leftclick.position);
            if (pickedOject != undefined) {
                var position = scene.pickPosition(leftclick.position);
                if (position != undefined) {
                    var cartesian3 = Cesium.Cartographic.fromCartesian(position);                        //笛卡尔XYZ
                    var longitude = Cesium.Math.toDegrees(cartesian3.longitude);                         //经度
                    var latitude = Cesium.Math.toDegrees(cartesian3.latitude);                           //纬度
                    var height = cartesian3.height;                                                      //高度
                    console.log(longitude);
                    console.log(latitude);



                    if (height > 0) {
                        showCeliang = " 位置:" + "\n" + " X:" + position.x.toFixed(6) + "\n" + " Y:" + position.y.toFixed(6) + "\n" + " Z:" + position.z.toFixed(6);
                        if (Cesium.defined(position)) {
                            viewer.entities.add({
                                name: "ptMeasue" + NewGuidCL(),
                                position: position,
                                point: {
                                    pixelSize: 12,
                                    color: Cesium.Color.RED,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                }
                            });


                            //测试用
                            viewer.entities.add({
                                name: "ptlMeasue" + NewGuidCL(),
                                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
                                label: {
                                    text: '经纬度(' + longitude.toFixed(2) + ',' + latitude.toFixed(2) + ',' + (height + 31.80).toFixed(2) + ')',
                                    showBackground: true,
                                    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                    font: '16px Times New Roman',
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                    pixelOffset: new Cesium.Cartesian2(0.0, -60),

                                }
                            });
                            if (showCeliang != null) {
                                form.val("celianginfoform", {
                                    "desc": showCeliang
                                });
                            }
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
        
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
   
};
//生成随机数
function NewGuidCL() {
    return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
};
elem.on('tab(celianglayer)', function (data) {
    console.log(viewer.scene.globe); 
    if (this.getAttribute('lay-id') == "222") {
        //判断一下模型。项目
        if (currentprojectid == null) {
            layer.msg('请先选择项目');
            elem.tabChange('celianglayer', 111); //
            return;
        }
        if (modleInfo == null) {
            layer.msg('请先选择模型');
            elem.tabChange('celianglayer', 111); //
            return;
        }

        viewer.scene.globe.depthTestAgainstTerrain = false;
    } else {
        viewer.scene.globe.depthTestAgainstTerrain = true;
    }
});
//高度量测
function heightMeasure() {
        ClearCeliangTemp();
        form.val("celianginfoform", {
            "desc": "单击模型两个点求距离",
            "celiangfangfa": "距离测量",
        });
       
        if (handler != undefined) {
            handler.destroy();
        }
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        //左击
        handler.setInputAction(function (leftclik) {
        
            var pickedOject = scene.pick(leftclik.position);
            if (pickedOject != undefined) {
                var xyz = scene.pickPosition(leftclik.position);
                if (xyz != undefined) {
                    var rblh = Cesium.Cartographic.fromCartesian(xyz);

                    viewer.entities.add({
                        name: "ptMeasue" +NewGuidCL(),
                        position: xyz,
                        point: {
                            pixelSize: 10,
                            color: Cesium.Color.YELLOW,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });

                    points.push(xyz);

                    if (points.length == 2) {
                        var point = points[0];

                        viewer.entities.add({
                            name: "plMeasue" +NewGuidCL(),
                            polyline: {
                                positions: [point, xyz],
                                width: 2,
                                material: Cesium.Color.RED,
                                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                    color: Cesium.Color.RED,
                                }),


                            }
                        });

                        var rblh1 = Cesium.Cartographic.fromCartesian(point);
                        if (rblh1.height > rblh.height) {
                            var b = rblh.latitude * 180 / Math.PI;
                            var l = rblh.longitude * 180 / Math.PI;
                            var h = rblh.height;

                            viewer.entities.add({
                                name: "plMeasue" +NewGuidCL(),
                                polyline: {
                                    positions: [point, Cesium.Cartesian3.fromDegrees(l, b, rblh1.height)],
                                    width: 2,
                                    material: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.GREEN
                                    }),
                                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.GREEN
                                    }),
                                }
                            });
                            viewer.entities.add({
                                name: "plMeasue" +NewGuidCL(),
                                polyline: {
                                    positions: [xyz, Cesium.Cartesian3.fromDegrees(l, b, rblh1.height)],
                                    width: 2,
                                    material: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.BLUE
                                    }),
                                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.BLUE
                                    }),
                                }
                            });

                            viewer.entities.add({
                                name: "pllMeasue" +NewGuidCL(),
                                position: Cesium.Cartesian3.fromDegrees(l, b, (rblh1.height + h) / 2),
                                // position: Cesium.Cartesian3.fromDegrees(l, b, rblh1.height),
                                label: {
                                    text: '高差：' + (rblh1.height - h).toFixed(2) + '米',
                                    showBackground: true,
                                    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                    font: '16px Times New Roman',
                                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                    //pixelOffset: new Cesium.Cartesian2(0.0, -60),
                                }
                            });
                            var sum = Cesium.Cartesian3.distance(points[0], points[1]);
                            viewer.entities.add({
                                name: "pllMeasue" +NewGuidCL(),
                                position: Cesium.Cartesian3.fromDegrees((l + rblh1.longitude * 180 / Math.PI) / 2, (b + rblh1.latitude * 180 / Math.PI) / 2, (rblh1.height + h) / 2),

                                label: {
                                    text: '距离：' + sum.toFixed(2) + '米',
                                    showBackground: true,
                                    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                    font: '16px Times New Roman',
                                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                    //pixelOffset: new Cesium.Cartesian2(0.0, -60),
                                }
                            });
                            var pingju = Math.sqrt(Math.pow(sum, 2) - Math.pow(rblh1.height - h, 2));
                            viewer.entities.add({
                                name: "pllMeasue" +NewGuidCL(),
                                position: Cesium.Cartesian3.fromDegrees((l + rblh1.longitude * 180 / Math.PI) / 2, (b + rblh1.latitude * 180 / Math.PI) / 2, rblh1.height),

                                label: {
                                    text: '平距：' + pingju.toFixed(2) + '米',
                                    showBackground: true,
                                    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                    font: '16px Times New Roman',
                                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                    //pixelOffset: new Cesium.Cartesian2(0.0, -60),
                                }
                            });
                            showCeliang = " 距离:" + sum.toFixed(2) + "\n" + " 平距:" + pingju.toFixed(2) + "\n" + " 高差:" + (rblh1.height - h).toFixed(2);
                            if (showCeliang != null) {
                                form.val("celianginfoform", {
                                    "desc": showCeliang
                                });
                            }
                            isRedo = true;
                            points = [];
                        }
                        else if (rblh1.height < rblh.height) {
                            var b = rblh1.latitude * 180 / Math.PI;
                            var l = rblh1.longitude * 180 / Math.PI;
                            var h = rblh1.height;


                            viewer.entities.add({
                                name: "plMeasue" +NewGuidCL(),
                                polyline: {
                                    positions: [point, Cesium.Cartesian3.fromDegrees(l, b, rblh.height)],
                                    width: 2,
                                    material: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.GREEN
                                    }),
                                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.GREEN
                                    }),
                                }
                            });

                            viewer.entities.add({
                                name: "plMeasue" +NewGuidCL(),
                                polyline: {
                                    positions: [xyz, Cesium.Cartesian3.fromDegrees(l, b, rblh.height)],
                                    width: 2,
                                    material: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.BLUE
                                    }),
                                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                        color: Cesium.Color.BLUE
                                    }),
                                }
                            });
                            viewer.entities.add({
                                name: "pllMeasue" +NewGuidCL(),
                                position: Cesium.Cartesian3.fromDegrees(l, b, (rblh.height + h) / 2),
                                // position: Cesium.Cartesian3.fromDegrees(l, b, rblh.height),
                                label: {
                                    text: '高差：' + (rblh.height - h).toFixed(2) + '米',
                                    showBackground: true,
                                    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                    font: '16px Times New Roman',
                                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                }
                            });
                            var sum = Cesium.Cartesian3.distance(points[0], points[1]);
                            viewer.entities.add({
                                name: "pllMeasue" +NewGuidCL(),
                                position: Cesium.Cartesian3.fromDegrees((l + rblh.longitude * 180 / Math.PI) / 2, (b + rblh.latitude * 180 / Math.PI) / 2, (rblh.height + h) / 2),

                                label: {
                                    text: '距离：' + sum.toFixed(2) + '米',
                                    showBackground: true,
                                    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                    font: '16px Times New Roman',
                                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                    //pixelOffset: new Cesium.Cartesian2(0.0, -60),
                                }
                            });
                            var pingju = Math.sqrt(Math.pow(sum, 2) - Math.pow(rblh.height - h, 2));
                            viewer.entities.add({
                                name: "pllMeasue" +NewGuidCL(),
                                position: Cesium.Cartesian3.fromDegrees((l + rblh.longitude * 180 / Math.PI) / 2, (b + rblh.latitude * 180 / Math.PI) / 2, rblh.height),

                                label: {
                                    text: '平距：' + pingju.toFixed(2) + '米',
                                    showBackground: true,
                                    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                    font: '16px Times New Roman',
                                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                                    //pixelOffset: new Cesium.Cartesian2(0.0, -60),
                                }
                            });
                            showCeliang = " 距离:" + sum.toFixed(2) + "\n" + " 平距:" + pingju.toFixed(2) + "\n" + " 高差:" + (rblh.height - h).toFixed(2);
                            if (showCeliang != null) {
                                form.val("celianginfoform", {
                                    "desc": showCeliang
                                });
                            }
                            isRedo = true;
                            points = [];
                        }
                        else {

                        }

                        //针对移动设备
                        if (isMobile.any()) {
                            if (handler != undefined) {
                                handler.destroy();
                            }
                        }
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
};
/*
面积计算包括表面积、投影面积计算
投影面积计算过程：
（1）获取空间直角坐标XYZ
（2）转换为大地坐标BLH
（3）转换为平面直角坐标xy
（4）计算面积
*/
function areaMeasure2() {
    //本面积计算方法为：将所有点转换为大地坐标BLH，然后将H赋值为最大H，再转换为空间直角坐标XYZ，取XY计算面积
    ClearCeliangTemp();
    form.val("celianginfoform", {
        "desc": "左击模型定义曲面，右击完成",
        "celiangfangfa": "面积测量",
    });
    
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
                    viewer.entities.add({
                        name: "ptMeasue" + NewGuidCL(),
                        position: position,
                        point: {
                            pixelSize: 10,
                            color: Cesium.Color.YELLOW,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        },

                    });
                    points.push(position);
                }
                if (points.length > 1) {
                    var point = points[points.length - 2];
                    viewer.entities.add({
                        name: "plMeasue" + NewGuidCL(),
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
                            material: Cesium.Color.RED,
                            depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                color: Cesium.Color.RED,
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
                                material: Cesium.Color.RED,
                                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                    color: Cesium.Color.RED,
                                }),
                            }
                        });
                    }
                }
            }
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
   
    //右击
    handler.setInputAction(function (rightclik) {

        if (points.length > 2) {
            if (viewer.entities.getById("line_temp9999") != null) {
                viewer.entities.removeById("line_temp9999");
            }
            if (viewer.entities.getById("line_temp9998") != null) {
                viewer.entities.removeById("line_temp9998");
            }
            //if (handler != undefined) {
            //    handler.destroy();
            //}
            var cartesian3s = [];
            var newcartesian3s = [];
            var maxHeight = Cesium.Cartographic.fromCartesian(points[0]).height;
            var minHeight = Cesium.Cartographic.fromCartesian(points[0]).height;
            var bSum = 0;
            var lSum = 0;
            var hSum = 0;
            for (var i = 0; i < points.length; i++) {
                var cartesian3 = points[i];
                cartesian3s.push(cartesian3);
                var rblh = Cesium.Cartographic.fromCartesian(points[i]);
                var blh = new Cesium.Cartesian3(rblh.latitude * 180 / Math.PI, rblh.longitude * 180 / Math.PI, rblh.height);
                newcartesian3s.push(blh);
                bSum += rblh.latitude * 180 / Math.PI;
                lSum += rblh.longitude * 180 / Math.PI;
                hSum += rblh.height;
                if (rblh.height < minHeight) {
                    minHeight = rblh.height;
                }
                if (rblh.height > maxHeight) {
                    maxHeight = rblh.height;
                }
            }


            viewer.entities.add({
                name: "plMeasue" + NewGuidCL(),
                polyline: {
                    positions: [points[0], points[points.length - 1]],
                    width: 2,
                    arcType: Cesium.ArcType.RHUMB,
                    material: Cesium.Color.RED,
                    depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                        color: Cesium.Color.RED,
                    }),
                }
            });

            //计算面积




            var area = jisuarea(points);
            var sum = Cesium.Cartesian3.distance(points[points.length - 1], points[0]);
            for (var i = 0; i < points.length - 1; i++) {
                var point1 = points[i];
                var point2 = points[i + 1];

                var distance = Cesium.Cartesian3.distance(point1, point2)
                if (distance == NaN) {
                    break;
                }
                else {
                    sum += distance;
                }
            }
            //计算重心
            viewer.entities.add({
                name: "pylMeasue" + NewGuidCL(),
                position: Cesium.Cartesian3.fromDegrees(lSum / points.length, bSum / points.length, hSum / points.length),
                label: {
                    text: '面积：' + area.toFixed(2) + '平方米  \n  周长：' + sum.toFixed(2) + '米',
                    showBackground: true,
                    backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                    font: '16px Times New Roman',
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                    // pixelOffset: new Cesium.Cartesian2(0.0, -60),
                }
            });

            showCeliang = " 面积:" + area.toFixed(2) + '平方米   ' + "\n" + " 周长:" + sum.toFixed(2) + '米';
            if (showCeliang != null) {
                form.val("celianginfoform", {
                    "desc": showCeliang
                });
            }
            //isRedo = true;
            points = [];
            //setTimeout(() => {
            //    areaMeasure2()
            //}, 1000);
        }

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    
};
var celinghtml = "	<div class='layui-tab layui-tab-brief' lay-filter='celianglayer'>								"
    + "		<ul class='layui-tab-title'>							"
    + "			<li lay-id='111' class='layui-this' style='width:30%;padding-top: 10px;'>地形测量</li>						"
    + "			<li lay-id='222' style='width:30%;padding-top: 10px;'>模型测量</li>						"
    + "		</ul>							"
    + "		<div class='layui-tab-content'>							"
    + "			<div class='layui-tab-item layui-show'>						"
    + "  <form class='layui-form' style='margin-top:5px;margin-right:15px;' lay-filter='celianginfoform'>                                                                                                              "
    + "	 <div class=' class='layui-form-item layui-form-tex'>                                                      "
    + "	                                                                                       "
    + "	   <label class='layui-form-label'>地形测量</label>                                                       "
    + "	   <div class='layui-input-block' style='white-space':'pre'>                                                                                  "
    + "		<textarea name='desc'  class='layui-textarea'></textarea>   "
    + "	   </div>                                                                                                              "
    + "	                                                                                                                "
    + "	 </div>                                                                                                                "
    //+ "	 <div class=' class='layui-form-item layui-form-tex'>                                                      "
    //+ "	                                                                                       "
    //+ "	   <label class='layui-form-label'>测量方式</label>                                                       "
    //+ "	   <div class='layui-input-block' style='white-space':'pre'>                                                                                  "
    //+ "		<input name='celiangfangfa'  class='layui-input' readonly></input>   "
    //+ "	   </div>                                                                                                              "
    //+ "	                                                                                                                "
    //+ "	 </div>                                                                                                                "
    + "	</form>                                                                                                                 "
    //+ "<div class='layui-btn-container' style='margin-top:15px '>                          "
    //+ "  <button type='button' class='layui-btn layui-btn-primary layui-btn-sm' onclick='pointMeasure2()'>坐标</button>"
    //+ "  <button type='button' class='layui-btn layui-btn-primary layui-btn-sm' onclick='heightMeasure()'>距离</button>"
    //+ "  <button type='button' class='layui-btn layui-btn-primary layui-btn-sm' onclick='areaMeasure2()'>面积</button>"
    //+ "  <button type='button' class='layui-btn layui-btn-primary layui-btn-sm' onclick='pointMeasure2()'>体积</button>"
    //+ "</div>"
    + "			</div>						"
    + "			<div class='layui-tab-item'>						"
    + "  <form class='layui-form' style='margin-top:5px;margin-right:15px;' lay-filter='celianginfoform'>                                                                                                              "
    + "	 <div class=' class='layui-form-item layui-form-tex'>                                                      "
    + "	                                                                                       "
    + "	   <label class='layui-form-label'>模型测量</label>                                                       "
    + "	   <div class='layui-input-block' style='white-space':'pre'>                                                                                  "
    + "		<textarea name='desc'  class='layui-textarea'></textarea>   "
    + "	   </div>                                                                                                              "
    + "	                                                                                                                "
    + "	 </div>                                                                                                                "
    + "	 <div class=' class='layui-form-item layui-form-tex'>                                                      "
    + "	                                                                                       "
    + "	   <label class='layui-form-label'>测量方式</label>                                                       "
    + "	   <div class='layui-input-block' style='white-space':'pre'>                                                                                  "
    + "		<input name='celiangfangfa'  class='layui-input' readonly></input>   "
    + "	   </div>                                                                                                              "
    + "	                                                                                                                "
    + "	 </div>                                                                                                                "
    + "	</form>                                                                                                                 "
    + "<div class='layui-btn-container' style='margin-top:15px;text-align:center '>                          "
    + "  <button type='button' class='layui-btn layui-btn-primary layui-btn-sm' onclick='pointMeasure2()'>坐标</button>"
    + "  <button type='button' class='layui-btn layui-btn-primary layui-btn-sm' onclick='heightMeasure()'>距离</button>"
    + "  <button type='button' class='layui-btn layui-btn-primary layui-btn-sm' onclick='areaMeasure2()'>面积</button>"
    //+ "  <button type='button' class='layui-btn layui-btn-primary layui-btn-sm' onclick='pointMeasure2()'>体积</button>"
    + "</div>"
    + "<div  style='text-align:center'>                          "
    + "  <button type='button' style='width:60%' class='layui-btn layui-btn-fluid layui-btn-danger' onclick='ClearCeliangTemp()'>清除</button>"

    + "</div>"
    + "			</div>						"
    + "		</div>							"
    + "	</div>								";
//清除临时图形
function ClearCeliangTemp() {
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
    form.val("celianginfoform", {
        "desc": "",
        "celiangfangfa": "请选择测量方法"
    });
    if (handler != undefined) {
        handler.destroy();
    }
    points = [];
}
function jisuarea(postList) {
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
    return area;
}