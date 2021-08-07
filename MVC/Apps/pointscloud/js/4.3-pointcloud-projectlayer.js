//弹出项目列表widget
layer.open({
    type: 1
    , title: ['项目列表', 'font-weight:bold;font-size:large;font-family:	Microsoft YaHei']
    , area: ['350px', '450px']
    , shade: 0
    , offset: ['60px', '10px']
    , closeBtn: 0
    , maxmin: true
    , moveOut: true
    , content:'<!--工具栏--><div class="layui-row" style="position:absolute;top:5px;width:100%">    <!--搜索-->    <div class="layui-col-md6" style="width:70%">        <div class="grid-demo grid-demo-bg1">            <input type="text" id="projectfilter" lay-verify="title" autocomplete="off" placeholder="搜索" class="layui-input" style="left:30px;height:30px;padding-left:35px;border-radius:5px">        </div>    </div>    <!--创建项目-->    <div class="layui-col-md2" style="width:10%">        <div class="grid-demo">            <button id="projectadd" type="button" class="layui-btn layui-btn-primary layui-btn-sm" style="border-style:hidden;float:right"><i class="layui-icon layui-icon-add-circle" style="margin-right:0px"></i></button>        </div>    </div>    <!--选择文件-->    <div class="layui-col-md2" style="width:10%">        <div class="grid-demo">            <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="selectpcdata" style="border-style:hidden;float:right"><i class="layui-icon layui-icon-file-b" style="margin-right:0px"></i></button>        </div>    </div>    <!--文件上传-->    <div class="layui-col-md2" style="width:10%">        <div class="grid-demo">            <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="startupload" style="border-style:hidden;float:right"><i class="layui-icon layui-icon-upload-circle" style="margin-right:0px"></i></button>        </div>    </div></div><!--项目列表--><div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief"     style="margin-top:30px">    <!--选项卡-->    <ul class="layui-tab-title">        <li class="layui-this" style="width:90%;padding-top: 3px;">            项目        </li>    </ul>    <!--tree-->    <div class="layui-tab-content">        <div class="layui-tab-item layui-show" id="projectbyname"></div>        <div class="layui-tab-item" id="projectbytime"></div>    </div></div>'
    , zIndex: layer.zIndex
    , success: function (layero) {
        layer.setTop(layero);
        PointCloudProjectList();
    }
});



