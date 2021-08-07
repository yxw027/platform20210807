﻿var currentmonitor = null;                      //当前监测点
var autodatachart = null;                       //图表
var monitorstatisticstable = null;              //监测点统计表
var monitorstatisticsdata = [];                 //监测点统计数据（最小值、最大值、平均值、标准差）


//自动化监测数据widget
function LoadAutoDataLayer(id) {
    if (id == null) {
        layer.msg("请先选择当前项目！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
        if ((automonitordatalayerindex != null) || (automonitordatalayerindex != undefined)) {
            layer.close(automonitordatalayerindex);
        }
    }
    else {
        if (automonitordatalayerindex == null) {
            automonitordatalayerindex = layer.open({
                type: 1
                , title: ['自动化监测数据可视化', 'font-weight:bold;font-size:large;font-family:Microsoft YaHei']
                , area: ['1000px', '800px']
                , shade: 0
                , offset: 'auto'
                , closeBtn: 1
                , maxmin: true
                , moveOut: true
                , content: '<!--自动化监测数据可视化--><div class="layui-row"><!--左侧--><div class="layui-col-md3" style="width:20%;height:750px;overflow: auto;"><div id="monitortreebytype" class="grid-demo"></div></div><!--右侧--><div class="layui-col-md9" style="width:80%;height:740px;border-left:solid;border-color:#e6e6e6;border-left-width:0px;"><div class="grid-demo grid-demo-bg1"><!--工具栏--><form class="layui-form" lay-filter="autodataform" style="margin-top:5px;"><div class="layui-row"><div class="layui-col-xs6"><div class="grid-demo grid-demo-bg1"><div class="layui-form-item"><div class="layui-input-block" style="margin-left:10px;"><select id="autodatapretimeid" name="autodatapretime" lay-filter="autodatapretimefilter" style="visibility:hidden;"></select></div></div></div></div><div class="layui-col-xs6"><div class="grid-demo"><div class="layui-form-item"><div class="layui-input-block" style="margin-left:10px;margin-right:10px;"><input id="autodatacustomtimeid" name="autodatacustomtime" type="text" class="layui-input" placeholder="开始时间 — 结束时间" style="visibility:hidden;"></div></div></div></div></div></form><!--图形--><div id="autodatachart" class="layui-tab-item layui-show" style="width:790px;height:540px"></div><!--统计表格--><div id="autodatastatisticsdiv" style="margin-left:10px;margin-right:10px;visibility:hidden;"><table id="autodatastatistics" class="layui-hide"></table></div></div></div></div>'
                , zIndex: layer.zIndex
                , success: function (layero) {
                    layer.setTop(layero);
                    //Loading
                    var loadinglayerindex = layer.load(0, { shade: false, zIndex: layer.zIndex, success: function (loadlayero) { layer.setTop(loadlayero); } });

                    //加载监测点
                    GetMonitors(id, loadinglayerindex);
                }
                , end: function () {
                    //关闭
                    automonitordatalayerindex = null;

                    currentmonitor = null;
                    autodatachart = null;
                    monitorstatisticstable = null;
                    monitorstatisticsdata = [];
                }
            });

        }

    }
};


//获取项目监测点
function GetMonitors(projectid, index) {
    $.ajax({
        url: servicesurl + "/api/Monitor/GetMonitor", type: "get", data: { "id": projectid, "cookie": document.cookie },
        success: function (data) {
            //关闭Loading
            layer.close(index);

            if (data == "") {
                layer.msg("无项目自动监测数据信息！", { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });
            }
            else {
                var monitorinfos = JSON.parse(data);

                var disasterinfo = [];                      //灾害体
                var sectioninfo = [];                       //监测剖面
                var methodinfo = [];                        //监测方法

                //获取灾害体、监测方法、监测剖面
                for (var i in monitorinfos) {
                    if (monitorinfos[i].DisasterString != null) {
                        if (disasterinfo.length != 0) {
                            var isin = false;
                            for (var j in disasterinfo) {
                                if (disasterinfo[j].id == monitorinfos[i].DisasterString.Id) {
                                    isin = true;
                                    break;
                                }
                            }

                            if (!isin) {
                                var di = new Object;
                                di.title = monitorinfos[i].DisasterString.ZHTBH;
                                di.id = monitorinfos[i].DisasterString.Id;
                                di.checked = false;
                                disasterinfo.push(di);
                            }
                        }
                        else {
                            var di = new Object;
                            di.title = monitorinfos[i].DisasterString.ZHTBH;
                            di.id = monitorinfos[i].DisasterString.Id;
                            di.checked = false;
                            disasterinfo.push(di);
                        }
                    }

                    if (monitorinfos[i].SectionString != null) {
                        if (sectioninfo.length != 0) {
                            var isin = false;
                            for (var j in sectioninfo) {
                                if (sectioninfo[j].id == monitorinfos[i].SectionString.Id) {
                                    isin = true;
                                    break;
                                }
                            }

                            if (!isin) {
                                var si = new Object;
                                si.title = monitorinfos[i].SectionString.PMBH;
                                si.id = monitorinfos[i].SectionString.Id;
                                si.checked = false;
                                sectioninfo.push(si);
                            }
                        }
                        else {
                            var si = new Object;
                            si.title = monitorinfos[i].SectionString.PMBH;
                            si.id = monitorinfos[i].SectionString.Id;
                            si.checked = false;
                            sectioninfo.push(si);
                        }
                    }

                    if (monitorinfos[i].MonitorString != null) {
                        if (methodinfo.length != 0) {
                            var isin = false;
                            for (var j in methodinfo) {
                                if (methodinfo[j].title == monitorinfos[i].MonitorString.JCFF) {
                                    isin = true;
                                    break;
                                }
                            }

                            if (!isin) {
                                var mi = new Object;
                                mi.title = monitorinfos[i].MonitorString.JCFF;
                                mi.id = monitorinfos[i].MonitorString.Id;//无实际意义
                                mi.checked = false;
                                if (monitorinfos[i].MonitorString.JCFF != "声光预警") {
                                    methodinfo.push(mi);
                                }
                            }
                        }
                        else {
                            var mi = new Object;
                            mi.title = monitorinfos[i].MonitorString.JCFF;
                            mi.id = monitorinfos[i].MonitorString.Id;//无实际意义
                            mi.checked = false;
                            if (monitorinfos[i].MonitorString.JCFF != "声光预警") {
                                methodinfo.push(mi);
                            }
                        }
                    }
                }

                //按不同分类组合监测点
                for (var i in monitorinfos) {
                    if (monitorinfos[i].MonitorString.JCZLX != "GNSS基准站") {
                        if (monitorinfos[i].MonitorString != null) {
                            var mi = new Object;
                            mi.title = monitorinfos[i].MonitorString.JCDBH;
                            mi.id = monitorinfos[i].MonitorString.Id;
                            mi.type = monitorinfos[i].MonitorString.JCFF;//监测方法

                            if (monitorinfos[i].DisasterString != null) {
                                for (var j in disasterinfo) {
                                    if (monitorinfos[i].DisasterString.Id == disasterinfo[j].id) {
                                        if (disasterinfo[j].children == null) {
                                            var child = [];
                                            child.push(mi);
                                            disasterinfo[j].children = child;
                                            if (j == 0) {
                                                disasterinfo[j].spread = true;
                                                currentmonitor = mi;
                                            }
                                        }
                                        else {
                                            disasterinfo[j].children.push(mi);
                                        }
                                    }
                                }
                            }

                            if (monitorinfos[i].SectionString != null) {
                                for (var j in sectioninfo) {
                                    if (monitorinfos[i].SectionString.Id == sectioninfo[j].id) {
                                        if (sectioninfo[j].children == null) {
                                            var child = [];
                                            child.push(mi);
                                            sectioninfo[j].children = child;
                                        }
                                        else {
                                            sectioninfo[j].children.push(mi);
                                        }
                                    }
                                }
                            }

                            for (var j in methodinfo) {
                                if (monitorinfos[i].MonitorString.JCFF == methodinfo[j].title) {
                                    if (methodinfo[j].children == null) {
                                        var child = [];
                                        child.push(mi);
                                        methodinfo[j].children = child;
                                    }
                                    else {
                                        methodinfo[j].children.push(mi);
                                    }
                                }
                            }
                        }
                    }
                }

                //按灾害体构建监测点树
                var monitortreebytypedata = [];             //按不同分类方法组成的监测点集合
                var monitorbydisaster = new Object;
                monitorbydisaster.title = "按灾害体分类";
                monitorbydisaster.children = disasterinfo;
                monitorbydisaster.spread = true;
                monitortreebytypedata.push(monitorbydisaster);
                //按监测方法构建监测点树
                var monitorbymethod = new Object;
                monitorbymethod.title = "按监测方法分类";
                monitorbymethod.children = methodinfo;
                monitortreebytypedata.push(monitorbymethod);
                //按监测剖面构建监测点树
                var monitorbysection = new Object;
                monitorbysection.title = "按监测剖面分类";
                monitorbysection.children = sectioninfo;
                monitortreebytypedata.push(monitorbysection);


                //渲染监测点树
                tree.render({
                    elem: '#monitortreebytype'
                    , id: 'monitortreebytypeid'
                    , showCheckbox: false
                    , showLine: true
                    , data: monitortreebytypedata
                    , edit: false
                    , accordion: true
                    , click: function (obj) {
                        if ((obj.data.type != null) || (obj.data.type != undefined)) {
                            if (obj.data != currentmonitor) {
                                currentmonitor = obj.data;
                                LoadMonitorAutoDataPreDateTime(currentmonitor, form.val("autodataform").autodatapretime);
                            }
                        }
                    }
                });


                //渲染工具栏
                document.getElementById("autodatapretimeid").style.visibility = "visible";
                document.getElementById("autodatacustomtimeid").style.visibility = "visible";

                //自动化监测数据时间范围（预设）
                if (autodatadatetimes.length > 0) {
                    for (var i in autodatadatetimes) {
                        if (autodatadatetimes[i].name == "最近30天") {
                            document.getElementById("autodatapretimeid").innerHTML += '<option value="' + autodatadatetimes[i].value + '" selected>' + autodatadatetimes[i].name + '</option>';
                        }
                        else {
                            document.getElementById("autodatapretimeid").innerHTML += '<option value="' + autodatadatetimes[i].value + '">' + autodatadatetimes[i].name + '</option>';
                        }
                    }
                }

                form.render();
                form.render('select');

                //预设时间范围切换时间
                form.on('select(autodatapretimefilter)', function (data) {
                    if (data.value != "") {
                        //按预设时间范围绘制图表
                        LoadMonitorAutoDataPreDateTime(currentmonitor, data.value);
                    }
                });


                //自定义时间范围
                date.render({
                    elem: '#autodatacustomtimeid'
                    , type: 'datetime'
                    , range: true
                    , done: function (value, date, endDate) {
                        if (value != "") {
                            //按自定义时间范围绘制图表
                            LoadMonitorAutoDataCustomDateTime(currentmonitor, value);
                        }
                    }
                });

                //渲染统计表格
                monitorstatisticstable = table.render({
                    elem: '#autodatastatistics'
                    , id: 'autodatastatisticstableid'
                    , title: '监测点监测数据统计信息'
                    , page: false
                    , skin: 'line'
                    , even: false
                    , size: 'sm'
                    , totalRow: false
                    , cols: [[
                        { field: 'name', title: '', fixed: 'left', align: "center" }
                        , { field: 'minvalue', title: '最小值', align: "center" }
                        , { field: 'maxvalue', title: '最大值', align: "center" }
                        , { field: 'avgvalue', title: '平均值', align: "center" }
                        , { field: 'sdvalue', title: '标准差', align: "center" }
                    ]]
                    , data: []
                });

                var data1 = form.val("autodataform");

                //加载初始监测点数据
                LoadMonitorAutoDataPreDateTime(currentmonitor, form.val("autodataform").autodatapretime);
            }
        }, datatype: "json"
    });
};


function LoadMonitorAutoDataPreDateTime(monitor, datetime) {
    //实例化图表
    autodatachart = echarts.init(document.getElementById('autodatachart'));
    autodatachart.showLoading();

    //请求监测点指点时间范围数据
    $.ajax({
        url: servicesurl + "/api/Data/GetAutoDatabyPreDateTime", type: "get", data: { "id": monitor.id, "type": monitor.type, "predatetime": datetime, "cookie": document.cookie },
        success: function (data) {
            DisplayDATA(monitor, data);
        }, datatype: "json"
    });
};


function LoadMonitorAutoDataCustomDateTime(monitor, datetime) {
    //实例化图表
    autodatachart = echarts.init(document.getElementById('autodatachart'));
    autodatachart.showLoading();

    //请求监测点指点时间范围数据
    $.ajax({
        url: servicesurl + "/api/Data/GetAutoDatabyCustomDateTime", type: "get", data: { "id": monitor.id, "type": monitor.type, "customdatetime": datetime, "cookie": document.cookie },
        success: function (data) {
            DisplayDATA(monitor, data);
        }, datatype: "json"
    });
};


//计算数组平均值
function GetArrayAvg(arr) {
    var sum = 0;
    for (var i in arr) {
        sum += arr[i];
    }
    return sum / arr.length;
};

//展示数据
function DisplayDATA(monitor, data) {
    if (data == "") {
        layer.msg('无监测数据！', { zIndex: layer.zIndex, success: function (layero) { layer.setTop(layero); } });

        DisplayNODATA(monitor);
    }
    else {
        if (monitor.type == "GNSS") {
            DisplayGNSS(monitor, data);
        }
        else if (monitor.type == "裂缝") {
            DisplayLF(monitor, data);
        }
        else if (monitor.type == "倾角") {
            DisplayQJ(monitor, data);
        }
        else if (monitor.type == "应力") {
            DisplayYL(monitor, data);
        }
        else if (monitor.type == "深部位移") {
            DisplaySBWY(monitor, data);
        }
        else if (monitor.type == "地下水位") {
            DisplayWATER(monitor, data);
        }
        else if (monitor.type == "雨量") {
            DisplayRAIN(monitor, data);
        }
        //TODO
    }
};


//展示无数据
function DisplayNODATA(monitor) {
    document.getElementById("autodatastatisticsdiv").style.visibility = "hidden";
    monitorstatisticstable.reload({ id: 'autodatastatisticstableid', data: [] });

    var option = {
        title: {
            text: monitor.title,
            textStyle: {
                fontSize: 20,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
            },
            left: "center",
            top: 10
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        }
    };

    autodatachart.hideLoading();
    autodatachart.setOption(option, true, false);
};

//展示GNSS
function DisplayGNSS(monitor, data) {
    var gnssmonitors = JSON.parse(data);

    //统计
    monitorstatisticsdata = [];
    var values = [];
    for (var i in gnssmonitors.Statistics) {
        var statistics = new Object;
        statistics.name = gnssmonitors.Statistics[i].Name;
        statistics.minvalue = gnssmonitors.Statistics[i].Min;
        statistics.maxvalue = gnssmonitors.Statistics[i].Max;
        statistics.avgvalue = gnssmonitors.Statistics[i].Avg;
        statistics.sdvalue = gnssmonitors.Statistics[i].Sd;
        monitorstatisticsdata.push(statistics);

        values.push(parseFloat(gnssmonitors.Statistics[i].Min));
        values.push(parseFloat(gnssmonitors.Statistics[i].Max));
    }
    document.getElementById("autodatastatisticsdiv").style.visibility = "visible";
    monitorstatisticstable.reload({ id: 'autodatastatisticstableid', data: monitorstatisticsdata });

    var yaxismax = parseInt(2 * Math.max.apply(null, values) - Math.min.apply(null, values));
    var yaxismin = parseInt(2 * Math.min.apply(null, values) - Math.max.apply(null, values));

    //图表
    var xs = [];
    var ys = [];
    var xys = [];
    var hs = [];

    for (var i in gnssmonitors.Datas) {
        //yyyy-MM-dd HH:mm:ss转UNIX时间戳（毫秒）
        var time = Math.round(new Date(gnssmonitors.Datas[i].Time) / 1000) * 1000;

        var x = [];
        var y = [];
        var xy = [];
        var h = [];

        x.push(time);
        x.push(parseInt(parseFloat(gnssmonitors.Datas[i].Dx) * 1000) / 1000);
        xs.push(x);

        y.push(time);
        y.push(parseInt(parseFloat(gnssmonitors.Datas[i].Dy) * 1000) / 1000);
        ys.push(y);

        xy.push(time);
        xy.push(parseInt(parseFloat(gnssmonitors.Datas[i].Dxy) * 1000) / 1000);
        xys.push(xy);

        h.push(time);
        h.push(parseInt(parseFloat(gnssmonitors.Datas[i].Dh) * 1000) / 1000);
        hs.push(h);
    }

    var option = {
        title: {
            text: monitor.title,
            textStyle: {
                fontSize: 20,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
            },
            left: "center",
            top: 10
        },
        legend: {
            data: ['X位移', 'Y位移', '水平位移', '垂直位移'],
            left: 'center',
            bottom: 10
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var date = new Date(parseInt(params[0].value[0]));
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mm = date.getMinutes();
                var s = date.getSeconds();
                var time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s);
                var label = "";
                for (var i in params) {
                    label += params[i].marker + params[i].seriesName + ':' + params[i].value[1] + 'mm<br/>';
                }
                return time + '<br/>' + label;
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            splitLine: { show: false },
            axisLabel: {
                formatter: function (params, index) {
                    var time = new Date(params);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var mm = time.getMinutes();
                    var s = time.getSeconds();
                    //return (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s) + '\n' + y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                }
            }
        },
        yAxis: {
            type: 'value',
            max: yaxismax,
            min: yaxismin,
            splitLine: { show: true, lineStyle: { color: '#DCDCDC' } },
            axisLabel: {
                formatter: '{value} mm'
            }
        },
        dataZoom: [
            //{
            //    //x轴滑块
            //    type: 'slider',
            //    height: 15,
            //    xAxisIndex: 0,
            //    filterMode: 'empty'
            //},
            {
                //y轴滑块
                type: 'slider',
                width: 20,
                yAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //x轴缩放
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //y轴缩放
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty'
            }
        ],
        series: [
            {
                name: 'X位移',
                type: 'line',
                showSymbol: false,
                data: xs
            },
            {
                name: 'Y位移',
                type: 'line',
                showSymbol: false,
                data: ys
            },
            {
                name: '水平位移',
                type: 'line',
                showSymbol: false,
                data: xys
            },
            {
                name: '垂直位移',
                type: 'line',
                showSymbol: false,
                data: hs
            }
        ]
    };

    autodatachart.hideLoading();
    autodatachart.setOption(option, true, false);
};
//展示裂缝
function DisplayLF(monitor, data) {
    var lfmonitors = JSON.parse(data);

    //统计
    var avgs = [];
    var sds = [];
    monitorstatisticsdata = [];
    for (var i in lfmonitors.Statistics) {
        var statistics = new Object;
        statistics.name = lfmonitors.Statistics[i].Name;
        statistics.minvalue = lfmonitors.Statistics[i].Min;
        statistics.maxvalue = lfmonitors.Statistics[i].Max;
        statistics.avgvalue = lfmonitors.Statistics[i].Avg;
        statistics.sdvalue = lfmonitors.Statistics[i].Sd;
        monitorstatisticsdata.push(statistics);

        avgs.push(parseFloat(lfmonitors.Statistics[i].Avg));
        sds.push(parseFloat(lfmonitors.Statistics[i].Sd));
    }
    document.getElementById("autodatastatisticsdiv").style.visibility = "visible";
    monitorstatisticstable.reload({ id: 'autodatastatisticstableid', data: monitorstatisticsdata });

    var yaxismax = parseInt(GetArrayAvg(avgs) + 12 * GetArrayAvg(sds));
    var yaxismin = parseInt(GetArrayAvg(avgs) - 12 * GetArrayAvg(sds));

    //图表
    var lens = [];
    for (var i in lfmonitors.Datas) {
        var len = [];

        len.push(Math.round(new Date(lfmonitors.Datas[i].Time) / 1000) * 1000);
        len.push(parseFloat(lfmonitors.Datas[i].Dv));
        lens.push(len);
    }

    var option = {
        title: {
            text: monitor.title,
            textStyle: {
                fontSize: 20,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
            },
            left: "center",
            top: 10
        },
        legend: {
            data: ['变形量'],
            left: 'center',
            bottom: 10
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var date = new Date(parseInt(params[0].value[0]));
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mm = date.getMinutes();
                var s = date.getSeconds();
                var time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s);
                var label = "";
                for (var i in params) {
                    label += params[i].marker + params[i].seriesName + ':' + params[i].value[1] + 'mm<br/>';
                }
                return time + '<br/>' + label;
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            splitLine: { show: false },
            axisLabel: {
                formatter: function (params, index) {
                    var time = new Date(params);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var mm = time.getMinutes();
                    var s = time.getSeconds();
                    //return (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s) + '\n' + y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                }
            }
        },
        yAxis: {
            type: 'value',
            min: yaxismin,
            max: yaxismax,
            splitLine: { show: true, lineStyle: { color: '#DCDCDC' } },
            axisLabel: {
                formatter: '{value} mm'
            }
        },
        dataZoom: [
            //{
            //    //x轴滑块
            //    type: 'slider',
            //    height: 15,
            //    xAxisIndex: 0,
            //    filterMode: 'empty'
            //},
            {
                //y轴滑块
                type: 'slider',
                width: 20,
                yAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //x轴缩放
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //y轴缩放
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty'
            }
        ],
        series: [
            {
                name: '变形量',
                type: 'line',
                showSymbol: false,
                data: lens
            }
        ]
    };

    autodatachart.hideLoading();
    autodatachart.setOption(option, true, false);
};
//展示倾角
function DisplayQJ(monitor, data) {
    var qjmonitors = JSON.parse(data);

    //统计
    monitorstatisticsdata = [];
    var values = [];
    for (var i in qjmonitors.Statistics) {
        var statistics = new Object;
        statistics.name = qjmonitors.Statistics[i].Name;
        statistics.minvalue = qjmonitors.Statistics[i].Min;
        statistics.maxvalue = qjmonitors.Statistics[i].Max;
        statistics.avgvalue = qjmonitors.Statistics[i].Avg;
        statistics.sdvalue = qjmonitors.Statistics[i].Sd;
        monitorstatisticsdata.push(statistics);

        values.push(parseFloat(qjmonitors.Statistics[i].Min));
        values.push(parseFloat(qjmonitors.Statistics[i].Max));
    }
    document.getElementById("autodatastatisticsdiv").style.visibility = "visible";
    monitorstatisticstable.reload({ id: 'autodatastatisticstableid', data: monitorstatisticsdata });

    var yaxismax = 2 * Math.max.apply(null, values) - Math.min.apply(null, values);
    var yaxismin = 2 * Math.min.apply(null, values) - Math.max.apply(null, values);
    //倾角角度较小
    if (yaxismax > 0) {
        if (parseInt(yaxismax) == 0) {
            yaxismax = 1;
        }
    }
    else {
        if (parseInt(yaxismax) == 0) {
            yaxismax = 0;
        }
    }

    if (yaxismin > 0) {
        if (parseInt(yaxismin) == 0) {
            yaxismin = 0;
        }
    }
    else {
        if (parseInt(yaxismin) == 0) {
            yaxismin = -1;
        }
    }

    if (yaxismax > 1) {
        yaxismax = parseInt(yaxismax) + 1;
    }

    if (yaxismin < -1) {
        yaxismin = parseInt(yaxismin) - 1;
    }


    //图表
    var xs = [];
    var ys = [];
    var zs = [];

    for (var i in qjmonitors.Datas) {
        var x = [];
        var y = [];

        x.push(Math.round(new Date(qjmonitors.Datas[i].Time) / 1000) * 1000);
        x.push(parseFloat(qjmonitors.Datas[i].Dx));
        xs.push(x);

        y.push(Math.round(new Date(qjmonitors.Datas[i].Time) / 1000) * 1000);
        y.push(parseFloat(qjmonitors.Datas[i].Dy));
        ys.push(y);
    }

    var option = {
        title: {
            text: monitor.title,
            textStyle: {
                fontSize: 20,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
            },
            left: "center",
            top: 10
        },
        legend: {
            data: ['X方向角度', 'Y方向角度'],
            left: 'center',
            bottom: 10
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var date = new Date(parseInt(params[0].value[0]));
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mm = date.getMinutes();
                var s = date.getSeconds();
                var time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s);
                var label = "";
                for (var i in params) {
                    label += params[i].marker + params[i].seriesName + ':' + params[i].value[1] + '°<br/>';
                }
                return time + '<br/>' + label;
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            splitLine: { show: false },
            axisLabel: {
                formatter: function (params, index) {
                    var time = new Date(params);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var mm = time.getMinutes();
                    var s = time.getSeconds();
                    //return (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s) + '\n' + y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                }
            }
        },
        yAxis: {
            type: 'value',
            min: yaxismin,
            max: yaxismax,
            splitLine: { show: true, lineStyle: { color: '#DCDCDC' } },
            axisLabel: {
                formatter: '{value} °'
            }
        },
        dataZoom: [
            //{
            //    //x轴滑块
            //    type: 'slider',
            //    height: 15,
            //    xAxisIndex: 0,
            //    filterMode: 'empty'
            //},
            {
                //y轴滑块
                type: 'slider',
                width: 20,
                yAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //x轴缩放
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //y轴缩放
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty'
            }
        ],
        series: [
            {
                name: 'X方向角度',
                type: 'line',
                showSymbol: false,
                data: xs
            },
            {
                name: 'Y方向角度',
                type: 'line',
                showSymbol: false,
                data: ys
            }
        ]
    };

    autodatachart.hideLoading();
    autodatachart.setOption(option, true, false);
};
//展示应力
function DisplayYL(monitor, data) {
    var ylmonitors = JSON.parse(data);

    //统计
    var avgs = [];
    var sds = [];
    monitorstatisticsdata = [];
    for (var i in ylmonitors.Statistics) {
        var statistics = new Object;
        statistics.name = ylmonitors.Statistics[i].Name;
        statistics.minvalue = ylmonitors.Statistics[i].Min;
        statistics.maxvalue = ylmonitors.Statistics[i].Max;
        statistics.avgvalue = ylmonitors.Statistics[i].Avg;
        statistics.sdvalue = ylmonitors.Statistics[i].Sd;
        monitorstatisticsdata.push(statistics);

        avgs.push(parseFloat(ylmonitors.Statistics[i].Avg));
        sds.push(parseFloat(ylmonitors.Statistics[i].Sd));
    }
    document.getElementById("autodatastatisticsdiv").style.visibility = "visible";
    monitorstatisticstable.reload({ id: 'autodatastatisticstableid', data: monitorstatisticsdata });

    var yaxismax = parseInt(GetArrayAvg(avgs) + 12 * GetArrayAvg(sds));
    var yaxismin = parseInt(GetArrayAvg(avgs) - 12 * GetArrayAvg(sds));

    //图表
    var ps = [];
    for (var i in ylmonitors.Datas) {
        var p = [];

        p.push(Math.round(new Date(ylmonitors.Datas[i].Time) / 1000) * 1000);
        p.push(parseFloat(ylmonitors.Datas[i].Dv));
        ps.push(p);
    }

    var option = {
        title: {
            text: monitor.title,
            textStyle: {
                fontSize: 20,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
            },
            left: "center",
            top: 10
        },
        legend: {
            data: ['应力变形量'],
            left: 'center',
            bottom: 10
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var date = new Date(parseInt(params[0].value[0]));
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mm = date.getMinutes();
                var s = date.getSeconds();
                var time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s);
                var label = "";
                for (var i in params) {
                    label += params[i].marker + params[i].seriesName + ':' + params[i].value[1] + 'kN<br/>';
                }
                return time + '<br/>' + label;
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            splitLine: { show: false },
            axisLabel: {
                formatter: function (params, index) {
                    var time = new Date(params);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var mm = time.getMinutes();
                    var s = time.getSeconds();
                    //return (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s) + '\n' + y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                }
            }
        },
        yAxis: {
            type: 'value',
            min: yaxismin,
            max: yaxismax,
            splitLine: { show: true, lineStyle: { color: '#DCDCDC' } },
            axisLabel: {
                formatter: '{value} kN'
            }
        },
        dataZoom: [
            //{
            //    //x轴滑块
            //    type: 'slider',
            //    height: 15,
            //    xAxisIndex: 0,
            //    filterMode: 'empty'
            //},
            {
                //y轴滑块
                type: 'slider',
                width: 20,
                yAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //x轴缩放
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //y轴缩放
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty'
            }
        ],
        series: [
            {
                name: '应力变形量',
                type: 'line',
                showSymbol: false,
                data: ps
            }
        ]
    };

    autodatachart.hideLoading();
    autodatachart.setOption(option, true, false);

};
//展示深部位移
function DisplaySBWY(monitor, data) {
    var sbwymonitors = JSON.parse(data);

    //统计
    monitorstatisticsdata = [];
    var values = [];
    for (var i in sbwymonitors.Statistics) {
        var statistics = new Object;
        statistics.name = sbwymonitors.Statistics[i].Name;
        statistics.minvalue = sbwymonitors.Statistics[i].Min;
        statistics.maxvalue = sbwymonitors.Statistics[i].Max;
        statistics.avgvalue = sbwymonitors.Statistics[i].Avg;
        statistics.sdvalue = sbwymonitors.Statistics[i].Sd;
        monitorstatisticsdata.push(statistics);

        values.push(parseFloat(sbwymonitors.Statistics[i].Min));
        values.push(parseFloat(sbwymonitors.Statistics[i].Max));
    }
    document.getElementById("autodatastatisticsdiv").style.visibility = "visible";
    monitorstatisticstable.reload({ id: 'autodatastatisticstableid', data: monitorstatisticsdata });

    var yaxismax = Math.floor(parseFloat(2 * Math.max.apply(null, values) - Math.min.apply(null, values)) * 100) / 100;
    var yaxismin = Math.floor(parseFloat(2 * Math.min.apply(null, values) - Math.max.apply(null, values)) * 100) / 100;

    //图表
    var xs = [];
    var ys = [];
    var zs = [];

    for (var i in sbwymonitors.Datas) {
        var x = [];
        var y = [];

        x.push(Math.round(new Date(sbwymonitors.Datas[i].Time) / 1000) * 1000);
        x.push(parseFloat(sbwymonitors.Datas[i].X));
        xs.push(x);

        y.push(Math.round(new Date(sbwymonitors.Datas[i].Time) / 1000) * 1000);
        y.push(parseFloat(sbwymonitors.Datas[i].Y));
        ys.push(y);
    }

    var option = {
        title: {
            text: monitor.title,
            textStyle: {
                fontSize: 20,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
            },
            left: "center",
            top: 10
        },
        legend: {
            data: ['X方向位移', 'Y方向位移'],
            left: 'center',
            bottom: 10
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var date = new Date(parseInt(params[0].value[0]));
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mm = date.getMinutes();
                var s = date.getSeconds();
                var time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s);
                var label = "";
                for (var i in params) {
                    label += params[i].marker + params[i].seriesName + ':' + Math.floor(parseFloat(params[i].value[1]) * 100) / 100 + 'mm<br/>';
                }
                return time + '<br/>' + label;
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            splitLine: { show: false },
            axisLabel: {
                formatter: function (params, index) {
                    var time = new Date(params);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var mm = time.getMinutes();
                    var s = time.getSeconds();
                    //return (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s) + '\n' + y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                }
            }
        },
        yAxis: {
            type: 'value',
            min: yaxismin,
            max: yaxismax,
            splitLine: { show: true, lineStyle: { color: '#DCDCDC' } },
            axisLabel: {
                formatter: '{value} mm'
            }
        },
        dataZoom: [
            //{
            //    //x轴滑块
            //    type: 'slider',
            //    height: 15,
            //    xAxisIndex: 0,
            //    filterMode: 'empty'
            //},
            {
                //y轴滑块
                type: 'slider',
                width: 20,
                yAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //x轴缩放
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                //y轴缩放
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty'
            }
        ],
        series: [
            {
                name: 'X方向位移',
                type: 'line',
                showSymbol: false,
                data: xs
            },
            {
                name: 'Y方向位移',
                type: 'line',
                showSymbol: false,
                data: ys
            }
        ]
    };

    autodatachart.hideLoading();
    autodatachart.setOption(option, true, false);
};
//展示地下水位
function DisplayWATER(monitor, data) {
    var watermonitors = JSON.parse(data);

    document.getElementById("autodatastatisticsdiv").style.visibility = "hidden";
    monitorstatisticsdata = [];
    monitorstatisticstable.reload({ id: 'autodatastatisticstableid', data: monitorstatisticsdata });

    var waters = [];
    for (var i in watermonitors.Datas) {
        var time = Math.round(new Date(watermonitors.Datas[i].Time) / 1000) * 1000;
        var water = [];

        water.push(time);
        water.push(parseFloat(watermonitors.Datas[i].Value));
        waters.push(water);
    }

    var top = Math.floor(parseFloat(watermonitors.Height) * 100) / 100;//孔口高程
    var down = Math.floor((parseFloat(watermonitors.Height) - parseFloat(watermonitors.Deep)) * 100) / 100;//孔底高程

    var option = {
        title: {
            text: monitor.title,
            textStyle: {
                fontSize: 20,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
            },
            left: "center",
            top: 10
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var date = new Date(parseInt(params[0].value[0]));
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mm = date.getMinutes();
                var s = date.getSeconds();
                var time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s);
                var label = "";
                for (var i in params) {
                    label += params[i].marker + params[i].seriesName + ':' + Math.floor(parseFloat(params[i].value[1]) * 100) / 100 + 'm<br/>';
                }
                return time + '<br/>' + label;
            }
        },
        legend: {
            data: ['地下水位'],
            left: 'center',
            bottom: 10
        },
        dataZoom: [
            //{
            //    type: 'slider',
            //    height: 15,
            //    start: 0,
            //    end: 100
            //},
            {
                type: 'inside',
                start: 0,
                end: 100
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            splitLine: { show: false },
            axisLabel: {
                formatter: function (params, index) {
                    var time = new Date(params);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var mm = time.getMinutes();
                    var s = time.getSeconds();
                    //return (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s) + '\n' + y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                }
            }
        },
        yAxis: {
            type: 'value',
            min: down,
            max: top,
            splitLine: { show: true, lineStyle: { color: '#DCDCDC' } },
            axisLabel: {
                formatter: '{value} m'
            }
        },
        series: [
            {
                name: '地下水位',
                type: 'line',
                smooth: true,
                symbol: 'none',
                itemStyle: {
                    color: 'rgb(135,206,250)'
                },
                sampling: 'average',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(135,206,250)'
                    }, {
                        offset: 1,
                        color: 'rgb(30,144,255)'
                    }])
                },
                data: waters
            }
        ]
    };

    autodatachart.hideLoading();
    autodatachart.setOption(option, true, false);
};
//展示雨量
function DisplayRAIN(monitor, data) {
    var rainmonitors = JSON.parse(data);

    document.getElementById("autodatastatisticsdiv").style.visibility = "hidden";
    monitorstatisticsdata = [];
    monitorstatisticstable.reload({ id: 'autodatastatisticstableid', data: monitorstatisticsdata });

    var rains = [];
    for (var i in rainmonitors) {
        var time = Math.round(new Date(rainmonitors[i].Time + " 12:00:00") / 1000) * 1000;
        var rain = [];

        rain.push(time);
        rain.push(parseFloat(rainmonitors[i].Value));
        rains.push(rain);
    }

    var option = {
        title: {
            text: monitor.title,
            textStyle: {
                fontSize: 20,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
            },
            left: "center",
            top: 10
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var date = new Date(parseInt(params[0].value[0]));
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var h = date.getHours();
                var mm = date.getMinutes();
                var s = date.getSeconds();
                var time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s);
                var label = "";
                for (var i in params) {
                    label += params[i].marker + params[i].seriesName + ':' + params[i].value[1] + 'mm<br/>';
                }
                return time + '<br/>' + label;
            }
        },
        legend: {
            data: ['降雨量(日)'],
            left: 'center',
            bottom: 10
        },
        dataZoom: [
            //{
            //    type: 'slider',
            //    height: 15,
            //    start: 0,
            //    end: 100
            //},
            {
                type: 'inside',
                start: 0,
                end: 100
            }
        ],
        grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            splitLine: { show: false },
            axisLabel: {
                formatter: function (params, index) {
                    var time = new Date(params);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var mm = time.getMinutes();
                    var s = time.getSeconds();
                    //return (h < 10 ? '0' + h : h) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (s < 10 ? '0' + s : s) + '\n' + y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: { show: true, lineStyle: { color: '#DCDCDC' } },
            axisLabel: {
                formatter: '{value} mm'
            }
        },
        series: [
            {
                name: '降雨量(日)',
                type: 'bar',
                itemStyle: {
                    color: '#4cabce'
                },
                showSymbol: false,
                data: rains
            }
        ]
    };

    autodatachart.hideLoading();
    autodatachart.setOption(option, true, false);
};

