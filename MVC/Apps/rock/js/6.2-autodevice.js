
var profileInfo = '';
//查看点信息
var drwInfox = null;
function DrwInfo(data,flag) {
   
    console.log(data);
    if (flag == "view") {
        if (data.data.type == "ROCKPOINT") {
          drwInfox = layer.open({
                type: 1
                , title: ['点信息查看', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                , area: ['300px', '400px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: '<form class="layui-form" style="margin-top:5px;margin-right:25px;" lay-filter="addpointinfoform"><div class="layui-form-item" style="margin-top:15px;margin-right:5px;"><div class="layui-row"><div class="layui-col-md6"><div class="grid-demo grid-demo-bg1"><label class="layui-form-label">点名称</label><div class="layui-input-block"><input type="text" name="name" lay-verify="required" autocomplete="off" readonly="readonly" class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">经度</label><div class="layui-input-block"><input type="text" name="ls" lay-verify="required" autocomplete="off" readonly="readonly"  class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">纬度</label><div class="layui-input-block"><input type="text" name="bs" lay-verify="required" autocomplete="off" readonly="readonly"  class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">高程</label><div class="layui-input-block"><input type="text" name="hs" lay-verify="required" autocomplete="off" readonly="readonly"  class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">描述</label><div class="layui-input-block"><input type="text" name="remarks" lay-verify="required" autocomplete="off" readonly="readonly"  class="layui-input" style="width:160px;"  /></div></div></div></div></div></form>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero);
                    var cartesian3 = Cesium.Cartographic.fromCartesian(data.data.postion);                        //笛卡尔XYZ
                    var longitude = Cesium.Math.toDegrees(cartesian3.longitude);                         //经度
                    var latitude = Cesium.Math.toDegrees(cartesian3.latitude);                           //纬度
                    var height = cartesian3.height;
                    form.val("addpointinfoform", {
                        "name": data.data.title
                        , "remarks": data.data.remarks
                        , "ls": longitude.toFixed(6)
                        , "bs": latitude.toFixed(6)
                        , "hs": height.toFixed(2)
                    });


                    //展示项目设备总览

                }
                , end: function () {

                }
            });
        } else if (data.data.type == "PROFILE" || data.data.type == "MENSURE" || data.data.type == "PROBESLOT" || data.data.type == "DRILLHOLE" ) {//查看剖面
            drwInfox = layer.open({
                type: 1
                , title: ['信息查看', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                , area: ['300px', '400px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: seeprofileform
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero);
                 
                    form.val("seeprofileform", {
                        "name": data.data.title
                        , "code": data.data.data.code
                        , "type": data.data.data.type
                        , "remark": data.data.remark
                    });


                    //展示项目设备总览

                }
                , end: function () {
                    drwInfox = null;
                }
            });
        } else if (data.data.type == "ROCKLINE" || data.data.type == "ROCKAREA") {
            console.log(data);
            drwInfox = layer.open({
                type: 1
                , title: ['信息查看', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                , area: '700px'
                , shade: 0.3
                , offset: '60px'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: '<form class="layui-form" style="margin-top:5px;margin-right:25px;" lay-filter="addpointinfoform"><div class="layui-form-item" style="margin-top:15px;margin-right:5px;"><div class="layui-row"><div class="layui-col-md6"><div class="grid-demo grid-demo-bg1"><label class="layui-form-label">点名称</label><div class="layui-input-block"><input type="text" name="name" lay-verify="required" autocomplete="off" readonly="readonly" class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">描述</label><div class="layui-input-block"><input type="text" name="remarks" lay-verify="required" autocomplete="off" readonly="readonly"  class="layui-input" style="width:160px;"  /></div></div></div></div></div></form><div><table class="layui-hide" id="postion-view" lay-filter=postion-view"></table></div>'
                // , content: '<div><table class="layui-hide" id="postion-view" lay-filter=postion-view"></table></div>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero);

                    form.val("addpointinfoform", {
                        "name": data.data.title
                        , "remarks": data.data.remarks
                    });
                    //展示项目设备总览

                }
                , end: function () {

                }
            });
        }

        var postionviewtable = table.render({
            elem: '#postion-view'
            , id: 'postionviewid'
            , title: '点位信息'
            , skin: 'line'
            , even: false
            , page: {
                layout: ['prev', 'page', 'next', 'count']
            }
            , limit: 14
            // , initSort: { field: 'ls', type: 'asc' }
            , totalRow: false
            , cols: [[
                { field: 'x', title: 'X', align: "center" }
                , { field: 'y', title: 'Y', align: "center" }
                , { field: 'z', title: 'Z', align: "center" }
            ]]
            , data: []
        });
        postionviewtable.reload({ id: 'postionviewid', data: data.data.pointList });
    } else if (flag == "update") {
        if (data.data.type == "ROCKWINDOW") {//测窗
            var temptitle = data.data.title;
            drwInfox = layer.open({
                type: 1
                , title: ['确认修改', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                //, content: '/Apps/flz/widget/addinfoPoint.html'
                , content: '<form class="layui-form" style="margin-top:5px;margin-right:25px;" lay-filter="addpointinfoform"><div class="layui-form-item" style="margin-top:15px;margin-right:5px;"><div class="layui-row"><div class="layui-col-md6"><div class="grid-demo grid-demo-bg1"><label class="layui-form-label">名称</label><div class="layui-input-block"><input type="text" name="name" lay-verify="required" autocomplete="off" placeholder="请输入" class="layui-input" style="width:160px;"  /></div></div></div><div class="layui-col-md6" style="margin-top:15px;margin-right:5px;"><div class="grid-demo"><label class="layui-form-label">描述</label><div class="layui-input-block"><input type="text" name="remarks" lay-verify="required" autocomplete="off" placeholder="请输入"  class="layui-input" style="width:160px;"  /></div></div></div></div></div><div class="layui-form-item" style="margin-top:15px"><div style="position:absolute;right:15px;"><button type="reset" class="layui-btn layui-btn-primary" style="width:100px">重置</button><button type="submit" class="layui-btn" lay-submit="" lay-filter="addpointinfosubmit" style="width:100px">提交</button></div></div></form>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();
                    form.val("addpointinfoform", {
                        "name": data.data.title
                        , "remarks": data.data.datas.remarks
                    });

                    form.on('submit(addpointinfosubmit)', function (temp) {
                        data.data.title = temp.field.name;
                        data.data.remarks = temp.field.remarks;
                        //tree.reload(data.data.id, { data: data.data });

                        temp.field.id = data.data.id.split("_")[1];//把id往后面传
                        temp.field.cookie = document.cookie;
                        console.log(layers);
                        $.ajax({
                            url: servicesurl + "/api/FlzWindowInfo/UpdateFlzWindow", type: "post", data: temp.field,
                            success: function (result) {
                                //创建失败
                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                if ("更新成功" == result) {
                                    for (var i in layers[0].children) {
                                        if (data.data.id == layers[0].children[i].id) {
                                            layers[0].children[i].title = temp.field.name;
                                            layers[0].children[i].remarks = temp.field.remarks;
                                            layers[0].spread = true;
                                            layers[0].children[i].spread = true;
                                            break;
                                        }

                                    }

                                    tree.reload('prjlayerlistid', { data: layers });
                                    //关闭,更改图上显示
                                    if (data.data.checked) {
                                        var entity = viewer.entities.getById(data.data.id + "_LABEL");
                                        console.log(entity);
                                        entity.label.text = entity.label.text._value.replace(temptitle, temp.field.name);
                                    }
                                    var entity = viewer.entities.getById(data.id);
                                    layer.close(drwInfox);
                                }

                            }, datatype: "json"
                        });
                        return false;
                    });

                }
                , end: function () {
                    layer.close(drwInfox);
                }
            });

        } else if (data.data.type == "PROFILE") {//剖面
            var temptitle = data.data.title;
            drwInfox = layer.open({
                type: 1
                , title: ['剖面修改', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                ,offset: ['85px', '260px']
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
       
                , content: updateprofileform
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();
                    form.val("updprofileform", {
                        "name": data.data.title
                        , "code": data.data.data.code
                        , "remark": data.data.remark
                    });

                    form.on('submit(updprofileinfosubmit)', function (temp) {
                       
                        //tree.reload(data.data.id, { data: data.data });
                        // 重汇的剖面点 JSON.stringify(obj.data.title).replace(/\"/g, "") ;<p style="font-size:24px;font-weight:bold;text-align:center;">' + JSON.stringify(obj.data.title).replace(/\"/g, "") +'</p>
                        if (temppoints.length > 0) {//重绘了剖面
                            layer.confirm('<p style="font-size:16px">是否确定将' + data.data.title + '的剖面替换？</p><br/>',
                                {
                                    title: ['消息提示', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei;background-color:#68bc80'],
                                    area: ['400px', '250px'],
                                    shade: 0.5,
                                    shadeClose: true,
                                    closeBtn: 0,
                                    resize: false,
                                    zIndex: layer.zIndex,
                                    success: function (loadlayero) {
                                        layer.setTop(loadlayero);
                                    }
                                }, function (index) {
                                  
                                    temp.field.cookie = document.cookie;
                                    console.log(layers);
                                    layer.close(index);

                                    var cartesian3 = Cesium.Cartographic.fromCartesian(temppoints[0]);                        //笛卡尔XYZ
                                    var longitude = Cesium.Math.toDegrees(cartesian3.longitude);                         //经度
                                    var latitude = Cesium.Math.toDegrees(cartesian3.latitude);                           //纬度
                                    var height = cartesian3.height;                                                      //高度

                                    var cartesian31 = Cesium.Cartographic.fromCartesian(temppoints[1]);                        //笛卡尔XYZ
                                    var longitude1 = Cesium.Math.toDegrees(cartesian31.longitude);                         //经度
                                    var latitude1 = Cesium.Math.toDegrees(cartesian31.latitude);                           //纬度
                                    var height1 = cartesian31.height;                                                      //高度

                                    var x = 0;
                                    var y = 0;
                                    var x1 =0;
                                    var y1 = 0;
                                    if (height > height1) {//第一点高，高出，反算出高点
                                        x= (160 - height) / (height - height1) * (longitude - longitude1) + longitude; 
                                        y = (160 - height) / (height - height1) * (latitude - latitude1) + latitude; 
                                       


                                        x1 = longitude1 - (height1 - 110) / (height - height1) * (longitude - longitude1) ;
                                        y1 = latitude1 - (height1 - 110) / (height - height1) * (latitude - latitude1) ; 

                                    } else {
                                       x = (160 - height1) / (height1 - height) * (longitude1 - longitude) + longitude1;
                                       y = (160 - height1) / (height1 - height) * (latitude1 - latitude) + latitude1;

                                        x1 = longitude - (height - 110) / (height1 - height) * (longitude1 - longitude);
                                        y1 = latitude - (height - 110) / (height1 - height) * (latitude1 - latitude); 
                                   
                                    }
                                    
                                    var sendDate = {};
                                    sendDate.remark = temp.field.remark;
                                    var tempdata = data.data.data;
                                    tempdata.code = temp.field.code.replace(/'/, '');
                                    tempdata.name = temp.field.name.replace(/'/, '"');

                                    //用replace函数将字符串中的“; ”替换成“, ”, 代码为“a.replace(/;/, ',') ”, 然后将后的字符串重新赋值给原变量:

                                    tempdata.startPoint = { "B": y, "L": x, "H": 160 };
                                    tempdata.endPoint = { "B": y1, "L": x1, "H": 110 };
                                    sendDate.profilePostion = JSON.stringify(tempdata);
                                    sendDate.id = data.data.lineId;
                                    sendDate.cookie = document.cookie;
                                    console.log(sendDate);
                                    var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });

                                    $.ajax({
                                        url: servicesurl + "/api/RockDesign/UpdateRockDesignPoint", type: "post", data: sendDate,
                                        success: function (result) {
                                            layer.close(loadingceindex);
                                            
                                            if ("更新成功" == result) {
                                                for (var i in layers) {
                                                    if (layers[i].type == "DESIGN") {
                                                        for (var j in layers[i].children) {
                                                            for (var z in layers[i].children[j].children) {
                                                                if (layers[i].children[j].children[z].id==data.data.id) {
                                                                    layers[i].children[j].children[z].remark = temp.field.remark;
                                                                    layers[i].children[j].children[z].data = tempdata;
                                                                    layers[i].spread = true;
                                                                    layers[i].children[j].spread = true;
                                                                    layers[i].children[j].children[z].spread = true;
                                                                    layers[i].children[j].children[z].checked = true;
                                                                    for (var m in layers[i].children[j].children ) {
                                                                        if (layers[i].children[j].children[m].type=="PROBESLOT") {
                                                                            layers[i].children[j].children[m].profileinfo = tempdata;//把新数据数据放入
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                viewer.entities.removeById(data.data.id);
                                                viewer.entities.removeById(data.data.id + "_LABEL");
                                                modeljiazaiFlag = false;
                                                tree.reload('prjlayerlistid', { data: layers });
                                                //关闭,更改图上显示
                                                //if (data.data.checked) {
                                                //    var entity = viewer.entities.getById(data.data.id + "_LABEL");
                                                //    console.log(entity);
                                                //    entity.label.text = entity.label.text._value.replace(temptitle, temp.field.name);
                                                //}
                                               // var entity = viewer.entities.getById(data.id);
                                                temppoints = [];
                                                ClearTemp();
                                                layer.close(drwInfox);
                                            } else {
                                                //创建失败
                                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                            }

                                        }, datatype: "json"
                                    });
                                });
                        } else {//修改了要素
                            //暂时未处理
                        }
                        
                        

                       
                        return false;
                    });

                }
                , end: function () {
                    layer.close(drwInfox);
                }
            });

        } else if (data.data.type == "DRILLHOLE") {//钻孔修改
            var temptitle = data.data.title;
            drwInfox = layer.open({
                type: 1
                , title: ['钻孔修改', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                , offset: ['85px', '260px']
                , closeBtn: 1
                , maxmin: true
                , moveOut: true

                , content: updatedrillHoleform
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();
                    form.val("upddrillHoleform", {
                        "name": data.data.title
                        , "code": data.data.data.code
                        , "remark": data.data.remark
                    });

                    form.on('submit(upddrillHoleinfosubmit)', function (temp) {

                        if (temppoints.length > 0) {//重绘了剖面
                            layer.confirm('<p style="font-size:16px">是否确定将' + data.data.title + '的钻孔替换？</p><br/>',
                                {
                                    title: ['消息提示', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei;background-color:#68bc80'],
                                    area: ['300px', '200px'],
                                    shade: 0.5,
                                    shadeClose: true,
                                    closeBtn: 0,
                                    resize: false,
                                    zIndex: layer.zIndex,
                                    success: function (loadlayero) {
                                        layer.setTop(loadlayero);
                                    }
                                }, function (index) {

                                    temp.field.cookie = document.cookie;
                                    console.log(layers);
                                    layer.close(index);
                                    var sendDate = {};
                                    sendDate.remark = temp.field.remark;

                                    var cartesian3 = Cesium.Cartographic.fromCartesian(temppoints[0]);                        //笛卡尔XYZ
                                    var longitude = Cesium.Math.toDegrees(cartesian3.longitude);                         //经度
                                    var latitude = Cesium.Math.toDegrees(cartesian3.latitude);                           //纬度
                                    var height = cartesian3.height;                                                      //高度

                                    var tempdata = data.data.data;
                                    tempdata.code = temp.field.code;
                                    tempdata.name = temp.field.name;
                                    tempdata.position ={ "B": latitude, "L": longitude, "H": height };
                                    sendDate.drillHolePostion = JSON.stringify(tempdata);
                                    sendDate.id = data.data.pointId;
                                    sendDate.cookie = document.cookie;
                                    var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });

                                    $.ajax({
                                        url: servicesurl + "/api/RockDesign/UpdateRockDesignPoint", type: "post", data: sendDate,
                                        success: function (result) {
                                            layer.close(loadingceindex);

                                            if ("更新成功" == result) {
                                                for (var i in layers) {
                                                    if (layers[i].type == "DESIGN") {
                                                        for (var j in layers[i].children) {
                                                            for (var z in layers[i].children[j].children) {
                                                                if (layers[i].children[j].children[z].id == data.data.id) {
                                                                    layers[i].children[j].children[z].remark = temp.field.remark;
                                                                    layers[i].children[j].children[z].data.position = { "B": latitude, "L": longitude, "H": height };
                                                                    layers[i].children[j].children[z].data.code = temp.field.code;
                                                                    layers[i].children[j].children[z].data.name = temp.field.name;
                                                                    layers[i].spread = true;
                                                                    layers[i].children[j].spread = true;
                                                                    layers[i].children[j].children[z].spread = true;
                                                                    layers[i].children[j].children[z].checked = true;

                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                viewer.entities.removeById(data.data.id);
                                                viewer.entities.removeById(data.data.id + "_LABEL");
                                                modeljiazaiFlag = false;
                                                tree.reload('prjlayerlistid', { data: layers });
                                                //关闭,更改图上显示
                                                //if (data.data.checked) {
                                                //    var entity = viewer.entities.getById(data.data.id + "_LABEL");
                                                //    entity.label.text = entity.label.text._value.replace(temptitle, temp.field.name);
                                                //}
                                                //var entity = viewer.entities.getById(data.id);
                                                temppoints = [];
                                                ClearTemp();
                                                layer.close(drwInfox);
                                            } else {
                                                //创建失败
                                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                            }

                                        }, datatype: "json"
                                    });
                                });
                        } else {//修改了要素
                            //暂时未处理
                        }




                        return false;
                    });

                }
                , end: function () {
                    layer.close(drwInfox);
                }
            });

        } else if (data.data.type == "MENSURE") {//测窗修改


            var temptitle = data.data.title;
            drwInfox = layer.open({
                type: 1
                , title: ['测窗修改', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                , offset: ['85px', '260px']
                , closeBtn: 1
                , maxmin: true
                , moveOut: true

                , content: updatemeasurWindowform
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();
                    form.val("updmeasurWindowform", {
                        "name": data.data.title
                        , "code": data.data.data.code
                        , "remark": data.data.remark
                    });

                    form.on('submit(updmeasurWindowinfosubmit)', function (temp) {

                        if (temppoints.length > 0) {//重绘了测窗
                            layer.confirm('<p style="font-size:16px">是否确定将' + data.data.title + '的测窗替换？</p><br/>',
                                {
                                    title: ['消息提示', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei;background-color:#68bc80'],
                                    area: ['300px', '200px'],
                                    shade: 0.5,
                                    shadeClose: true,
                                    closeBtn: 0,
                                    resize: false,
                                    zIndex: layer.zIndex,
                                    success: function (loadlayero) {
                                        layer.setTop(loadlayero);
                                    }
                                }, function (index) {

                                  
                                     //var sendDate = {};
                                    //sendDate.remark = temp.field.remark;

                                    //var tempdata = data.data.data;
                                    //tempdata.code = temp.field.code;
                                    //tempdata.name = temp.field.name;
                                    //tempdata.position = temppoints[0];
                                    //sendDate.measurWindowPostion = JSON.stringify(tempdata);
                                    //sendDate.id = data.data.pointId;
                                    //sendDate.cookie = document.cookie;
                                    //var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });


                                    console.log(layers);
                                    layer.close(index);



                                    var sendDate = {};


                                   
                                    var windouinfo = temppoints[0];
                                    var pointList = windouinfo.Vertices3D1;
                                    
                                    var tempdata = data.data.data;
                                    tempdata.position = pointList;
                                    tempdata.code = temp.field.code;
                                    tempdata.name = temp.field.name;
                                    tempdata.wingdowinfo = windouinfo;

                                    var listTemp = data.data.list;
                                    for (var j in listTemp) {
                                        if (listTemp[j].code == tempdata.code) {//等于
                                            listTemp.splice(j, 1);
                                        }
                                    }
                                    listTemp.push(tempdata);

                                    sendDate.measurWindowPostion = JSON.stringify(listTemp);
                                    sendDate.remark = temp.field.remark;
                                    sendDate.id = data.data.lineId;
                                    sendDate.cookie = document.cookie;
                                    console.log(sendDate);

                                  

                                    var loadingceindex = layer.load(0, {
                                        shade: 0.2,
                                        zIndex: layer.zIndex,
                                        success: function (loadlayero) { layer.setTop(loadlayero); }
                                    });

                                    $.ajax({
                                        url: servicesurl + "/api/RockDesign/UpdateRockDesignPoint", type: "post", data: sendDate,
                                        success: function (result) {
                                            layer.close(loadingceindex);

                                            if ("更新成功" == result) {
                                                for (var i in layers) {
                                                    if (layers[i].type == "DESIGN") {
                                                        for (var j in layers[i].children) {
                                                            for (var z in layers[i].children[j].children) {
                                                                if (layers[i].children[j].children[z].id == data.data.id) {
                                                                    layers[i].children[j].children[z].data.position = pointList;
                                                                    layers[i].children[j].children[z].list = listTemp;
                                                                    layers[i].spread = true;
                                                                    layers[i].children[j].spread = true;
                                                                    layers[i].children[j].children[z].spread = true;
                                                                    layers[i].children[j].children[z].checked = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                viewer.entities.removeById(data.data.id);
                                                viewer.entities.removeById(data.data.id + "_LABEL");
                                                modeljiazaiFlag = false;
                                                tree.reload('prjlayerlistid', { data: layers });
                                                //关闭,更改图上显示
                                                //if (data.data.checked) {
                                                //    var entity = viewer.entities.getById(data.data.id + "_LABEL");
                                                //    console.log(entity);
                                                //    entity.label.text = entity.label.text._value.replace(temptitle, temp.field.name);
                                                //}
                                                temppoints = [];
                                                ClearTemp();
                                                layer.close(drwInfox);
                                            } else {
                                                //创建失败
                                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                            }

                                        }, datatype: "json"
                                    });


                                    
                                });
                        } else {//修改了要素
                            //暂时未处理
                        }




                        return false;
                    });

                }
                , end: function () {
                    layer.close(drwInfox);
                }
            });

        } else if (data.data.type == "PROBESLOT") {//探槽修改
            var temptitle = data.data.title;
            
            profileInfo = data.data.profileinfo;
            drwInfox = layer.open({
                type: 1
                , title: ['探槽修改', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                , area: ['300px', '300px']
                , shade: 0
                , offset: ['85px', '260px']
                , closeBtn: 1
                , maxmin: true
                , moveOut: true

                , content: updateprobeSlotform
                , zIndex: layer.zIndex
                , success: function (layero) {
                    //置顶
                    layer.setTop(layero);
                    form.render();
                    form.val("updprobeSlotform", {
                        "name": data.data.title
                        , "code": data.data.data.code
                        , "remark": data.data.remark
                    });

                    form.on('submit(updprobeSlotinfosubmit)', function (temp) {

                        if (temppoints.length > 0) {//重绘了探槽
                            layer.confirm('<p style="font-size:16px">是否确定将' + data.data.title + '的探槽替换？</p><br/>',
                                {
                                    title: ['消息提示', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei;background-color:#68bc80'],
                                    area: ['300px', '200px'],
                                    shade: 0.5,
                                    shadeClose: true,
                                    closeBtn: 0,
                                    resize: false,
                                    zIndex: layer.zIndex,
                                    success: function (loadlayero) {
                                        layer.setTop(loadlayero);
                                    }
                                }, function (index) {



                                    layer.close(index);



                                    var sendDate = {};

                                    
                                    var windouinfo = temppoints[0];
                                    var pointList = windouinfo.Vertices3D1;

                                    var tempdata = data.data.data;
                                    tempdata.position = pointList;
                                    tempdata.code = temp.field.code;
                                    tempdata.name = temp.field.name;
                                    tempdata.wingdowinfo = windouinfo;

                                    sendDate.probeSlotPostion = JSON.stringify(tempdata);
                                    sendDate.remark = temp.field.remark;
                                    sendDate.id = data.data.pointId;
                                    sendDate.cookie = document.cookie;
                                    var loadingceindex = layer.load(0, {
                                        shade: 0.2,
                                        zIndex: layer.zIndex,
                                        success: function (loadlayero) { layer.setTop(loadlayero); }
                                    });
                                    
                                    $.ajax({
                                        url: servicesurl + "/api/RockDesign/UpdateRockDesignPoint", type: "post", data: sendDate,
                                        success: function (result) {
                                            layer.close(loadingceindex);

                                            if ("更新成功" == result) {
                                                for (var i in layers) {
                                                    if (layers[i].type == "DESIGN") {
                                                        for (var j in layers[i].children) {
                                                            for (var z in layers[i].children[j].children) {
                                                                if (layers[i].children[j].children[z].id == data.data.id) {
                                                                    layers[i].children[j].children[z].data = tempdata;
                                                                    layers[i].children[j].children[z].remark = temp.field.remark; 
                                                                    layers[i].spread = true;
                                                                    layers[i].children[j].spread = true;
                                                                    layers[i].children[j].children[z].spread = true;
                                                                    layers[i].children[j].children[z].checked = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                viewer.entities.removeById(data.data.id);
                                                viewer.entities.removeById(data.data.id + "_LABEL");
                                                modeljiazaiFlag = false;
                                                tree.reload('prjlayerlistid', { data: layers });

                                                temppoints = [];
                                                ClearTemp();
                                                layer.close(drwInfox);
                                            } else {
                                                //创建失败
                                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                            }

                                        }, datatype: "json"
                                    });



                                });
                        } else {//修改了要素
                            //暂时未处理
                        }




                        return false;
                    });

                }
                , end: function () {
                    layer.close(drwInfox);
                }
            });

        } else {//最开始的点线面。
            var temptitle = data.data.title;
            if (data.data.type == "ROCKPOINT" || data.data.type == "ROCKLINE" || data.data.type == "ROCKAREA" ) {//节理信息修改
                drwInfox = layer.open({
                    type: 1
                    , title: ['确认修改', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
                    , area: ['300px', '300px']
                    , shade: 0.3
                    , offset: 'auto'
                    , closeBtn: 1
                    , maxmin: true
                    , moveOut: true
                    , content: jiegouupd 
                    , zIndex: layer.zIndex
                    , success: function (layero) {
                        //置顶
                        layer.setTop(layero);
                        form.render();
                        form.val("updpointinfoform", {
                            "name": data.data.title
                            , "remarks": data.data.remarks,

                        });

                        form.on('submit(updpointinfosubmit)', function (temp) {
                            data.data.title = temp.field.name;
                            data.data.remarks = temp.field.remarks;
                            //data.data.avgOpening = temp.field.avgOpening;
                            //tree.reload(data.data.id, { data: data.data });

                            temp.field.id = data.data.id.split("_")[1];//把id往后面传
                            temp.field.cookie = document.cookie;
                            var loadingceindex = layer.load(0, { shade: 0.2, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });

                            $.ajax({
                                url: servicesurl + "/api/RockData/UpdateRockPoint", type: "post", data: temp.field,
                                success: function (result) {
                                    layer.close(loadingceindex);
                                    //创建失败
                                    layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                    if ("更新成功" == result) {

                                           
                                        
                                        for (var i in biaoLayers) {
                                            for (var j in biaoLayers[i].children) {
                                                if (data.data.id == biaoLayers[i].children[j].id) {
                                                    biaoLayers[i].children[j].title = temp.field.name;
                                                    biaoLayers[i].children[j].remarks = temp.field.remarks;
                                                    biaoLayers[i].children[j].datas.remarks = temp.field.remarks;
                                                    biaoLayers[i].children[j].datas.name = temp.field.name;
                                                    biaoLayers[i].children[j].spread = true;
                                                    biaoLayers[i].spread = true;
                                                    break;
                                                }
                                            }
                                        }
                                        tree.reload('prjbiaoZhuListid', { data: biaoLayers });

                                       
                                        //关闭,更改图上显示
                                        if (data.data.checked) {
                                            var entity = viewer.entities.getById(data.data.id + "_LABEL");
                                            console.log(entity);
                                            entity.label.text = entity.label.text._value.replace(temptitle, temp.field.name);

                                        }
                                        var entity = viewer.entities.getById(data.id);
                                        layer.close(drwInfox);
                                    }

                                }, datatype: "json"
                            });
                            return false;
                        });

                    }
                    , end: function () {
                        layer.close(drwInfox);
                    }
                });
            }
            

        }
        
    }
}

