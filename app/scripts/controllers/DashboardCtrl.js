'use strict';

angular.module('testDashApp').controller('DashboardCtrl', function ($scope, $stateParams, $http, $interval, $timeout, $rootScope, $window) {
  
  var _self = this;
  init();

  var connectionType = $rootScope.connectionType;
  var host = $rootScope.host;
  var port = $rootScope.nodeServerPort;
  var socket = io(connectionType+'://'+host+':'+port); /* BOYD IP: 10.162.161.103*/ /*NOSI IP: 10.143.8.155 */

  function init() {
    
    $scope.gridsterOpts = {
      "minRows": 1,
      "maxRows": 1000,
      "columns": 12,
      "colWidth": "auto",
      "rowHeight": "84",
      "margins": [10, 10],
      "defaultSizeX": 2,
      "defaultSizeY": 1,
      "mobileBreakPoint": 600,
      "resizable": {
        "enabled": false
      },
      "draggable": {
        "enabled": true,
        "handle": ".title-header"
      }
    };

    //_self.location = null;
    //_self.url = "rtmp://35.154.150.13/digital_factory/live";
    // getCarLocation();
    _self.robotStartFlag = 0;
    _self.robotStartControles = 'RETRACT';

    _self.carControlstitle = "Car Controls";
   // _self.videotitle = "Live Feed"
    // __setSizeXforGrid();
    // $(window).resize(function(){
    //     __setSizeXforGrid();
    // });

    __getDivSizeByID();
    $(window).resize(function() {
        __getDivSizeByID();
    });

    var handler = function(e){
		console.log("starting point");
      __getArrowPressed(e.keyCode);
    };

    var $doc = angular.element(document);

    $doc.on('keydown', handler);
    $scope.$on('$destroy',function(){
      $doc.off('keydown', handler);
    })
    
  }

  function __getDivSizeByID(){
    $timeout(function(){
        $rootScope.divWidth = document.getElementById('mapComponent').offsetWidth;
        $rootScope.divHeight = document.getElementById('mapComponent').offsetHeight;
//        $rootScope.divHeight = $rootScope.divHeight - 30;
        console.log(" div size ( inside DashboardCtrl ): " + $rootScope.divWidth + " , " +$rootScope.divHeight);

        $rootScope.videoDivWidth = document.getElementById('videoComponent').offsetWidth;
        $rootScope.videoDivHeight = document.getElementById('videoComponent').offsetHeight;
//        $rootScope.divHeight = $rootScope.divHeight - 30;
        console.log(" videoDiv size ( inside DashboardCtrl ): " + $rootScope.videoDivWidth + " , " +$rootScope.videoDivHeight);

    }, 500);
  }

  // function __setSizeXforGrid(){
  //   $timeout(function(){
  //     console.log("window - " + Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
  //   }, 200);
    
  //   _self.sizeXforMap = 6;
  //   _self.sizeXforCarCont = 6;
  //   _self.sizeXforCo = 6;
  //   _self.sizeXforVideo = 6;
  // }

  function __getArrowPressed(keyCode){
    // var handler = function(e){
      _self.leftArrowBlink = false; _self.upArrowBlink = false; _self.rightArrowBlink = false; _self.downArrowBlink = false; 

      // var socket = io('http://localhost:3000');
      var values = {"keyCode": keyCode};
      console.log('{"keyCode": e.keyCode}', keyCode);
      // var arrayLength = $rootScope.carActualCoordinates.length;
      // var x = $rootScope.carActualCoordinates[arrayLength-1].x;
      // var y = $rootScope.carActualCoordinates[arrayLength-1].y;
      // var coOrdinate = {"x": x, "y": y};
      // console.log("coOrdinate ", coOrdinate );

      // if (keyCode == 38){
           // alert("up arrow");
            // $timeout(function(){
              // _self.upArrowBlink = true;
            // }, 200);
            // coOrdinate.x = parseInt(x);
            // coOrdinate.y = parseInt(y) - 200;
			// if(parseInt(y) < 200){
                // coOrdinate.y = 0;
            // } else {
                // coOrdinate.y = parseInt(y) - 200;
            // }
      // } else if (keyCode == 39){
          //  alert("right arrow");
            // $timeout(function(){
              // _self.rightArrowBlink = true;
            // }, 200);
            //coOrdinate.x = parseInt(x) + 200;
            //coOrdinate.y = parseInt(y);
      // } else if (keyCode == 40){
            //alert("down arrow");
            // $timeout(function(){
              // _self.downArrowBlink = true;
            // }, 200);
            // coOrdinate.x = parseInt(x);
            // coOrdinate.y = parseInt(y) + 200;
			 // if(parseInt(y) >= $rootScope.actualHeight){
                // coOrdinate.y = $rootScope.actualHeight - 150;
            // } else {
                // coOrdinate.y = parseInt(y) + 200;
            // }
      // } else if (keyCode == 37){
            //alert("left arrow");
            // $timeout(function(){
              // _self.leftArrowBlink = true;
            // }, 200);
            //coOrdinate.x = parseInt(x) - 200;
         //   coOrdinate.y = parseInt(y);
      // }

    // socket.on('pressedKeyCodeData', function (data) {
           //  $rootScope.carMoveWatcher(data);
     //});
	 socket.emit('pressedKeyCode',keyCode);
		// if(keyCode == 38 || keyCode == 40){
       // $rootScope.carMoveWatcher(coOrdinate);
		// $rootScope.moveRobot(coOrdinate);
		// }
		// else if (keyCode == 39 || keyCode == 37){
		 // $rootScope.turnRobot(keyCode);
		// }
    // };
  }

  function onLocationData(data) {
    _self.location = data;
    console.log("location", _self.location);
  }

  function getCarLocation() {
    // var socket = io('http://localhost:3000');
    socket.on('message', function (data) {
      onLocationData(data);
      console.log("data", data);
    });

  }

  var flag;
  _self.arrowClicked = function(keyValue){
    console.log("keyValue", keyValue);
	if(flag){
		$interval.cancel(flag);
	}
	
	flag = $interval(function() {
    __getArrowPressed(keyValue);
	},100);
	
	
  };
  
  $scope.mouseUp=function(){
		$interval.cancel(flag);
		flag = null;
  }


  _self.robot = function(){
	if(_self.robotStartFlag == 0){
	    _self.robotStartControles = 'DEPLOY';
	    socket.emit('robotOps', 2);
        _self.robotStartFlag = 1;
	} else {
	    _self.robotStartControles = 'RETRACT';
	    socket.emit('robotOps', 3);
        _self.robotStartFlag = 0;
	}


	
  };

});

