//标注列表widget
var biaoLayers = [];
var moidsendhist = "";
function LoadBiaozhunListLayer() {
    if (currentprojectid == null) {
        layer.msg("请先选择当前项目！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
    }
    else {
        // if (projectbiaoZhuListlayerindex == null) {
        var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });
        var data={};
        data.cookie = document.cookie;
        data.projectId = currentprojectid;
        data.modleId = modleInfo.id.split('_')[1];
        data.user = ViewBag.User;

        data.type = null;

        moidsendhist = data.modleId;//把历史记录存起来
        //请求图层列表
        $.ajax({
            url: servicesurl + "/api/RockData/GetBiaozhunListInfo", type: "get", data: data,
            success: function (data) {
                layer.close(loadingceindex);
                if (data == "") {
                    layer.msg("无标注信息！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                }
                else {
                    var biaoZhuList = JSON.parse(data);
                    console.log(biaoZhuList);
                    biaoLayers = [];//图层列表数据
                    
                   

                    //监测图层（监测点、监测剖面）
                    if (biaoZhuList!= null && biaoZhuList.length>0) {
                        var pointList = [];
                        var lineList = [];
                        var noodlesList = [];
                        for (var i = 0; i < biaoZhuList.length; i++) {
                            if ("1" == biaoZhuList[i].type) {
                                pointList.push(biaoZhuList[i]);
                            } else if ("2" == biaoZhuList[i].type) {
                                lineList.push(biaoZhuList[i]);
                            } else if ("3" == biaoZhuList[i].type) {
                                noodlesList.push(biaoZhuList[i]);
                            }
                        }
                        //点
                        if (pointList != null && pointList.length > 0) {
                            var rockpointlayer = new Object;
                            rockpointlayer.title = "点数据";
                            rockpointlayer.type = "ROCKPOINT";
                            rockpointlayer.checked = false;
                            rockpointlayer.showCheckbox = true;//显示复选框
                            var rockpointlayerchild = [];
                            for (var i = 0; i < pointList.length; i++) {
                                var postion = JSON.parse(pointList[i].postion);
                                var rockpoint = new Object;
                                rockpoint.title = pointList[i].name;
                                rockpoint.id = "ROCKPOINT_" + pointList[i].id;
                                rockpoint.type = "ROCKPOINT";
                                rockpoint.remarks = pointList[i].remarks;
                                rockpoint.pointId = pointList[i].id;
                                rockpoint.src = "../../"+pointList[i].src;
                                rockpoint.colour = pointList[i].colour;
                                rockpoint.postion = postion;
                                rockpoint.checked = false;
                                rockpoint.showCheckbox = true;//显示复选框

                                rockpoint.datas = pointList[i];
                                rockpointlayerchild.push(rockpoint);

                            }
                            rockpointlayer.children = rockpointlayerchild;
                            biaoLayers.push(rockpointlayer);

                        }
                        //线
                        if (lineList != null && lineList.length > 0) {
                            var rocklinelayer = new Object;
                            rocklinelayer.title = "长度标注";
                            rocklinelayer.type = "ROCKLINE";
                            rocklinelayer.checked = false;
                            rocklinelayer.showCheckbox = true;//显示复选框
                            var rocklinelayerchild = [];
                            for (var i = 0; i < lineList.length; i++) {
                                var pointListtem = JSON.parse(lineList[i].postion);
                                var xSum = 0;//求一个平均点，用于定位
                                var ySum = 0;
                                var zSum = 0;
                                for (var m = 0; m < pointListtem.length; m++) {
                                    xSum = xSum + parseFloat(pointListtem[m].x);
                                    ySum = ySum + parseFloat(pointListtem[m].y);
                                    zSum = zSum + parseFloat(pointListtem[m].z);
                                }


                                var rockline = new Object;
                                rockline.Centerx = xSum / pointListtem.length;
                                rockline.Centery = ySum / pointListtem.length;
                                rockline.Centerz = zSum / pointListtem.length;
                                rockline.title = lineList[i].name;
                                rockline.id = "ROCKLINE_" + lineList[i].id;
                                rockline.type = "ROCKLINE";
                                rockline.remarks = lineList[i].remarks;
                                rockline.lineId = lineList[i].id;
                                rockline.pointList = pointListtem;
                                rockline.colour = lineList[i].colour;
                                rockline.lineSize = lineList[i].lineSize;
                                rockline.datas = lineList[i];
                                rockline.checked = false;
                                rockline.showCheckbox = true;//显示复选框
                                rocklinelayerchild.push(rockline);

                            }
                            rocklinelayer.children = rocklinelayerchild;
                            biaoLayers.push(rocklinelayer);

                        }
                        //面
                        if (noodlesList != null && noodlesList.length > 0) {
                            var rocknoodleslayer = new Object;
                            rocknoodleslayer.title = "面标注";
                            rocknoodleslayer.type = "ROCKAREA";
                            rocknoodleslayer.checked = false;
                            rocknoodleslayer.showCheckbox = true;//显示复选框
                            var rocknoodleslayerchild = [];
                            for (var i = 0; i < noodlesList.length; i++) {
                                var pointListtem = JSON.parse(noodlesList[i].postion);
                                var xSum = 0;//求一个平均点，用于定位
                                var ySum = 0;
                                var zSum = 0;
                                for (var m = 0; m < pointListtem.length; m++) {
                                    xSum = xSum + parseFloat(pointListtem[m].x);
                                    ySum = ySum + parseFloat(pointListtem[m].y);
                                    zSum = zSum + parseFloat(pointListtem[m].z);
                                }



                                var rocknoodles = new Object;
                                rocknoodles.Centerx = xSum / pointListtem.length;
                                rocknoodles.Centery = ySum / pointListtem.length;
                                rocknoodles.Centerz = zSum / pointListtem.length;
                                rocknoodles.title = noodlesList[i].name;
                                rocknoodles.id = "ROCKAREA_" + noodlesList[i].id;
                                rocknoodles.type = "ROCKAREA";
                                rocknoodles.remarks = noodlesList[i].remarks;
                                rocknoodles.noodlesId = noodlesList[i].id;
                                rocknoodles.pointList = pointListtem;
                                rocknoodles.colour = noodlesList[i].colour; 
                                rocknoodles.lineType = noodlesList[i].lineType;
                                rocknoodles.datas = noodlesList[i];
                                rocknoodles.checked = false;
                                rocknoodles.showCheckbox = true;//显示复选框
                                rocknoodleslayerchild.push(rocknoodles);

                            }
                            rocknoodleslayer.children = rocknoodleslayerchild;
                            biaoLayers.push(rocknoodleslayer);

                        }
                        console.log(biaoLayers);
                    }


                    //TODO MORE LAYER

                    console.log(biaoLayers);
                    if (projectindex != null) {
                        tree.render({
                            elem: '#prjbiaoZhuList'
                            , id: 'prjbiaoZhuListid'
                            , edit: ['add', 'update', 'del']
                            , showCheckbox: true
                            , customCheckbox: true
                            , showLine: false
                            , data: biaoLayers
                            , accordion: false
                            , click: function (obj) {
                                //点击事件
                                //如果选中就缩放到目标
                                //如果未选中就不做任何处理
                                var data = obj.data;
                                console.log(data);
                                if (data.checked) {
                                    if (data.children != undefined) {
                                        var entities = [];
                                        for (var i in data.children) {
                                            var entity = viewer.entities.getById(data.children[i].id)
                                            if (entity != undefined) {
                                                entities.push(entity);
                                            }
                                        }

                                        if (entities.length > 0) {
                                            viewer.zoomTo(entities);
                                        }

                                    }
                                    else {
                                        if (data.type == "ROCKAREA") {// || data.type == "YOUSHIMIAN"
                                            //viewer.zoomTo(viewer.entities.getById(data.id + "_LABEL"));
                                            console.log(data);
                                            viewer.zoomTo(viewer.entities.getById(data.id + "_LABEL"), new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-90), 0));
                                        }  else {
                                            viewer.zoomTo(viewer.entities.getById(data.id), new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-90), 0))
                                        } 
                                        

                                    }
                                }

                            }
                            , oncheck: function (obj) {
                                //根据选中状态在地图中添加元素
                                var checked = obj.checked;
                                var data = obj.data;

                                //TODO解决模型多选


                                if (checked) {
                                    if (data.children != undefined) {
                                        //多选
                                        if (data.type == "ROCKPOINT") {
                                            //全选监测点
                                            for (var i in data.children) {
                                                var entity = viewer.entities.getById(data.children[i].id);
                                                if (entity == undefined) {
                                                    //当无此元素添加
                                                    viewer.entities.add({
                                                        id: data.children[i].id,
                                                        position: data.children[i].postion,
                                                        billboard: {
                                                            image: data.children[i].src,
                                                            color: Cesium.Color.fromCssColorString(data.children[i].colour),
                                                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                                            width: 24,
                                                            height: 24,
                                                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                                                        }
                                                    });
                                                }

                                                var entitylabel = viewer.entities.getById(data.children[i].id + "_LABEL");
                                                if (entitylabel == undefined) {
                                                    viewer.entities.add({
                                                        id: data.children[i].id + "_LABEL",
                                                        position: data.children[i].postion,
                                                        label: {
                                                            text: data.children[i].title,
                                                            font: '16px Times New Roman',
                                                            showBackground: true,
                                                            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                                            fillColor: Cesium.Color.fromCssColorString(data.children[i].colour),
                                                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                                            pixelOffset: new Cesium.Cartesian2(0.0, -36),
                                                            eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                                                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                                                        }
                                                    });
                                                }

                                                data.children[i].checked = true;
                                            }
                                        }
                                        else if (data.type == "ROCKLINE") {
                                            //全选线
                                            for (var i in data.children) {
                                                var entity = viewer.entities.getById(data.children[i].id);
                                                if (entity == undefined) {
                                                    var line = data.children[i].pointList;
                                                    var sum = 0;

                                                    for (var x = 0; x < line.length - 1; x++) {
                                                        var point1 = line[x];
                                                        var point2 = line[x + 1];

                                                        var distance = Cesium.Cartesian3.distance(point1, point2)
                                                        if (distance == NaN) {
                                                            sum = 0;
                                                            break;
                                                        }
                                                        else {
                                                            sum += distance;
                                                        }
                                                    }
                                                    console.log(data);
                                                    viewer.entities.add({
                                                        id: data.children[i].id,
                                                        polyline: {
                                                            positions: line,
                                                            width: data.children[i].lineSize,
                                                            material: Cesium.Color.fromCssColorString(data.children[i].colour),
                                                            depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                                                color: Cesium.Color.fromCssColorString(data.children[i].colour)
                                                            }),
                                                        }
                                                    });

                                                    viewer.entities.add({
                                                        id: data.children[i].id + "_LABEL",
                                                        position: new Cesium.Cartesian3(data.children[i].Centerx, data.children[i].Centery, data.children[i].Centerz),
                                                        label: {
                                                            text: data.children[i].title + '-长度：' + sum.toFixed(2) + '米',
                                                            font: '12px Times New Roman',
                                                            showBackground: true,
                                                            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                                            fillColor: Cesium.Color.fromCssColorString(data.children[i].colour),
                                                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                                            pixelOffset: new Cesium.Cartesian2(0.0, -60),
                                                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                                                        }

                                                    });

                                                }

                                                data.children[i].checked = true;
                                            }
                                        } else if (data.type == "ROCKAREA") {


                                            console.log(data);
                                            //点击的线
                                            //全选监测剖面
                                            for (var i in data.children) {
                                                var entity = viewer.entities.getById(data.children[i].id);
                                                if (entity == undefined) {
                                                    var points = data.children[i].pointList;
                                                    
                                                    viewer.entities.add({
                                                        id: data.children[i].id,
                                                        polygon: {
                                                            hierarchy: {
                                                                positions: points
                                                            }, 
                                                            material: Cesium.Color.fromCssColorString(data.children[i].colour).withAlpha(data.children[i].lineType),
                                                        }
                                                    });
                                                    var areamianji = jisumianji(points);

                                                    //计算重心
                                                    viewer.entities.add({
                                                        id: data.children[i].id + "_LABEL",
                                                        position: new Cesium.Cartesian3(data.children[i].Centerx, data.children[i].Centery, data.children[i].Centerz),
                                                        label: {
                                                            text: data.children[i].title + '面积：' + areamianji.toFixed(2) + '平方米',
                                                            showBackground: true,
                                                            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                                            font: '12px Times New Roman',
                                                            fillColor: Cesium.Color.fromCssColorString(data.children[i].colour),
                                                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                                            pixelOffset: new Cesium.Cartesian2(0.0, -10),
                                                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                                                        }
                                                    });
                                                    
                                                }

                                                data.children[i].checked = true;
                                            }
                                        } 


                                        data.checked = true;
                                    }
                                    else {
                                        //单选
                                        if (data.type == "ROCKPOINT") {
                                            //监测点
                                            var entity = viewer.entities.getById(data.id);
                                            if (entity == undefined) {
                                                //当无此元素添加
                                                viewer.entities.add({
                                                    id: data.id,
                                                    position: data.postion,//new Cesium.Cartesian3.fromDegrees(data.lbh.ls, data.lbh.bs, data.lbh.hs),
                                                    billboard: {
                                                        image: data.src,
                                                        color: Cesium.Color.fromCssColorString(data.colour),
                                                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                                        width: 24,
                                                        height: 24,
                                                        disableDepthTestDistance : Number.POSITIVE_INFINITY
                                                    }
                                                });
                                            }

                                            var entitylabel = viewer.entities.getById(data.id + "_LABEL");
                                            if (entitylabel == undefined) {
                                                viewer.entities.add({
                                                    id: data.id + "_LABEL",
                                                    position: data.postion,
                                                    label: {
                                                        text: data.title,
                                                        font: '16px Times New Roman',
                                                        showBackground: true,
                                                        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                                        verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                                        pixelOffset: new Cesium.Cartesian2(0.0, -36),
                                                        eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                                                        fillColor: Cesium.Color.fromCssColorString(data.colour),
                                                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                                                    }
                                                });
                                            }

                                            data.checked = true;
                                        }
                                        else if (data.type == "ROCKLINE") {
                                            //点击的线
                                            console.log(data);
                                            var sum = 0;
                                            var entity = viewer.entities.getById(data.id);
                                            if (entity == undefined) {
                                                var line = data.pointList;
                                                for (var i = 0; i < line.length - 1; i++) {
                                                    var point1 = line[i];
                                                    var point2 = line[i + 1];

                                                    var distance = Cesium.Cartesian3.distance(point1, point2)
                                                    if (distance == NaN) {
                                                        sum = 0;
                                                        break;
                                                    }
                                                    else {
                                                        sum += distance;
                                                    }
                                                }


                                                var points = data.pointList;
                                                viewer.entities.add({
                                                    id: data.id,
                                                    polyline: {
                                                        positions: line,
                                                        width: data.lineSize,
                                                        material: Cesium.Color.fromCssColorString(data.colour),
                                                        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                                                            color: Cesium.Color.fromCssColorString(data.colour)
                                                        }),
                                                    }
                                                });

                                                viewer.entities.add({
                                                    id: data.id + "_LABEL",
                                                    position: new Cesium.Cartesian3(data.Centerx, data.Centery, data.Centerz),
                                                    label: {
                                                        text: data.title + '-长度：' + sum.toFixed(2) + '米',
                                                        font: '12px Times New Roman',
                                                        showBackground: true,
                                                        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                                        fillColor: Cesium.Color.fromCssColorString(data.colour),
                                                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                                        verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                                        pixelOffset: new Cesium.Cartesian2(0.0, -60),
                                                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                                                    }
                                                   

                                                });


                                            }

                                            data.checked = true;
                                        } else if (data.type == "ROCKAREA") {

                                            console.log(data);
                                            //点击的线
                                            var entity = viewer.entities.getById(data.id);
                                            if (entity == undefined) {
                                                var points = data.pointList;
                                                points.push(points[0]);
                                                viewer.entities.add({
                                                    id: data.id,
                                                    polygon: {
                                                        hierarchy: {
                                                            positions: points
                                                        },
                                                        material: Cesium.Color.fromCssColorString(data.colour).withAlpha(data.lineType),
                                                        
                                                    }
                                                });
                                               


                                                data.checked = true;

                                                var areamianji = jisumianji(points);
                                                //计算重心
                                                viewer.entities.add({
                                                    id: data.id + "_LABEL",
                                                    position: new Cesium.Cartesian3(data.Centerx, data.Centery, data.Centerz),
                                                    label: {
                                                        text: data.title + '面积：' + areamianji.toFixed(2) + '平方米',
                                                        showBackground: true,
                                                        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                                                        font: '15px Times New Roman',
                                                        fillColor: Cesium.Color.fromCssColorString(data.colour),
                                                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                                        verticalOrigin: Cesium.VerticalOrigin.CENTER,
                                                        pixelOffset: new Cesium.Cartesian2(0.0, -10),
                                                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                                                    }
                                                });


                                            }

                                            data.checked = true;
                                        }
                                    }

                                }
                                else {
                                    if (data.children != undefined) {
                                        for (var i in data.children) {
                                            viewer.entities.removeById(data.children[i].id);
                                            viewer.entities.removeById(data.children[i].id + "_LABEL");
                                            data.children[i].checked = false;
                                        }
                                        
                                        data.checked = false;
                                    }
                                    else {
                                        
                                        viewer.entities.removeById(data.id);
                                        viewer.entities.removeById(data.id + "_LABEL");
                                        data.checked = false;
                                    }

                                }

                            }

                            , operate: function (obj) {
                                var type = obj.type; //得到操作类型：add、edit、del
                                var data = obj.data; //得到当前节点的数据
                                var elem = obj.elem; //得到当前节点元素

                                var id = data.id;
                                var name = data.title;
                                console.log(obj);
                                if (type === 'add') { //增加节点，查看
                                    DrwInfo(obj, "view");
                                    return;
                                } else if (type === 'update') { //修改节点
                                    DrwInfo(obj, "update");
                                } else if (type === 'del') { //删除节点
                                    
                                        var loadinglayerindex = layer.load(0, { shade: false, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });

                                        $.ajax({
                                            url: servicesurl + "/api/RockData/DeleteRockPoint", type: "delete", data: { "id": obj.data.id.split("_")[1], "cookie": document.cookie },
                                            success: function (result) {
                                                layer.close(loadinglayerindex);
                                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                                viewer.entities.removeById(obj.data.id);
                                                viewer.entities.removeById(obj.data.id + "_LABEL");
                                                for (var i in biaoLayers) {
                                                    for (var j in biaoLayers[i].children) {
                                                        if (obj.data.id == biaoLayers[i].children[j].id) {
                                                            biaoLayers[i].children[j].splice(j, 1);
                                                            break;
                                                        }
                                                    }
                                                }
                                                
                                                tree.reload('prjbiaoZhuListid', { data: biaoLayers });
                                            }, datatype: "json"
                                        });
                                    


                                };
                            }
                        });

                    }

                }

            }, datatype: "json"
        });

        //}

    }

}

