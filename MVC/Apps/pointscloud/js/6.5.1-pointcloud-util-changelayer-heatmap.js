
//加载热力图

function LoadHeadMap(obj) {

    if (obj.data.type == "headmaps") {
        //变化图层信息
        let data = JSON.parse(obj.data.changes);


        let valueMin = Number.MAX_VALUE;
        let valueMax = -Number.MAX_VALUE;

        let bounds = {
            west: 180,
            east: -180,
            south: 90,
            north: -90
        };

        data.forEach(function (item) {
            bounds.west = Math.min(bounds.west, item.x);
            bounds.east = Math.max(bounds.east, item.x);
            bounds.south = Math.min(bounds.south, item.y);
            bounds.north = Math.max(bounds.north, item.y);

            valueMin = Math.min(valueMin, item.value);
            valueMax = Math.max(valueMax, item.value);
        });

        // init heatmap
        let heatMap = CesiumHeatmap.create(
            viewer, // your cesium viewer
            bounds, // bounds for heatmap layer
            {
                // heatmap.js options go here
                // maxOpacity: 0.3
                radius: 100
            }
        );
        // add data to heatmap
        heatMap.setWGS84Data(valueMin, valueMax, data);

        // viewer.scene.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(bounds.west,31.9579881734127,1000)
        // });
        viewer.camera.setView({
            destination: Cesium.Rectangle.fromDegrees(bounds.west, bounds.south, bounds.east, bounds.north)
        });
    }
    else if (obj.data.type == "surPointCloud") {
        LoadPointCloud(obj.data);
    }

}




/*
 * 加载3d tiles点云模型
 */
function LoadPointCloud(obj) {

    var modelurl = datasurl + "/SurPointCloud" + obj.path;
    //删除上一个模型（保证只有一个模型）
    if (curpointcloudtileset != null) {
        viewer.scene.primitives.remove(curtileset);
    }

    //添加点云
    curpointcloudtileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: modelurl,
        maximumScreenSpaceError: isMobile.any() ? 1 : 1,
        maximumNumberOfLoadedTiles: isMobile.any() ? 1000 : 1000
    }));

    //缩放至模型
    viewer.zoomTo(curpointcloudtileset);


    //ugByDistance(curpointcloudtileset);


};





let transformPos = { x: -518467.65, y: -2537603.97, z: -42.13 };
let blhPos = [116.46000, 39.90002];
this.initPointCloudCheck(transformPos, blhPos);

function ugByDistance(tileSet) {
    //let viewer = this.CesiumViewer;
    let camera_position = viewer.scene.camera.position;
    let selectedTiles = tileSet._selectedTiles;
    let distanceArray = [];
    for (let i = 0; i < selectedTiles.length; i++) {
        let tile = selectedTiles[i];
        let boundingSphere = tile.boundingSphere;
        let distance = Cesium.Cartesian3.distance(boundingSphere.center, camera_position);
        console.log(JSON.stringify(boundingSphere) + "," + distance);
        distanceArray.push({ distance: distance });
    }
    if (distanceArray.length <= 0) {
        return;
    }
    let minOne = this.sortByDistance(distanceArray);
    let distance = minOne.distance;
    this.changePointSizeByDistance(tileSet, distance);
}

function changePointSizeByDistance(tileSet, distance){
    let arrayValue = this.$store.state.gradArry;
    if (arrayValue.length === 0) {
        arrayValue = window.tunneManager.initGradArry(0, 0);
    }
    if (distance <= 2) {
        this.pointSize = 30;
    }
    else if (distance <= 2.5) {
        this.pointSize = 25;
    }
    else if (distance <= 3) {
        this.pointSize = 20;
    }
    else if (distance <= 3.5) {
        this.pointSize = 15;
    }
    else if (distance <= 4) {
        this.pointSize = 10;
    }
    else {
        this.pointSize = 5;
    }
    let pointCloudPointStyle = this.initPointCloudStyle(arrayValue, this.pointSize);
    tileSet.style = pointCloudPointStyle;
}

function initPointCloudStyle(arrayValue,pointSize) {
    let conditions = [];
    for (let i = arrayValue.length - 1; i >= 0; i--) {
        let condition = [];
        condition.push('${pValue}>=' + arrayValue[i].value);
        condition.push('color("' + arrayValue[i].color + '")');
        conditions.push(condition);
        if (i === 0) {
            condition = [];
            condition.push('true');
            condition.push('color("blue")');
            conditions.push(condition);
        }
    }

    let showOther = this.$store.state.showCloudOther;
    let colorStyle = new Cesium.Cesium3DTileSyle({
        "defines": {
            "pValue":"(${Intensity}/1000)-1"
        },
        color: {
            "conditions": conditions
        },
        show: {
            conditions: [
                ['${Intensity}<=0', showOther],
                ['${Intensity}<=0','true']
            ]
        },
        pointSize: pointSize
    });
    return colorStyle;
}

