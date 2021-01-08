var viewer = new Cesium.Viewer('cesiumContainer', {imageryProvider : new Cesium.TileMapServiceImageryProvider({
        url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
    }),
    baseLayerPicker : false,
    geocoder : false,
	animation:false,
	timeline:false
});
viewer.scene.globe.depthTestAgainstTerrain = true;
// Enable lighting based on sun/moon positions
	viewer.scene.globe.enableLighting = true;
	//viewer.clock.shouldAnimate = false;
function load_data(url){
this.url=url;
}
//Here to change url of the tileset
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
     // Edit url //as needed
	//C:\xampp\htdocs\Source\EXPORT\cesium
	url : 'http://192.168.1.166:8090/Source/brascuba/tileset.json'
	//url : 'http://192.168.1.166:8090/Source/EXPORT/cesium/tileset.json' 
	//old url http://192.168.43.223:9080/Source/SampleData/tilesets/TilesetWithDiscreteLOD/tileset.json
	
	//http://192.168.43.223:9080
}));

// Create an initial camera view
    var initialPosition = new Cesium.Cartesian3.fromDegrees(0,-0.51111, 0);
    var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(0.12, -0.487223091598949054, 0.005883251314954971306);
    var homeCameraView = {
        destination : initialPosition,
        orientation : {
            heading : initialOrientation.heading,
            pitch : initialOrientation.pitch,
            roll : initialOrientation.roll
        }
    };
	
viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));
viewer.scene.debugShowFramesPerSecond = true;

//camera up
var scene = viewer.scene;
var canvas = viewer.canvas;
canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
canvas.onclick = function() {
    canvas.focus();
};
var ellipsoid = scene.globe.ellipsoid;

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
    moveRight : false,
	align : false,
	restart_view : false
	
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
	case 'C'.charCodeAt(0):
        return 'align';
	case 'X'.charCodeAt(0):
        return 'restart_view';
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
	if(flags.align)	{
	var direction = camera.direction;
	var x = direction.x;
	var y = direction.y;
	var z = direction.z;
	//camera.direction=(direction.x,0,direction.z);
	camera.direction = Cesium.Cartesian3.negate(Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3());
	//console.log(direction.x +", " + direction.y + ", " + direction.z);
	}
	if(flags.restart_view)	{
	viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));
	}
});

