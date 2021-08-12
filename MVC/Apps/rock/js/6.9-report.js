﻿//重画剖面
var temppoints = []; //装点的
function drowProfile() {
    if (modleInfo == null) {
        layer.msg('请先选择模型');
        return;
    }
    ClearTemp();
    temppoints = [];
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

                    temppoints.push(position);
                    
                    //temppoints.push({ "B": latitude, "L": longitude, "H": height});

                    viewer.entities.add({
                        name: "ptMeasue" + NewGuid(),
                        position: position,
                        point: {
                            pixelSize: 10,
                            color: Cesium.Color.YELLOW,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });

                    if (temppoints.length == 2) {
                        var point = temppoints[temppoints.length - 2];
                        //polylineOnModel("plMeasue" + NewGuid(), [point, position], 0.05, 10, Cesium.Color.AQUAMARINE);     
                        if (viewer.entities.getById("line_temp9999") != null) {
                            viewer.entities.removeById("line_temp9999");
                        }
                        if (handler != undefined) {
                            handler.destroy();
                        }
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
                }
            }
        } else {
            layer.msg('请点击模型');
            return;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //移动
    handler.setInputAction(function (move) {
        if (temppoints.length > 0) {
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
                            positions: [temppoints[temppoints.length - 1], XYZ],
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

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //右击
    //handler.setInputAction(function (rightclik) {
    //    if (viewer.entities.getById("line_temp9999") != null) {
    //        viewer.entities.removeById("line_temp9999");
    //    }
    //    if (handler != undefined) {
    //        handler.destroy();
    //    }
    //    viewer._container.style.cursor = "default";//还原鼠标样式
    //    if (temppoints.length > 1) {
    //        DrowHuaHua("line", temppoints);

    //    }

    //}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        
    
};
//画钻孔
function drowdrillHole() {
    if (modleInfo == null) {
        layer.msg('请先选择模型');
        return;
    }
    
    
    if (handler != undefined) {
        handler.destroy();
    }

    handler = new Cesium.ScreenSpaceEventHandler(canvas);
    //左击
    handler.setInputAction(function (leftclik) {
        temppoints = [];
        ClearTemp();
        var pickedOject = scene.pick(leftclik.position);
        if (pickedOject != undefined) {
            var position = scene.pickPosition(leftclik.position);
            if (position != undefined) {
                if (Cesium.defined(position)) {

                    temppoints.push(position);

                    viewer.entities.add({
                        name: "ptMeasue" + NewGuid(),
                        position: position,
                        point: {
                            pixelSize: 10,
                            color: Cesium.Color.YELLOW,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });
                }
            }
        } else {
            layer.msg('请点击模型');
            return;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
   
};
//画测窗
function drowmeasurWindow() {
    if (modleInfo == null) {
        layer.msg('请先选择模型');
        return;
    }
    if (handler != undefined) {
        handler.destroy();
    }
    temppoints = [];
    ClearTemp();
    handler = new Cesium.ScreenSpaceEventHandler(canvas);
    //左击
    handler.setInputAction(function (leftclik) {
        
        var pickedOject = scene.pick(leftclik.position);
        if (pickedOject != undefined) {
            var position = scene.pickPosition(leftclik.position);
            if (position != undefined) {
                if (Cesium.defined(position)) {
                    viewer.entities.add({
                        name: "ptMeasue" + NewGuid(),
                        position: position,
                        point: {
                            pixelSize: 1,
                            color: Cesium.Color.YELLOW,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });
                    
                    //var sideLength = 1.8;
                    var tempx = new Cesium.Cartesian2(leftclik.position.x + 1, leftclik.position.y);
                    var tempx1 = new Cesium.Cartesian2(leftclik.position.x, leftclik.position.y+1);
                    var tempy = new Cesium.Cartesian2(leftclik.position.x, leftclik.position.y);
                  
                    
                    var biliciy = Cesium.Cartesian3.distance(scene.pickPosition(tempy), scene.pickPosition(tempx1));

                    var bilicixx = Math.sqrt((scene.pickPosition(tempy).x - scene.pickPosition(tempx).x) * (scene.pickPosition(tempy).x - scene.pickPosition(tempx).x) + (scene.pickPosition(tempy).y - scene.pickPosition(tempx).y) * (scene.pickPosition(tempy).y - scene.pickPosition(tempx).y));
                  

                    var canshu1 = 1.5 / biliciy;
                    var canshu2 = 2 / bilicixx;

                    var fangxiang = new Cesium.Cartesian2(leftclik.position.x - 100, leftclik.position.y);
                    
                    //绘制多边形临时边线
                    //viewer.entities.add({

                    //    name: "ptMeasue" + NewGuid(),
                    //    polyline: {
                    //        positions: trem,
                    //        width: 1,
                    //        arcType: Cesium.ArcType.RHUMB,
                    //        material: Cesium.Color.YELLOW,
                    //        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    //            color: Cesium.Color.YELLOW,
                    //        }),
                    //    }
                    //});
                    
                    var eyepostion = new Cesium.Cartesian3(viewer.camera.position.x, viewer.camera.position.y, viewer.camera.position.z);

                    //var tremlist = [];
                   // tremlist.push(eyepostion);
                    //视野点四下

                    //linepoints = trem;
                    //// 眼睛点
                    //eyespoints = eyepostion;
                    //points = trem;

                    //var distancev = Cesium.Cartesian3.distance(cartesian3a, cartesian3b);
                    //if (distancev > 10) {
                    //    layer.msg('选择的点形成的测区超过了模型范围，请重新选择！');
                    //    return;
                    //}
                    //绘制多边形临时边线
                   // points.push(points[0]);
                    var jimiList = [];
                    jimiList.push(scene.pickPosition(fangxiang));
                    for (var x = 0; x < 11; x++) {
                        for (var m = 0; m < 11; m++) {

                            var temp = new Cesium.Cartesian2(leftclik.position.x - canshu2 + 0.2 * canshu2 * x , leftclik.position.y - canshu1 + 0.2 * canshu1*m);//b点，加了5.

                            jimiList.push(scene.pickPosition(temp));
                        }
                    }

                    ////绘制多边形临时边线
                    //viewer.entities.add({

                    //    name: "ptMeasue" + NewGuid(),
                    //    polyline: {
                    //        positions: jimiList,
                    //        width: 0.5,
                    //        arcType: Cesium.ArcType.RHUMB,
                    //        material: Cesium.Color.YELLOW,
                    //        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    //            color: Cesium.Color.YELLOW,
                    //        }),
                    //    }
                    //});

                    var sendDate = {};

          
                    sendDate.target = JSON.stringify(position);
                    sendDate.eye = JSON.stringify(eyepostion);
                    sendDate.sps = JSON.stringify(jimiList);
                    sendDate.w = 4;
                    sendDate.h = 3;
                    sendDate.cookie = document.cookie;
                    var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });

                    $.ajax({
                        url: servicesurl + "/api/FlzWindowInfo/getRockWindowInfo", type: "post", data: sendDate,//后台发送请求
                        success: function (result) {


                            layer.close(loadingceindex);
                            //关闭
                            var windowInfos = JSON.parse(result);
                            console.log(windowInfos);
                            if (windowInfos == null) {
                                layer.close(drowinfoAddlayerindex);
                                layer.msg("调用接口计算失败，请重新选择位置，所选的点不能形成平面", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                               
                                if (handler != undefined) {
                                    handler.destroy();
                                }

                                isRedo = true;
                                points = [];
                                linepoints = [];
                                return false;
                            }
                            if (windowInfos == "") {
                                layer.msg("调用接口结算失败，请稍后再试", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                            } else {
                                var BLHList = windowInfos.Vertices3D1;
                                BLHList.push(BLHList[0]);
                                var positList = [];
                            
                                for (var i in BLHList) {
                                    //经纬度，现在的坐标，转换三维。
                                    positList.push(new Cesium.Cartesian3.fromDegrees(BLHList[i].L, BLHList[i].B, BLHList[i].H));
                                  
                                }
                                
                                temppoints.push(windowInfos);
                                //console.log(positList);
                                //console.log(windowInfos.Vertices3D);
                                //var dList3 = windowInfos.Vertices3D;
                                //var dList3temp = [];
                                //for (var j in dList3) {
                                //    dList3temp.push(new Cesium.Cartesian3(dList3[j].X, dList3[j].Y, dList3[j].Z));
                                //}
                                //console.log(dList3temp);
                                //绘制多边形临时边线
                                //viewer.entities.add({

                                //    name: "ptMeasue" + NewGuid(),
                                //    polyline: {
                                //        positions: dList3temp,
                                //        width: 1,
                                //        arcType: Cesium.ArcType.RHUMB,
                                //        material: Cesium.Color.BLUE,
                                //        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                //            color: Cesium.Color.BLUE,
                                //        }),
                                //    }
                                //});
                                //绘制多边形临时边线
                               
                                viewer.entities.add({

                                    name: "ptMeasue" + NewGuid(),
                                    polyline: {
                                        positions: positList,
                                        width: 1,
                                        arcType: Cesium.ArcType.RHUMB,
                                        material: new Cesium.PolylineDashMaterialProperty({
                                            color: Cesium.Color.YELLOW,
                                        }),
                                        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                            color: Cesium.Color.YELLOW,
                                        }),
                                    }
                                });
                       
                                if (handler != undefined) {
                                    handler.destroy();
                                }


                                //data.field.cookie = document.cookie;
                                //data.field.points = JSON.stringify(positList);//直接存吧
                                //data.field.projectId = currentprojectid;
                                //data.field.creatTime = y + '-' + (mouth < 10 ? '0' + mouth : mouth) + '-' + (d < 10 ? '0' + d : d);

                                //data.field.axisx = JSON.stringify(windowInfos.AxisX);//x轴
                                //data.field.axisy = JSON.stringify(windowInfos.AxisY);//y轴   Normal Origin Vertices2D Vertices3D Vertices3D1
                                //data.field.normal = JSON.stringify(windowInfos.Normal);//法向量
                                //data.field.origin = JSON.stringify(windowInfos.Origin);//原点
                                //data.field.vertices2d = JSON.stringify(windowInfos.Vertices2D);//平，面
                                //data.field.vertices3d = JSON.stringify(windowInfos.Vertices3D);//空间执教
                                //data.field.vertices3dlbh = JSON.stringify(windowInfos.Vertices3D1);//大地坐标
                                ////我算一个倾角不，倾角算出来，倾向，倾角。
                                //var tempList = [];
                                //tempList.push(positList[0]);
                                //tempList.push(positList[1]);
                                //tempList.push(positList[2]);
                                //var chanzhuang = getChanzhuang(positList);
                                //var qingXiang = parseFloat(chanzhuang.qingXiang) - 180;
                                //var qingJiao = parseFloat(chanzhuang.qingJiao) - 90;
                                //data.field.level = qingXiang.toFixed(2);
                                //data.field.vertical = qingJiao.toFixed(2);
                                //data.field.height = maxHeihts.toFixed(2);
                                
                            }

                        }, datatype: "json"
                    });
                    //viewer.entities.add({
                    //    name: "ptMeasue" + NewGuid(),
                    //    polyline: {
                    //        positions: points,
                    //        width: 2,
                    //        arcType: Cesium.ArcType.RHUMB,
                    //        material: Cesium.Color.RED,
                    //        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    //            color: Cesium.Color.RED,
                    //        }),
                    //    }
                    //});
                    //if (Cesium.defined(position)) {

                    //    DrowHuaHua('newwindow', points, 'guding');

                    //}
                 
                }
            }
        } else {
            layer.msg('请点击模型');
            return;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

};
//画探槽
function drowprobeSlot() {
    if (modleInfo == null) {
        layer.msg('请先选择模型');
        return;
    }
    if (handler != undefined) {
        handler.destroy();
    }
    temppoints = [];
    ClearTemp();
    handler = new Cesium.ScreenSpaceEventHandler(canvas);
    //左击
    handler.setInputAction(function (leftclik) {

        var pickedOject = scene.pick(leftclik.position);
        if (pickedOject != undefined) {
            var position = scene.pickPosition(leftclik.position);
            if (position != undefined) {
                if (Cesium.defined(position)) {

                    temppoints.push(position);

                    viewer.entities.add({
                        name: "ptMeasue" + NewGuid(),
                        position: position,
                        point: {
                            pixelSize: 1,
                            color: Cesium.Color.YELLOW,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });

                    //var sideLength = 1.8;
                    var tempx = new Cesium.Cartesian2(leftclik.position.x + 1, leftclik.position.y);
                    var tempx1 = new Cesium.Cartesian2(leftclik.position.x, leftclik.position.y + 1);
                    var tempy = new Cesium.Cartesian2(leftclik.position.x, leftclik.position.y);


                    var biliciy = Cesium.Cartesian3.distance(scene.pickPosition(tempy), scene.pickPosition(tempx1));

                    var bilicixx = Math.sqrt((scene.pickPosition(tempy).x - scene.pickPosition(tempx).x) * (scene.pickPosition(tempy).x - scene.pickPosition(tempx).x) + (scene.pickPosition(tempy).y - scene.pickPosition(tempx).y) * (scene.pickPosition(tempy).y - scene.pickPosition(tempx).y));


                    var canshu1 = 1.5 / biliciy;
                    var canshu2 = 2 / bilicixx;



                    var eyepostion = new Cesium.Cartesian3(viewer.camera.position.x, viewer.camera.position.y, viewer.camera.position.z);


                    var jimiList = [];
                    for (var x = 0; x < 11; x++) {
                        for (var m = 0; m < 11; m++) {

                            var temp = new Cesium.Cartesian2(leftclik.position.x - canshu2 + 0.2 * canshu2 * x, leftclik.position.y - canshu1 + 0.2 * canshu1 * m);//b点，加了5.

                            jimiList.push(scene.pickPosition(temp));
                        }
                    }



                    var sendDate = {};

                    sendDate.target = JSON.stringify(position);
                    sendDate.eye = JSON.stringify(eyepostion);
                    sendDate.sps = JSON.stringify(jimiList);
                    sendDate.w = 4;
                    sendDate.h = 3;
                    sendDate.cookie = document.cookie;
                    console.log(sendDate);
                    var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });
                    return;
                    $.ajax({
                        url: servicesurl + "/api/FlzWindowInfo/getRockWindowInfo", type: "post", data: sendDate,//后台发送请求
                        success: function (result) {


                            layer.close(loadingceindex);
                            //关闭
                            var windowInfos = JSON.parse(result);
                            console.log(windowInfos);
                            if (windowInfos == null) {
                                layer.close(drowinfoAddlayerindex);
                                layer.msg("调用接口计算失败，请重新选择位置，所选的点不能形成平面", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                modeljiazaiFlag = false;
                                tree.reload('prjlayerlistid', { data: layers });
                                ClearTemp();

                                if (handler != undefined) {
                                    handler.destroy();
                                }

                                isRedo = true;
                                points = [];
                                linepoints = [];
                                return false;
                            }
                            if (windowInfos == "") {
                                layer.msg("调用接口结算失败，请稍后再试", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                            } else {
                                var BLHList = windowInfos.Vertices3D1;
                                var positList = [];
                                var maxHeihts = 0;

                                
                                for (var i in BLHList) {
                                    if (BLHList[i].L == "NaN") {
                                        layer.msg("请旋转模型到合适位置", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                        return;
                                    }
                                    var postions = new Cesium.Cartographic(Math.PI / 180 * BLHList[i].L, Math.PI / 180 * BLHList[i].B);

                                    var Heights = viewer.scene.sampleHeight(postions);
                                    if (Heights > maxHeihts) {
                                        maxHeihts = Heights;
                                    }
                                    //经纬度，现在的坐标，转换三维。
                                    positList.push(new Cesium.Cartesian3.fromDegrees(BLHList[i].L, BLHList[i].B, Heights));

                                }
                                positList.push(positList[0]);
                                temppoints = positList;

                                //绘制多边形临时边线
                                viewer.entities.add({

                                    name: "ptMeasue" + NewGuid(),
                                    polyline: {
                                        positions: positList,
                                        width: 1,
                                        arcType: Cesium.ArcType.RHUMB,
                                        material: Cesium.Color.RED,
                                        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                            color: Cesium.Color.RED,
                                        }),
                                    }
                                });
                            }

                        }, datatype: "json"
                    });


                }
            }
        } else {
            layer.msg('请点击模型');
            return;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

};