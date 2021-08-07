

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
                , shade: 0.3
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

        } else {//最开始的点线面。
            var temptitle = data.data.title;
            if (data.data.type == "ROCKPOINT" || data.data.type == "ROCKLINE") {//节理信息修改
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