function initPointCloudCheck(transformPos, b1lhPos) {
    this.destoryClick();
    let _this = this;
    this.handler.setInputAction(function (movement) {
        let feature = _this.CesiumViewer.scene.pick(movement.position);
        if (feature) {
            let pickedCar3 = cesiumCommon.getCartesian3fromPick (_this.CesiumViewer, movement);
            this.createEntity(pickedCar3, Cesịụm.Color.YELLOW); 
            let url = feature.content.ur1;
            let pickId = feature.content._pickId.key;
            let pointLength = feature.content._pointCloud.pointsLength;

            axios.get(ur1, {
                responseType: ' arraybuffer',

            }).then((res) => {
                _this.processPntsData(res.data, pickId, pickedCar3, pointLength, transformPos, b1lhPos);

            });

        }
    }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 * 鼠标点击处的屏幕坐标转换成笛卡尔坐标
 *  @param {screen position from mouse} viewer
 * @param {screen position from mouse} movement
 */
function getCartesian3fromPick(viewer, movement) {
    let position = movement.position;
    if (!Cesium.defined(position)) {
        return;
    }
    let worldPosition = viewer.scene.pickPosition(position);
    if (!Cesium.defined(worldPosition)) {
        return;
    }
    return worldPosition;
}

/**
 * 读取点云pnts的源数据
 * @param {Object} arrayBuffer
 * @param {Object} pickId 选中的tile Id
 * @param {Object} pickedCar3 选中car3坐标
 * @param {Object} pointLength 选中的tile 所包含的点数量
 * @param {Object} transformPos 
 * @param {Object} blhPos
 */
function processPntsData(arrayBuffer, pickId, pickedCar3, pointLength, transformPos, blhPos) {

    let pickedOriginalPos = this.transFormLocalPosition(pickedCar3, transformPos, blhPos);

    let uint8Array = new Uint8Array(arrayBuffer);
    let view = new DataView(arrayBuffer);

    let sizeOfUint32 = 4;

    //偏移字节数byteOffset 默认为4，TILE中的前4个字节为magic标识
    //getUint32()方法从DataView相对于起始位置偏移 n 个字节处开始，获取一个32-bit数,即为tile的版本
    //具体可查看fuckgis 3D tile的数据结构
    //https://www.cnblogs.com/fuckgiser/p/6554666.html
    let byteOffset = 0;
    byteOffset += sizeOfUint32;  // Skip magic

    let version = view.getUint32(byteOffset, true);
    //继续往下移动
    byteOffset += sizeOfUint32;  // Skip magic
    //得到byteLength的长度
    let byteLength = view.getUint32(byteOffset, true);
    //继续往下移动
    byteOffset += sizeOfUint32;  // Skip byteLength
    //得到featuretableJSON字节长度
    let featureTableJsonByteLength = view.getUint32(byteOffset, true);
    byteOffset += sizeOfUint32;
    //得到featuretable 二进制字节长度
    let featureTableBinaryByteLength = view.getUint32(byteOffset, true);
    //得到bathTableJson字节长度
    let batchTableJSONByteLength = view.getUint32(20, true);
    //得到bathTable 二进制字节长度
    let batchTableBinaryByteLength = view.getUint32(24, true);

    //获取body的内容,从28开始是因为pnts的头部长度为28，b3dm与i3dm是其他的固定值

    //转换到featuretable的buffer中
    let featureTableJson = new Uint8Array(arrayBuffer, 28, featureTableJsonByteLength);
    let featureTableJsonStr = this.Uint8ArrayToString(featureTableJson);
    let featureTableJsonObj = JSON.parse(featureTableJsonStr);
    //多次offset后，可以直接读取内容gltf
    let featureTableBinary = new Uint8Array(arrayBuffer, byteOffset, featureTableBinaryByteLength);
    let featureTable = new Cesium.Cesium3DTileFeatureTable(featureTableJsonObj, featureTableBinary);
    let positions = featureTable.getPropertyArray('POSITION_QUANTIZED', Cesium.ComponentDatatype.UNSIGNED_SHORT, 3);
    // getPropertyArray 函数中调用getTypedArrayFromBinary，
    // 在调用 typedArray = ComponentDatatype.createArrayBufferView(componentType, featureTable.buffer.buffer, featureTable.buffer.byteOffset + byteOffset, count * componentLength);

    let batchTableJSON = new Uint8Array(arrayBuffer, 28 + featureTableJsonByteLength + featureTableBinaryByteLength, batchTableJSONByteLength);
    let batchTableJSONStr = this.Uint8ArrayToString(batchTableJSON);
    let batchTableJSONObj = JSON.parse(batchTableJSONStr);
    let batchTableBinary = new Uint8Array(arrayBuffer, 28 + featureTableJsonByteLength + featureTableBinaryByteLength + batchTableJSONByteLength, batchTableBinaryByteLength);
    let batchTable = new Cesium.Cesium3DTileFeatureTable(batchTableJSONObj, batchTableBinary);
    let intensity = batchTable.getPropertyArray('Intensity', Cesium.ComponentDatatype.UNSIGNED_SHORT, 3);

    let referpointOriginalXYZ = [-518444.65, -2537603.97, -42.13];
    let referpointBLH = [116.46, 39.90002, 0];
    let referpointCar3 = [1, 1, 1];
    let referpointCartian3 = cesiumCommon.lonlat2Cartesian([referpointBLH[0], referpointBLH[1]], referpointBLH[2]);

    this.createEntity(referpointCartian3, Cesium.Color.RED);

    //header+featureTableJsonByteLength+featureTableBinaryByteLength+batchTableJSONByteLength
    //到二进制数据的位置
    let pickIdPre = 28 + featureTableJsonByteLength + featureTableBinaryByteLength + batchTableJSONByteLength;
    // let intensityValue = view.getUint16(pickIdPre, true);

    //byteOffset 表示字段在arraybuffer在body中的偏移
    let xIndex = pickIdPre + batchTableJSONObj.x.byteOffset;
    let yIndex = pickIdPre + batchTableJSONObj.y.byteOffset;
    let zIndex = pickIdPre + batchTableJSONObj.z.byteOffset;

    // let x = view.getFloat32(xIndex, true);
    // let y = view.getFloat32(yIndex, true);
    // let z = view.getFloat32(zIndex, true);
    // alert("强度值:" + intensityValue + "\n" + "x:" + x + ",y:" + y + ",z:" + z);

    //强度值
    let intensitycompentType = batchTableJSONObj.Intensity.componentType;
    let intensitytype = batchTableJSONObj.Intensity.type;
    let intensityIndex = pickIdPre + batchTableJSONObj.Intensity.byteOffset;
    let intensityStep = Cesium.ComponentDatatype.getSizeInBytes(Cesium.ComponentDatatype.fromName(intensitycompentType)) * Cesium.numberOfComponentsForType(intensitytype);

    //x y z
    let xcompentType = batchTableJSONObj.x.componentType;
    let xtype = batchTableJSONObj.x.type;
    //compentType与type 决定了x字段的占位长度
    let xStep = Cesium.ComponentDatatype.getSizeInBytes(Cesium.ComponentDatatype.fromName(xcompentType)) * Cesium.numberOfComponentsForType(xtype);

    let distanceArray = [];

    //一个pnts可能有成千上万个点的数据，pointLength就是该pnts对应的点的个数（todo）
    for (let i = 0; i < pointLength; i++) {
        //强度值
        let eachIntensity = intensityIndex + i * intensityStep;
        //float 每一个值占4位
        let eachX = xIndex + i * xStep;
        let eachY = yIndex + i * xStep;
        let eachZ = zIndex + i * xStep;

        let thisIntensity = view.getUint16(eachIntensity, true);

        let thisX = view.getFloat32(eachX, true);
        let thisY = view.getFloat32(eachY, true);
        let thisZ = view.getFloat32(eachZ, true);

        let checkCartian3 = new Cesium.Cartesian3(thisX, thisY, thisZ);

        let distance = Cesium.Cartesian3.distance(checkCartian3, pickedOriginalPos);

        let checkedPoint = {
            Intensity: thisIntensity,
            x: thisX,
            y: thisY,
            z: thisZ,
            cartesian3: checkCartian3
        };

        distanceArray.push({ distance: distance, point: checkedPoint });
        console.log(JSON.stringify(checkedPoint));
    }

    let minOne = this.sortByDistance(distanceArray);

    //let minOneCar3 = minOne.point.cartesian3;
    //this.createEntity(minOneCar3, Cesium.Color.WHITE);

    alert(JSON.stringify(minOne));
}