var projectdatagroupname = [];//按项目名称排序
var layers = [];//图层列表数据
var layerlist;
//获取点云项目树形LAYUI
function PointCloudProjectList() {
    $.ajax({
        url: servicesurl + "/api/PointCloudProject/GetPCloudProjectList", type: "get", data: { "cookie": document.cookie },
        success: function (data) {


            if (data == "") {
                layer.msg("无项目信息！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
            }
            else {
                layerlist = JSON.parse(data);
                console.log(layerlist);
                layers = [];//图层列表数据
                //构建项目树
                if (layerlist.PCloudProjectList != null) {
                    for (var i in layerlist.PCloudProjectList) {
                        var project = new Object;
                        project.title = layerlist.PCloudProjectList[i].XMMC;
                        project.type = 'project';
                        project.id = layerlist.PCloudProjectList[i].Id;
                        var projectchild = [];
                            //项目区域
                        for (var j in layerlist.PCloudProjectList[i].RegionList) {
                            if (layerlist.PCloudProjectList[i].RegionList[j] != null) {
                                var regionchild = [];
                                regionchild.title = layerlist.PCloudProjectList[i].RegionList[j].RegionName;
                                regionchild.id = layerlist.PCloudProjectList[i].RegionList[j].Id;
                                regionchild.type = 'region';
                                var regionchildson = [];
                                for (var n in layerlist.PCloudProjectList[i].RegionList[j].PCloudDataList) {
                                    if (layerlist.PCloudProjectList[i].RegionList[j].PCloudDataList[n] != null) {
                                        var pcdata = new Object;
                                        pcdata.title = layerlist.PCloudProjectList[i].RegionList[j].PCloudDataList[n].CJSJ.substring(0, 4) + "-"+layerlist.PCloudProjectList[i].RegionList[j].PCloudDataList[n].Id;
                                        pcdata.id = layerlist.PCloudProjectList[i].RegionList[j].PCloudDataList[n].Id;
                                        pcdata.type = 'pcdata';
                                        pcdata.checked = false;
                                        //   pcdata.showCheckbox = true;//显示复选框
                                        regionchildson.push(pcdata);
                                        regionchild.children = regionchildson;
                                        regionchild.push(regionchildson);
                                    }
                                }
                                projectchild.children = regionchild;
                                projectchild.push(regionchild)
                            }

                        }

                        //三维实景模型
                        if (layerlist.PCloudProjectList[i].surModels != null) {
                            var prjsurmodel = new Object;
                            prjsurmodel.type = 'surModel'
                            prjsurmodel.title = layerlist.PCloudProjectList[i].surModels.Title;
                            var prjsurmodelchild = [];
                            modleInfoList = layerlist.PCloudProjectList[i].surModels.SurModelList;//把模型的值存起来
                            for (var z in layerlist.PCloudProjectList[i].surModels.SurModelList) {
                                var surmodel = new Object;
                                surmodel.title = layerlist.PCloudProjectList[i].surModels.SurModelList[z].MXSJ;
                                surmodel.id = "PROJECTSUMODEL_" + layerlist.PCloudProjectList[i].surModels.SurModelList[z].Id;
                                surmodel.type = "project_surModel";
                                surmodel.path = layerlist.PCloudProjectList[i].surModels.SurModelList[z].MXLJ;
                                surmodel.checked = false;
                                surmodel.showCheckbox = true;//显示复选框
                                prjsurmodelchild.push(surmodel);
                            }
                            prjsurmodel.children = prjsurmodelchild;

                            projectchild.children = prjsurmodel;
                            projectchild.push(prjsurmodel);
                        }

                        project.children = projectchild
                        layers.push(project);
                    }
                }

                tree.render({
                    elem: '#projectbyname'
                    , id: 'prjlayerlistid'
                    , showCheckbox: true
                    , customCheckbox: true
                    , customOperate: false
                    , showLine: true
                    , isImageTree: true
                    , data: layers
                    , edit: ['add', 'update','del']
                    , accordion: true
                    , click: function (obj) {
                        PointCloudProjectNodeClick(obj);
                    }       
                    , operate: function (obj) {
                        PointCloudProjectNodeOperate(obj);
                    }    
                    , oncheck: function (obj) {
                        PointCloudProjectNodeCheck(obj);
                    }
                });
            }
        }, datatype: "json"
    });
}
//节点点击
function PointCloudProjectNodeClick(obj) {
    if (obj.data.type === 'project') {
        layer.confirm('<p style="font-size:16px">是否确定将以下项目作为系统当前项目？</p><br/><p style="font-size:24px;font-weight:bold;text-align:center;">' + JSON.stringify(obj.data.title).replace(/\"/g, "") + '</p>', { title: ['消息提示', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei;background-color:#68bc80'], area: ['400px', '250px'], shade: 0.5, shadeClose: true, closeBtn: 0, resize: false, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } }, function (index) {

            if (JSON.stringify(obj.data.id) != currentprojectid) {
                currentprojectid = JSON.stringify(obj.data.id);                             //更新当前项目id
                document.getElementById("currentproject").style.visibility = "visible";
                document.getElementById("currentproject").innerHTML = "<option>" + JSON.stringify(obj.data.title).replace(/\"/g, "") + "</option><option>清除当前项目</option>";

                //TODO请求项目相关信息（图层、监测点）
               // GetProjectMonitor(currentprojectid);


                //监听清除当前项目操作
                $(() => {
                    $('#currentprojectoperate select').change(() => {
                        if ($('#currentprojectoperate select').val() == "清除当前项目") {
                            document.getElementById("currentproject").innerHTML = "";
                            document.getElementById("currentproject").style.visibility = "hidden";
                            currentprojectid = null;

                            CloseAllLayer();                               //关闭弹出图层
                            viewer.entities.removeAll();
                            AddEntitiesInViewer(projectentities);

                        }
                    });
                });

            }
            layer.close(index);
        });
    }

   
}
//节点操作(查看、编辑、删除)
function PointCloudProjectNodeOperate(obj) {
    if (obj.type === 'add') {
        if (obj.data.type === 'project') {

        }
        if (obj.data.type === 'region') {

        }
        if (obj.data.type === 'pcdata') {
            //查看项目
            if ((projectinfoaddlayerindex == null) && (projectinfoeditlayerindex == null)) {
                PCloudDataInfo(obj.data.id, "view");
            }
            else {
                layer.confirm('是否打开新的模块?', { icon: 3, title: '提示', zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } }, function (index) {
                    CloseProjectinfoLayer();
                    PCloudDataInfo(obj.data.id, "view");
                    layer.close(index);
                });
            }
        }
    }
//编辑
    else if (obj.type === 'update') {

        if (obj.data.type === 'project') {

        }
        if (obj.data.type === 'region') {

        }
        if (obj.data.type === 'pcdata') {
            if ((projectinfoaddlayerindex == null) && (projectinfoviewlayerindex == null)) {
                PCloudDataInfo(obj.data.id, "edit");
            }
            else {
                layer.confirm('是否打开新的模块?', { icon: 3, title: '提示', zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } }, function (index) {
                    CloseProjectinfoLayer();
                    //PCloudDataInfo(obj.data.id, "edit");
                    layer.close(index);
                });
            }
        }
    }

    else if (obj.type === 'del') {
        if (obj.data.type === 'project') {

        }
        if (obj.data.type === 'region') {

        }
        if (obj.data.type === 'pcdata') {

        }
    }
}
//节点选中
function PointCloudProjectNodeCheck(obj) {
    //根据选中状态在地图中添加元素
    var checked = obj.checked;
    var data = obj.data;
    if (checked) {
        if (data.type == "project_surModel") {
            //加载点云
            LoadModel(data);
        }
    }
}

