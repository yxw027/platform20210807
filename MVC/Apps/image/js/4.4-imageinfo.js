////弹出影像上传模块widget

function ImageInfo(id, style) {
    if (style == "view") {

    }
    else if (style == "edit") {
        //
    }

    else if (style == "add") {
        if (id == null) {
            layer.msg("请先选择当前项目！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
        }
        else {
            //上传影像
            if (imageinfoaddlayerindex == null) {
                imageinfoaddlayerindex = layer.open({
                    type: 1
                    , title: ['上传影像', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                    , area: ['560px', '600px']
                    , shade: 0
                    , offset: 'auto'
                    , closeBtn: 1
                    , maxmin: true
                    , moveOut: true
                    , content: '<form class="layui-form" style="margin-top:10px" lay-filter="addallimageform"><div class="layui-form-item"><label class="layui-form-label">目标编号</label><div class="layui-input-block" style="padding-right:10px"><input type="text" name="image_yxbh_add" autocomplete="off" placeholder="自动识别" lay-verify="required" class="layui-input" /></div></div><div class="layui-form-item"><label class="layui-form-label">备注</label><div class="layui-input-block" style="padding-right:10px"><input type="text" name="image_bz_add" autocomplete="off" placeholder="请输入" class="layui-input" /></div></div><div class="layui-form-item" style="height: 220px;"><div class="layui-upload"><div class="layui-row" style="margin-top:20px;margin-left:10px;margin-right:20px"><div class="layui-col-xs6"><div class="grid-demo grid-demo-bg1"><button type="button" class="layui-btn-fluid layui-btn layui-btn-primary layui-border-green" id="image_allimage_select">1-选择影像</button></div></div><div class="layui-col-xs6"><div class="grid-demo"><button type="button" class="layui-btn-fluid layui-btn layui-btn-primary layui-border-green" id="image_allimage_upload">2-上传</button></div></div></div><div class="layui-upload-list" style="height:350px;margin-top:10px;margin-left:10px;margin-right:10px;background-color:rgba(25,25,0,0.11)"><p style="color:green;font-size:20px;">点击“1-选择影像”，在此预览影像</p><img class="layui-upload-img" id="image_roi_img" name="image_roi_img" style="width:100%;height:auto;vertical-align:middle"></div></div></div></form>'
                    , zIndex: layer.zIndex
                    , success: function (layero) {
                        layer.setTop(layero);                   
                    }
                    , end: function () {
                        imageinfoaddlayerindex = null;
                    }
                    , cancel: function () {
                        imageinfoaddlayerindex = null;
                    }
                });
            }


        }
       


    }





}

