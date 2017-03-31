var mapComponent = angular.module('MapComponent', []);

mapComponent.directive('mapComponent', function () {
    return {
        restrict: 'AE',
        scope: { location: '=' },
        templateUrl: 'components/map/map.html',
        controller: mapController,
        controllerAs: 'map'
    }
});

function mapController($scope, $timeout, $window, $rootScope, $filter) {
    var _self = this;

    _self.title = "Map";
    _self.centered = false;
    _self.oneUnit = 100;
    
    var connectionType = $rootScope.connectionType;
    var host = $rootScope.host;
    var port = $rootScope.nodeServerPort;
    var socket = io(connectionType+'://'+host+':'+port); /* BOYD IP: 10.162.161.103*/ /*NOSI IP: 10.143.8.155 */

    $rootScope.mousePickCoordsX = 0;
    $rootScope.mousePickCoordsY = 0;

    $rootScope.mousePickCoordsConvertedX = 0;
    $rootScope.mousePickCoordsConvertedY = 0;

    __getCarLocation();

    $(window).resize(function(){
        __getCarLocation();
        // $scope.$apply(function(){
        // //do something to update current scope based on the new innerWidth and let angular update the view.
        // });
    });

    function __getCarLocation() {
        var socket = io(connectionType+'://'+host+':'+port); /* BOYD IP: 10.162.161.103*/ /*NOSI IP: 10.143.8.155 */
        socket.on('message', function (data) {
            __onLocationData(data);
            console.log("data", data);
        });

    }

    function __onLocationData(data){
        // _self.actualWidth = 1400+'px';
        // _self.actualHeight = 894+'px';

        // _self.co_ordinates = [{'x': 500, 'y': 150}, {'x': 550, 'y': 250}, {'x': 850, 'y': 250}, {'x': 850, 'y': 400}, {'x': 650, 'y': 400}, {'x': 650, 'y': 600}];
        // $rootScope.carActualCoordinates = _self.co_ordinates;
        _self.actualWidth = data.imageSize.width+'px';
        _self.actualHeight = data.imageSize.height+'px';
		$rootScope.actualWidth = _self.actualWidth;
        $rootScope.actualHeight = _self.actualHeight;

        _self.co_ordinates = data.coOrdinates;
        $rootScope.carActualCoordinates = _self.co_ordinates;

        __getDivSize();
    
    }

    function __getDivSize(){
        $timeout(function(){
//            _self.divWidth = document.getElementById('map').offsetWidth;
//            _self.divHeight = document.getElementById('map').offsetHeight;
            _self.divWidth = $rootScope.divWidth;
            _self.divHeight = $rootScope.divHeight;
            console.log(" div size ( inside Map directive ): " + _self.divWidth + " , " + _self.divHeight);

            $rootScope.carConvertedCoordinates = [];
            _self.floorPlanDivSize = {
//                 'height': _self.divHeight+'px', 662
                 'height': 494+'px',
                 'width': _self.divWidth+'px',
                //  'overflow': 'auto',
                 'position': 'absolute'
            }
            _self.floorPlanClass = { 
                // 'background-image': 'url(../../images/floorMaps.png)',
                // // 'background-size': _self.divWidth+'px ' + + _self.divHeight+'px' 
                // 'background-size': 1088+'px ' + + 1000+'px',
//                'height': _self.divHeight+'px',
                'height': 494+'px',
                'width': _self.divWidth+'px',
                'position': 'relative'
            }
            
            _self.carImage = document.getElementById("carImage");

            _self.carImage.style.position = "absolute";

            let promise = $timeout();
            angular.forEach(_self.co_ordinates, function(v, k){
                var x = __convertToInt(v.x);
                var y = __convertToInt(v.y);
                promise = promise.then(function() {
                    __assignCo_ordinates(x, y);
                    return $timeout(2000);
                });
            })

        }, 1000);
    }
	
	
	function RotateImage(deg) {
    //var deg = 90 * (deg/10);
	console.log('rotate ',deg);
    $('#carImage').css({
        '-webkit-transform': 'rotate(' + deg + 'deg)',  //Safari 3.1+, Chrome
        '-moz-transform': 'rotate(' + deg + 'deg)',     //Firefox 3.5-15
        '-ms-transform': 'rotate(' + deg + 'deg)',      //IE9+
        '-o-transform': 'rotate(' + deg + 'deg)',       //Opera 10.5-12.00
        'transform': 'rotate(' + deg + 'deg)',         //Firefox 16+, Opera 12.50+
        //'transition-duration':'2s'
        });
    }

    function __assignCo_ordinates(x, y){
        // console.log("x", x);
        // console.log("y", y);
        // 'actualHeight & actualWidth' means actual Height and Width of the images(this is we are getting from server)
        var actualHeight = _self.actualHeight.replace ( /[^\d.]/g, '' );
        var actualWidth = _self.actualWidth.replace ( /[^\d.]/g, '' );
        actualHeight = parseInt(actualHeight);
        actualWidth = parseInt(actualWidth);
        // console.log("actualHeight", actualHeight);
        // console.log("actualWidth", actualWidth);
        
        $rootScope.actualWidth = actualWidth;
        $rootScope.actualHeight = actualHeight;
        // 'convertedWidth & convertedHeight' means Height and Width of the div to fit the image
        $rootScope.convertedWidth = _self.divWidth;
        $rootScope.convertedHeight = _self.divHeight;
        // left = 'x' coordinate & top = 'y' coordinate
        var left = (_self.divWidth * x);
        left = (left/actualWidth);

        var top = (_self.divHeight * y);
        top = (top/actualHeight);

        // console.log("left : " + left + ";" +" top : " + top);
        // console.log("x : " + x + ";" +" y : " + y);
        left = $filter('number')(left, 0);
        top = $filter('number')(top, 0);
		_self.presentPositionX = left;
        _self.presentPositionY = top;
        $rootScope.carConvertedCoordinates.push({'x': left, 'y': top});
        $rootScope.carActualCoordinates = [];
        $rootScope.carActualCoordinates = _self.co_ordinates;
        
        $timeout(function(){
            _self.carImage.style.left = left+'px';
            _self.carImage.style.top  = top+'px'; 
            // _self.carImage.style.transitionDelay = '1.5s';

            $('#carImage').css('transition-duration','2s');
            
            // var arrayLength = $rootScope.carConvertedCoordinates.length;
            // if(arrayLength > 1){
            //     var rorateAngle = __fingAngle($rootScope.carConvertedCoordinates[arrayLength-2].x, $rootScope.carConvertedCoordinates[arrayLength-2].y, left, top);
            //     // console.log("rorateAngle", rorateAngle);
            //     $('#carImage').css('transform', 'rotate('+rorateAngle+'deg)');
            //     $('#carImage').css('-webkit-transform', 'rotate('+rorateAngle+'deg)');
            //     $('#carImage').css('-ms-transform', 'rotate('+rorateAngle+'deg)');
            // }    
			 $('#manualTootip').css('transition-duration','2s');
        
        });
    }

   

    function __fingAngle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        //if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    }

    function __sendMousePickCarLocation(values) {
		console.log("values", values);
		
		
        // var socket = io('http://localhost:3000');
        socket.emit('request', values); // emit an event to the socket
        // var socket = io('http://localhost:3000');
        socket.on('mouseClickMoveCar', function (data) {
            // $timeout(function(){
            // if(data.length > 0){
                // var x = data.x;
                // x = x.replace(/\,/g,'');
                // x=parseInt(x,10);

                // var y = data.y;
                // y = y.replace(/\,/g,'');
                // y = parseInt(y,10);

                var x = __convertToInt(data.x);
                var y = __convertToInt(data.y);

               __assignCo_ordinates(parseInt(x), parseInt(y));            
                console.log("data from on(mouseClickMoveCar)", data);
            // }
            // }, 2000);
        });
        
    }

    function __convertToInt(val){
        if (val === parseInt(val, 10)){
            // console.log("data is integer");
            return val;
        } else {
             console.log(val);
            val = val.replace(/\,/g,'');
            val = parseInt(val,10);
            return val;
        }

        
    }

    $rootScope.addNewPathValues = function (form , pathValues) {
        if(form.$valid){
            console.log("pathValues", pathValues);
            _self.co_ordinates.push({'x': pathValues.x, 'y': pathValues.y});
            console.log("_self.co_ordinates", _self.co_ordinates);
            __getDivSize();
        }
    };

    // _self.showCoords = function(event) {
		// console.log('starting point for map click');
        // $rootScope.mousePickCoordsX = event.pageX - $('#map').offset().left;
        // $rootScope.mousePickCoordsY = event.pageY - $('#map').offset().top;

        // var left = ($rootScope.actualWidth * $rootScope.mousePickCoordsX);
        // $rootScope.mousePickCoordsConvertedX = (left/_self.divWidth);

        // var top = ($rootScope.actualHeight * $rootScope.mousePickCoordsY);
        // $rootScope.mousePickCoordsConvertedY = (top/_self.divHeight);
        // __callAstartAlgo($rootScope.mousePickCoordsConvertedX, $rootScope.mousePickCoordsConvertedY);
    // }

    function __callAstartAlgo(x_val, y_val){
        _self.co_ordinates = _self.co_ordinates.slice(_self.co_ordinates.length - 1);
        console.log("_self.co_ordinates", _self.co_ordinates);
        var val1 = $filter('number')(x_val, 0);
        var val2 = $filter('number')(y_val, 0);

        var x = __convertToInt(val1);
        var y = __convertToInt(val2);

		var x2 = x/100;
		var y2 = y/100;
		// __assignCo_ordinates($rootScope.mousePickCoordsConvertedX, $rootScope.mousePickCoordsConvertedY);
//        _self.co_ordinates.push({'x': x, 'y': y});


        var values = {"x": parseInt(x2,10),"y": parseInt(y2,10)};

		var temp = _self.co_ordinates[_self.co_ordinates.length - 1];
		var x1 = temp.x;
		var y1 = temp.y;
		x1 = x1/100;
		y1 = y1/100;
		var from = {'x':parseInt(x1,10), 'y':parseInt(y1,10) };

		console.log("from", from);
        console.log("values", values);

        var result = callPathFunction(from, values);
        console.log("result", result);
		
		socket.emit('autoDirect',result);

        let promise = $timeout();
        angular.forEach(result, function (v, k) {
//            if(v == 'North'){
//                __moveNorth(x1, y1);
//            } else if(v == 'East'){
//                __moveEast(x1, y1);
//            } else if(v == 'South'){
//                __moveSouth(x1, y1);
//            } else if(v == 'West'){
//                __moveWest(x1, y1);
//            }
            promise = promise.then(function() {
                switch (v){
                   case 'left':  __moveNorth(_self.co_ordinates[_self.co_ordinates.length - 1].x, _self.co_ordinates[_self.co_ordinates.length - 1].y);
						//RotateImage(-5);
                       break;
                   case 'back': __moveEast(_self.co_ordinates[_self.co_ordinates.length - 1].x, _self.co_ordinates[_self.co_ordinates.length - 1].y);
                       break;
                   case 'right': __moveSouth(_self.co_ordinates[_self.co_ordinates.length - 1].x, _self.co_ordinates[_self.co_ordinates.length - 1].y);
						//RotateImage(5);
                       break;
                   case 'front': __moveWest(_self.co_ordinates[_self.co_ordinates.length - 1].x, _self.co_ordinates[_self.co_ordinates.length - 1].y);
                       break;
               }

                return $timeout(200);
            });

        });

        // __sendMousePickCarLocation(values);
    }

    /**
    North = back arrow,
    East = down arrow,
    South = right arrow,
    West = up arrow */
    function __moveNorth(x, y){
        x = parseInt(x);
        y = parseInt(y);
        x = x - _self.oneUnit;
        console.log('__moveNorth(x, y)' + x + " - " + y);
        _self.co_ordinates.push({'x': x, 'y': y});
        __assignCo_ordinates(x, y);  
	  
    }
    function __moveEast(x, y){
        x = parseInt(x);
        y = parseInt(y);
        y = y + _self.oneUnit;
        console.log('__moveEast(x, y)' + x + " - " + y);
        _self.co_ordinates.push({'x': x, 'y': y});
        __assignCo_ordinates(x, y);
    }
    function __moveSouth(x, y){
        x = parseInt(x);
        y = parseInt(y);
        x = x + _self.oneUnit;
        _self.co_ordinates.push({'x': x, 'y': y});
        __assignCo_ordinates(x, y);
    }
    function __moveWest(x, y){
        x = parseInt(x);
        y = parseInt(y);
        y = y - _self.oneUnit;
        console.log('__moveWest(x, y)' + x + " - " + y);
        _self.co_ordinates.push({'x': x, 'y': y});
        __assignCo_ordinates(x, y);
    }

    $rootScope.carMoveWatcher = function (data) {
        if(angular.isUndefined(data) == false){
            // var left = ($rootScope.actualWidth * data.x);
            // $rootScope.mousePickCoordsConvertedX = (left/_self.divWidth);

            // var top = ($rootScope.actualHeight * data.y);
            // $rootScope.mousePickCoordsConvertedY = (top/_self.divHeight);
            
//            $rootScope.mousePickCoordsConvertedX = __convertToInt(data.x);
//            $rootScope.mousePickCoordsConvertedY = __convertToInt(data.y);
//            console.log("converted moveCar data - " + $rootScope.mousePickCoordsConvertedX + ", " + $rootScope.mousePickCoordsConvertedY);
//            data.x = $filter('number')(data.x, 2);
//            data.y = $filter('number')(data.y, 2);
            console.log("moveCar data", data);
           // __callAstartAlgo(data.x, data.y)
           // __assignCo_ordinates($rootScope.mousePickCoordsConvertedX, $rootScope.mousePickCoordsConvertedY);
        }
    };
	
	var robotAngle = 0;
	
	$rootScope.turnRobot = function(data){
		if(data ==  39){
			robotAngle =  robotAngle + 5;
			RotateImage(robotAngle);
		}
		else if(data == 37){
			robotAngle =  robotAngle - 5;
			RotateImage(robotAngle);
		}
	};
	
	
	$rootScope.moveRobot = function(data) {
	
	if(angular.isUndefined(data) == false){
	
	  _self.co_ordinates = _self.co_ordinates.slice(_self.co_ordinates.length - 1);
	  
		if(data ==  38){
			_moveNorth(_self.co_ordinates[_self.co_ordinates.length - 1].x, _self.co_ordinates[_self.co_ordinates.length - 1].y);
		}
		else if(data == 40){
			_moveSouth(_self.co_ordinates[_self.co_ordinates.length - 1].x, _self.co_ordinates[_self.co_ordinates.length - 1].y);
		}
	
	}
	
	};

    _self.zoomIn = function(){
        var h = parseInt(_self.floorPlanClass.height.replace ( /[^\d.]/g, '' )) + 100;
        var w = parseInt(_self.floorPlanClass.width.replace ( /[^\d.]/g, '' )) + 100;
        _self.floorPlanClass = { 
            'height': h+'px',
            'width': w+'px'
        }
        // console.log("_self.floorPlanClass copy", _self.floorPlanClass);
    };
    
    _self.zoomOut = function(){
        var h = _self.floorPlanClass.height.replace ( /[^\d.]/g, '' ) - 100;
        var w = _self.floorPlanClass.width.replace ( /[^\d.]/g, '' ) - 100;
        _self.floorPlanClass = { 
            'height': h+'px',
            'width': w+'px'
        }
    };

}