//创建项目
function AddProject() {
    //编辑项目
    if (projectinfoaddlayerindex == null) {
        projectinfoaddlayerindex = layer.open({
            type: 1
            , title: ['新增点云时序对比项目', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
            , area: ['800px', '450px']
            , shade: 0
            , offset: 'auto'
            , closeBtn: 1
            , maxmin: true
            , moveOut: true
            , content:'<!--创建点云项目--><form class="layui-form" style="margin-top:5px;margin-right:5px;" lay-filter="addpointcloud_projectform">    <div class="layui-form-item">        <label class="layui-form-label">项目名称</label>        <div class="layui-input-block">            <input type="text" name="xmmc" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />        </div>    </div>    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">中心经度</label>                    <div class="layui-input-block">                        <input type="text" name="zxjd" lay-verify="required|number" autocomplete="off" placeholder="请输入" class="layui-input" />                    </div>                </div>            </div>            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo">                    <label class="layui-form-label">中心纬度</label>                    <div class="layui-input-block">                        <input type="text" name="zxwd" lay-verify="required|number" autocomplete="off" placeholder="请输入" class="layui-input" />                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">行政区划</label>        <div class="layui-input-inline" style="width:200px;">            <select id="provinceid" name="province" lay-verify="required">                <option value="">省/市</option>                <option value="0">重庆市</option>            </select>        </div>        <div class="layui-input-inline" style="width:200px;">            <select id="cityid" name="city" lay-verify="required">                <option value="">市辖区/县</option>                <option value="0">市辖区</option>                <option value="1">县</option>            </select>        </div>        <div class="layui-input-inline" style="width:200px;">            <select id="districtid" name="district" lay-verify="required">                <option value="">区/县</option>            </select>        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">项目位置</label>        <div class="layui-input-block">            <input type="text" name="xmwz" autocomplete="off" placeholder="请输入" class="layui-input" />        </div>    </div>    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <div class="layui-inline">                        <label class="layui-form-label">创建时间</label>                        <div class="layui-input-inline" style="width:250px;">                            <input type="text" id="xmkssjid" name="xmkssj" lay-verify="date" placeholder="YYYY-MM-DD" autocomplete="off" class="layui-input" />                        </div>                    </div>                </div>            </div>            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">坐标系统</label>                    <div class="layui-input-block">                        <select id="kjckid" name="kjck" lay-verify="required">                            <option value="">请选择</option>                        </select>                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">是否有三维模型</label>                    <div class="layui-input-block">                        <select id="swmxid" name="swmx" lay-verify="required">                            <option value="1">是</option>                            <option value="0">否</option>                        </select>                    </div>                </div>            </div>            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">是否结束</label>                    <div class="layui-input-block">                        <select id="sfjsid" name="sfjs" lay-verify="required">                            <option value="1">是</option>                            <option value="0">否</option>                        </select>                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">备注</label>        <div class="layui-input-block">            <input type="text" name="bz" autocomplete="off" placeholder="请输入" class="layui-input" />        </div>    </div>    <div class="layui-form-item" style="margin-top:5px">        <div style="position:absolute;right:15px;">            <button type="reset" class="layui-btn layui-btn-primary" style="width:100px">重置</button>            <button type="submit" class="layui-btn" lay-submit="" lay-filter="addprojectinfosubmit" style="width:100px">提交</button>        </div>    </div></form>'
            , zIndex: layer.zIndex
            , success: function (layero) {
                layer.setTop(layero);
                //渲染创建时间
                date.render({
                    elem: '#xmkssjid'
                });
                if (srids.length > 0) {
                    for (var i in srids) {
                        //if (srids[i].name == "China Geodetic Coordinate System 2000") {
                            document.getElementById("kjckid").innerHTML += '<option value="' + srids[i].value + '" selected>' + srids[i].name + '</option>';
                        //}
                    }
                }
                if (xjxzqs.length > 0) {
                    for (var i in xjxzqs) {
                        document.getElementById("districtid").innerHTML += '<option value="' + xjxzqs[i].value + '">' + xjxzqs[i].name + '</option>';
                    }
                }

                form.render();
                form.render('select');

                form.on('submit(addprojectinfosubmit)', function (data) {
                    data.field.cookie = document.cookie;
                    $.ajax({
                        url: servicesurl + "/api/PointCloudProject/AddProject", type: "post", data: data.field,
                        success: function (result) {

                            if (isNaN(parseInt(JSON.parse(result).code)==0)) {
                                //创建失败
                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                            }
                            else {
                                layer.msg("创建成功。", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                //关闭
                                layer.close(projectinfoaddlayerindex);

                                //刷新项目列表
                                PointCloudProjectList();
                            }
                        }, datatype: "json"
                    });

                    return false;
                });
            }
            , end: function () {
                projectinfoaddlayerindex = null;
            }
        });
    }    
}

//创建项目区域
function AddRegion() {

    if (currentprojectid == null) {
        layer.msg("请先选择当前项目！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
        if ((regionaddlayerindex != null) || (regionaddlayerindex != undefined)) {
            layer.close(regionaddlayerindex);
        }
    } else {
        if (regionaddlayerindex == null) {
            regionaddlayerindex = layer.open({
                type: 1
                , title: ['新增项目区域', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                , area: ['800px', '400px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: '<!--创建点云项目区域--><form class="layui-form" style="margin-top:5px;margin-right:5px;" lay-filter="addpointcloud_regionform">    <div class="layui-form-item">        <div class="layui-row">            <label class="layui-form-label" style="margin-top:10px">项目名称</label>            <div class="layui-input-block">                <input type="text" id="xmmc" name="xmmc" class="layui-input" readonly="readonly" />            </div>        </div>    </div>    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">区域名称</label>                    <div class="layui-input-block">                        <input type="text" name="regionname" lay-verify="required" autocomplete="off" placeholder="请输入" class="layui-input" />                    </div>                </div>            </div>            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <div class="layui-inline">                        <label class="layui-form-label">创建时间</label>                        <div class="layui-input-inline" style="width:250px;">                            <input type="text" id="cjsj" name="cjsj" lay-verify="date" placeholder="YYYY-MM-DD" autocomplete="off" class="layui-input" />                        </div>                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">中心经度</label>                    <div class="layui-input-block">                        <input type="text" name="zxjd" lay-verify="required|number" autocomplete="off" placeholder="请输入" class="layui-input" />                    </div>                </div>            </div>            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo">                    <label class="layui-form-label">中心纬度</label>                    <div class="layui-input-block">                        <input type="text" name="zxwd" lay-verify="required|number" autocomplete="off" placeholder="请输入" class="layui-input" />                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">备注</label>        <div class="layui-input-block">            <input type="text" name="bz" autocomplete="off" placeholder="请输入" class="layui-input" />        </div>    </div>    <div class="layui-form-item" style="margin-top:5px">        <div style="position:absolute;right:15px;">            <button type="reset" class="layui-btn layui-btn-primary" style="width:100px">重置</button>            <button type="submit" class="layui-btn" lay-submit="" lay-filter="addregioninfosubmit" style="width:100px">提交</button>        </div>    </div></form>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero);
                    //渲染创建时间
                    date.render({
                        elem: '#cjsj'
                    });
                    form.render();
                    form.render('select');

                    //渲染项目名称
                    for (var i = 0; i < layers.length; i++) {
                        if (layers[i].id == currentprojectid) {
                            form.val("addpointcloud_regionform", {
                                "xmmc": layers[i].title
                            })
                        }
                    }

                    form.on('submit(addregioninfosubmit)', function (data) {
                        data.field.cookie = document.cookie;
                        data.field.currentprojectid = currentprojectid;
                        $.ajax({
                            url: servicesurl + "/api/PointCloudRegion/AddRegion", type: "post", data: data.field,
                            success: function (result) {

                                if (isNaN(parseInt(JSON.parse(result).code) == 0)) {
                                    //创建失败
                                    layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                }
                                else {
                                    layer.msg("创建成功。", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                    //关闭
                                    layer.close(regionaddlayerindex);

                                    //刷新项目列表
                                    PointCloudProjectList();
                                }
                            }, datatype: "json"
                        });

                        return false;
                    });
                }
                , end: function () {
                    regionaddlayerindex = null;
                }
            });
        }
    }
 
}

//点云时序数据信息
function PCloudDataInfo(id, style) {
    if (style == "view") {
        //查看项目信息
        if (projectinfoviewlayerindex == null) {
            projectinfoviewlayerindex = layer.open({
                type: 1
                , title: ['时序数据信息', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                , area: ['700px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , anim: 0
                , maxmin: true
                , moveOut: true
                , content:'<!--查看项目--><div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief" style="margin:0px 0px">    <ul class="layui-tab-title">        <li class="layui-this">基本信息</li>        <li>工程设置</li>    </ul>    <div class="layui-tab-content" style="margin:0px 0px">        <!--基本信息-->        <div class="layui-tab-item layui-show">            <form class="layui-form" style="margin-top:0px" lay-filter="projectinfoviewform">                <div class="layui-form-item" >                    <label class="layui-form-label" style="margin-top:10px">所属项目</label>                    <div class="layui-input-block">                        <input type="text" name="xmmc" class="layui-input" readonly="readonly" />                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md4">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">采集人员</label>                                <div class="layui-input-block">                                    <input type="text" name="cjry" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo">                                <label class="layui-form-label">采集时间</label>                                <div class="layui-input-block">                                    <input type="text" name="cjsj" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">项目区域</label>                                <div class="layui-input-block">                                    <input type="text" name="xmqy" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">中心经度</label>                                <div class="layui-input-block">                                    <input type="text" name="zxjd" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">中心纬度</label>                                <div class="layui-input-block">                                    <input type="text" name="zxwd" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md8">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">坐标系统</label>                                <div class="layui-input-block">                                    <input type="text" name="kjck" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo">                                <label class="layui-form-label">数据格式</label>                                <div class="layui-input-block">                                    <input type="text" name="sjgs" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md4">                            <div class="grid-demo">                                <label class="layui-form-label">采集设备</label>                                <div class="layui-input-block">                                    <input type="text" name="cjsb" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">数据类型</label>                                <div class="layui-input-block">                                    <input type="text" name="sjlx" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">点云数目</label>                                <div class="layui-input-block">                                    <input type="text" name="dysm" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row" >                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">目前流程</label>                                <div class="layui-input-block">                                    <input type="text" name="mqlc" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">采集周期</label>                                <div class="layui-input-block">                                    <input type="text" name="cjzq" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <label class="layui-form-label">备注</label>                    <div class="layui-input-block">                        <input type="text" name="bz" class="layui-input" readonly="readonly" />                    </div>                </div>            </form>        </div>        <!--工程设置-->        <div class="layui-tab-item">            <form class="layui-form" style="margin-top:0px" lay-filter="datasetupviewform">                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 10px;">                    <legend>统计滤波参数设置</legend>                </fieldset>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">邻近点数</label>                                <div class="layui-input-block">                                    <input type="text" name="meank" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">离群点阈值</label>                                <div class="layui-input-block">                                    <input type="text" name="StddevMulThresh" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <label class="layui-form-label">设置时间</label>                    <div class="layui-input-block">                        <input type="text" name="szsj" class="layui-input" readonly="readonly" />                    </div>                </div>                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 10px;">                    <legend>FHFP-ICP配置参数</legend>                </fieldset>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">创建时间</label>                                <div class="layui-input-block">                                    <input type="text" name="cjsj" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">VoexlGri体素大小</label>                                <div class="layui-input-block">                                    <input type="text" name="leafsize" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">最大迭代次数</label>                                <div class="layui-input-block">                                    <input type="text" name="maxIteration" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">计算表面法线/FPFH搜索范围半径</label>                                <div class="layui-input-block">                                    <input type="text" name="radiusSearch" class="layui-input" readonly="readonly" />                                </div>                            </div>                        </div>                    </div>                </div>                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 10px;">                    <legend>提取点云边界方式</legend>                </fieldset>                <div class="layui-form-item">                    <label class="layui-form-label">边界方法</label>                    <div class="layui-input-block">                        <input type="text" name="bjff" class="layui-input" readonly="readonly" />                    </div>                </div>            </form>        </div>    </div></div>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero);
                    form.render();
                }
                , end: function () {
                    projectinfoviewlayerindex = null;
                }
            });
        }

        //项目信息
        $.ajax({
            url: servicesurl + "/api/PointCloudProject/GetPointCloudDataInfo", type: "get", data: { "id": id, "cookie": document.cookie },
            success: function (data) {
                if (data == "") {
                    layer.msg("无点云时序数据信息！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                    //清除项目信息
                    form.val("projectinfoviewform", {
                        "xmmc": ""
                        , "cjry": ""
                        , "cjsj": ""
                        , "region": ""
                        , "zxjd": ""
                        , "zxwd": ""
                        , "kjck": ""
                        , "sjgs": ""
                        , "cjsb": ""
                        , "sjlx": ""
                        , "dysm": ""
                        , "mqlc": ""
                        , "cjzq": ""   
                        , "bz": ""
                    });
                }
                else {
                    //项目信息
                    var projectinfo = JSON.parse(data);

                    form.val("projectinfoviewform", {
                        "xmmc": projectinfo.XMMC
                        , "cjry": projectinfo.CJRY
                        , "cjsj": projectinfo.CJSJ
                        , "xmqy": projectinfo.Regionid
                        , "zxjd": projectinfo.ZXJD
                        , "zxwd": projectinfo.ZXWD
                        , "kjck": projectinfo.SRID
                        , "sjgs": projectinfo.SJGSid
                        , "cjsb": projectinfo.Deviceid
                        , "sjlx": projectinfo.Typeid
                        , "dysm": projectinfo.DYSM
                        , "mqlc": projectinfo.MQLCid
                        , "cjzq": projectinfo.CJZQ
                        , "bz": projectinfo.BZ
                    });
                }
            }, datatype: "json"
        });

        //工程设置信息
        $.ajax({
            url: servicesurl + "/api/PointCloudProjectSetUp/GetPointCloudSetupInfo", type: "get", data: { "id": id, "cookie": document.cookie },
            success: function (data) {
                if (data == "") {
                    layer.msg("无工程设置数据信息！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                    //清除项目信息
                    form.val("datasetupviewform", {
                        "meank": ""
                        , "StddevMulThresh": ""
                        , "szsj": ""
                        , "cjsj": ""
                        , "leafsize": ""
                        , "maxIteration": ""
                        , "radiusSearch": ""
                        , "bjff": ""
                    });
                }
                else {
                    //项目信息
                    var setupinfo = JSON.parse(data);

                    form.val("datasetupviewform", {
                        "meank": setupinfo.StatisticoutlierPara.Meank
                        , "StddevMulThresh": setupinfo.StatisticoutlierPara.StddevMulThresh
                        , "szsj": setupinfo.StatisticoutlierPara.CJSJ
                        , "cjsj": setupinfo.ICPPara.CJSJ
                        , "leafsize": setupinfo.ICPPara.LeafSize
                        , "maxIteration": setupinfo.ICPPara.MaxIteration
                        , "radiusSearch": setupinfo.ICPPara.RadiusSearch
                        , "bjff": setupinfo.ShapePara.BJFF
                    });
                }
            }, datatype: "json"
        });


    }
    else if (style == "edit") {
        //编辑项目
        if (projectinfoeditlayerindex == null) {
            projectinfoeditlayerindex = layer.open({
                type: 1
                , title: ['编辑项目', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                , area: ['900px', '800px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content:'<!--编辑项目--><div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief" style="margin:1px 0px">    <ul class="layui-tab-title">        <li class="layui-this">基本信息</li>        <li>工程设置</li>    </ul>    <div class="layui-tab-content" style="margin:0px 0px">        <!--基本信息-->        <div class="layui-tab-item layui-show">            <form class="layui-form" style="margin-top:0px" lay-filter="pointcloudprojectedit">                <div class="layui-form-item">                    <label class="layui-form-label" style="margin-top:10px">所属项目</label>                    <div class="layui-input-block">                        <input type="text" name="xmmc" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md4">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">采集人员</label>                                <div class="layui-input-block">                                    <input type="text" name="cjry" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo">                                <label class="layui-form-label">采集时间</label>                                <div class="layui-input-block">                                    <input type="text" name="cjsj" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">项目区域</label>                                <div class="layui-input-block">                                    <input type="text" name="xmqy" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">中心经度</label>                                <div class="layui-input-block">                                    <input type="text" name="zxjd" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">中心纬度</label>                                <div class="layui-input-block">                                    <input type="text" name="zxwd" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md8">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">坐标系统</label>                                <div class="layui-input-block">                                    <input type="text" name="kjck" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo">                                <label class="layui-form-label">数据格式</label>                                <div class="layui-input-block">                                    <input type="text" name="sjgs" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md4">                            <div class="grid-demo">                                <label class="layui-form-label">采集设备</label>                                <div class="layui-input-block">                                    <input type="text" name="cjsb" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">数据类型</label>                                <div class="layui-input-block">                                    <input type="text" name="sjlx" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md4">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">点云数目</label>                                <div class="layui-input-block">                                    <input type="text" name="dysm" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">目前流程</label>                                <div class="layui-input-block">                                    <input type="text" name="mqlc" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">采集周期</label>                                <div class="layui-input-block">                                    <input type="text" name="cjzq" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <label class="layui-form-label">备注</label>                    <div class="layui-input-block">                        <input type="text" name="bz" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                    </div>                </div>                <div class="layui-form-item" style="margin-top:5px">                    <div style="position:absolute;right:5px;">                        <button type="submit" class="layui-btn" lay-submit="" lay-filter="editpointcloudprojectinfosubmit" style="width:120px">保存</button>                    </div>                </div>            </form>        </div>        <!--工程设置-->        <div class="layui-tab-item">            <form class="layui-form" style="margin-top:0px" lay-filter="pointcloudprojectsetedit">                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 10px;">                    <legend>统计滤波参数设置</legend>                </fieldset>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">邻近点数</label>                                <div class="layui-input-block">                                    <input type="text" name="meank" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">离群点阈值</label>                                <div class="layui-input-block">                                    <input type="text" name="StddevMulThresh" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <label class="layui-form-label">设置时间</label>                    <div class="layui-input-block">                        <input type="text" name="szsj" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                    </div>                </div>                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 10px;">                    <legend>FHFP-ICP配置参数</legend>                </fieldset>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">创建时间</label>                                <div class="layui-input-block">                                    <input type="text" name="cjsj" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">VoexlGrid体素大小</label>                                <div class="layui-input-block">                                    <input type="text" name="leafsize" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                    </div>                </div>                <div class="layui-form-item">                    <div class="layui-row">                        <div class="layui-col-md6">                            <div class="grid-demo grid-demo-bg1">                                <label class="layui-form-label">最大迭代次数</label>                                <div class="layui-input-block">                                    <input type="text" name="maxIteration" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                        <div class="layui-col-md6">                            <div class="grid-demo">                                <label class="layui-form-label">表面法线/FPFH搜索范围半径</label>                                <div class="layui-input-block">                                    <input type="text" name="radiusSearch" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                                </div>                            </div>                        </div>                    </div>                </div>                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 10px;">                    <legend>提取点云边界方式</legend>                </fieldset>                <div class="layui-form-item">                    <label class="layui-form-label">边界方法</label>                    <div class="layui-input-block">                        <input type="text" name="bjff" autocomplete="off" placeholder="请输入" lay-verify="required" class="layui-input" />                    </div>                </div>            </form>        </div>    </div></div>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero);

                    //项目信息
                    $.ajax({
                        url: servicesurl + "/api/PointCloudProject/GetPointCloudDataInfo", type: "get", data: { "id": id, "cookie": document.cookie },
                        success: function (data) {
                            if (data == "") {
                                layer.msg("无点云时序数据信息！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                //清除项目信息
                                form.val("projectinfoviewform", {
                                    "xmmc": ""
                                    , "cjry": ""
                                    , "cjsj": ""
                                    , "region": ""
                                    , "zxjd": ""
                                    , "zxwd": ""
                                    , "kjck": ""
                                    , "sjgs": ""
                                    , "cjsb": ""
                                    , "sjlx": ""
                                    , "dysm": ""
                                    , "mqlc": ""
                                    , "cjzq": ""
                                    , "bz": ""
                                });
                            }
                            else {
                                //项目信息
                                var projectinfo = JSON.parse(data);
                            
                                form.val("pointcloudprojectedit", {
                                    "xmmc": projectinfo.XMMC
                                    , "cjry": projectinfo.CJRY
                                    , "cjsj": projectinfo.CJSJ
                                    , "xmqy": projectinfo.Regionid
                                    , "zxjd": projectinfo.ZXJD
                                    , "zxwd": projectinfo.ZXWD
                                    , "kjck": projectinfo.SRID
                                    , "sjgs": projectinfo.SJGSid
                                    , "cjsb": projectinfo.Deviceid
                                    , "sjlx": projectinfo.Typeid
                                    , "dysm": projectinfo.DYSM
                                    , "mqlc": projectinfo.MQLCid
                                    , "cjzq": projectinfo.CJZQ
                                    , "bz": projectinfo.BZ
                                });

                            }
                        }, datatype: "json"
                    });

                    ////更新项目信息
                    form.on('submit(editpointcloudprojectinfosubmit)', function (data) {
                        data.field.id = id;
                        data.field.cookie = document.cookie;

                        $.ajax({
                            url: servicesurl + "/api/PointCloudProject/UpdatePointCloudProjectInfo", type: "put", data: data.field,
                            success: function (result) {
                                layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                            }, datatype: "json"
                        });
                        return false;
                    });

                    //工程设置信息
                    $.ajax({
                        url: servicesurl + "/api/PointCloudProjectSetUp/GetPointCloudSetupInfo", type: "get", data: { "id": id, "cookie": document.cookie },
                        success: function (data) {
                            if (data == "") {
                                layer.msg("无工程设置数据信息！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                //清除项目信息
                                form.val("pointcloudprojectsetedit", {
                                    "meank": ""
                                    , "StddevMulThresh": ""
                                    , "szsj": ""
                                    , "cjsj": ""
                                    , "leafsize": ""
                                    , "maxIteration": ""
                                    , "radiusSearch": ""
                                    , "bjff": ""
                                });
                            }
                            else {
                                //项目信息
                                var setupinfo = JSON.parse(data);

                                form.val("pointcloudprojectsetedit", {
                                    "meank": setupinfo.StatisticoutlierPara.Meank
                                    , "StddevMulThresh": setupinfo.StatisticoutlierPara.StddevMulThresh
                                    , "szsj": setupinfo.StatisticoutlierPara.CJSJ
                                    , "cjsj": setupinfo.ICPPara.CJSJ
                                    , "leafsize": setupinfo.ICPPara.LeafSize
                                    , "maxIteration": setupinfo.ICPPara.MaxIteration
                                    , "radiusSearch": setupinfo.ICPPara.RadiusSearch
                                    , "bjff": setupinfo.ShapePara.BJFF
                                });
                            }
                        }, datatype: "json"
                    });

                }
                , end: function () {
                    projectinfoeditlayerindex = null;
                }
            });
        }
    }
};

//上传文件
function UploadData() {
    
     if ((addpointclouddatalayerindex != null) || (addpointclouddatalayerindex != undefined)) {
            layer.close(addpointclouddatalayerindex);
        }
     else {
        if (addpointclouddatalayerindex == null) {
            addpointclouddatalayerindex = layer.open({
                type: 1
                , title: ['上传点云数据', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                , area: ['800px', '400px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: '<!--上传点云数据--><form class="layui-form" style="margin-top:5px;margin-right:5px;" lay-filter="uploaddataform">    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">上传项目</label>                    <div class="layui-input-block">                        <select id="projectid" name="project" lay-filter="projectfilter">                            <option value="">请选择</option>                        </select>                    </div>                </div>            </div>            <div class="layui-col-md6">                <div class="grid-demo">                    <label class="layui-form-label">项目区域</label>                    <div class="layui-input-block">                        <select id="regionid" name="region" lay-filter="regionidfilter">                            <option value="">请选择</option>                        </select>                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">坐标系统</label>                    <div class="layui-input-block">                        <select id="kjckid" name="kjck" lay-verify="required">                            <option value="">请选择</option>                        </select>                    </div>                </div>            </div>            <div class="layui-col-md6">                <div class="grid-demo grid-demo-bg1">                    <div class="layui-inline">                        <label class="layui-form-label">采集时间</label>                        <div class="layui-input-inline" style="width:250px;">                            <input type="text" id="cjsjid" name="cjsj" lay-verify="date" placeholder="YYYY-MM-DD" autocomplete="off" class="layui-input" />                        </div>                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">采集人员</label>                    <div class="layui-input-block">                        <input type="text" id="people" name="people" lay-verify="required" autocomplete="off" placeholder="请输入" class="layui-input" />                    </div>                </div>            </div>            <div class="layui-col-md6">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">采集设备</label>                    <div class="layui-input-block">                        <select id="deviceid" name="type">                            <option value="">请选择</option>                            <option value="0">无人机</option>                            <option value="1">Lidar</option>                        </select>                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <div class="layui-row">            <div class="layui-col-md6" style="width:50%">                <div class="grid-demo grid-demo-bg1">                    <label class="layui-form-label">数据格式</label>                    <div class="layui-input-block">                        <select id="sjgsid" name="type">                            <option value="">请选择</option>                            <option value="0">las</option>                            <option value="1">pcd</option>                            <option value="2">txt</option>                        </select>                    </div>                </div>            </div>        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">备注</label>        <div class="layui-input-block">            <input type="text" id ="bz"name="bz" autocomplete="off" placeholder="请输入" class="layui-input" />        </div>    </div>    <div class="layui-form-item" style="margin-top:30px">        <div style="position:absolute;left:50px;">            <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="selectdata" style="width:100px">选择文件</button>            <button type="button" class="layui-btn layui-btn-green layui-btn-sm" id="uploaddata" style="width:100px">上传</button>        </div>    </div></form>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero);

                    if (layerlist.PCloudProjectList.length > 0) {
                        for (var i in layerlist.PCloudProjectList) {
                            document.getElementById("projectid").innerHTML += '<option value="' + layerlist.PCloudProjectList[i].Id + '">' + layerlist.PCloudProjectList[i].XMMC + '</option>';
                        }
                    }

                    if (srids.length > 0) {
                        for (var i in srids) {
                            //if (srids[i].name == "China Geodetic Coordinate System 2000") {
                                document.getElementById("kjckid").innerHTML += '<option value="' + srids[i].value + '" selected>' + srids[i].name + '</option>';
                            //}
                        }
                    }

                    //渲染开始时间&结束时间
                    date.render({
                        elem: '#cjsjid'
                    });
                    form.render();
                    form.render('select');

                    // 联动
                    layui.use('form', function () {

                        form.on('select(projectfilter)', function (data) {
                            getRegion(data);
                        });
                    });



                    layui.use('upload', function (obj) {
                        var $ = layui.jquery, upload = layui.upload;

                        //选完文件后不自动上传
                        upload.render({
                            elem: '#selectdata'
                            , url: servicesurl + "/api/PointCloudUpload/UploadData" //改成您自己的上传接口
                            , auto: false
                            , accept: 'file'                  //上传文件类型
                            , bindAction: '#uploaddata'
                            , before: function () {//携带额外的数据
                                this.data = {
                                    "dataid": 1,
                                    "projectid": $('#projectid').val(),
                                    "rgionid": $('#regionid').val(),
                                    "kjck": $('#kjckid').val(),
                                    "cjsj": $('#cjsjid').val(),
                                    "people": $('#people').val(),
                                    "deviceid": $('#deviceid').val(),
                                    "sjgsid": $('#sjgsid').val(),
                                    "bz": $('#bz').val(),
                                    "cookie": document.cookie
                                }
                            }
                            , done: function (result) {
                                if (isNaN(parseInt(JSON.parse(result).code) == 0)) {
                                    //创建失败
                                    layer.msg(result, { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
                                }
                                else {
                                    layer.msg("创建成功。", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

                                    //关闭
                                    layer.close(regionaddlayerindex);

                                    //刷新项目列表
                                    PointCloudProjectList();
                                }
                            }, datatype: "json"
                        });
                    });

                }
            });
        }
    }


 
}
// 获取项目区域
function getRegion(data) {
    var params = {
        buildingId: data.value
    }
    //将项目区域添加到下拉框中
    $.ajax({
        url: servicesurl + "/api/PointCloudParameter/GetPointCloudRegion",
        type: "get",
        dataType: 'json',
        data: { "projectid": params.buildingId },
        success: function (data) {
            $("#regionid").empty();//清空下拉框的值
            var regionlist = JSON.parse(data);
            if (regionlist.length > 0) {
                for (var i in regionlist) {
                    document.getElementById("regionid").innerHTML += '<option value="' + regionlist[i].Id + '">' + regionlist[i].RegionName + '</option>';
                }
            }
            layui.form.render("select");//重新渲染 固定写法
        }
    });
};

//创建项目
$("#projectadd").on("click", function () {
    //创建项目
    if (((projectinfoviewlayerindex == null) && (projectinfoeditlayerindex == null) && (projectinfoaddlayerindex == null)  )) {
        AddProject();
    }
    else {
        layer.confirm('是否打开新项目?', { icon: 3, title: '提示', zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } }, function (index) {
            CloseProjectinfoLayer();
            AddProject();
            layer.close(index);
        });
    }
});
//创建项目区域
$("#startupload").on("click", function () {
    AddRegion();
});

//上传数据
$("#selectpcdata").on("click", function () {
    UploadData();
});

//创建项目提示
$("#projectadd").on("mouseenter", function () {
    if (tipslayer == -1) {
        tipslayer = layer.tips('创建项目', '#projectadd', {
            tips: [2, '#78BA32']
        });
    }
});
$("#projectadd").on("mouseleave", function () {
    if (tipslayer != -1) {
        layer.close(tipslayer);
        tipslayer = -1;
    }
});

//创建项目区域提示
$("#startupload").on("mouseenter", function () {
    if (tipslayer == -1) {
        tipslayer = layer.tips('新增项目区域', '#startupload', {
            tips: [2, '#78BA32']
        });
    }
});
$("#startupload").on("mouseleave", function () {
    if (tipslayer != -1) {
        layer.close(tipslayer);
        tipslayer = -1;
    }
});

//上传提示
$("#selectpcdata").on("mouseenter", function () {
    if (tipslayer == -1) {
        tipslayer = layer.tips('上传点云', '#selectpcdata', {
            tips: [2, '#78BA32']
        });
    }
});
$("#selectpcdata").on("mouseleave", function () {
    if (tipslayer != -1) {
        layer.close(tipslayer);
        tipslayer = -1;
    }
});
