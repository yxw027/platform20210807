//工具栏
util.fixbar({
    bar1:'<li class="layui-icon" lay-type="bar1" id="utilbar1" style="margin:5px;border-radius:5px;background-color:#303336"><svg t="1622084150790" class="icon" style="position:relative;top:5px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2375" width="40" height="40"><path d="M723.2 678.4L537.6 537.6V377.6c83.2-12.8 147.2-83.2 147.2-172.8C691.2 102.4 608 25.6 512 25.6S332.8 102.4 332.8 204.8c0 83.2 57.6 153.6 140.8 172.8v160l-179.2 128H32v320h320V704L512 595.2l160 115.2v281.6h320v-320h-268.8z m-435.2 256h-192v-192h192v192zM396.8 204.8c0-64 51.2-115.2 115.2-115.2s115.2 51.2 115.2 115.2S576 313.6 512 313.6s-115.2-51.2-115.2-108.8z m531.2 729.6h-192v-192h192v192z" p-id="2376" fill="#ffffff"></path></svg></li>'
    ,bar2: '<li class="layui-icon" lay-type="bar2" id="utilbar2" style="margin:5px;border-radius:5px;background-color:#303336"><svg t="1622011842430" class="icon" style="position:relative;top:5px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11797" width="40" height="40"><path d="M712.72 419.09L481.11 650.71 376.51 546.1c-13.29-13.29-34.85-13.29-48.14 0s-13.29 34.85 0 48.14L456.8 722.68c6.7 6.7 15.49 10 24.27 9.95 8.81 0.07 17.63-3.23 24.35-9.94l255.45-255.45c13.29-13.29 13.29-34.85 0-48.14s-34.85-13.3-48.15-0.01z" fill="#ffffff" p-id="11798"></path><path d="M827.91 129.65H701.88v-27.11c0-24.08-19.6-43.68-43.68-43.68H365.99c-24.08 0-43.66 19.6-43.66 43.68v27.11H196.28c-40.91 0-74.19 33.28-74.19 74.19V891.2c0 40.91 33.28 74.19 74.19 74.19h631.63c40.91 0 74.19-33.28 74.19-74.19V203.84c0-40.91-33.28-74.19-74.19-74.19z m-441.84-7.04h252.07v72.49H386.07v-72.49zM838.36 891.2c0 5.76-4.69 10.45-10.45 10.45H196.28c-5.76 0-10.45-4.69-10.45-10.45V203.84c0-5.76 4.69-10.45 10.45-10.45h126.05v21.78c0 24.08 19.59 43.68 43.66 43.68H658.2c24.08 0 43.68-19.6 43.68-43.68v-21.78h126.04c5.76 0 10.45 4.69 10.45 10.45V891.2z" fill="#ffffff" p-id="11799"></path></svg></li>'
    , bar3: '<li class="layui-icon" lay-type="bar3" id="utilbar3" style="margin:5px;border-radius:5px;background-color:#303336"><svg t="1622010660707" class="icon" style="position:relative;top:5px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1895" width="40" height="40"><path d="M757.333333 426.666667C633.6 426.666667 533.333333 526.933333 533.333333 650.666667S633.6 874.666667 757.333333 874.666667 981.333333 774.4 981.333333 650.666667 881.066667 426.666667 757.333333 426.666667z m0 384c-87.466667 0-160-72.533333-160-160s72.533333-160 160-160 160 72.533333 160 160-72.533333 160-160 160z" p-id="1896" fill="#ffffff"></path><path d="M821.333333 618.666667H789.333333v-32c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32V618.666667h-32c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32H725.333333v32c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V682.666667h32c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM477.866667 810.666667H106.666667V277.333333h106.666666v21.333334c0 23.466667 19.2 42.666667 42.666667 42.666666h170.666667c23.466667 0 42.666667-19.2 42.666666-42.666666v-21.333334h106.666667v72.533334c0 12.8 8.533333 25.6 21.333333 29.866666h2.133334c21.333333 6.4 40.533333-8.533333 40.533333-29.866666V256c0-23.466667-19.2-42.666667-42.666667-42.666667h-128V192c0-23.466667-19.2-42.666667-42.666666-42.666667h-170.666667c-23.466667 0-42.666667 19.2-42.666667 42.666667v21.333333H85.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667v576c0 23.466667 19.2 42.666667 42.666666 42.666667h392.533334c12.8 0 23.466667-8.533333 29.866666-19.2 8.533333-21.333333-6.4-44.8-29.866666-44.8zM277.333333 213.333333h128v64h-128v-64z" p-id="1897" fill="#ffffff"></path><path d="M224 661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h106.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-106.666667zM458.666667 405.333333h-234.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h234.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM490.666667 565.333333c0-17.066667-14.933333-32-32-32h-234.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h234.666667c17.066667 0 32-14.933333 32-32z" p-id="1898" fill="#ffffff"></path></svg></li>'
    , bar4: '<li class="layui-icon" lay-type="bar4" id="utilbar4" style="margin:5px;border-radius:5px;background-color:#303336"><svg t="1622082388562" class="icon" style="position:relative;top:5px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11013" width="40" height="40"><path d="M976 672c-6.496 0-12.688 1.328-18.352 3.664v-0.016l-0.208 0.08-0.208 0.08L512 860.048 66.784 675.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.08-0.016 0.016a48 48 0 0 0-36.704 88.656v0.016l463.584 191.824a1.12 1.12 0 0 0 0.208 0.08l0.208 0.08 0.016-0.016a47.6 47.6 0 0 0 36.688 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48 48 0 0 0 976 672zM29.664 348.336v0.016l463.584 191.824 0.208 0.08 0.208 0.08 0.016-0.016a47.456 47.456 0 0 0 36.672 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48.048 48.048 0 0 0 1024 304a48 48 0 0 0-29.648-44.336v-0.016L530.784 67.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.08-0.016 0.016a47.744 47.744 0 0 0-36.688-0.016l-0.016-0.016-0.208 0.08a1.12 1.12 0 0 1-0.208 0.08L29.648 259.648v0.016A48 48 0 0 0 0 304a48 48 0 0 0 29.664 44.336zM976 464c-6.496 0-12.688 1.328-18.352 3.664v-0.016l-0.208 0.096a1.12 1.12 0 0 1-0.208 0.08L512 652.048 66.784 467.824a1.12 1.12 0 0 0-0.208-0.08l-0.208-0.096-0.016 0.016a48 48 0 0 0-36.704 88.672v0.016l463.584 191.824 0.208 0.08 0.208 0.08 0.016-0.016a47.6 47.6 0 0 0 36.688 0.016l0.016 0.016 0.208-0.08a1.12 1.12 0 0 1 0.208-0.08l463.568-191.824v-0.016A48 48 0 0 0 976 464z" p-id="11014" fill="#ffffff"></path></svg></li>'
    , bar5: '<li class="layui-icon" lay-type="bar5" id="utilbar5" style="margin:5px;border-radius:5px;background-color:#303336"><svg t="1622082494959" class="icon" style="position:relative;top:5px"viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12623" width="40" height="40"><path d="M256 224.576c0-33.536-0.384-63.232 0.128-92.992 0.64-41.28 25.856-67.072 67.392-67.2 125.44-0.512 250.752-0.512 376.128 0 42.368 0.064 67.52 26.24 68.224 69.312 0.512 28.928 0.128 57.856 0.128 90.88h112.448c79.616 0 79.616 0 79.616 78.592v603.904c0 45.568-6.592 52.16-51.456 52.224H115.328c-45.248 0-51.328-6.144-51.328-52.096V275.2c0-42.368 8.256-50.496 50.944-50.56 45.952-0.128 91.84 0 141.056 0z m638.592 670.4v-332.16H614.72c0 19.072-0.256 36.032 0 52.992 0.448 23.04-11.584 35.968-33.6 36.48-46.08 1.152-92.16 1.088-138.176 0.128-22.08-0.512-34.112-13.184-33.728-36.352 0.32-17.6 0.064-35.328 0.064-53.248h-279.68v332.16h764.992zM129.216 494.208h277.312c1.216-3.2 2.24-4.736 2.24-6.272 0.256-14.464 0.32-28.992 0.512-43.456 0.448-28.608 9.728-39.808 37.376-40.448 43.52-0.896 86.976-0.896 130.432 0 27.264 0.64 37.12 12.16 37.568 40.512 0.32 16.64 0.064 33.344 0.064 49.856h280V290.816H129.28v203.392z m192-271.872h380.544V129.216H321.28v93.12z m228.608 247.808H474.176v116.416h75.648v-116.48z" p-id="12624" fill="#ffffff"></path></svg></li>'
    , css: { right: 17, top: 401 }
    , bgcolor: '#393D49'
    , click: function (type) {
        if (type === 'bar1') {
            //预处理
            PointCloudPrecraet(currentprojectid);
        } 
        else if (type === 'bar2') {
            //任务列表
            PointCloudTaskList(currentprojectid);
        }
        else if (type === 'bar3') {
            //新增任务
            addPointCloudTask(currentprojectid);
        }
        else if (type === 'bar4') {
            //图层管理
            PointCloudChangesLayer((currentprojectid));
        }
        else if (type === 'bar5') {
            //工具
            PointCloudTool((currentprojectid));
        }
    }
});


