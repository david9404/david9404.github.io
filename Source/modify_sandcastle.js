function startup(Cesium) {
        "use strict";
        //Sandcastle_Begin
        /*
This Sandcastle makes it easy to test streaming performance for 3D Tiles & terrain. `startTest()` will begin a
camera tour, and end once both the tileset has finish resolving in the final view.

It is better to host locally with throttling and disabled cache (f12, networktab).

You can add more flights to destinationFunctions to change the tour or make it longer.

The heatmapTileProperty will colorize the tile property in a heatmap. Booleans should set a reference min/max of -1,1 to help with coloring.
*/
        var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider : new Cesium.TileMapServiceImageryProvider({
        url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
    }),
    baseLayerPicker : false,
    geocoder : false,
	animation:false,
	timeline:false
});
        var scene = viewer.scene;
        var camera = scene.camera;
        var globe = scene.globe;
        var statistics = Cesium.RequestScheduler.statistics;
        var Cartesian3 = Cesium.Cartesian3;

        var tourTime = 0;
        var tourLoads = 0;
        var destinationFunctions = [];
        var lastTotalLoaded = 0;
        var flightDuration = 8.0;
        var doTour = true;
        var currentDestination = 0;

        var referenceMinimum = new Cesium.JulianDate();
        var referenceMaximum = new Cesium.JulianDate();
        //var heatmapTileProperty = "_foveatedFactor";
        //var heatmapTileProperty = "_loadTimestamp";
        var heatmapTileProperty = "_priorityDeferred";

        var tileset = new Cesium.Cesium3DTileset({
          url: 'http://192.168.1.166:8095/Source/tiles_data/brascuba/tileset.json'
          //url: 'http://192.168.1.166:8095/Source/tiles_data/EXPORT/cesium/tileset.json'
		  ,debugHeatmapTilePropertyName: heatmapTileProperty,
        });
		var tileset2= new Cesium.Cesium3DTileset({
          //url: 'http://192.168.1.166:8095/Source/tiles_data/brascuba/tileset.json'
          url: 'http://192.168.1.166:8095/Source/tiles_data/EXPORT/cesium/tileset.json'
		  ,debugHeatmapTilePropertyName: heatmapTileProperty,
        });

        function updateReferenceMinMax() {
          if (heatmapTileProperty === "_loadTimestamp") {
            Cesium.JulianDate.now(referenceMinimum);
            var viewLoadTime = 10;
            Cesium.JulianDate.addSeconds(
              referenceMinimum,
              viewLoadTime,
              referenceMaximum
            );
            tileset._heatmap.setReferenceMinimumMaximum(
              referenceMinimum,
              referenceMaximum,
              heatmapTileProperty
            );
          } else if (heatmapTileProperty === "_priorityDeferred") {
            tileset._heatmap.setReferenceMinimumMaximum(
              -1,
              1,
              heatmapTileProperty
            );
          }
        }

        viewer.scene.primitives.add(tileset);
		viewer.scene.primitives.add(tileset2);
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));
        //viewer.scene.debugShowFramesPerSecond = true;
        tileset.debugColorizeTiles=true;

        destinationFunctions[0] = function () {
          tourTime = 0;
          updateReferenceMinMax();
          camera.flyTo({
        destination : new Cartesian3(738204.474965527, -5826587.244381966, 2479020.1689464003),
        orientation : {
            direction : new Cartesian3(-0.09861909173394406, 0.7783923850859431, 0.6199835236405794),
            up : new Cartesian3(0.07792640376574907, -0.6150666997829799, 0.7846148293361598),
        },
            duration: 8,
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
          });
          startTimer();
        };

        destinationFunctions[1] = function () {
          updateReferenceMinMax();
          camera.flyTo({
        destination : new Cartesian3(738155.9871443008, -5826468.320521228, 2479298.451265381),
        orientation : {
            direction : new Cartesian3(0.6569927772073704, 0.6273080615012825, 0.4181448154322255),
            up : new Cartesian3(0.3561847566162805, -0.7471189813773005, 0.5612001842657806),
        },
            duration: flightDuration,
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            maximumHeight: 100,
          });
          startTimer();
        };

        destinationFunctions[2] = function () {
          updateReferenceMinMax();
          camera.flyTo({
        destination : new Cartesian3(738190.0549898583, -5826591.526179706, 2479029.8159059216),
        orientation : {
            direction : new Cartesian3(0.8035381967837426, 0.5604993462839175, -0.2004166887383191),
            up : new Cartesian3(0.5939016168136055, -0.7322294493561361, 0.3333480209057724),
        },
            duration: flightDuration,
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            maximumHeight: 100,
          });
          startTimer();
        };
		
		destinationFunctions[3] = function () {
          updateReferenceMinMax();
          camera.flyTo({
        destination : new Cartesian3(738045.5904594861, -5826624.020406847, 2479023.3242798983),
        orientation : {
            direction : new Cartesian3(-0.7526655717384786, 0.5996707658130838, 0.27182624919006443),
            up : new Cartesian3(-0.3333549209709643, -0.7031150776127906, 0.6280952828178235),
        },
            duration: flightDuration,
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            maximumHeight: 100,
          });
          startTimer();
        };
		destinationFunctions[4] = function () {
          updateReferenceMinMax();
          camera.flyTo({
        destination : new Cartesian3(738169.7504614324, -5826565.3872025255, 2479236.356043856),
        orientation : {
            direction : new Cartesian3(0.11405000578240052, 0.9905737739652211, 0.07586958885702125),
            up : new Cartesian3(0.42343550523030293, -0.11755205402865454, 0.8982671582018362),
        },
            duration: flightDuration,
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            maximumHeight: 100,
          });
          startTimer();
        };
		destinationFunctions[5] = function () {
          updateReferenceMinMax();
          camera.flyTo({
        destination : new Cartesian3(738193.8632764659, -5826520.407758946, 2479228.206698554),
        orientation : {
            direction : new Cartesian3(-0.76728399066864, -0.0519239152070724, -0.6392019905266061),
            up : new Cartesian3(-0.11149014023928856, -0.9707392553664278, 0.21268579341379873),
        },
            duration: flightDuration,
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            maximumHeight: 100,
          });
          startTimer();
        };

        destinationFunctions[6] = function () {
          console.log(
            "Total Loads and Time (ignoring first view and flight time): " +
              tourLoads +
              ", " +
              tourTime
          );
        };

        

        Sandcastle.addToolbarButton("Start Test", function () {
          currentDestination = 0;
          tourLoads = 0;
          tourTime = 0;
          doTour = true;
          lastTotalLoaded = 0;
          destinationFunctions[0]();
        });

        Sandcastle.addToolbarButton("View 0", function () {
          destinationFunctions[0]();
        });

        Sandcastle.addToolbarButton("View 1", function () {
          destinationFunctions[1]();
        });

        Sandcastle.addToolbarButton("View 2", function () {
          destinationFunctions[2]();
        });
		
		Sandcastle.addToolbarButton("View 3", function () {
          destinationFunctions[3]();
        });
		Sandcastle.addToolbarButton("View 4", function () {
          destinationFunctions[4]();
        });
		Sandcastle.addToolbarButton("View 5", function () {
          destinationFunctions[5]();
        });

        function startTimer() {
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
            duration -= currentDestination === 0 ? 0 : flightDuration;
            var flightLoads = totalLoaded - lastTotalLoaded;
            console.log(
              "view " +
                currentDestination +
                " flight loads, final view time: " +
                flightLoads +
                ", " +
                duration
            );
            lastTotalLoaded = totalLoaded;
            tourTime += currentDestination === 0 ? 0 : duration;
            tourLoads += currentDestination === 0 ? 0 : flightLoads;
            if (
              doTour &&
              currentDestination < destinationFunctions.length - 1
            ) {
              destinationFunctions[++currentDestination]();
            }
            tileset.allTilesLoaded.removeEventListener(timerListener);
            camera.moveEnd.removeEventListener(timerListener);
          };
          window.setTimeout(function () {
            tileset.allTilesLoaded.addEventListener(timerListener);
          }, 50);
        }

        // Add code for flyto
        Sandcastle.addToolbarButton("get cam", function () {
          console.log("requested params for current camera view");
          var position = camera.position;
          var direction = camera.direction;
          var up = camera.up;

          console.log(
            "\n\
Sandcastle.addToolbarButton(VIEW, function() {\n\
    camera.flyTo({\n\
        destination : new Cartesian3(" +
              position.x +
              ", " +
              position.y +
              ", " +
              position.z +
              "),\n\
        orientation : {\n\
            direction : new Cartesian3(" +
              direction.x +
              ", " +
              direction.y +
              ", " +
              direction.z +
              "),\n\
            up : new Cartesian3(" +
              up.x +
              ", " +
              up.y +
              ", " +
              up.z +
              "),\n\
        },\n\
        duration : flightDuration,\n\
        easingFunction: Cesium.EasingFunction.LINEAR_NONE,\n\
    });\n\
    timeAll();\n\
});"
          );
        }); //Sandcastle_End
        Sandcastle.finishedLoading();
      }
      if (typeof Cesium !== "undefined") {
        window.startupCalled = true;
        startup(Cesium);
      }