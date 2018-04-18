// Get your own Bing Maps API key at https://www.bingmapsportal.com, prior to publishing your Cesium application:
Cesium.BingMapsApi.defaultKey = 'AoXRFa1lJ6JlI2tu736DfDW3XcJ_I6uajA1tOUJwP5zynnlLWCXppSjhuCJMV0j1';

// Construct the default list of terrain sources.
var terrainModels = Cesium.createDefaultTerrainProviderViewModels();

// Construct the viewer with just what we need for this base application
var viewer = new Cesium.Viewer('cesiumContainer', {
	
	homeButton : true,//�Ƿ���ʾHome��ť  
	geocoder : false,//�Ƿ���ʾgeocoderС���������Ͻǲ�ѯ��ť
	navigationHelpButton : false,//�Ƿ���ʾ���Ͻǵİ�����ť
	selectionIndicator : true,//�Ƿ���ʾѡȡָʾ�����  
	
	clock : new Cesium.Clock(),//���ڿ��Ƶ�ǰʱ���ʱ�Ӷ���
	
	timeline:false,   //
	animation:false,
	vrButton:true,
	sceneModePicker:false,
	infoBox:true,
	baseLayerPicker : false,  //���ػ�������ѡ����
	scene3DOnly:true,
	terrainProviderViewModels: terrainModels,
	selectedTerrainProviderViewModel: terrainModels[1]  // Select STK high-res terrain
});


//�ȸ��ͼ�ӵ���
    viewer.imageryLayers.removeAll();
    var google = new Cesium.UrlTemplateImageryProvider({
        url : 'http://mt0.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}',
        tilingScheme : new Cesium.WebMercatorTilingScheme(),
        maximumLevel : 20
    });
    viewer.imageryLayers.addImageryProvider(google);

		
		var terrainProvider = new Cesium.CesiumTerrainProvider({
    url : '//assets.agi.com/stk-terrain/world',
	  requestVertexNormals: true});
		viewer.terrainProvider = terrainProvider;
		viewer.scene.globe.enableLighting = true;
		
		
		
viewer._cesiumWidget._creditContainer.style.display="none";


// No depth testing against the terrain to avoid z-fighting
viewer.scene.globe.depthTestAgainstTerrain = false;

// Add credit to Bentley
//viewer.scene.frameState.creditDisplay.addDefaultCredit(new Cesium.Credit('Cesium 3D Tiles produced by Bentley ContextCapture', 'Resources/logoBentley.png', 'http://www.bentley.com/'));

// Bounding sphere
//var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(116.4147512, 40.2002638, 36.14939633), 138.537965);

// Override behavior of home button




/*---------------------------------------------------------------------------------**//**
* @bsimethod
+---------------+---------------+---------------+---------------+---------------+------*/
// Functions to adapt screen space error and memory use to the device
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

// Add tileset. Do not forget to reduce the default screen space error to 1
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
	url: '../static/assets/Scene/Production_4.json',
	//maximumScreenSpaceError : isMobile.any() ? 8 : 1, // Temporary workaround for low memory mobile devices - Increase maximum error to 8.
	//maximumNumberOfLoadedTiles : isMobile.any() ? 10 : 1000 // Temporary workaround for low memory mobile devices - Decrease (disable) tile cache.
}));




//

var bl=true;
tileset.allTilesLoaded.addEventListener(function() {
	if (bl) {
		viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {duration: 0}); 
    console.log('All tiles are loaded');
    
    bl=false;
	}

});
tileset.readyPromise.then(function(tileset) {
    // Set the camera to view the newly added tileset
    //viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
    changeHeight(140);  //�������θ߶�
    viewer.camera.flyToBoundingSphere(tileset.boundingSphere, {duration: 0});
});




viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
	// Fly to custom position
	viewer.camera.flyToBoundingSphere(tileset.boundingSphere);
  //changeHeight(140);  //�������θ߶�
	// Tell the home button not to do anything
	commandInfo.cancel = true;
});


//�˷�������ģ�͸߶�  ֱ�ӵ��ú����������߶�,height��ʾ���������ĸ߶�
function changeHeight(height) {
    height = Number(height);
    if (isNaN(height)) {
        return;
    }
    
    var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude,height);
    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}



function getPosition() {
        //�õ���ǰ��ά����
        var scene = viewer.scene;
        //�õ���ǰ��ά������������
        var ellipsoid = scene.globe.ellipsoid;
        var entity = viewer.entities.add({
            label : {
                show : false
            }
        });
        var longitudeString = null;
        var latitudeString = null;
        var height = null;
        var cartesian = null;
        // ���嵱ǰ�����Ļ���Ԫ�ص��¼�����
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //��������ƶ��¼��Ĵ����������︺�����x,y����ֵ�仯
        handler.setInputAction(function(movement) {
            //ͨ��ָ����������ߵ�ͼ��Ӧ������ϵ�������Ķ�ά����ת��Ϊ��Ӧ��������ά����
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian) {
                //���ѿ�������ת��Ϊ��������
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                //������תΪ�ȵ�ʮ���ƶȱ�ʾ
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                //��ȡ����߶�
                height = Math.ceil(viewer.camera.positionCartographic.height);
                entity.position = cartesian;
                entity.label.show = true;
                entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')' ;
            }else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //�����������¼��Ĵ����������︺������߶�ֵ�仯
        handler.setInputAction(function(wheelment) {
            height = Math.ceil(viewer.camera.positionCartographic.height);
            entity.position = cartesian;
            entity.label.show = true;
            entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')' ;
        }, Cesium.ScreenSpaceEventType.WHEEL);
    }