//提示
$("#utilbar1").on("mouseenter", function () {
    if (tipslayer == -1) {
        tipslayer = layer.tips('预处理', '#utilbar1', {
            tips: [4, '#78BA32']
        });
    }
});
$("#utilbar1").on("mouseleave", function () {
    if (tipslayer != -1) {
        layer.close(tipslayer);
        tipslayer = -1;
    }
});

//提示
$("#utilbar2").on("mouseenter", function () {
    if (tipslayer == -1) {
        tipslayer = layer.tips('任务列表', '#utilbar2', {
            tips: [4, '#78BA32']
        });
    }
});
$("#utilbar2").on("mouseleave", function () {
    if (tipslayer != -1) {
        layer.close(tipslayer);
        tipslayer = -1;
    }
});

//提示
$("#utilbar3").on("mouseenter", function () {
    if (tipslayer == -1) {
        tipslayer = layer.tips('新建任务', '#utilbar3', {
            tips: [4, '#78BA32']
        });
    }
});
$("#utilbar3").on("mouseleave", function () {
    if (tipslayer != -1) {
        layer.close(tipslayer);
        tipslayer = -1;
    }
});

//提示
$("#utilbar4").on("mouseenter", function () {
    if (tipslayer == -1) {
        tipslayer = layer.tips('图层管理', '#utilbar4', {
            tips: [4, '#78BA32']
        });
    }
});
$("#utilbar4").on("mouseleave", function () {
    if (tipslayer != -1) {
        layer.close(tipslayer);
        tipslayer = -1;
    }
});

//提示
$("#utilbar5").on("mouseenter", function () {
    if (tipslayer == -1) {
        tipslayer = layer.tips('工具', '#utilbar5', {
            tips: [4, '#78BA32']
        });
    }
});
$("#utilbar5").on("mouseleave", function () {
    if (tipslayer != -1) {
        layer.close(tipslayer);
        tipslayer = -1;
    }
});


