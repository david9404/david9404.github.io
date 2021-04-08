var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider : new Cesium.TileMapServiceImageryProvider({
       url: '//mt1.google.cn/maps/vt?lyrs=s,h&gl=CN&x={x}&y={y}&z={z}'
       // url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')

    }),
        // Wedgets
        animation: false,
        timeline: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        baseLayerPicker: false,
        sceneModePicker: true,
        infoBox: true,
        selectionIndicator: false,
        creditContainer: document.createElement('DIV'),

        // Display
        
        terrainProviderViewModels: undefined,
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        sceneMode: Cesium.SceneMode.SCENE3D // Cesium.SceneMode.SCENE2D Cesium.SceneMode.COLUMBUS_VIEW
    });
    //var weather = new Cesium.WebMapTileServiceImageryProvider({
    //url : './Source/TileMapService_Mariel/',
   // layer : 'TileMapService_Mariel',
    //style : 'default',
    //tileMatrixSetID : '2km',
   // maximumLevel : 5,
   // format : 'image/png',
    //clock: clock,
    //times: times,
    //credit : new Cesium.Credit('NASA Global Imagery Browse Services for EOSDIS')
    //});
    //viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({url : './Source/orto2/tilemapresource.xml'}));
    var scene = viewer.scene;
    

    tileset = new Cesium.Cesium3DTileset({
        url: './Source/redes_Mariel/tileset.json'
        //url: './Source/matanzas_model/tileset.json'
    });
    //viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
    //var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
    //inspectorViewModel.tileset = tileset;
    
    scene.primitives.add(tileset);
    tileset.readyPromise.then(function(tileset) {
        var boundingSphere = tileset.boundingSphere;
        var range = Math.max(100.0 - boundingSphere.radius, 0.0); // Set a minimum offset of 100 meters
        viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, range));
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 27.0);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 55);
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.5, 0));
        
    }).otherwise(function(error) {
        throw(error);
    });
    var nameOverlay = document.createElement('div');
viewer.container.appendChild(nameOverlay);
nameOverlay.className = 'backdrop';
nameOverlay.style.display = 'none';
nameOverlay.style.position = 'absolute';
nameOverlay.style.bottom = '0';
nameOverlay.style.left = '0';
nameOverlay.style['pointer-events'] = 'none';
nameOverlay.style.padding = '4px';
nameOverlay.style.backgroundColor = 'black';

// Information about the currently selected feature
var selected = {
    feature: undefined,
    originalColor: new Cesium.Color()
};
// Here i will Read all the rest of the properties
//so modify here to read another model's properties outside batch table

//var json_prop;
// read JSON object from file
//function readFile(file) {
//    var rawFile = new XMLHttpRequest();
//    rawFile.open("GET", file, false);
//    rawFile.onreadystatechange = function ()
//    {
//        if(rawFile.readyState === 4) {
//            if(rawFile.status === 200 || rawFile.status == 0) {
//                var allText = rawFile.responseText;
//                var value = JSON.parse(allText);
//                // now display on browser :)
//                json_prop=value;
//            }
//        }
//    }
//    rawFile.send(null);
//}
//readFile("./Source/redes_Mariel/redes.json");
//console.log(json_prop);
 // reader.readAsText("D:/Cibernetica/Geocuba/Geocuba_work/CONTROL DE VERSIONES GIT/project-mariel-network/cesium 1.67/Pagina de Cesium/Source/redes_Mariel/redes.json", 'UTF-8');
  




//=====================================here is the rest of the code changed a little less
// An entity object which will hold info about the currently selected feature for infobox display
var selectedEntity = new Cesium.Entity();

// Get default left click handler for when a feature is not picked on left click
var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);






// If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
// If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
    // Silhouettes are supported
    var silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
    silhouetteBlue.uniforms.length = 0.01;
    silhouetteBlue.selected = [];

    var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteGreen.uniforms.color = Cesium.Color.LIME;
    silhouetteGreen.uniforms.length = 0.01;
    silhouetteGreen.selected = [];

    viewer.scene.postProcessStages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteBlue, silhouetteGreen]));
