var viewer = new Cesium.Viewer('cesiumContainer', {imageryProvider : new Cesium.TileMapServiceImageryProvider({
        url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
    }),
    baseLayerPicker : false,
    geocoder : false,
	animation:false,
	timeline:false
});
var lastTotalLoaded = 0;
var all_loaded=0;
var full_time=0;
var moving = false;
var last_position=0;
//var timerStart=0;


viewer.scene.globe.depthTestAgainstTerrain = true;
// Enable lighting based on sun/moon positions
	viewer.scene.globe.enableLighting = true;
	//viewer.clock.shouldAnimate = false;
function loadTileset(url) {
    tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url : url,
          }));

    tileset.debugShowBoundingVolume = viewModel.debugBoundingVolumesEnabled;
    return tileset.readyPromise.then(function() {
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4.0));
    });};
	
	
//Here to change url of the tileset
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
     // Edit url //as needed
	//C:\xampp\htdocs\Source\EXPORT\cesium
	//url : 'http://192.168.1.166:8090/Source/brascuba/tileset.json'
	url : 'http://192.168.1.166:8090/Source/EXPORT/cesium/tileset.json' 
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
tileset.debugColorizeTiles=true;




		  
//camera up
viewer.scene.camera.moveEnd.addEventListener(function() {
var camera=viewer.scene.camera;
if(camera.position!=last_position )
{
last_position=camera.position.clone();

startTimer();

lastTotalLoaded=tileset._statistics.numberOfLoadedTilesTotal;

}
});
//capturar boton para timer
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
//get flagKey
function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
    case 'T'.charCodeAt(0):
        return 'time_duration';
	default:
        return undefined;
	}}
//flag
var flags = {
    time_duration:false
	
};

viewer.clock.onTick.addEventListener(function(clock) {
    if (flags.time_duration) {
        console.log(
            "Total Loads and Time : " +
              all_loaded +
              ", " +
              full_time
          );
    }
	
});

function startTimer() {
		  var scene = viewer.scene;
		  var camera = scene.camera;
		  var timerStart = window.performance.now();
          var timerListener = function () {
            if (camera._currentFlight !== undefined) {
              tileset.allTilesLoaded.removeEventListener(timerListener);
              camera.moveEnd.addEventListener(timerListener);
              return;
            } else if (!tileset._tilesLoaded) {
              return;
            }
            var timerEnd = window.performance.now();
            var duration = (timerEnd - timerStart) / 1000.0;
            var totalLoaded = tileset._statistics.numberOfLoadedTilesTotal;
            var flightLoads = totalLoaded - lastTotalLoaded;
            console.log(
              "view " +
                " flight loads, final view time: " +
                flightLoads +
                ", " +
                duration
            );
            full_time +=  duration;
            all_loaded += flightLoads;
            tileset.allTilesLoaded.removeEventListener(timerListener);
            camera.moveEnd.removeEventListener(timerListener);
          };
          window.setTimeout(function () {
            tileset.allTilesLoaded.addEventListener(timerListener);
          }, 50);
		  }