//自动化监测数据图表可视化
function LoadAuoData(monitor) {
    if (monitor != null) {
        //if (chart != null) {
        //    chart.dispose();
        //    chart = nul;
        //}

        //绘制图表
        chart = echarts.init(document.getElementById('autodatachart'));//实例化图表

        chart.showLoading();
        $.ajax({
            url: servicesurl + "/api/Data/GetDeviceData", type: "get", data: { "id": monitor.id, "type": monitor.type, "cookie": document.cookie },
            success: function (result) {
                if (result == "") {
                    //无数据
                    var option = {
                        title: {
                            text: monitor.title + '无数据'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '1%',
                            right: '1%',
                            bottom: '1%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                //保存图片
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: '',
                                type: 'line',
                                stack: '总量',
                                data: []
                            },
                            {
                                name: '',
                                type: 'line',
                                stack: '总量',
                                data: []
                            }
                        ]
                    };

                    chart.hideLoading();
                    chart.setOption(option);
                }
                else {
                    if (monitor.type == "GNSS") {

                        var gnsss = JSON.parse(result);
                        var times = [];
                        var xys = [];
                        var hs = [];

                        for (var i in gnsss) {
                            if (gnsss[i].Flag != "200") {
                                times.push(gnsss[i].Time);
                                xys.push(gnsss[i].Dxy);
                                hs.push(gnsss[i].Dh);
                            }
                        }

                        var option = {
                            title: {
                                text: monitor.title
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['平面位移', '垂直位移']
                            },
                            dataZoom: [
                                {   // 这个dataZoom组件，默认控制x轴。
                                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                                    start: 50,      // 左边在 10% 的位置。
                                    end: 100         // 右边在 60% 的位置。
                                },
                                {   // 这个dataZoom组件，也控制x轴。
                                    type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                                    start: 50,      // 左边在 10% 的位置。
                                    end: 100        // 右边在 60% 的位置。
                                }
                            ],
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: times
                            },
                            yAxis: {
                                type: 'value',
                                min: -50,
                                max: 50

                            },
                            series: [
                                {
                                    name: '平面位移',
                                    type: 'line',
                                    stack: '总量',
                                    data: xys
                                },
                                {
                                    name: '垂直位移',
                                    type: 'line',
                                    stack: '总量',
                                    data: hs
                                }
                            ]
                        };

                    }
                    else if (monitor.type == "裂缝") {
                        var lfs = JSON.parse(result);
                        var times = [];
                        var values = [];

                        for (var i in lfs) {
                            if (lfs[i].Flag != "200") {
                                times.push(lfs[i].Time);
                                values.push(lfs[i].Dv);
                            }
                        }

                        var option = {
                            title: {
                                text: monitor.title
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['位移']
                            },
                            dataZoom: [
                                {
                                    type: 'slider',
                                    start: 50,
                                    end: 100
                                },
                                {
                                    type: 'inside',
                                    start: 50,
                                    end: 100
                                }
                            ],
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: times
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name: '位移',
                                    type: 'line',
                                    stack: '总量',
                                    data: values
                                }
                            ]
                        };
                    }
                    else if (monitor.type == "倾角") {
                        var qjs = JSON.parse(result);
                        var times = [];
                        var xs = [];
                        var ys = [];

                        for (var i in qjs) {
                            if (qjs[i].Flag != "200") {
                                times.push(qjs[i].Time);
                                xs.push(qjs[i].Dx);
                                ys.push(qjs[i].Dy);
                            }
                        }

                        var option = {
                            title: {
                                text: monitor.title
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['X方向', 'Y方向']
                            },
                            dataZoom: [
                                {
                                    type: 'slider',
                                    start: 50,
                                    end: 100
                                },
                                {
                                    type: 'inside',
                                    start: 50,
                                    end: 100
                                }
                            ],
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: times
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name: 'X方向',
                                    type: 'line',
                                    stack: '总量',
                                    data: xs
                                },
                                {
                                    name: 'Y方向',
                                    type: 'line',
                                    stack: '总量',
                                    data: ys
                                }
                            ]
                        };



                    }
                    else if (monitor.type == "应力") {
                        var yls = JSON.parse(result);
                        var times = [];
                        var values = [];

                        for (var i in yls) {
                            if (yls[i].Flag != "200") {
                                times.push(yls[i].Time);
                                values.push(yls[i].Dv);
                            }
                        }

                        var option = {
                            title: {
                                text: monitor.title
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['位移']
                            },
                            dataZoom: [
                                {
                                    type: 'slider',
                                    start: 50,
                                    end: 100
                                },
                                {
                                    type: 'inside',
                                    start: 50,
                                    end: 100
                                }
                            ],
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: times
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name: '位移',
                                    type: 'line',
                                    stack: '总量',
                                    data: values
                                }
                            ]
                        };
                    }
                    else if (monitor.type == "深部位移") {
                        var sbwys = JSON.parse(result);
                        var times = [];
                        var xs = [];
                        var ys = [];

                        for (var i in sbwys) {
                            times.push(sbwys[i].Time);
                            xs.push(sbwys[i].X);
                            ys.push(sbwys[i].Y);
                        }

                        var option = {
                            title: {
                                text: monitor.title
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['X方向位移', 'Y方向位移']
                            },
                            dataZoom: [
                                {   // 这个dataZoom组件，默认控制x轴。
                                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                                    start: 50,      // 左边在 10% 的位置。
                                    end: 100         // 右边在 60% 的位置。
                                },
                                {   // 这个dataZoom组件，也控制x轴。
                                    type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                                    start: 50,      // 左边在 10% 的位置。
                                    end: 100        // 右边在 60% 的位置。
                                }
                            ],
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: times
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name: 'X方向位移',
                                    type: 'line',
                                    stack: '总量',
                                    data: xs
                                },
                                {
                                    name: 'Y方向位移',
                                    type: 'line',
                                    stack: '总量',
                                    data: ys
                                }
                            ]
                        };
                    }
                    else if (monitor.type == "地下水位") {
                        var waters = JSON.parse(result);
                        var times = [];
                        var water = [];

                        for (var i in waters) {
                            times.push(waters[i].Time);
                            water.push(waters[i].Value);
                        }

                        var option = {
                            title: {
                                text: monitor.title
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['地下水位']
                            },
                            dataZoom: [
                                {   // 这个dataZoom组件，默认控制x轴。
                                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                                    start: 0,      // 左边在 10% 的位置。
                                    end: 100         // 右边在 60% 的位置。
                                },
                                {   // 这个dataZoom组件，也控制x轴。
                                    type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                                    start: 0,      // 左边在 10% 的位置。
                                    end: 100        // 右边在 60% 的位置。
                                }
                            ],
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: times
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name: '地下水位',
                                    type: 'line',
                                    stack: 'm',
                                    data: water
                                }
                            ]
                        };
                    }
                    else if (monitor.type == "雨量") {
                        var rains = JSON.parse(result);
                        var times = [];
                        var rain = [];

                        for (var i in rains) {
                            times.push(rains[i].Time);
                            rain.push(rains[i].Value);
                        }

                        var option = {
                            title: {
                                text: monitor.title
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['降雨量（日）']
                            },
                            dataZoom: [
                                {   // 这个dataZoom组件，默认控制x轴。
                                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                                    start: 0,      // 左边在 10% 的位置。
                                    end: 100         // 右边在 60% 的位置。
                                },
                                {   // 这个dataZoom组件，也控制x轴。
                                    type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
                                    start: 0,      // 左边在 10% 的位置。
                                    end: 100        // 右边在 60% 的位置。
                                }
                            ],
                            grid: {
                                left: '5%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            toolbox: {
                                feature: {
                                    saveAsImage: {}
                                }
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: times
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    name: '降雨量',
                                    type: 'bar',
                                    stack: 'mm',
                                    data: rain
                                }
                            ]
                        };
                    }










                    chart.hideLoading();
                    chart.setOption(option, true, false);
                }

            }, datatype: "json"
        });


    }
















}
