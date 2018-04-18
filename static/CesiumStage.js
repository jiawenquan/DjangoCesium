// stage - a cesium client by simon
// visit roa.nz a new beginning for the long term 

//https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=-36.88|174.75&format=json
//https://en.wikipedia.org/?curid=18630637

var degrees=Math.PI/180;
var range=new Cesium.HeadingPitchRange(0,-30*degrees,26000);

var home = Cesium.Cartesian3.fromDegrees(174.7577127,-36.8763942, 250.0);
var extent = Cesium.Rectangle.fromCartesianArray(home);

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

var time=new Cesium.JulianDate(0,60*60*18);

var terrainSource="https://s3.amazonaws.com/roavirginia/terrain/nz-dem";
var baseSource="https://s3.amazonaws.com/roavirginia/aerial/marble2004-sat";

//var terrainSource="https://s3-ap-southeast-2.amazonaws.com/roanz/terrain/nz-dem";
//var baseSource="https://s3-ap-southeast-2.amazonaws.com/roanz/aerial/marble2004-sat";
//var aerialSource="https://s3-ap-southeast-2.amazonaws.com/roanz/aerial/aerial.json";

var viewer = new Cesium.Viewer('viewer', {
  sceneMode : Cesium.SceneMode.SCENE_3D,
//  sceneMode :   Cesium.SceneMode.COLUMBUS_VIEW,
  mapProjection : new Cesium.WebMercatorProjection(),
  imageryProvider : Cesium.createOpenStreetMapImageryProvider({url : baseSource, maximumLevel:8 }),
  terrainProvider : new Cesium.CesiumTerrainProvider({url : terrainSource, requestVertexNormals: true}),
  baseLayerPicker : false,
  homeButton: false,
  timeline: false,
  geocoder:false,  
  infoBox: true,
  sceneModePicker: false,
  selectionIndicator: false,
  navigationHelpButton: false,
  shadows : true,
  vrButton:false,
  creditContainer: "credits",
  animation: false,
});

var shadows = viewer.shadowMap;
shadows.darkness=0.86;

var scene = viewer.scene;
scene.globe.enableLighting = true;
scene.fog.enable=false;
scene.allowTextureFilterAnisotropic = true;
viewer.clock.currentTime = time;
// viewer.clock.multiplier = 2000;
//scene.globe.maximumScreenSpaceError = 60;
//scene.globe.enableLighting=true;
//scene.globe.tileCacheSize=5000;
//viewer.clockViewModel= new Cesium.ClockViewModel(viewer.clock);

/*
scene.screenSpaceCameraController.enableTilt = true;
scene.screenSpaceCameraController.enableZoom = true;
scene.screenSpaceCameraController.enableRotate = true;

scene.screenSpaceCameraController.enableTranslate = false;
scene.screenSpaceCameraController.enableLook = false;
*/

var placemat= new Cesium.GridMaterialProperty({
  color : Cesium.Color.BLACK,
  cellAlpha : 0.03,
  lineCount : new Cesium.Cartesian2(16,16),
  lineThickness : new Cesium.Cartesian2(0.4, 0.4)
});

var tiles=[];
var tilesrc=[];
for(var index in tilesrc){
  var name=tilesrc[index];
  var tile = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({  
    name : name,
    url : '../static/assets/'+name
  }));
  tiles[tile.name]=tile
  Cesium.when(tile.readyPromise).then(function(tile) {
    console.log("tile ready "+tile.url+" "+JSON.stringify(tile.boundingSphere));
//    viewer.camera.viewBoundingSphere(tile.boundingSphere);
  });
}

var models=['CesiumAir.glb','seagull.glb','Duck.glb','CesiumMan.glb',"CesiumMilkTruck.glb"];

for(var index in models){
  var matrix = Cesium.Transforms.eastNorthUpToFixedFrame(home);  
  var model = scene.primitives.add(Cesium.Model.fromGltf({
      url : '../static/assets/'+models[index],
      modelMatrix : matrix,
      scale : 1000.0
  }));

  Cesium.when(model.readyPromise).then(function(model) {
    console.log("model ready "+JSON.stringify(model.gltf.asset));
    model.activeAnimations.addAll({
        loop : Cesium.ModelAnimationLoop.REPEAT
    });
    
  });
}

var cursor = viewer.entities.add({
  position: home,
  ellipse : {
    semiMinorAxis : 150.0,
    semiMajorAxis : 150.0,
    material : placemat
  }
});

viewer.zoomTo(cursor,range);

viewer.extend(Cesium.viewerDragDropMixin);

viewer.dropError.addEventListener(function(dropHandler, name, error) {
console.log(error);
window.alert(error);
});    

/*
var startMousePosition;
var mousePosition;
var flags = {
    looking : false,
    moveForward : false,
    moveBackward : false,
    moveUp : false,
    moveDown : false,
    moveLeft : false,
    moveRight : false
};
*/

var canvas = viewer.canvas;
canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
canvas.onclick = function() {
    canvas.focus();
};

var ellipsoid = viewer.scene.globe.ellipsoid;

/*
// disable the default event handlers
scene.screenSpaceCameraController.enableRotate = false;
scene.screenSpaceCameraController.enableTranslate = false;
scene.screenSpaceCameraController.enableZoom = false;
scene.screenSpaceCameraController.enableTilt = false;
scene.screenSpaceCameraController.enableLook = false;

var startMousePosition;
var mousePosition;
var flags = {
    looking : false,
    moveForward : false,
    moveBackward : false,
    moveUp : false,
    moveDown : false,
    moveLeft : false,
    moveRight : false
};

var handler = new Cesium.ScreenSpaceEventHandler(canvas);

handler.setInputAction(function(movement) {
    flags.looking = true;
    mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

handler.setInputAction(function(movement) {
    mousePosition = movement.endPosition;
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(function(position) {
    flags.looking = false;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
    case 'W'.charCodeAt(0):
        return 'moveForward';
    case 'S'.charCodeAt(0):
        return 'moveBackward';
    case 'Q'.charCodeAt(0):
        return 'moveUp';
    case 'E'.charCodeAt(0):
        return 'moveDown';
    case 'D'.charCodeAt(0):
        return 'moveRight';
    case 'A'.charCodeAt(0):
        return 'moveLeft';
    default:
        return undefined;
    }
}

document.addEventListener('keydown', function(e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        flags[flagName] = true;
    }
}, false);

document.addEventListener('keyup', function(e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        flags[flagName] = false;
    }
}, false);

viewer.clock.onTick.addEventListener(function(clock) {
    var camera = viewer.camera;

    if (flags.looking) {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        // Coordinate (0.0, 0.0) will be where the mouse was clicked.
        var x = (mousePosition.x - startMousePosition.x) / width;
        var y = -(mousePosition.y - startMousePosition.y) / height;

        var lookFactor = 0.05;
        camera.lookRight(x * lookFactor);
        camera.lookUp(y * lookFactor);
    }

    // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
    var moveRate = cameraHeight / 100.0;

    if (flags.moveForward) {
        camera.moveForward(moveRate);
    }
    if (flags.moveBackward) {
        camera.moveBackward(moveRate);
    }
    if (flags.moveUp) {
        camera.moveUp(moveRate);
    }
    if (flags.moveDown) {
        camera.moveDown(moveRate);
    }
    if (flags.moveLeft) {
        camera.moveLeft(moveRate);
    }
    if (flags.moveRight) {
        camera.moveRight(moveRate);
    }
});

*/
