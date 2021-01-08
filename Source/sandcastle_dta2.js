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
          //url: 'http://192.168.43.233:8086/Source/tiles_data/brascuba/tileset.json'
          url: 'http://192.168.43.223:8086/Source/tiles_data/EXPORT/cesium/tileset.json'
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
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));

        destinationFunctions[0] = function () {
          tourTime = 0;
          updateReferenceMinMax();
          camera.flyTo({
        destination : new Cartesian3(777754.8528453743, -5823657.813369272, 2474118.0938625033),
        orientation : {
            direction : new Cartesian3(-0.10386264093208285, 0.7777006831502771, 0.619995321955098),
            up : new Cartesian3(0.08207226558355178, -0.6145391301358999, 0.7846055064513595),
        },
            duration: 8,
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
          });
          startTimer();
        };

        destinationFunctions[1] = function () {
          updateReferenceMinMax();
          camera.flyTo({
        destination : new Cartesian3(777765.7103307678, -5823632.808773175, 2474168.1407738267),
        orientation : {
            direction : new Cartesian3(0.758299058782998, 0.3017088308767102, -0.5778878081598783),
            up : new Cartesian3(0.4718445233832335, -0.8656857983633166, 0.16718505993454222),
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
        destination : new Cartesian3(778491.5619303845, -5823862.991109853, 2473468.526770756),
        orientation : {
            direction : new Cartesian3(-0.007594312972216681, 0.846524488745507, 0.5322956099430447),
            up : new Cartesian3(0.14310217966994035, -0.5259120311551506, 0.838414158790258),
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
        destination : new Cartesian3(778573.8539007165, -5823610.790817161, 2474120.604550024),
        orientation : {
            direction : new Cartesian3(0.6052559774189122, 0.564988642021616, -0.5607611222127009),
            up : new Cartesian3(0.6940015860788071, -0.719570905271681, 0.024073030689833186),
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
        destination : new Cartesian3(778893.6159198786, -5823367.240720371, 2474471.1170019787),
        orientation : {
            direction : new Cartesian3(-0.9349796720075527, 0.2579785642306098, -0.24343391984307025),
            up : new Cartesian3(-0.32740740272856705, -0.8917018738267357, 0.31252545632703643),
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
        destination : new Cartesian3(778860.4587655282, -5823598.627512495, 2473867.9624835635),
        orientation : {
            direction : new Cartesian3(0.8993760153921773, 0.428856999346285, -0.08487907309219771),
            up : new Cartesian3(0.42702854354402053, -0.8201951473065965, 0.38069218974570895),
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

        viewer.scene.debugShowFramesPerSecond = true;

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