function Compara(name1,name2)
{
    var j=0;
    //console.log(code_name1);
    for(var i=0;i<name1.length;i++)
    {   
        if(j<name2.length && name2[j]==name1[i]){
        j++;
        if(j>3)console.log(name1+','+name2);
        
        }
        else if(j>0&&j<name2.length && name2[j]!=name1[i]){
            j=0;
            
            }
        else if(j==name2.length){console.log(name1+","+name2);return 1;}


    }
    
    return 0;
    

}
    // Silhouette a feature blue on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
        // If a feature was previously highlighted, undo the highlight
        silhouetteBlue.selected = [];

        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.endPosition);
        if (!Cesium.defined(pickedFeature)) {
            nameOverlay.style.display = 'none';
            return;
        }

        // A feature was picked, so show it's overlay content
        nameOverlay.style.display = 'block';
        nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
        nameOverlay.style.left = movement.endPosition.x + 'px';
        var name = pickedFeature.getProperty('BIN');
        nameOverlay.textContent = name;

        // Highlight the feature if it's not already selected.
        if (pickedFeature !== selected.feature) {
            silhouetteBlue.selected = [pickedFeature];
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Silhouette a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        // If a feature was previously selected, undo the highlight
        silhouetteGreen.selected = [];

        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
            clickHandler(movement);
            return;
        }

        // Select the feature if it's not already selected
        if (silhouetteGreen.selected[0] === pickedFeature) {
            return;
        }

        // Save the selected feature's original color
        var highlightedFeature = silhouetteBlue.selected[0];
        if (pickedFeature === highlightedFeature) {
            silhouetteBlue.selected = [];
        }

        // Highlight newly selected feature
        silhouetteGreen.selected = [pickedFeature];

        // Set feature infobox description
        var featureName = pickedFeature.getProperty('name');
        selectedEntity.name = featureName;
        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
        viewer.selectedEntity = selectedEntity;
        var propertyNames = pickedFeature.getPropertyNames();
        var string_description="";
        //aqui es 1000 veces mas facil tener un conjunto de lo que quiero 
        //que se vea xq en total son 219 propiedades
        var propnotallowed=['GlobalId','IfcType',"Familia y tipo","batchId","Abreviatura de sistema",
                ,"maxPoint","minPoint","ID de tipo","Grosor de aislamiento","Elevación invertida",
            "Nombre de sistema","Segmento de tubería","Serie/Tipo","Tipo de conexión","Tramo",
            "Aspereza relativa","Aspereza","Estado de flujo","Fase de creación","Justificación horizontal",
            "Justificación vertical","name"];
            //ESTAS SON LAS PROPIEDADES QUE SALEN EN LA PLANILLA PARA EL LEVANTAMIENTO
        var proptoshow=["Tipo","Categoría","Diámetro exterior","Diámetro interno","Longitud",
            "Clasificación de sistema","Diámetro","Material","Pendiente","Elevación inferior",
            "Elevación intermedia","Elevación intermedia final","Elevación intermedia inicial",
            "Elevación superior","Ancho","Largo","Profundidad","Ancho del Muro","Tipo de Material",
            "Marca","Dimenciones"];  
           
        
        //console.log(name11)
        for (var i = 0; i < propertyNames.length; ++i) {
            var propertyName = propertyNames[i];
            var propertyString = pickedFeature.getProperty(propertyName);
            if(propertyString!=="0"&&propertyString!=="!!" && propertyString!=null && propertyString!=""&& 
            !propnotallowed.includes(propertyName)&&proptoshow.includes(propertyName))
            string_description+='<tr><th>'+ propertyName +'</th><td>'+ propertyString+ '</td></tr>';
            
        }
        selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
                                     //'<tr><th>BIN</th><td>' + strin2 + '</td></tr>' +
                                     //'<tr><th>DOITT ID</th><td>' + pickedFeature.getProperty('DOITT_ID') + '</td></tr>' +
                                     //'<tr><th>SOURCE ID</th><td>' + pickedFeature.getProperty('SOURCE_ID') + '</td></tr>' +
                                     //'<tr><th>Longitude</th><td>' + pickedFeature.getProperty('longitude') + '</td></tr>' +
                                     //'<tr><th>Latitude</th><td>' + pickedFeature.getProperty('latitude') + '</td></tr>' +
                                     //'<tr><th>Height</th><td>' + pickedFeature.getProperty('height') + '</td></tr>' +
                                     //'<tr><th>Terrain Height (Ellipsoid)</th><td>' + pickedFeature.getProperty('TerrainHeight') + '</td></tr>' +
                                     string_description+
                                     '</tbody></table>';
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
} 
else {

    // Silhouettes are not supported. Instead, change the feature color.

    // Information about the currently highlighted feature
    var highlighted = {
        feature : undefined,
        originalColor : new Cesium.Color()
    };

    // Color a feature yellow on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
        // If a feature was previously highlighted, undo the highlight
        if (Cesium.defined(highlighted.feature)) {
            highlighted.feature.color = highlighted.originalColor;
            highlighted.feature = undefined;
        }
        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.endPosition);
        if (!Cesium.defined(pickedFeature)) {
            nameOverlay.style.display = 'none';
            return;
        }
        // A feature was picked, so show it's overlay content
        nameOverlay.style.display = 'block';
        nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
        nameOverlay.style.left = movement.endPosition.x + 'px';
        var name = pickedFeature.getProperty('name');
        if (!Cesium.defined(name)) {
            name = pickedFeature.getProperty('id');
        }
        nameOverlay.textContent = name;
        // Highlight the feature if it's not already selected.
        if (pickedFeature !== selected.feature) {
            highlighted.feature = pickedFeature;
            Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
            pickedFeature.color = Cesium.Color.YELLOW;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        // If a feature was previously selected, undo the highlight
        if (Cesium.defined(selected.feature)) {
            selected.feature.color = selected.originalColor;
            selected.feature = undefined;
        }
        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
            clickHandler(movement);
            return;
        }
        // Select the feature if it's not already selected
        if (selected.feature === pickedFeature) {
            return;
        }
        selected.feature = pickedFeature;
        // Save the selected feature's original color
        if (pickedFeature === highlighted.feature) {
            Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
            highlighted.feature = undefined;
        } else {
            Cesium.Color.clone(pickedFeature.color, selected.originalColor);
        }
        // Highlight newly selected feature
        pickedFeature.color = Cesium.Color.LIME;
        // Set feature infobox description
        var featureName = pickedFeature.getProperty('name');
        
        selectedEntity.name = featureName;
        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
        viewer.selectedEntity = selectedEntity;
        //modificado

        var propertyNames = feature.getPropertyNames();
        var string_description="";
        for (var i = 0; i < propertyNames.length; ++i) {
            var propertyName = propertyNames[i];
            var propertyString = propertyName + ': ' + feature.getProperty(propertyName);
            string_description+='<tr><th>'+ propertyName +'</th><td>'+ feature.getProperty(propertyName)+ '</td></tr>';
            
        }
        selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
                                     //'<tr><th>BIN</th><td>' + pickedFeature.getProperty('BIN') + '</td></tr>' +
                                     //'<tr><th>DOITT ID</th><td>' + pickedFeature.getProperty('DOITT_ID') + '</td></tr>' +
                                     //'<tr><th>SOURCE ID</th><td>' + pickedFeature.getProperty('SOURCE_ID') + '</td></tr>' +
                                     //'<tr><th>Longitude</th><td>' + pickedFeature.getProperty('longitude') + '</td></tr>' +
                                     //'<tr><th>Latitude</th><td>' + pickedFeature.getProperty('latitude') + '</td></tr>' +
                                     //'<tr><th>Height</th><td>' + pickedFeature.getProperty('height') + '</td></tr>' +
                                     //'<tr><th>Terrain Height (Ellipsoid)</th><td>' + pickedFeature.getProperty('TerrainHeight') + '</td></tr>' +
                                     string_description+
                                     '</tbody></table>';
        selectedEntity.show=true;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

var scene = viewer.scene;
var canvas = viewer.canvas;
canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
canvas.onclick = function() {
    canvas.focus();
};
var ellipsoid = scene.globe.ellipsoid;

// disable the default event handlers
//scene.screenSpaceCameraController.enableRotate = false;
//scene.screenSpaceCameraController.enableTranslate = false;
//scene.screenSpaceCameraController.enableZoom = false;
//scene.screenSpaceCameraController.enableTilt = false;
//scene.screenSpaceCameraController.enableLook = false;

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
    var moveRate = cameraHeight / 10.0;

    if (flags.moveForward) {
        camera.moveForward(moveRate);
		//startTimer();
    }
    if (flags.moveBackward) {
        camera.moveBackward(moveRate);
		//startTimer();
    }
    if (flags.moveUp) {
        camera.moveUp(moveRate);
		//startTimer();
    }
    if (flags.moveDown) {
        camera.moveDown(moveRate);
		//startTimer();
    }
    if (flags.moveLeft) {
        camera.moveLeft(moveRate);
		//startTimer();
    }
    if (flags.moveRight) {
        camera.moveRight(moveRate);
		//startTimer();
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
	lastTotalLoaded=0;
	}
});
