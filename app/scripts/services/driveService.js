'use strict';

angular.module('testDashApp').factory('driveService', [ '$http', '$q', function($http, $q){
    // Double Driver App

    var APP_VERSION_NUM = "2.2.0";
    var APP_BUILD_NUM = "10";
    var doubleExtensionId = "pkciafnjgfphlemjdjldkcibniakgmmh";
    var IS_ROBOT_MODE = false;
    var IS_OCULUS_MODE = false;
    var kDRCookieDomain = ".doublerobotics.com";

    var kDRBlueColor = "rgb(23, 143, 236)";
    var kDRGreenColor = "rgb(23, 198, 10)";
    var kDROrangeColor = "#F07B06";
    var kDRRedColor = "rgb(234, 34, 44)";

    // commands
    var kDRCommandDriverToRobotHello = 1;
    var kDRCommandRobotToDriverHello = 2;
    var kDRCommandDriverToRobotGoodbye = 3;
    var kDRCommandGoodbye = 4;
    var kDRCommandControlDrive = 8;
    var kDRCommandControlPole = 9;
    var kDRCommandKickstandDeploy = 10;
    var kDRCommandKickstandRetract = 11;
    var kDRCommandRobotIsAvailable = 19;
    var kDRCommandRobotIsBusy = 20;
    var kDRCommandDriverIsReady = 21;
    var kDRCommandRequestListOfRobots = 22;
    var kDRCommandListOfRobots = 23;
    var kDRCommandRequestOpenTokSession = 24;
    var kDRCommandOpenTokSession = 25;
    var kDRCommandFlipCamera = 26;
    var kDRCommandRequestStatusData = 29;
    var kDRCommandStatusData = 30;
    var kDRCommandTurnBy = 36;
    var kDRCommandPoleStand = 37;
    var kDRCommandPoleSit = 38;
    var kDRCommandPoleStop = 39;
    var kDRCommandPoleMoving = 40;
    var kDRCommandVolumeChanged = 41;
    var kDRCommandRequestRobotiPadOrientation = 44;
    var kDRCommandRobotiPadOrientation = 45;
    var kDRCommandLogSessionError = 50;
    var kDRRequestFirmwareConstants = 51;
    var kDRFirmwareConstantsSent = 52;
    var kDRSetFirmwareConstants = 53;
    var kDRCommandRemoteVideoFroze = 54;
    var kDRCommandRemoteVideoUnfroze = 55;
    var kDRCommandFlashlightOn = 56;
    var kDRCommandFlashlightOff = 57;
    var kDRCommandTakePhoto = 58;
    var kDRCommandPhoto = 59;
    var kDRCommandZoom = 60;
    var kDRCommandResetVideoLink = 61;
    var kDRCommandDidFinishFlipping = 62;
    var kDRCommandJoinSession = 63;
    var kDRCommandRequestJoinKey = 64;
    var kDRCommandJoinKey = 65;
    var kDRCommandViewerDidLeaveSession = 66;
    var kDRCommandSetRobotScreenBrightness = 67;
    var kDRCommandLowLightModeOn = 68;
    var kDRCommandLowLightModeOff = 69;
    var kDRCommandKnockKnock = 70;
    var kDRCommandFocusOnPoint = 71;
    var kDRCommandRobotFrameRate = 72;
    var kDRCommandKickDriver = 73;
    var kDRCommandKickAndBlockDriver = 74;
    var kDRCommandUnblockDriver = 75;
    var kDRCommandWebURLShow = 76;
    var kDRCommandWebURLHide = 77;
    var kDRCommandVideoStabilizationOn = 78;
    var kDRCommandVideoStabilizationOff = 79;
    var kDRCommandReloadConfiguration = 80;
    var kDRCommandGACycle = 81;
    var kDRCommandSetPreferences = 82;
    var kDRCommandViewerDidJoinSession = 83;
    var kDRCommandViewerDidPublishAudio = 84;
    var kDRCommandMultipartyViewers = 85;
    var kDRCommandCameraKitSettings = 86;
    var kDRCommandCameraKitStartVideo = 87;
    var kDRCommandCameraKitStopVideo = 88;
    var kDRCommandCameraKitCyclePower = 89;
    var kDRCommandCameraKitWhiteBalance = 90;
    var kDRCommandCameraKitExposure = 91;
    var kDRCommandCameraKitLED = 92;
    var kDRCommandAdaptiveHDEnable = 93;
    var kDRCommandAdaptiveHDDisable = 94;
    var kDRCommandDebugString = 95;
    var kDRCommandBeginAngleCalibration = 96;
    var kDRCommandRequestBatteryDebug = 97;
    var kDRCommandFloorViewEnable = 98;
    var kDRCommandFloorViewDisable = 99;
    var kDRCommandCameraKitEnable = 100;
    var kDRCommandCameraKitDisable = 101;
    var kDRCommandColorFiltersEnable = 102;
    var kDRCommandColorFiltersDisable = 103;
    var kDRCommandLensCorrectionEnable = 104;
    var kDRCommandLensCorrectionDisable = 105;
    var kDRCommandAspectRatio = 106;
    var kDRCommandSetFloorViewPosition = 107;
    var kDRCommandSetRelayServer = 108;
    var kDRCommandSharpenFilterEnable = 109;
    var kDRCommandSharpenFilterDisable = 110;

    var kDRFloorViewPositionBottomLeft = 0;
    var kDRFloorViewPositionTopLeft = 1;

    var kDRCommandDebug = 999;

    // Kickstand states
    var kDRKickstand_stateNone = 				0;
    var kDRKickstand_stateDeployed =  			1;
    var kDRKickstand_stateRetracted = 			2;
    var kDRKickstand_stateDeployWaiting = 		3;
    var kDRKickstand_stateDeployBeginning = 	4;
    var kDRKickstand_stateDeployMiddle =  		5;
    var kDRKickstand_stateDeployEnd =  			6;
    var kDRKickstand_stateDeployAbortMiddle = 	7;
    var kDRKickstand_stateDeployAbortEnd = 		8;
    var kDRKickstand_stateRetractBeginning =  	9;
    var kDRKickstand_stateRetractMiddle =  		10;
    var kDRKickstand_stateRetractEnd =  		11;

    // robot status
    var kDRRobotStatusAvailable = 0;
    var kDRRobotStatusInUse = 1;
    var kDRRobotStatusAway = 2;
    var isFlipped = false;
    var isMuted = false;
    var speakerIsMuted = false;
    var kickstandState = kDRKickstand_stateNone;
    var poleIsMoving = false;
    var flipKeyDidRelease = true;
    var statusValues = {};
    var lastVolume = 0;
    var justGotVolume = false;
    var robotiPadOrientation = 0;
    var powerDriveOn = false;

    var configuration = {};

    var opentokAPIKey = 10772502; // OpenTok sample API key. Replace with your own API key.
    var opentokSession;
    var opentokPublisher;
    var opentokSubscriber = undefined;
    var opentokViewSubscribers = [];

    var blinkArray = [];

    var forwardState = 0;
    var backwardState = 0;
    var leftState = 0;
    var rightState = 0;
    var poleUpState = 0;
    var poleDownState = 0;
    var shouldZoomAfterLoadingRobots = true;
    var zoomLevel = 1.0;
    var zoomCenter = [ 0.5, 0.5 ];
    var nextZoomCenter = null;
    var sessionIsMultipartyHost = false;
    var sessionIsViewer = false;
    var multipartyViewerName = "Viewer";
    var multipartyViewerId = null;
    var multipartyLink = null;
    var multipartyViewers = [];
    var centerRemoteVideoInterval = null;
    var sessionRobotInstallationId = undefined;
    var neutralDriveCommandsSent = 0;
    var neutralPoleCommandsSent = 0;
    var poleToSend = -1;
    var allowPoleUpdate = true;
    var allowRobotSpeakerUpdate = true;
    var allowRobotSpeakerUpdateTimeout = null;
    var robotSpeakerVolumeToSend = -1;
    var sharpenFilterEnabled = false;
    var lastQualitySettingCameraKit = -1;
    var lastQualitySettingiPad = -1;

    var showingWebPage = false;

    var sessionBatteryButton = null;

    var drivingTallTimeout = null;
    var drivingTallInterval = null;

    // Socket.io
    var socket;
    var relaySocket = undefined;
    var isConnected = false;
    var nodeServer = "node.doublerobotics.com";
    var nodePort = 443;

    // OpenTok
    var opentokSessionId;
    var opentokSessionToken;
    var remoteIsLandscape;

    // map
    var mapboxMap;
    var markerLayer;
    var kDRClusterDistance = 64.0;
    var panTimeout;
    var robots = [];
    var robotsPrivate = [];
    var robotsPublic = [];
    var robotsList = [];
    var lastRobotsString = "";

    // driving
    var commandsTimer;
    var mouseMoveInterval;
    var mouseMoveCountdown;
    var mouseMoved = false;
    var mouseY = 0;

    var leftKeyDownStartTime = 0;
    var leftTurnTimeout;
    var rightKeyDownStartTime = 0;
    var rightTurnTimeout;

    var freezeDetectionTimer = null;

    // client types
    var kDRClientTypeUnknown = 0;
    var kDRClientTypeiPad = 1;
    var kDRClientTypeiPhone = 2;
    var kDRClientTypeWeb = 3;

    var scrollValue = 0;

    var nightVisionEnabled = false;
    var lastBrightnessSent = -1;

    var publicRobotsSwitch = 0;

    var geocoder;
    var geocoderCache = {};

    var statsInterval;

    // three
    var scene;
    var renderer;
    var videoCanvas;
    var videoContext;
    var videoElement;
    var videoTexture;
    var videoObject;
    var floorVideoObject;
    var alwaysOnFloorViewEnabled = true;
    var cameraKitEnabled = false;
    var dedistortionAllowed = true;
    var inLowCPUMode = false;
    var leftBlackBar;
    var rightBlackBar;
    var effect;
    var bodyAngle;
    var threeWindowResize;
    var sensorDevice = null;
    var hmdDevice = null;
    var vrMode = false;
    var stats;
    var camera = null;
    var cameraLeft;
    var cameraRight;
    var fovScale = 1.0;
    var VR_POSITION_SCALE = 25;

    $(window).keydown(function(e) {
        if (!$("#session").is(":visible") || $("#showWebPage").is(":visible")) {
            return;
        }
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
            // ignore text boxes
            return;
        }

        if (e.shiftKey) {
            powerDriveOn = true;
        } else {
            powerDriveOn = false;
        }
            
        switch (e.keyCode) {
            case 37: // left, arrow
            case 65: // left, a

                // If key down is less than 200ms, do turn by degree
                // So we are firing a timer here after 200ms to update leftState for firing driver commands		
                if (leftKeyDownStartTime == 0) {
                    leftKeyDownStartTime = Date.now();
                    leftTurnTimeout = window.setTimeout(function() {
                                        leftState = 1;
                                        fireDriveCommands();
                                        }, 200);
                }
                
                return false;

            case 39: // right, arrow
            case 68: // right, d

                // If key down is less than 200ms, do turn by degree
                // So we are firing a timer here after 200ms to update leftState for firing driver commands		
                if (rightKeyDownStartTime == 0) {
                    rightKeyDownStartTime = Date.now();
                    rightTurnTimeout = window.setTimeout(function() {
                                        rightState = 1;
                                        fireDriveCommands();
                                        }, 200);
                }
                
                return false;
                
            case 38: // forward, arrow
            case 87: // forward, w
                if (forwardState == 0 && kickstandState == kDRKickstand_stateDeployed) {
                    parkAction();
                }
                forwardState = 1;
                return false;

            case 40: // backward, arrow
            case 83: // backward, s
                backwardState = 1;
                return false;

            case 85: // u
                toggleLowCPUMode();
                return false;

            case 82: // pole up, r
                if (remoteRobotSupports("oculus")) {
                    sensorDevice.resetSensor();
                } else {
                    poleUpState = 1;
                }
                return true;

            case 70: // pole down, f
                if (navigator.getVRDevices) {
                    beginOculusMode();
                } else {
                    poleDownState = 1;
                }
                return false;

            case 32: // flip, space bar
                if (hmdDevice) {
                    sensorDevice.resetSensor();
                } else {
                    if (flipKeyDidRelease) {
                        flipAction();
                        flipKeyDidRelease = false;
                    }
                }
                return false;
        }
        return; //using "return" other attached events will execute
    });

    $(window).keyup(function(e) {
        if ($("#showWebPage").is(":visible")) {
            return;
        }
        if (!$("#session").is(":visible")) {
            if (e.keyCode != 27) { // allow esc
                return;
            }
        }
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
            // ignore text boxes
            return;
        }

        if (e.shiftKey) {
            powerDriveOn = true;
        } else {
            powerDriveOn = false;
        }

        switch (e.keyCode) {
            case 37: // left, arrow
            case 65: // left, a
                window.clearTimeout(leftTurnTimeout);				
                var diff = Date.now() - leftKeyDownStartTime;
                //console.log("keyup " + diff + "ms");
                if (diff < 100) {
                    //console.log("turn by 5 degrees");
                    var degree = 5.0;
                    sendCommandWithData(kDRCommandTurnBy, { "degrees" : degree, "degreesWhileDriving" : degree/2.0});	
                } else if (diff < 200) {
                    //console.log("Turn 8 degrees");
                    var degree = 8.0;				
                    sendCommandWithData(kDRCommandTurnBy, { "degrees" : degree, "degreesWhileDriving" : degree/2.0});	
                }
                leftKeyDownStartTime = 0;
                leftState = 0;
                return false;

            case 67: // capture photo, c
                takePhoto();
                break;

            case 39: // right, arrow
            case 68: // right, d
            
                window.clearTimeout(rightTurnTimeout);				
                var diff = Date.now() - rightKeyDownStartTime;
                //console.log("keyup " + diff + "ms");
                if (diff < 100) {
                    //console.log("turn by -5 degrees");
                    var degree = -5.0;
                    sendCommandWithData(kDRCommandTurnBy, { "degrees" : degree, "degreesWhileDriving" : degree/2.0});	
                } else if (diff < 200) {
                    //console.log("Turn -8 degrees");
                    var degree = -8.0;				
                    sendCommandWithData(kDRCommandTurnBy, { "degrees" : degree, "degreesWhileDriving" : degree/2.0});	
                }
                rightKeyDownStartTime = 0;
                rightState = 0;
                return false;
                
            case 38: // forward, arrow
            case 87: // forward, w
                forwardState = 0;
                return false;

            case 40: // backward, arrow
            case 83: // backward, s
                backwardState = 0;
                return false;

            case 82: // pole up, r
                poleUpState = 0;
                return false;

            case 70: // pole down, f
                poleDownState = 0;
                return false;

            case 32: // flip, space bar
                flipKeyDidRelease = true;
                return false;

            case 80: // park, p
                parkAction();
                return false;

            case 27: // end call, esc
                disconnect();
                hideMessage("robotsSharedWithMe");
                hideMessage("callHistory");
                hideMessage("settings");
                hideMessage("showWebPage");
                hideMessage("multipartyMessage");
                return false;

            case 77: // mute, m
                muteAction();
                return false;

            case 78: // speaker mute, n
                speakerMuteAction();
                return false;

            case 219: // speaker volume down, []
                speakerVolumeDown();
                return false;

            case 221: // speaker volume up, ]
                speakerVolumeUp();
                return false;

            case 187:
                if (e.shiftKey) {
                    // volume up, + key
                    volumeUp();
                }
                return false;

            case 189:
                if (e.shiftKey) {
                    // volume down, - key
                    volumeDown();
                }
                return false;

            case 107:
                // volume up, num pad + key
                volumeUp();
                return false;

            case 109:
                // volume down, num pad - key
                volumeDown();
                return false;

            case 79:
                if (sharpenFilterEnabled) {
                    sendCommand(kDRCommandSharpenFilterDisable);
                } else {
                    sendCommand(kDRCommandSharpenFilterEnable);
                }
                return false;
                
            case 73:
                toggleQualityStats();
                return false;
        }
        return; // using "return" other attached events will execute
    });

    window.addEventListener('blur', function() {
        clearKeyboardCommands();
    });

    function clearKeyboardCommands() {
        leftState = 0;
        forwardState = 0;
        rightState = 0;
        backwardState = 0;
        poleUpState = 0;
        poleDownState = 0;
        flipKeyDidRelease = true;
    }

    // functions
    $(document).ready(function () {
        checkForNativeApp();
        setup();
        checkForScreenSharingExtension();
    });

    function isMobileSafari() {
        return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
    }

    function checkForNativeApp() {
        if (isMobileSafari()){
            // To avoid the "protocol not supported" alert, fail must open itunes store to dl the app, add a link to your app on the store
            var appstorefail = "https://itunes.apple.com/us/app/double/id589230178?mt=8";
            var loadedAt = +new Date;
            setTimeout(function() {
                if (+new Date - loadedAt < 2000){
                    window.location = appstorefail;
                }
            }, 100);

            var queryString = "";

            if (getURLParameter("join").length >= 8) {
                // multiparty
                queryString = "?join="+ getURLParameter("join");
            } else if (getURLParameter("tls").length >= 8) {
                // visitor
                queryString = "?tls="+ getURLParameter("tls");
            }

            // Launch the element in your app if it's already installed on the phone
            window.open("doublerobotics://"+ queryString, "_self");
        }
    }

    function setup() {
        console.log("App version "+ APP_VERSION_NUM +", Build "+ APP_BUILD_NUM);

        var options = { defaultLang: 'en', path: "lang", skip: [ "en", "US", "en-US" ] };
        if (getURLParameter("lang")) {
            options.forceLang = getURLParameter("lang");
        }
        $("[data-translate]").jqTranslate("drive", options);

        if (getURLParameter("server").length > 4) {
            nodeServer = getURLParameter("server");
        }
        if (getURLParameter("api").length > 4) {
            kAPIBaseURL = getURLParameter("api");
        }

        getCurrentInstallation().save();
        loadSettings();

        setupBlink();

        // robots = [
        // 	RobotWithSetup(-74.0, 40.0, { "nickname" : "Robot A", "status" : 0 }),
        // 	RobotWithSetup(-75.0, 41.0, { "nickname" : "Robot B", "status" : 1 }),
        // 	RobotWithSetup(-79.0, 48.0, { "nickname" : "Robot C", "status" : 2 }),
        // 	RobotWithSetup(-82.5, 39.5, { "nickname" : "Robot D", "status" : 0 })
        // ];

        // setup map
        map = new RobotsMap();
        mapboxMap = map.setupMapboxWithId("map");

        if (!videoIsSupported()) {
            $("#incompatible").show();
            // alert("WebRTC is not supported in this browser.  Please download Chrome 23+.");
            if (navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("iOS") > 0) {
                $("#incompatibleWeb").hide();
                $("#incompatibleiOS").show();
            }
            if (isIE()) {
                OT.upgradeSystemRequirements();
            }
            return;
        } else {
            
        }

        // automatic demo login
        if (getURLParameter("public_key").length > 0) {
            if (!currentUser.isLoggedIn()) {
                window.setTimeout(function () {
                    $("#loginForm")[0].elements["username"].value = "public";
                    $("#loginForm")[0].elements["password"].value = "public";
                    login();
                    showPublicRobots();
                }, 100);
            }
        } else if (!currentUser.isLoggedIn() && getURLParameter("tls").length > 0) {
            // TODO:DEBUG - temporary fix for visitor pass
            window.setTimeout(function () {
                $("#loginForm")[0].elements["username"].value = "public";
                $("#loginForm")[0].elements["password"].value = "public";
                login();
                showPublicRobots();
            }, 100);
        }

        // User setup
        currentUser = getCurrentUser();
        if (currentUser.isLoggedIn()) {
            // logged in
            if (currentUser.username == "public") {
                if (getURLParameter("public_key").length == 0 && getURLParameter("tls").length == 0) {
                    logOut();
                } else {
                    showPublicRobots();
                }
            } else if (getURLParameter("public_key").length > 0) {
                showPublicRobots();
            }
        } else {
            // show the signup or login page
            $("#content").show();
            showLoginForm();
            $("#usernameLoginField").select();
            window.location.hash = "";
            loadConfiguration();
        }

        // monitor the hash for changes
        // var lastHash = "";
        // window.setInterval(function () {
        // 	if (lastHash != window.location.hash) {
        // 		// the hash changed
        // 		if (window.location.hash == "#private") {
        // 			showPrivateRobots();
        // 			updateRobotsOnMap();
        // 		} else if (window.location.hash == "#public") {
        // 			showPublicRobots();
        // 			updateRobotsOnMap();
        // 		}
        // 		lastHash = window.location.hash;
        // 	}
        // }, 200);

        setupSocket();
    }

    function setupSocket() {
        // setup socket.io
        socket = io.connect(nodeServer, {secure: ('https:' == document.location.protocol), forceNew: true, 'force new connection': true});
        $("#statusBulb").removeClass().addClass("yellow");
        // $("#statusBulb").html("&nbsp;CONNECTING&nbsp;");
        socket.on('connect', function () {
            isConnected = true;
            console.log("did connect to socket.io");
            if (currentUser) {
                var access_token = currentUser.access_token;
                if (access_token) {
                    didLogin();
                } else {
                    console.log("failed to get user");
                }
            }
            $("#statusBulb").removeClass().addClass("green");
            $("#statusBulb").html("");

            if (getURLParameter("robot") == "true") {
                window.setTimeout(becomeRobot, 3000);
            }

            // TODO:DEBUG - moved the visitor pass stuff to didLogin() as a temporary fix

            // multiparty session participant
            if (getURLParameter("join").length >= 8) {
                promptToJoinMultipartySession();
            }
            // multiparty session watcher
            if (getURLParameter("watch").length >= 8) {
                promptToJoinMultipartySession();
            }
        });
        socket.on('disconnect', function () {
            isConnected = false;
            console.log("socket.io did disconnect");
            $("#statusBulb").removeClass().addClass("red");
            // $("#statusBulb").html("&nbsp;ERROR&nbsp;");
        });
        socket.on('connect_failed', function () {
            isConnected = false;
            console.log("socket.io failed to connect");
            $("#statusBulb").removeClass().addClass("red");
            // $("#statusBulb").html("&nbsp;ERROR&nbsp;");
        });
        socket.on("message", function (data) {
            if (currentUser == null) { return; }

            // console.log("received: "+ JSON.stringify(data));
            var command = data["c"];
            var values = data["d"];
            switch (command) {
                case kDRCommandListOfRobots:
                    if (values.robots) {
                        robotsList = values.robots.sort(function(a,b) {return (a.nickname > b.nickname) ? 1 : ((b.nickname > a.nickname) ? -1 : 0);} ); 
                    } else {
                        robotsList = [];
                    }
                    
                    if (document.hidden) {
                        document.addEventListener("visibilitychange", function vchange() {
                            document.removeEventListener("visibilitychange", vchange, false);
                            if (!document.hidden) {
                                updateRobotsOnMap();
                            }
                        }, false);
                    } else {
                        updateRobotsOnMap();
                    }

                    break;

                case kDRCommandDriverToRobotHello:
                    console.log("Hello from driver.");
                    if (IS_ROBOT_MODE) {
                        beginSession();
                        sendCommand(kDRCommandRobotToDriverHello);
                        window.setTimeout(function () {
                            sendRobotStatus();
                        }, 500);
                    }
                    break;

                case kDRCommandRequestStatusData:
                    if (IS_ROBOT_MODE) {
                        sendRobotStatus();
                    }
                    break;

                case kDRCommandRobotToDriverHello:
                    console.log("Hello from robot.");
                    if ($("#securityLevelClientToServer:checked").val() == "clientToServer") {
                        sendCommandWithData(kDRCommandRequestOpenTokSession, { "multiparty" : true });
                    } else {
                        sendCommand(kDRCommandRequestOpenTokSession);
                    }
                    break;

                case kDRCommandGoodbye:
                    console.log("Goodbye from robot.");
                    window.setTimeout(endSession, 100);
                    if (values && values["error"]) {
                        alert("Error: "+ values["error"]);
                    }
                    break;

                case kDRCommandOpenTokSession:
                    // start opentok
                    console.log("Got session: ", values);
                    opentokSessionId = values.openTokSessionId;
                    opentokSessionToken = values.openTokSessionToken;
                    opentokConnect();

                    if (sessionIsViewer || sessionIsMultipartyHost) {
                        sendCommand(kDRCommandRequestJoinKey);
                        if (sessionIsViewer) {
                            sendCommandWithData(kDRCommandViewerDidJoinSession, { "name": multipartyViewerName, "viewerId": multipartyViewerId });
                        }
                    }
                    break;

                case kDRCommandJoinKey:
                    if (sessionIsMultipartyHost && values["key"]) {
                        var link = location.protocol + '//' + location.host + location.pathname;
                        if (getURLParameter("server")) {
                            link = addQueryStringParameter(link, "server", getURLParameter("server"));
                        }
                        if (getURLParameter("api")) {
                            link = addQueryStringParameter(link, "api", getURLParameter("api"));
                        }
                        link = addQueryStringParameter(link, "join", values["key"]);
                        console.log("Multiparty: "+ link);
                        multipartyLink = link;
                        showMultipartyLink(link);
                    }
                    break;

                case kDRCommandStatusData:
    /* 				console.log("status: "+ JSON.stringify(values)); */
                    kickstandState = values.kickstand;
                    statusValues = values;
                    updateUserInterface();
                    break;

                case kDRCommandPoleMoving:
                    // TODO: implement pole button flashing
                    break;
                    
                case kDRCommandRobotiPadOrientation:
                    robotiPadOrientation = values.robot_ipad_orientation;
                    updateUserInterface();
        
                    if (values.robot_ipad_orientation == 1) {
                        // don't flip upside down
                        $("#subscribers .remoteVideo video").addClass("videoRightSideUp");
                        alert($("#stringDownwardCameraNotAvailable").html());
                    } else {
                        // leave as default css
                        $("#subscribers .remoteVideo video").removeClass("videoRightSideUp");
                    }
                    break;

                case kDRCommandPhoto:
                    // console.log("got photo");
                    // window.location.href = 'data:image/png;base64,' + values["photo"];
                    // document.getElementById("photoBucket").src = "data:image/jpeg;base64,"+ values["photo"];
                    var blob = b64toBlob(values["photo"], "image/jpg");
                    // var blobUrl = URL.createObjectURL(blob);
                    // window.location = blobUrl;
                    downloadBlob(blob, "photo.jpg");
                    displayHoverMessage("Taking Photo", "Downloaded.");
                    window.setTimeout(hideHoverMessage, 2000);
                    break;

                case kDRCommandResetVideoLink:
                    resetVideoLink();
                    break;

                case kDRCommandViewerDidJoinSession:
                    // received by driver
                    console.log("Viewer did join: ", values);
                    
                    if (values && values.viewerId) {
                        addViewer(values.viewerId, values.name);
                    }
                    
                    break;
                    
                case kDRCommandViewerDidPublishAudio:
                    // received by driver
                    console.log("Viewer did publish audio: ", values);

                    if (values && values.viewerId && values.streamId) {
                        attachAudioToViewer(values.viewerId, values.streamId);
                    }
                    
                    break;
                    
                case kDRCommandViewerDidLeaveSession:
                    // reveived by driver
                    console.log("Viewer did leave: ", values);

                    if (values && values.viewerId) {
                        removeViewer(values.viewerId);
                    }

                    break;

                case kDRCommandMultipartyViewers:
                    // received by viewers
                    if (values && values.viewers) {
                        console.log("Viewers: ", values.viewers);
                        
                        multipartyViewers = values.viewers;
                        redrawMultipartyViewers();
                    }
                    break;
                
                case kDRCommandDebug:
                    console.log("kDRCommandDebug");
                    break;

            }
        });

        var target = $('#session')[0]; // Get DOM element from jQuery collection
        $('#fullscreenButton').click(function() {
            lockPointer();
        });

        window.onresize = centerRemoteVideo;
        centerRemoteVideo();
    }

    function centerRemoteVideo() {
        var w = $(window).width();
        var h = $(window).height();
        var videoTop = 0;
        if (isChromeAndroid()) {
            videoTop = 80;
            h -= videoTop;
        }
        // $("#subscribers .remoteVideo video").css({
        // 	background: "black",
        // 	position: "fixed"
        // });
        if (remoteRobotSupports("oculus")) {
            $("#subscribers .remoteVideo video").css({ left: 0, top: 0, bottom: 0, width: "100%", height: "100%" });
        } else if (remoteIsLandscape) {
            if (tempScale) {
                tempScale();
            }
        // } else if (sessionIsViewer) {
        // 	// layout for viewing two large streams
        // 	$("#subscribers .remoteVideo video").eq(0).css({ left: 0, top: 0, bottom: 0, width: "50%", height: "100%" });
        // 	$("#subscribers .remoteVideo video").eq(1).css({ left: "auto", right: 0, top: 0, bottom: 0, width: "50%", height: "100%" });
        } else {
            // standard layout
            var size = w;
            if (w > h) {
                size = h;
            }
            // $("#subscribers .remoteVideo video").width(size).height(size);
            // if (h > w) {
            // 	// tall
            // 	$("#subscribers .remoteVideo video").css({ left: 0, top: videoTop, height: "100%" });
            // } else {
            // 	// wide
            // 	$("#subscribers .remoteVideo video").css({ left: (w - size) / 2, top: videoTop });
            // }
            
            // remote video overlay
            var videoHeight = h;
            var videoWidth = w;
            $("#remoteVideoOverlay").css({ left: 0.0, width: Math.round(videoWidth) });

            // local video
            var ratio = w / h;
            // wide window
            var localVideoWidth = 155;
            // $("#localVideo").css({ left: "auto", right: "0px", width: localVideoWidth, height: 200, top: 90, position: "absolute" });
            if (camera) {
                $("#remoteVideoOverlay").css({ left: 0.0, width: w });
                $("#multipartyAudioLevels").css({ left: "auto", right: "0px" });
            }
            $("#opentok_publisher").css({ width: "", height: "", left: "" });
            $("#myCamera").css({ width: "", height: "" });

            $("#opentok_screensharing_publisher .OT_video-container").css({ width: "100%", height: "100%", left: 0 });

            if (w < 700) {
                $("#logo").hide();
                $("#robotName").hide();
                $("#robotLocation").hide();
            } else {
                $("#logo").show();
                $("#robotName").show();
                $("#robotLocation").show();
            }
        }
        
        if (threeWindowResize) {
            threeWindowResize();
        }
    }

    var tempScale = function () {
        var w = $(window).width();
        var h = $(window).height();
        $("#subscribers .remoteVideo video").css({ left: 0, top: 0, bottom: 0, width: w, height: w, "-webkit-transform": "translate(0px, -10%) rotate(90deg)" });
    }

    var flipResizeCounter = 0;
    var flipResizeInterval = null;

    function repeatCenterRemoteVideo() {
        // fix for opentok v2.0.14.1 - after flip, video element was 1px x 1px, so we have to re-position it
        flipResizeCounter = 0;
        window.clearInterval(flipResizeInterval);
        flipResizeInterval = window.setInterval(function () {
            centerRemoteVideo();
        
            flipResizeCounter++;
            if (flipResizeCounter > 50) {
                window.clearInterval(flipResizeInterval);
            }
        }, 250);
    }

    function socketIsConnected() {
        return isConnected;
    }

    function showLoginForm() {
        $("#login").show();
        if (getURLParameter("domain") && getURLParameter("domain").indexOf(".doublerobotics.com") > -1 && !getURLParameter("public_key")) {
            var title = (getURLParameter("name").length > 0) ? decodeURIComponent(getURLParameter("name")) : getURLParameter("domain");
            $("#googleSSOTitle").html(title);
            $("#googleSSONext").val(getURLParameter("domain"));
            if (parseInt(getURLParameter("google_sso_configured")) == 1) {
                $("#googleSSOSection").show();
                $("#loginForm").hide();
            }
        } else {
            $("#googleSSOTitle").html("");
            $("#googleSSONext").val("");
            $("#googleSSOSection").hide();
            $("#loginForm").show();
        }
    }

    function login() {
        var username = $("#loginForm")[0].elements["username"].value.toLowerCase();
        var password = $("#loginForm")[0].elements["password"].value;

        $("#content").hide();
        $("#login").hide();
        $("#loginForm")[0].elements["username"].value = "";
        $("#loginForm")[0].elements["password"].value = "";

        DBLUserLogin(username, password);
    }

    function createAccount() {
        var username = $("#createAccountForm")[0].elements["username"].value.toLowerCase();
        var email = $("#createAccountForm")[0].elements["email"].value.toLowerCase();
        var password = $("#createAccountForm")[0].elements["password"].value;
        var password2 = $("#createAccountForm")[0].elements["password2"].value;

        if (password != password2) {
            alert("Password fields don't match.");
            return;
        }

        $("#content").hide();
        $("#createAccount").hide();
        $("#createAccountForm")[0].elements["username"].value = "";
        $("#createAccountForm")[0].elements["email"].value = "";
        $("#createAccountForm")[0].elements["password"].value = "";
        $("#createAccountForm")[0].elements["password2"].value = "";

        DBLUserCreateAccount(username, email, password);
    }

    function didLogin() {
        if (currentUser) {
            var username = currentUser.username;
            console.log("found user: "+ username);
            $("#content").hide();
            $("#login").hide();
            if (currentUser.username == "public") {
                $("#currentUsername .company").html("");
                $("#currentUsername .company").hide();
                $("#currentUsername .username").html("&nbsp;");
                $("#accountOrganization").html("&nbsp;");
                $("#accountUsername").html("&nbsp;");
                $("#accountEmail").html("&nbsp;");
            } else {
                $("#currentUsername .company").html("");
                $("#currentUsername .company").hide();
                $("#currentUsername .username").html(currentUser.username);
                $("#accountOrganization").html("(None)");
                $("#accountUsername").html(currentUser.username);
                $("#accountEmail").html(currentUser.email);
            }
            $("#currentUser").show();
            $("#settingsButton").show();
            $("#supportButton").hide();

            if (isChromeAndroid()) {
                $("#warning").hide();
            } else {
                // $("#warning").show();
            }

            if (getURLParameter("domain") && getURLParameter("public_key")) {
                $("#warning").hide();
                $("#segmentedRobots").hide();
                $("#currentUsername").css({ opacity: 0 });
                $("#currentUser .popover .private").hide();
                showPublicRobots();
            } else {
                $("#segmentedRobots").show();
            }

            var options = { "userId" : currentUser.access_token, "installationId" : getCurrentInstallation().getKey(), "clientType" : 3 };
            if (getURLParameter("public_key").length > 0) {
                options.public_key = getURLParameter("public_key");
            }
            sendCommandWithData(kDRCommandDriverIsReady, options);

            shouldZoomAfterLoadingRobots = true;
            getListOfRobots();

            if (getURLParameter("connectTo").length > 10) {
                connectTo(getURLParameter("connectTo"));
            } else if (getURLParameter("invite-accept").length > 10) {
                prepareToShowInvitation(getURLParameter("invite-accept"));
            }

            loadConfiguration();

            // TODO:DEBUG - temporary fix moving this here - visitor pass
            if (getURLParameter("tls").length > 10) {
                var tlsKey = getURLParameter("tls");
                
                var request = getSharedDBLHTTPClient().request("GET", kAPIEndpointTLS, { access_key: tlsKey });
                var success = function (data) {
                    // success
                    console.log("got response: "+ data.robot);

                    if (data.success == true && data.robot) {
                        connectTo(data.robot, tlsKey);
                    } else {
                        alert($("#stringInvalidTempLink").html());
                    }
                };
                var fail = function (data) {
                    // failure
                    alert($("#stringInvalidTempLink").html());
                };
                request.send(success, fail);
            }
        }
    }

    function prepareToShowInvitation(key) {
        var client = MakeDBLHTTPClient("https://admin.doublerobotics.com/");
        var params = { "key" : key };
        var request = client.request("GET", "invite-accept", params);
        request.send(function (data) {
            // success
            if (data && data.company_name && data.admin_email) {
                $("#acceptInvitationName").html(data.company_name);
                $("#acceptInvitationAdminEmail").html(data.admin_email);
                $("#acceptInvitationUsername").html(currentUser.username);
                $("#acceptInvitationUserEmail").html(currentUser.email);
                showMessage("acceptInvitation");
                currentUser.getData(function () {
                    $("#acceptInvitationUserEmail").html(currentUser.email);
                });
            }
        }, function () {
            // failure
            console.log("failed to load invitation");
        });	
    }

    function acceptInvitation(key) {
        var client = MakeDBLHTTPClient("https://admin.doublerobotics.com/");
        var params = {
            "key" : key,
            "access_token" : currentUser.access_token
        };
        var request = client.request("POST", "invite-accept", params);
        request.send(function (data) {
            // success
            console.log(data);
            if (data && data.success == true) {
                hideMessage("acceptInvitation");
            } else {
                alert("Failed to accept invitation.");
            }
        }, function () {
            // failure
            alert("Failed to accept invitation.");
        });	
    }

    function didLogOut() {
        $("#content").show();
        showLoginForm();
        $("#currentUsername .company").html("");
        $("#currentUsername .username").html("");
        $("#currentUser").hide();
        $("#robots").hide();
        $("#noLocationBubble").hide();
        $("#callHistoryLink").hide();
        $("#segmentedRobots").hide();
        $("#settingsButton").hide();
        $("#supportButton").show();
        window.location.hash = "";
        map.removeAllMarkers();
        robots = [];
        robotsPrivate = [];
        robotsPublic = [];
        $("#usernameField").select();
        $("#callHistoryDrivers").html("<option value=\"all\">"+ $("#stringAllDrivers").html() +"</option>");
        currentUser = null;
        loadConfiguration();
        if (socket) {
            socket.disconnect();
        }
        window.setTimeout(setupSocket, 200);
    }

    function getListOfRobots() {
        sendCommand(kDRCommandRequestListOfRobots);
    }

    function deployKickstands() {
        sendCommand(kDRCommandKickstandDeploy);
    }

    function retractKickstands() {
        sendCommand(kDRCommandKickstandRetract);
    }

    function flip() {
        if (!isFlipped) {
            resetZoom();
        }

        isFlipped = !isFlipped;
        updateUserInterface();
        sendCommand(kDRCommandFlipCamera);
        
        if (remoteRobotSupports("preflippedDownCamera")) {
            // do nothing
        } else {
            if (isFlipped) {
                window.setTimeout(function () {
                    $("#subscribers .remoteVideo video").addClass("flipped");
                }, 1000);
                $(".remoteVideo").css("z-index", "1");
            } else {
                window.setTimeout(function () {
                    $("#subscribers .remoteVideo video").removeClass("flipped");
                }, 1000);
                $(".remoteVideo").css("z-index", "1");
            }

            // dim the video for a second
            $("#shade").css("display", "block");
            window.setTimeout(function () {
                $("#shade").css("display", "none");
            }, 1500);
        }

        repeatCenterRemoteVideo();
    }

    function zoomIn() {
        mapboxMap.zoomBy(1);
    }

    function zoomOut() {
        mapboxMap.zoomBy(-1);
    }

    function logOut() {
        currentUser.logout();
        currentUser = null;
        didLogOut();
    }

    function logOutConfirm() {
        if (confirm($("#stringAreYouSure").html())) {
            $('#settings').hide();
            logOut();
        }
    }

    function sendCommand(commandId) {
        if (socket) {
            var out = new Object;
            out.c = commandId;
            socket.emit("message", out);
        }
    }

    function sendCommandWithData(commandId, data) {
        if ((commandId == kDRCommandControlDrive || commandId == kDRCommandTurnBy) && $("#peerToPeerDriving").is(':checked')) {
            // send peer to peer driving commands
            var signalType = (commandId == kDRCommandControlDrive) ? "kDRCommandControlDrive" : ((commandId == kDRCommandTurnBy) ? "kDRCommandTurnBy" : "");
            if (opentokSession != undefined && opentokSubscriber != undefined) {
                opentokSession.signal({
                    type: signalType,
                    data: JSON.stringify(data),
                }, function(error) {
                    if (error) {
                        console.log("signal error: " + error.reason);
                    }
                });
            }
        } else if ((commandId == kDRCommandControlDrive || commandId == kDRCommandTurnBy) && relaySocket != undefined) {
            var out = new Object;
            out.c = commandId;
            data.toInstallationId = sessionRobotInstallationId;
            out.d = data;
            relaySocket.emit("message", out);
        } else {
            // regular commands via node server
            if (socket) {
                var out = new Object;
                out.c = commandId;
                out.d = data;
                socket.emit("message", out);
            }
        }
    }

    function connectTo(installationId, access_key) {
        // if (currentUser == null) { return; }
        console.log("connecting to "+ installationId);
        var options = { "robotInstallationId" : installationId };
        if (access_key) {
            options.access_key = access_key;
            options.qualityPreference = 3;
        }
        sendCommandWithData(kDRCommandDriverToRobotHello, options);
        sessionRobotInstallationId = installationId;
        beginSession();

        // relay server
        var s = $("#settingsForm input[name='relayServer']:checked").val();
        if (s != "") {
            setRelayServer(s);
        }

        for (var i = 0; i < robots.length; i++) {
            var r = robots[i];
            if (r.dictionary.installationId == installationId) {
                $("#robotName").html(r.dictionary.nickname);
                var lat = roundToPlaces(r.dictionary.latitude, 5);
                var lng = roundToPlaces(r.dictionary.longitude, 5);
                reverseGeocodeLatLng("robotLocation", lat, lng);
            }
        }
        
        var dCode = getURLParameter("d");
        if (dCode) {
            logDemo(dCode);
        }
    }

    function logDemo(dCode) {
        // log the view
        if (dCode) {
            var client = MakeDBLHTTPClient("https://secure.doublerobotics.com/");
            var params = { "d" : dCode };
            var request = client.request("POST", "demo", params);
            request.send(function (data) {
                // success
                // console.log("Logged demo");
            }, function () {
                // failure
                // console.log("Failed to log demo");
            });
        }
    }

    function disconnect() {
        tearDownThree();
        if (sessionIsViewer) {
            sendCommandWithData(kDRCommandViewerDidLeaveSession, { viewerId: multipartyViewerId });
            console.log("disconnected, was viewer");
        } else {
            window.setTimeout(function () {
                sendCommand(kDRCommandGoodbye);
                console.log("disconnected, sending goodbye");
            }, 1000);
        }
        endSession();
    }

    function resetSessionVariables() {
        isFlipped = false;
        isMuted = false;
        speakerIsMuted = false;
        kickstandState = kDRKickstand_stateNone;
        poleIsMoving = false;
        statusValues = {};
        lastVolume = 0;
        justGotVolume = false;
        blinkArray = [];

        clearKeyboardCommands();
    }

    function beginSession() {
        // if (currentUser == null) { return; }

        $("#connecting").show();
        $("#session").show();
        $("#resetZoomButton").hide();
        $("#resetExposureButton").hide();
        $("#localVideoOverlay").hide();
        $("#localVideo .audioLevel").hide();
        $("#remoteVideoOverlay").hide();

        resetSessionVariables();
        updateUserInterface();

        if (statsInterval) {
            window.clearInterval(statsInterval);
        }
        statsInterval = window.setInterval(updateStats, 500);

        if (sessionIsViewer) {
            $("#sessionButtons").hide();
            $("#session #sessionHeader").hide();
        } else {
            $("#sessionButtons").show();
            $("#session #sessionHeader").show();

            window.clearInterval(commandsTimer);
            commandsTimer = window.setInterval(fireDriveCommands, 200);

            // window.setTimeout(beginFreezeDetection, 5000);

            if (drivingTallInterval) {
                window.clearInterval(drivingTallInterval);
            }
            drivingTallInterval = window.setInterval(checkDrivingTall, 1000);

            // turn by scrolling
            window.onmousewheel = document.onmousewheel = function (e) {
                e = e || window.event;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;  

                if (e.wheelDeltaX > 0) {
                    scrollValue = Math.min(scrollValue + e.wheelDeltaX, 1500);
                } else {
                    scrollValue = Math.max(scrollValue + e.wheelDeltaX, -1500);
                }
            };

            if (!isChromeAndroid()) {
                mouseMoveInterval = window.setInterval(function () {
                    if (mouseMoveCountdown == 0) {
                        if (!$("#sessionHeader .popover").is(":visible") && mouseY > 80) {
                            $("#session #sessionHeader").css({ opacity: 0.0 });
                            $("#remoteVideoOverlay .button").addClass("hidden");
                            $("#localVideoOverlay .button").addClass("hidden");
                            $("#drivingTallWarning").css({ top: "20px" });
                        }
                        mouseMoveCountdown = -1;
                    } else {
                        mouseMoveCountdown--;
                    }
                    if (mouseMoved) {
                        $("#session #sessionHeader").css({ opacity: 1.0 });
                        $("#remoteVideoOverlay .button").removeClass("hidden");
                        $("#localVideoOverlay .button").removeClass("hidden");
                        mouseMoved = false;
                        $("#drivingTallWarning").css({ top: "100px" });
                    }
                }, 100);
                $("#session").mousemove(function(e) {
                    mouseMoveCountdown = 30;
                    mouseMoved = true;
                    mouseY = e.pageY;
                });
                $("#session").mouseleave(function(e) {
                    mouseMoveCountdown = 0;
                    mouseMoved = false;

                    $("#session #sessionHeader").css({ opacity: 0.0 });
                    $("#remoteVideoOverlay .button").addClass("hidden");
                    $("#localVideoOverlay .button").addClass("hidden");
                    $("#drivingTallWarning").css({ top: "20px" });
                });
            }
        }
        
        // centerRemoteVideoInterval = window.setInterval(function () {
        // 	centerRemoteVideo();
        // }, 100);
    }

    function beginFreezeDetection() {
        // freeze detection
        var videoCanvas = null;
        var videoContext = null;
        var lastVideoCanvas = null;
        var lastVideoContext = null;
        var remoteVideoIsFrozen = false;
        var videoMetaDataLoaded = false;
        window.clearInterval(freezeDetectionTimer);
        freezeDetectionTimer = window.setInterval(function () {
            var videoElement = $("#subscribers video");
            if (videoElement.length > 0) {
                videoElement = videoElement[0];

                $("#subscribers video").bind("loadedmetadata", function () {
                    videoMetaDataLoaded = true;
                });
            }

            if (videoElement.nodeName == "VIDEO" && videoMetaDataLoaded) {
                // new video canvas
                if (!videoCanvas) {
                    videoCanvas = document.createElement("canvas");
                    videoCanvas.width  = videoElement.videoWidth;
                    videoCanvas.height = videoElement.videoHeight;
                    videoContext = videoCanvas.getContext("2d");
                }
                videoContext.drawImage(videoElement, 0, 0);

                // compare the two frames
                if (lastVideoCanvas) {
                    if (videoCanvas.toDataURL() == lastVideoCanvas.toDataURL()) {
                        // FREEZE DETECTED
                        if (!remoteVideoIsFrozen) {
                            console.log("Freeze detected");
                            remoteVideoIsFrozen = true;
                            sendCommandWithData(kDRCommandRemoteVideoFroze, { 
                                driverClientDescription: navigator.userAgent
                            });
                            displayHoverMessage($("#stringReconnecting").html() +"...", $("#stringTheVideoSignalFroze").html());
                        }
                    } else if (remoteVideoIsFrozen && opentokSubscriber != undefined && opentokSubscriber.stream.hasVideo == true) {
                        console.log("Unfrozen detected");
                        remoteVideoIsFrozen = false;
                        sendCommand(kDRCommandRemoteVideoUnfroze);
                        hideHoverMessage();
                    }
                }

                // save the frame for next time
                if (!lastVideoCanvas) {
                    lastVideoCanvas = document.createElement("canvas");
                    lastVideoCanvas.width  = videoElement.videoWidth;
                    lastVideoCanvas.height = videoElement.videoHeight;
                    lastVideoContext = lastVideoCanvas.getContext("2d");
                }
                lastVideoContext.drawImage(videoElement, 0, 0);
            }

        }, 2000);
    }

    function endSession() {
        hideHoverMessage();
        $("#robots").show();
        $("#session").hide();
        $("#connecting").hide();
        window.clearInterval(commandsTimer);
        window.clearInterval(freezeDetectionTimer);
        window.onmousewheel = document.onmousewheel = null;
        window.clearInterval(mouseMoveInterval);
        window.clearInterval(centerRemoteVideoInterval);

        $("#multipartyAudioLevels").hide();
        $("#multipartyAudioLevels .viewer").remove();
        sessionIsViewer = false;
        multipartyViewerId = null;
        multipartyViewers = [];

        document.title = "Double";

        opentokDisconnect();

        alwaysOnFloorViewEnabled = true;
        cameraKitEnabled = false;
        dedistortionAllowed = true;
        inLowCPUMode = false;
        tearDownThree();
        sessionRobotInstallationId = undefined;
        clearRelayServer();

        if (statsInterval) {
            window.clearInterval(statsInterval);
            statsInterval = undefined;
        }

        // if (IS_OCULUS_MODE || true) {
        // 	window.location = window.location;
        // }
    }

    function fireDriveCommands() {
        var drive = (forwardState == 1) ? -100 : ((backwardState) ? 50 : 0);
        var turn = (leftState == 1) ? 100 : ((rightState) ? -100 : 0);
        var pole = (poleUpState == 1) ? 200 : ((poleDownState) ? -200 : 0);

        // turn by scroll
        if (drive == 0) {
            scrollValue = 0;
        }
        if (scrollValue != 0) {
            if (scrollValue > 0) {
                // scroll left
                turn = -35;
                scrollValue = Math.max(scrollValue - 200, 0);
            } else {
                // scroll right
                turn = 35;
                scrollValue = Math.min(scrollValue + 200, 0);
            }
        }

        // Only send neutral drive/turn commands 10 times then stop
        if (drive == 0 && turn == 0) {
            neutralDriveCommandsSent++;
        } else {
            neutralDriveCommandsSent = 0;
        }

        if (neutralDriveCommandsSent < 10) {
            //console.log("drive: " + drive + ", turn: " + turn);
            sendCommandWithData(kDRCommandControlDrive, { "drive" : drive, "turn" : turn, "powerDrive": powerDriveOn });
        }

        if (robotSpeakerVolumeToSend != -1) {
            sendCommandWithData(kDRCommandVolumeChanged, { volume: robotSpeakerVolumeToSend });
            robotSpeakerVolumeToSend = -1;
        }

        if (poleToSend != -1) {
            if (remoteRobotSupports("poleTargets")) {
                sendCommandWithData(kDRCommandControlPole, { "target" : poleToSend });
            }
            poleToSend = -1;
        } else {
            // Only send neutral pole commands 10 times then stop
            if (pole == 0) {
                neutralPoleCommandsSent++;
            } else {
                neutralPoleCommandsSent = 0;
            }

            if (neutralPoleCommandsSent < 10) {
                //console.log("pole: " + pole);
                sendCommandWithData(kDRCommandControlPole, { "pole" : pole });
            }
        }

        if (nextZoomCenter) {
            sendZoom();
        }

        // send brightness
        var value = $("#brightnessSlider").val()/100;
        if (lastBrightnessSent != -1 && lastBrightnessSent != value) {
            sendCommandWithData(kDRCommandSetRobotScreenBrightness, { "brightness" : value });
            lastBrightnessSent = value;
        }
    }
        
    function updateZoomers() {
        var level = mapboxMap.zoom();
        if (level == kDRMapZoomMin) {
            $("#zoomOut").addClass("disabled");
            $("#zoomIn").removeClass("disabled");
        } else if (level == kDRMapZoomMax) {
            $("#zoomOut").removeClass("disabled");
            $("#zoomIn").addClass("disabled");
        } else {
            // enable both
            $("#zoomOut").removeClass("disabled");
            $("#zoomIn").removeClass("disabled");
        }
    }

    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,''])[1]
        );
    }

    function addQueryStringParameter(theURL, name, value) {
        var re = new RegExp("([?&]" + name + "=)[^&]+", "");

        function add(sep) {
            theURL += sep + name + "=" + encodeURIComponent(value);
        }

        function change() {
            theURL = theURL.replace(re, "$1" + encodeURIComponent(value));
        }

        if (theURL.indexOf("?") === -1) {
            add("?");
        } else {
            if (re.test(theURL)) {
                change();
            } else {
                add("&");
            }
        }
        
        return theURL;
    }

    function clickedConnectionStatus() {
        
    }

    function showNoRobotsConnectedMessage() {
        $("#noLocationBubble").show();
        $("#noLocationBubble h1").show();
        $("#noLocationRobotsList").html("");
        $("#noLocationBubble").height(84);
    }

    function hideNoRobotsConnectedMessage() {
        $("#noLocationBubble h1").hide();
    }

    // Blink

    function setupBlink() {
        window.setInterval(fireBlink, 250);
    }

    function addBlink(o) {
        if (blinkArray.indexOf(o) < 0) {
            blinkArray.push(o);
        }
    }

    function removeBlink(o) {
        var counter = 0;
        for (var i = 0; i < blinkArray.length; i++) {
            if (blinkArray[i] == o) {
                blinkArray.splice(i, 1);
                i--;
                counter++;
            }
        }
        if (counter > 0) {
            updateUserInterface();
        }
    }

    function fireBlink() {
        for (var i = 0; i < blinkArray.length; i++) {
            $(blinkArray[i]).toggleClass("on");
        }
    }

    // Button Actions

    function updateUserInterface() {
        // park
        switch (kickstandState) {
            case kDRKickstand_stateDeployed:
                removeBlink("#parkButton");
                $("#parkButton").addClass("on");
                break;

            case kDRKickstand_stateDeployWaiting: // It's retracted, but waiting to be deployed
            case kDRKickstand_stateDeployBeginning:
            case kDRKickstand_stateDeployMiddle:
            case kDRKickstand_stateDeployEnd:
            case kDRKickstand_stateRetractBeginning:
            case kDRKickstand_stateRetractMiddle:
            case kDRKickstand_stateRetractEnd:
            case kDRKickstand_stateDeployAbortMiddle:
            case kDRKickstand_stateDeployAbortEnd:                                            
                // blink
                addBlink("#parkButton");
                break;

            case kDRKickstand_stateRetracted:
            case kDRKickstand_stateNone:
            default:
                removeBlink("#parkButton");
                $("#parkButton").removeClass("on");
                break;
                break;
        }

        // flip
        if (robotiPadOrientation == 1 
    /*		|| (remoteRobotSupports("cameraKitIsConnected") && !("cameraKitEnabled" in statusValues))
            || (remoteRobotSupports("cameraKitIsConnected") && "cameraKitEnabled" in statusValues && statusValues.cameraKitEnabled) */)
        {
            $("#flipButton").addClass("disabled");
            $("#flipButton").removeClass("on");
        } else if (robotiPadOrientation == 2) {
            $("#flipButton").removeClass("disabled");
            if (isFlipped) {
                $("#flipButton").addClass("on");
            } else {
                $("#flipButton").removeClass("on");
            }
        } else {
            $("#flipButton").addClass("disabled");
            $("#flipButton").removeClass("on");
        }
        if (remoteRobotSupports("cameraKitIsConnected") && "cameraKitEnabled" in statusValues) {
            $("#ckButton").removeClass("disabled");
            if (statusValues.cameraKitEnabled) {
                $("#ckButton").addClass("on");
            } else {
                $("#ckButton").removeClass("on");
            }
        } else {
            $("#ckButton").addClass("disabled");
        }

        if (remoteRobotSupports("robot")) {
            // robot connected
            $("#batteryButton").show();
            $("#parkButton").show();
            $("#poleButton").show();
            $("#missingRobotButton").hide();
        } else {
            // missing robot
            $("#batteryButton").hide();
            $("#parkButton").hide();
            $("#poleButton").hide();
            $("#missingRobotButton").show();
        }

        // Microphone mute
        if (isMuted) {
            $("#muteButton").addClass("on");
        } else {
            $("#muteButton").removeClass("on");
        }

        // Microphone volume slider
        if (allowRobotSpeakerUpdate && statusValues.volume != undefined) {
            $("#nativeVolumeSlider").val(statusValues.volume * 100);
            $("#localVideo .audioLevel").width(Math.round(statusValues.volume * 100) +"%");
        }

        // Speaker mute
        if (speakerIsMuted) {
            $("#speakerMuteButton").addClass("on");
        } else {
            $("#speakerMuteButton").removeClass("on");
        }

        // pole
        if (allowPoleUpdate && statusValues.pole !== undefined) {
            $("#nativePoleSlider").val(Math.round(statusValues.pole * 100));
        }

        // update battery level
        if (!sessionBatteryButton) {
            sessionBatteryButton = BatteryButtonWithParentId("sessionBatteryButton");
        }
        sessionBatteryButton.robotBatteryLevel = statusValues.robot_battery;
        sessionBatteryButton.iPadBatteryLevel = statusValues.ipad_battery;
        sessionBatteryButton.supportsiPadMeter = true;
        sessionBatteryButton.showChargingIcon = statusValues.is_robot_charging;
        sessionBatteryButton.barContentSize = { "width": 38.0, "height": 16.0 };
        sessionBatteryButton.strokeThickness = 2.0;
        sessionBatteryButton.fillColor = "rgba(40, 40, 40, 1.0)";
        if (statusValues.is_robot_charging) {
            if (statusValues.robot_battery == 1.0) {
                sessionBatteryButton.fillColor = kDRGreenColor;
            } else {
                sessionBatteryButton.fillColor = kDROrangeColor;
            }
        }
        sessionBatteryButton.redraw();
        $("#robotBatteryLevel").html(Math.round(statusValues.robot_battery * 100));
        $("#iPadBatteryLevel").html(Math.round(statusValues.ipad_battery * 100));

        // update warning message about driving while too tall
        checkDrivingTall();

        // enable multiparty button
        if (remoteRobotSupports("multiparty")) {
            $("#multipartyButton").removeClass("disabled");
            if (sessionIsMultipartyHost) {
                $("#multipartyButton").addClass("on");
            } else {
                $("#multipartyButton").removeClass("on");
            }
        } else {
            $("#multipartyButton").addClass("disabled");
        }

        // enable screensharing button
        if (remoteRobotSupports("screensharing") && (!getURLParameter("domain") || getURLParameter("domain").indexOf(".doublerobotics.com") > -1)) {
            $("#screenSharingButton").removeClass("disabled");
            if (screenSharingIsActive()) {
                $("#screenSharingButton").addClass("on");
            } else {
                $("#screenSharingButton").removeClass("on");
            }
        } else {
            $("#screenSharingButton").addClass("disabled");
        }
        if (isChromeAndroid()) {
            $("#screenSharingButton").remove();
        }

        // display web page
        if (remoteRobotSupports("screensharing")) { // note: we don't have an entry for displaying a web page
            $("#displayWebPageButton").removeClass("disabled");
        } else {
            $("#displayWebPageButton").addClass("disabled");
        }

        // enable photo button
        if (remoteRobotSupports("photo")) {
            $("#photoButton").removeClass("disabled");
        } else {
            $("#photoButton").addClass("disabled");
        }

        // quality
        if (remoteRobotSupports("qualityPreference")) {
            if (!isUsingCameraKit()) {
                // don't allow AHD when not using a Camera Kit
                statusValues.qualityPreference = Math.min(2, statusValues.qualityPreference);
            }

            // supports quality preference
            $("#qualityPreference").removeClass("disabled");
            $("#qualityPreference0").removeClass("selected");
            $("#qualityPreference1").removeClass("selected");
            $("#qualityPreference2").removeClass("selected");
            $("#qualityPreference3").removeClass("selected");
            $("#qualityPreference"+ Math.min(statusValues.qualityPreference, 3)).addClass("selected");

            // Disable options based on remote iPad capabilites
            if ("qualityPreference" in statusValues && statusValues.maxQualityPreference <= 1) {
                // iPad Air or lower
                $("#qualityPreference3").addClass("disabled");
                if (statusValues.maxQualityPreference <= 0 && isUsingCameraKit()) {
                    // iPad 4 or lower
                    $("#qualityPreference2").addClass("disabled");
                    $("#qualityPreference1").addClass("disabled");
                } else {
                    $("#qualityPreference2").removeClass("disabled");
                    $("#qualityPreference1").removeClass("disabled");
                }
            } else {
                // iPad Air 2 or newer
                if (isUsingCameraKit()) {
                    // allow AHD only when using a Camera Kit
                    $("#qualityPreference3").removeClass("disabled");
                } else {
                    $("#qualityPreference3").addClass("disabled");
                }
                $("#qualityPreference2").removeClass("disabled");
                $("#qualityPreference1").removeClass("disabled");
            }
            
            if ("qualityPreference" in statusValues) {
                if (isUsingCameraKit() && lastQualitySettingCameraKit < 0) {
                    lastQualitySettingCameraKit = (statusValues.maxQualityPreference == 2) ? 3 : statusValues.maxQualityPreference;
                }
                if (!isUsingCameraKit() && lastQualitySettingiPad < 0) {
                    lastQualitySettingiPad = statusValues.maxQualityPreference;
                }
            }
            
        } else {
            // no quality preference
            $("#qualityPreference").addClass("disabled");
        }

        // brightness
        if (remoteRobotSupports("brightness")) {
            $("#brightnessSlider").prop('disabled', false);
            $("#brightnessSlider").val(statusValues.brightness * 100);
            lastBrightnessSent = statusValues.brightness;
        } else {
            $("#brightnessSlider").prop('disabled', true);
        }

        if (remoteRobotSupports("cameraKitIsConnected")) {
            if ("floorViewEnabled" in statusValues) {
                if (statusValues.floorViewEnabled) {
                    showAlwaysOnFloorView();
                } else {
                    hideAlwaysOnFloorView();
                }
            }
            if ("cameraKitEnabled" in statusValues) {
                if (statusValues.cameraKitEnabled) {
                    enterCameraKitMode();
                } else {
                    exitCameraKitMode();
                }
            } else {
                enterCameraKitMode();
                cameraKitEnabled = true;
            }
        } else {
            exitCameraKitMode();
        }

        if ("sharpenFilterEnabled" in statusValues) {
            sharpenFilterEnabled = statusValues.sharpenFilterEnabled;
        }

        // Speaker volume slider - keep this as the last one in the function
        try {
            if (opentokSubscriber != undefined && opentokSubscriber.getAudioVolume != undefined) {
                // $("#speakerVolumeSlider").simpleSlider("setValue", opentokSubscriber.getAudioVolume() / 100);
                // $("#nativeSpeakerVolumeSlider").val(opentokSubscriber.getAudioVolume());
            }
        } catch (err) {
            
        }
    }

    function isUsingCameraKit() {
        return (remoteRobotSupports("cameraKitIsConnected") && ("cameraKitEnabled" in statusValues && statusValues.cameraKitEnabled == true));
    }

    function checkDrivingTall() {
        if (statusValues.pole >= 0.5 && forwardState == 1) {
            if (!drivingTallTimeout) {
                drivingTallTimeout = window.setTimeout(function () {
                    // show the warning
                    if (!$("#drivingTallWarning").is(":visible")) {
                        if (!$("#poleButton .popover").is(":visible")) {
                            $("#drivingTallWarning").fadeIn(100);
                        }
                    }
                    drivingTallTimeout = null;
                }, 3000);
            }
        } else {
            window.clearTimeout(drivingTallTimeout);
            drivingTallTimeout = null;
            if ($("#drivingTallWarning").is(":visible")) {
                $("#drivingTallWarning").fadeOut(100);
            }
        }
    }

    function endAction() {
        disconnect();
        updateUserInterface();
    }

    function parkAction() {
        switch (kickstandState) {
            case kDRKickstand_stateDeployed:
                retractKickstands();
                break;

            case kDRKickstand_stateDeployWaiting: // It's retracted, but waiting to be deployed
            case kDRKickstand_stateDeployBeginning:
            case kDRKickstand_stateDeployMiddle:
            case kDRKickstand_stateDeployEnd:
            case kDRKickstand_stateRetractBeginning:
            case kDRKickstand_stateRetractMiddle:
            case kDRKickstand_stateRetractEnd:
            case kDRKickstand_stateDeployAbortMiddle:
            case kDRKickstand_stateDeployAbortEnd:                                            
                break;

            case kDRKickstand_stateRetracted:
            case kDRKickstand_stateNone:
            default:
                deployKickstands();
                break;
                break;
        }
        updateUserInterface();
    }

    function flipAction() {
        if (robotiPadOrientation != 1 /* && (!remoteRobotSupports("cameraKitIsConnected") || !cameraKitEnabled) */) {
            flip();
        }
    }

    function ckAction() {
        if (remoteRobotSupports("cameraKitIsConnected") && cameraKitEnabled) {
            sendCommand(kDRCommandCameraKitDisable);
        } else {
            sendCommand(kDRCommandCameraKitEnable);
        }
    }

    // Microphone Actions

    function muteAction() {
        if (isMuted) {
            document.title = "Double";
            muteDisable();
        } else {
            document.title = "Double [Robot Muted]";
            muteEnable();
        }
    }

    function muteEnable() {
        opentokPublisher.publishAudio(false);
        isMuted = true;
        updateUserInterface();
    }

    function muteDisable() {
        opentokPublisher.publishAudio(true);
        isMuted = false;
        updateUserInterface();
    }

    var volumeTimeout;
    function volumeSliderDidChange(theValue) {
        if (justGotVolume == true) { return; }

        if (volumeTimeout) {
            window.clearTimeout(volumeTimeout);
        }

        volumeTimeout = window.setTimeout(function () {
            sendCommandWithData(kDRCommandVolumeChanged, { volume: theValue });
        }, 100);
    }

    function volumeUp() {
        if (isMuted) {
            muteDisable();
        }
        robotSpeakerVolumeToSend = Math.min(1, statusValues.volume + 0.1);
        statusValues.volume = robotSpeakerVolumeToSend;
        $("#localVideo .audioLevel").width(Math.round(robotSpeakerVolumeToSend * 100) +"%");
        updateUserInterface();
        temporarilyBlockSpeakerSliderUpdate();
    }

    function volumeDown() {
        robotSpeakerVolumeToSend = Math.max(0, statusValues.volume - 0.1);
        statusValues.volume = robotSpeakerVolumeToSend;
        if (statusValues.volume <= 0.01) {
            muteEnable();
        }
        $("#localVideo .audioLevel").width(Math.round(robotSpeakerVolumeToSend * 100) +"%");
        updateUserInterface();
        temporarilyBlockSpeakerSliderUpdate();
    }

    function temporarilyBlockSpeakerSliderUpdate() {
        allowRobotSpeakerUpdate = false;
        window.clearTimeout(allowRobotSpeakerUpdateTimeout);
        allowRobotSpeakerUpdateTimeout = window.setTimeout(function () {
            allowRobotSpeakerUpdate = true;
        }, 2500);
    }

    // Speaker Actions

    function speakerMuteAction() {
        if (speakerIsMuted) {
            speakerMuteDisable();
        } else {
            speakerMuteEnable();
        }
    }

    function speakerMuteEnable() {
        opentokSubscriber.subscribeToAudio(false);
        speakerIsMuted = true;
        updateUserInterface();
    }

    function speakerMuteDisable() {
        opentokSubscriber.subscribeToAudio(true);
        speakerIsMuted = false;
        updateUserInterface();
    }

    function speakerVolumeSliderDidChange(theValue) {
        if (opentokSubscriber != undefined) {
            opentokSubscriber.setAudioVolume(Math.round(theValue * 100));
        }
    }

    function speakerVolumeUp() {
        if (opentokSubscriber != undefined) {
            if (speakerIsMuted) {
                speakerMuteDisable();
            }
            opentokSubscriber.setAudioVolume(Math.min(100, opentokSubscriber.getAudioVolume() + 10));
            $("#speakerVolumeSlider").simpleSlider("setValue", opentokSubscriber.getAudioVolume() / 100);
            updateUserInterface();
        }
    }

    function speakerVolumeDown() {
        if (opentokSubscriber != undefined) {
            opentokSubscriber.setAudioVolume(Math.max(0, opentokSubscriber.getAudioVolume() - 10));
            $("#speakerVolumeSlider").simpleSlider("setValue", opentokSubscriber.getAudioVolume() / 100);
            if (opentokSubscriber.getAudioVolume() <= 0.01) {
                speakerMuteEnable();
            }
            updateUserInterface();
        }
    }

    function saveSettings() {
        clearKeyboardCommands();

        var dict = {
            peerToPeerDriving: $("#peerToPeerDriving").is(':checked'),
            securityLevel: $(".securityLevel input[name=securityLevel]:checked").val(),
            relayServer: $(".relayServer input[name=relayServer]:checked").val()
        };
        $.cookie("settings", JSON.stringify(dict), { expires : 10000, secure: ('https:' == document.location.protocol) });
    }

    function loadSettings() {
        var dict = $.cookie("settings");
        if (dict && dict != null && dict != "null") {
            dict = JSON.parse(dict);
            $('#peerToPeerDriving').prop('checked', dict.peerToPeerDriving);
            
            if (dict.securityLevel == "clientToServer") {
                $("#securityLevelClientToServer").prop("checked", true);
            } else {
                $("#securityLevelEndToEnd").prop("checked", true);
            }

            if (dict.relayServer == "relay-singapore.doublerobotics.com") {
                $("#relayServerSingapore").prop("checked", true);
            } else {
                $("#relayServerUS").prop("checked", true);
            }
        }
    }

    function showRobotsSharedWithMe() {
        $("#robotsSharedWithMe").show();
        loadRobotsSharedWithMe();
    }

    function showCallHistory() {
        $("#callHistory").show();
        loadCallHistory();
    }

    function loadRobotsSharedWithMe() {
        $("#robotsSharedWithMeRows").html("<tr><td>Loading...</td></tr>");

        var request = getSharedDBLHTTPClient().request("GET", kAPIEndpointUserSharedRobots, { });
        request.send(function (data) {
            // success
            var html = "";
            if (data.robots && data.robots.length > 0) {
                for (var i = 0; i < data.robots.length; i++) {
                    var r = data.robots[i];
                    var isOnline = false;
                    for (var k = 0; k < robots.length; k++) {
                        if (robots[k].dictionary.installationId == r.robot_installation_key) {
                            isOnline = true;
                        }
                    }
                    html += "<tr><td>"+ r.robot_nickname + ((!isOnline) ? " (offline)" : "") +"</td><td class=\"right\">"+ r.robot_user +"</td></tr>";
                }
            } else {
                $("#robotsSharedWithMeRows").html("<tr><td>None</td></tr>");
            }
            $("#robotsSharedWithMeRows").html(html);
        }, function () {
            // failure
            console.log("failed to load robots shared with me");
        });
    }

    function loadCallHistory() {
        $("#callHistory table").html("<tr><td>"+ $("#stringLoading").html() +"...</td></tr>");
        
        var d = new Date()
        var offset = d.getTimezoneOffset() * -60;
        var parameters = { "group" : "days", "time_zone_offset" : offset };

        var driverValue = $("#callHistoryDrivers").val();
        if (driverValue != "all" && driverValue != "") {
            // you need to set both to get a specific driver's usage of my robots
            parameters.user_one_id = driverValue;
        }
        
        var client = MakeDBLHTTPClient("https://dynamic.doublerobotics.com/");
        var request = client.request("GET", "session-search.php", parameters );
        request.send(function (data) {
            // success
            var html = "";

            if (data.results && data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    var month = data.results[i];
                    html += "<thead>";
                    html += "<tr><th width=\"30%\">"+ month.title +"</th>";
                    html += "<th width=\"55%\"></th>";
                    html += "<th width=\"15%\" class=\"right\">"+ prettyDuration(month.duration) +"</th></tr>";
                    html += "</thead>";
                    html += "<tbody>";
                    if (month.days && month.days.length > 0) {
                        for (var k = 0; k < month.days.length; k++) {
                            var day = month.days[k];
                            html += "<tr>";
                            html += "<td>"+ day.date +"</td>";
                            var nicknames = day.nicknames.join(", ");
                            var nicknamesCut = nicknames;
                            if (nicknames == "") {
                                nicknames = "-";
                                nicknamesCut = "-";
                            } else if (nicknames.length > 63) {
                                nicknamesCut = nicknames.substr(0, 60) +"...";
                            }
                            html += "<td><span title=\""+ nicknames.replace(/"/g, '\\"') +"\">"+ nicknamesCut +"</span></td>";
                            html += "<td class=\"right\">"+ prettyDuration(day.duration) +"</td>";
                            html += "</tr>";
                        }
                    } else {
                        html = "<tr><td>"+ $("#stringNone").html() +"</td></tr>";
                    }
                    html += "</tbody>";
                }
            }

            var options = "<option value=\"all\">"+ $("#stringAllDrivers").html() +"</option>";
            if (data.drivers && data.drivers.length) {
                for (var i = 0; i < data.drivers.length; i++) {
                    var driver = data.drivers[i];
                    options += "<option value=\""+ driver.id +"\">"+ driver.email +"</option>";
                }
                $("#callHistoryDrivers").html(options);
            }

            $("#callHistory table").html(html);

            // graph
            var graphData = {
                labels : [],
                datasets : [
                    {
                        fillColor : "#528bc2",
                        data : []
                    }
                ]
            }
            if (data.results && data.results.length > 0) {
                data.results.reverse();
                for (var i = 0; i < data.results.length; i++) {
                    var month = data.results[i];
                    var monthName = month.title.split(" ")[0];
                    graphData.labels.push((monthName == "January") ? month.title : monthName);
                    if (month.days && month.days.length > 0) {
                        month.days.reverse();
                        for (var k = 0; k < month.days.length; k++) {
                            var day = month.days[k];
                            if (k > 0) {
                                graphData.labels.push("");
                            }
                            graphData.datasets[0].data.push(day.duration);
                        }
                    }
                }
            }
            setupGraph(graphData);
        }, function () {
            // failure
            console.log("failed to load call history");
        });
    }

    function setupGraph(graphData) {
        // document.getElementById("canvas").style.width = (barChartData.labels.length + 30) +"px";
        // document.getElementById("canvas").style.width = "600px";

        var html = "<canvas id=\"canvas\" height=\"160\" width=\"640\"></canvas>";
        $("#callHistory .graph").html(html);

        var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Bar(graphData, {
            
            //Boolean - If we show the scale above the chart data			
            scaleOverlay : false,

            //Boolean - If we want to override with a hard coded scale
            scaleOverride : false,

            //** Required if scaleOverride is true **
            //Number - The number of steps in a hard coded scale
            scaleSteps : 1,
            //Number - The value jump in the hard coded scale
            scaleStepWidth : 200,
            //Number - The scale starting value
            scaleStartValue : 0,

            //String - Colour of the scale line	
            scaleLineColor : "rgba(0,0,0,0)",
            //Number - Pixel width of the scale line	
            scaleLineWidth : 0,

            //Boolean - Whether to show labels on the scale	
            scaleShowLabels : false,
            //Interpolated JS string - can access value
            scaleLabel : "<%=value%>",
            //String - Scale label font declaration for the scale label
            scaleFontFamily : "'Arial'",
            //Number - Scale label font size in pixels	
            scaleFontSize : 12,
            //String - Scale label font weight style	
            scaleFontStyle : "normal",
            //String - Scale label font colour	
            scaleFontColor : "#666",	

            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : false,
            //String - Colour of the grid lines
            scaleGridLineColor : "none",
            //Number - Width of the grid lines
            scaleGridLineWidth : 1,	

            //Boolean - If there is a stroke on each bar	
            barShowStroke : false,
            //Number - Pixel width of the bar stroke	
            barStrokeWidth : 1,

            //Number - Spacing between each of the X value sets
            barValueSpacing : 1,
            //Number - Spacing between data sets within X values
            barDatasetSpacing : 1,

            //Boolean - Whether to animate the chart
            animation : true,
            //Number - Number of animation steps
            animationSteps : 60,
            //String - Animation easing effect
            animationEasing : "easeOutQuart",
            //Function - Fires when the animation is complete
            onAnimationComplete : null
        });
    }

    function switchToCreateAccount() {
        $("#content").show();
        $("#login").hide();
        $("#createAccount").show();
        $("#usernameCreateAccountField").select();
        if ($("#usernameLoginField").val() != "") {
            $("#usernameCreateAccountField").val($("#usernameLoginField").val());
            $("#emailCreateAccountField").select();
        }
        if ($("#passwordLoginField").val() != "") {
            $("#passwordCreateAccountField").val($("#passwordLoginField").val());
            $("#passwordCreateAccountField2").val($("#passwordLoginField").val());
        }
    }

    function switchToLogin() {
        $("#content").show();
        showLoginForm();
        $("#createAccount").hide();
        $("#usernameLoginField").select();
    }

    function displayHoverMessage(title, subtitle) {
        $("#hoverMessage h1").html(title);
        if (subtitle) {
            $("#hoverMessage h2").html(subtitle);
        } else {
            $("#hoverMessage h2").html("");
        }
        $("#hoverMessage").fadeIn(150);
    }

    function hideHoverMessage() {
        $("#hoverMessage").fadeOut(10);
    }

    function prettyDuration(input) {
        var sec_num = parseInt(input, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.ceil((sec_num - (hours * 3600)) / 60);
        var time = "";
        if (hours > 0) {
            time += hours +"h ";
        }
        time += minutes +"m";
        if (hours == 0 && minutes == 0) {
            time = "-";
        }
        return time;
    }

    function loadConfiguration() {
        var client = MakeDBLHTTPClient("https://config.doublerobotics.com/");
        var token = (currentUser && currentUser.access_token) ? currentUser.access_token : "";
        var params = { "checkBetaAccessKey" : token };
        if (getURLParameter("domain")) {
            params["domain"] = getURLParameter("domain");
        }
        var request = client.request("GET", "configuration.php", params);
        request.send(function (data) {
            // success
            if (data.data.robot_sharing_enabled) {
                $("#callHistoryLink").show();
            }
            if (data.data.logo) {
                if (navigator.userAgent.indexOf("Firefox") >= 0) {
                    $("#logo").css("background-image", "url(\""+ data.data.logo +"\")");
                } else {
                    $("#logo").css("background-image", "-webkit-image-set(url(\""+ data.data.logo +"\") 1x, url(\""+ data.data.logo_2x +"\") 2x)");
                }
            }
            if (data.data.logo_link) {
                $("#logo").attr("href", data.data.logo_link);
            }
            configuration = data;
        }, function () {
            // failure
            console.log("failed to load configuration");
        });	
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    function downloadBlob(blob, fileName) {
        var url = (isChromeAndroid()) ? window.webkitURL.createObjectURL(blob) : window.URL.createObjectURL(blob);

        if (navigator.userAgent.indexOf("Firefox") >= 0) {
            window.open(url, '_blank');
            return;
        }

        var link = document.createElement("a");
        document.body.appendChild(link);
        link.style = "display: none;";
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    function takePhoto() {
        if (!remoteRobotSupports("photo")) {
            alert("Capturing a photo appears to be disabled or not supported on the remote iPad.");
            return;
        }

        var flash = document.createElement("div");
        document.getElementById("subscribers").appendChild(flash);
        flash.id = "photoFlash";
        flash.style.background = "white";
        flash.style.width = "100%";
        flash.style.height = $(document).height();
        flash.style.left = "0px";
        flash.style.top = "0px";
        flash.style.position = "fixed";
        window.setTimeout(function () {
            $("#photoFlash").fadeOut(1000);
            window.setTimeout(function () {
                $("#photoFlash").remove();
            }, 1500);
        }, 20);

        window.setTimeout(function () {
            sendCommand(kDRCommandTakePhoto);
        }, 50);

        displayHoverMessage($("#stringTakingPhoto").html(), $("#stringCapturing").html() +"...");
        window.setTimeout(function () {
            displayHoverMessage($("#stringTakingPhoto").html(), $("#stringDownloading").html() +"...");
        }, 1500);
    }

    function remoteRobotSupports(key) {
        return (statusValues && statusValues.supports && statusValues.supports.indexOf(key) >= 0);
    }

    function resetVideoLink(multiparty) {
        if (multiparty) {
            // switch to multiparty
            opentokDisconnect();
            // resetSessionVariables();
            // sendCommand(kDRCommandResetVideoLink);
            window.setTimeout(function() {
                sendCommandWithData(kDRCommandRequestOpenTokSession, { "multiparty" : true });
                sessionIsMultipartyHost = true;
                sendCommand(kDRCommandRequestStatusData);
            }, 500);
        } else {
            // normal
            opentokStopPublishing();
            window.setTimeout(function() {
                sendCommand(kDRCommandRequestOpenTokSession);
                sendCommand(kDRCommandRequestStatusData);
            }, 500);
        }	
        
        // displayHoverMessage("Reconnecting...", " ");
        updateUserInterface();
    }

    function toggleNightVision(el) {
        clearKeyboardCommands();

        if (el && el.checked) {
            sendCommand(kDRCommandLowLightModeOn);
            nightVisionEnabled = true;
        } else {
            sendCommand(kDRCommandLowLightModeOff);
            nightVisionEnabled = false;
        }
    }

    function toggleFloorView() {
        clearKeyboardCommands();

        if (alwaysOnFloorViewEnabled) {
            sendCommand(kDRCommandFloorViewDisable);
            hideAlwaysOnFloorView();
        } else {
            sendCommand(kDRCommandFloorViewEnable);
            showAlwaysOnFloorView();
        }
    }

    function configAction() {
        
    }

    function qualityPreferenceDidChange() {
        sendCommandWithData(kDRCommandResetVideoLink, { "qualityPreference" : $("#qualityPreference").val() });
    }

    function setQualityPreference(value, el) {
        if (el !== null && $(el).hasClass("disabled")) {
            return;
        }
        $("#qualityPreference0").removeClass("selected");
        $("#qualityPreference1").removeClass("selected");
        $("#qualityPreference2").removeClass("selected");
        $("#qualityPreference3").removeClass("selected");
        $("#qualityPreference"+ Math.min(value, 3)).addClass("selected");
        if (value >= 3) {
            sendCommand(kDRCommandAdaptiveHDEnable);
        } else {
            sendCommand(kDRCommandAdaptiveHDDisable);
        }
        if (el) {
            if (isUsingCameraKit()) {
                lastQualitySettingCameraKit = value;
            } else {
                lastQualitySettingiPad = value;
            }
        }
        sendCommandWithData(kDRCommandResetVideoLink, { "qualityPreference" : value });
    }

    var volumeTimeout;
    function nativeVolumeSliderDidChange() {
        clearKeyboardCommands();

        robotSpeakerVolumeToSend = $("#nativeVolumeSlider").val() / 100;
        $("#localVideo .audioLevel").width($("#nativeVolumeSlider").val() +"%");
        temporarilyBlockSpeakerSliderUpdate();
    }

    function nativeSpeakerVolumeSliderDidChange() {
        clearKeyboardCommands();

        if (opentokSubscriber != undefined) {
            opentokSubscriber.setAudioVolume(Math.round($("#nativeSpeakerVolumeSlider").val()));
        }
    }

    function nativePoleSliderDidChange() {
        clearKeyboardCommands();

        poleToSend = $("#nativePoleSlider").val() / 100;
        allowPoleUpdate = false;
    }

    function becomeRobot() {
        IS_ROBOT_MODE = true;
        var dict = {
            "missingRobot" : true,
            "userId" : currentUser.access_token,
            "installationId" : getCurrentInstallation().installation_key,
            "nickname" : "Oculus Test"
        };
        sendCommandWithData(kDRCommandRobotIsAvailable, dict);
    }

    function sendRobotStatus() {
        var dict = {
            "supports" : [ "oculus" ]
        };
        sendCommandWithData(kDRCommandStatusData, dict);
    }

    function beginOculusMode() {
        if (IS_OCULUS_MODE) { return; }
        IS_OCULUS_MODE = true;
        console.log("begin oculus mode");

        // getScript('../stitch/three.min.js', function () {} );
        // getScript('../stitch/stats.min.js', function () {} );
        // getScript('../stitch/dat.gui.min.js', function () {} );
        // getScript('../stitch/OrbitControls.js', function () {} );
        // getScript('../stitch/Detector.js', function () {} );
        // getScript('../stitch/OculusRiftEffect.js', function () {} );
        // getScript('../stitch/OculusBridge.js?v3', function () {} );

        $("#localVideo").hide();
        $("#sessionHeader").hide();
        setupThree();
        $("#vrBtn").show();
    }

    function showAlwaysOnFloorView() {
        alwaysOnFloorViewEnabled = true;
        if (floorVideoObject) {
            floorVideoObject.visible = true;
        }
        $("#floorViewCheckbox").prop("checked", true);
    }

    function hideAlwaysOnFloorView() {
        alwaysOnFloorViewEnabled = false;
        if (floorVideoObject) {
            floorVideoObject.visible = false;
        }
        $("#floorViewCheckbox").prop("checked", false);
    }

    function enterCameraKitMode() {
        if (cameraKitEnabled) {
            return;
        };
        if ("lensCorrectionEnabled" in statusValues) {
            if (statusValues.lensCorrectionEnabled) {
                dedistortionAllowed = false;
            }
        }
        cameraKitEnabled = true;
        if (dedistortionAllowed) {
            setupThree();
        }
        $("#floorViewCheckbox").prop("disabled", false);
        $("#floorViewCheckbox").parent().css({ opacity: 1.0 });
        if (!remoteRobotSupports("nightVision")) {
            $("#nightVisionCheckbox").prop("disabled", true);
            $("#nightVisionCheckbox").parent().css({ opacity: 0.5 });
        }

        // disable night vision
        sendCommand(kDRCommandLowLightModeOff);
        $("#nightVisionCheckbox").prop("checked", false);

        if (lastQualitySettingCameraKit >= 0) {
            window.setTimeout(function () { setQualityPreference(lastQualitySettingCameraKit); }, 500);
        }
    }

    function exitCameraKitMode() {
        if (!cameraKitEnabled) {
            return;
        };
        cameraKitEnabled = false;
        tearDownThree();
        $("#floorViewCheckbox").prop("disabled", true);
        $("#floorViewCheckbox").parent().css({ opacity: 0.5 });
        $("#nightVisionCheckbox").prop("disabled", false);
        $("#nightVisionCheckbox").parent().css({ opacity: 1.0 });

        // disable night vision
        sendCommand(kDRCommandLowLightModeOff);
        $("#nightVisionCheckbox").prop("checked", false);

        if (lastQualitySettingiPad >= 0) {
            window.setTimeout(function () { setQualityPreference(lastQualitySettingiPad); }, 500);
        }
    }

    function enableDedistortion() {
        dedistortionAllowed = true;
        setupThree();
    }

    function disableDedistortion() {
        dedistortionAllowed = false;
        tearDownThree();
        sendCommand(kDRCommandFloorViewDisable);
    }

    function enterLowCPUMode() {
        inLowCPUMode = true;
        disableDedistortion();
        setQualityPreference(0);
        sendCommand(kDRCommandAdaptiveHDDisable);
    }

    function exitLowCPUMode() {
        inLowCPUMode = false;
        sendCommand(kDRCommandFloorViewEnable);
        enableDedistortion();
        sendCommand(kDRCommandAdaptiveHDEnable);
        setQualityPreference(2);
    }

    function toggleLowCPUMode() {
        if (inLowCPUMode) {
            exitLowCPUMode();
        } else {
            enterLowCPUMode();
        }
    }

    function disableCameraKit() {
        sendCommand(kDRCommandCameraKitDisable);
    }

    function enableCameraKit() {
        sendCommand(kDRCommandCameraKitEnable);
    }

    function tearDownThree() {
        if (!camera) { return; }

        for(var i = scene.children.length - 1; i >= 0; i--) { }

        // stats.domElement.parentElement.removeChild(stats.domElement);
        // stats = null;

        renderer.domElement.parentElement.removeChild(renderer.domElement);
        videoCanvas.parentElement.removeChild(videoCanvas);
        threeWindowResize = null;
        scene = null;
        controls = null;
        camera = null;
        scene = null;
        light = null;
        renderer = null;
        videoContext = null;
        videoElement = null;
        videoTexture = null;
        videoObject = null;
        floorVideoObject = null;
        leftBlackBar = null;
        rightBlackBar = null;
    }

    function setupThree() {
        if (camera) { return; }
        if ($("#subscribers .remoteVideo video")[0]) {
            
        } else {
            tearDownThree();
            return;
        }

        // stats = new Stats();
        // stats.setMode(0); // 0: fps, 1: ms, 2: mb
        // stats.domElement.style.position = 'absolute';
        // stats.domElement.style.right = '0px';
        // stats.domElement.style.bottom = '0px';
        // stats.domElement.style.zIndex = '99999999';
        // document.body.appendChild( stats.domElement );
        
        // cameraLeft = new THREE.PerspectiveCamera( 75, 4/3, 0.1, 1000 );
        // cameraRight = new THREE.PerspectiveCamera( 75, 4/3, 0.1, 1000 );

        // get oculus data
        // if (navigator.getVRDevices) {
        // 	navigator.getVRDevices().then(EnumerateVRDevices);
        // } else if (navigator.mozGetVRDevices) {
        // 	navigator.mozGetVRDevices(EnumerateVRDevices);
        // } else {
        // 	// rotate a THREE.js object based on the orientation of the Oculus Rift
        // 	var bridge = new OculusBridge({
        // 	    "onOrientationUpdate" : function(quatValues) {
        // 			bodyAngle = degreesToRadians(180);
        // 			bridgeOrientationUpdated(quatValues);
        // 		}
        // 	});
        // 	bridge.connect();
        // }

        // camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        camera = new THREE.PerspectiveCamera( 16, window.innerWidth / window.innerHeight, 0.1, 1000 );
        // camera.rotation.set( degreesToRadians(0), degreesToRadians(0), 0 );
        // camera.setLens(45);
        camera.position.set(0, 0, 220);
        camera.lookAt(new THREE.Vector3(0, 0, -100));

        // controls = new THREE.OrbitControls( camera );
        // controls.minDistance = 10;
        // controls.maxDistance = 100;
        // controls.noKeys = true;
        // controls.noZoom = false;
        // controls.target = new THREE.Vector3( -6, 4, 12 );

        scene = new THREE.Scene();

        var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        scene.add( light );

        renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
        renderer.setClearColor( 0x000000 );
        // renderer.setClearColor(0x202020, 1.0);
        // renderer.setSize( window.innerWidth, window.innerHeight );
        // renderer.shadowMapEnabled = false;
        // renderer.shadowMapSoft = false;
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.left = "0px";
        renderer.domElement.style.top = "0px";

        // video object
        videoCanvas = document.createElement("canvas");
        videoCanvas.width = 1280; // 1280
        videoCanvas.height = 960; // 720
        byId("session").appendChild(videoCanvas);
        videoContext = videoCanvas.getContext("2d");
        videoElement = $("#subscribers .remoteVideo video")[0];
        // videoElement.style.display = "none";
        
        videoTexture = new THREE.Texture(videoCanvas);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        
        var videoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: videoTexture, overdraw: true, side: THREE.DoubleSide });
        var videoGeometry = new THREE.SphereGeometry(60, 64, 64, degreesToRadians(180), degreesToRadians(180), degreesToRadians(45), degreesToRadians(90));

        // videoObject = new THREE.Mesh(videoGeometry, videoMaterial);
        // videoObject.position.set(0, 0, 0);
        // scene.add(videoObject);

        var loader = new THREE.JSONLoader();          
        loader.load( "js/unwarp.json", function(geometry) {
            videoObject = new THREE.Mesh(geometry, videoMaterial);
            videoObject.scale.set(57.0, 57.0, 57.0);
            videoObject.rotation.set(degreesToRadians(3), 0, 0);
            videoObject.position.set(0, -44.5, 0);
            scene.add(videoObject);
        });
        loader.onLoadComplete=function(){ //render
        }

        var loaderFloor = new THREE.JSONLoader();          
        loaderFloor.load( "js/unwarp-floor.json", function(geometry) {
            floorVideoObject = new THREE.Mesh(geometry, videoMaterial);
            floorVideoObject.scale.set(-15.0, 15.0, 15.0);
            floorVideoObject.rotation.set(0, 0, 0);
            floorVideoObject.position.set(-40, -30, 0);
            scene.add(floorVideoObject);
            if (!alwaysOnFloorViewEnabled) {
                floorVideoObject.visible = false;
            }
        });
        loaderFloor.onLoadComplete=function(){ //render
        }

        leftBlackBar = new THREE.Mesh(new THREE.PlaneGeometry(5, 30), new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} ));
        leftBlackBar.position.set(-19.5, 0, 145);
        scene.add(leftBlackBar);

        rightBlackBar = new THREE.Mesh(new THREE.PlaneGeometry(5, 30), new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} ));
        rightBlackBar.position.set(19.5, 0, 145);
        scene.add(rightBlackBar);

        // Oculus Rift
        // effect = new THREE.OculusRiftEffect(renderer, { worldFactor: 39.7301 }); // number of units in 1 meter
        // effect.setSize( window.innerWidth, window.innerHeight );

        // $("#subscribers .remoteVideo video").css({ left: 0, top: 0, bottom: 0, width: "100%", height: "100%" });

        threeWindowResize = function () {
            if (camera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            }
            if (effect) {
                effect.setSize( window.innerWidth, window.innerHeight );
            }
            renderer.setSize( window.innerWidth, window.innerHeight );
        }
        threeWindowResize();

        // document.addEventListener("webkitfullscreenchange", onFullscreenChange, false);
        // document.addEventListener("mozfullscreenchange", onFullscreenChange, false);

        //     var vrBtn = document.getElementById("vrBtn");
        // if (vrBtn) {
        // 	vrMode = true;
        // 	vrBtn.addEventListener("click", function() {
        // 		if (renderer.domElement.webkitRequestFullscreen) {
        // 			renderer.domElement.webkitRequestFullscreen({ vrDisplay: hmdDevice });
        // 		} else if (renderer.domElement.mozRequestFullScreen) {
        // 			renderer.domElement.mozRequestFullScreen({ vrDisplay: hmdDevice });
        // 		}
        // 	}, false);
        // }

        byId("subscribers").appendChild(renderer.domElement);
        threeAnimate();
    }

    function onFullscreenChange() {
        if(!document.webkitFullscreenElement && !document.mozFullScreenElement) {
            vrMode = false;
        }
        threeWindowResize();
    }

    function threeAnimate() {
        if (camera) {
            requestAnimationFrame(threeAnimate);
        }
        if (stats) { stats.begin(); }
        threeRender();
        if (stats) { stats.end(); }
    }

    function threeRender() {
        if (videoObject) {
            var yPerc = Math.min(1.0, Math.max(-1.0, (((mouseY / window.innerHeight) * 2.0) - 1.0) * 1.5));
            var yPos = -47 + (6.0 * yPerc);
            videoObject.position.set(0, yPos, 0);
        }

        if (videoContext && videoTexture && videoElement && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
            videoContext.save();
            // videoContext.translate(1280, 0);
            // videoContext.scale(-1, 1);
            // videoContext.translate(0, 960);
            // videoContext.scale(1, -1);
            videoContext.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight, 0, 0, 1280, 960);
            videoContext.restore();
            videoTexture.needsUpdate = true;
        }

        // updateVRDevice();

        // if (vrMode) {
        // 	// Render left eye
        // 	renderer.enableScissorTest ( true );
        // 	renderer.setScissor( 0, 0, window.innerWidth / 2, window.innerHeight );
        // 	renderer.setViewport( 0, 0, window.innerWidth / 2, window.innerHeight );
        // 	renderer.render(scene, cameraLeft);
        //
        // 	// Render right eye
        // 	renderer.setScissor( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight );
        // 	renderer.setViewport( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight );
        // 	renderer.render(scene, cameraRight);
        // } else {
            // Render mono view
            // renderer.setScissorTest(false);
        if (renderer) {
            renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
            renderer.render(scene, camera);
        }
        // }
    }

    function bridgeOrientationUpdated(quatValues) {

        var bodyAxis = new THREE.Vector3(0, 1, 0);

        // make a quaternion for the the body angle rotated about the Y axis
        var bodyQuat = new THREE.Quaternion();
        bodyQuat.setFromAxisAngle(bodyAxis, bodyAngle);

        // make a quaternion for the current orientation of the Rift
        var riftQuat = new THREE.Quaternion(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

        // multiply the body rotation by the Rift rotation.
        bodyQuat.multiply(riftQuat);


        // Make a vector pointing along the Z axis and rotate it 
        // according to the combined look+body angle.
        var xzVector = new THREE.Vector3(0, 0, 1);
        xzVector.applyQuaternion(bodyQuat);

        // Compute the X/Z angle based on the combined look/body angle.
        viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;

        // Update the camera so it matches the current view orientation
        camera.quaternion.copy(bodyQuat);
    }

    function EnumerateVRDevices(devices) {
    // First find an HMD device
    for (var i = 0; i < devices.length; ++i) {
        if (devices[i] instanceof HMDVRDevice) {
        hmdDevice = devices[i];

        var eyeOffsetLeft = hmdDevice.getEyeTranslation("left");
        var eyeOffsetRight = hmdDevice.getEyeTranslation("right")
        // document.getElementById("leftTranslation").innerHTML = printVector(eyeOffsetLeft);
        // document.getElementById("rightTranslation").innerHTML = printVector(eyeOffsetRight);

        // cameraLeft.position.sub(eyeOffsetLeft);
        // cameraLeft.position.y -= .064;
        cameraLeft.position.z = 12;

        // cameraRight.position.sub(eyeOffsetRight);
        // cameraRight.position.y += .064;
        cameraRight.position.z = 12;

        resizeFOV(0.0);
        }
    }

    // Next find a sensor that matches the HMD hardwareUnitId
    for (var i = 0; i < devices.length; ++i) {
        if (devices[i] instanceof PositionSensorVRDevice &&
            (!hmdDevice || devices[i].hardwareUnitId == hmdDevice.hardwareUnitId)) {
        sensorDevice = devices[i];
        console.log(sensorDevice.hardwareUnitId);
        console.log(sensorDevice.deviceId);
        console.log(sensorDevice.deviceName);
        }
    }
    }

    function resizeFOV(amount) {
    var fovLeft, fovRight;

    if (!hmdDevice) { 
        return;
    }

    if (amount != 0 && 'setFieldOfView' in hmdDevice) {
        fovScale += amount;
        if (fovScale < 0.1) { fovScale = 0.1; }

        fovLeft = hmdDevice.getRecommendedEyeFieldOfView("left");
        fovRight = hmdDevice.getRecommendedEyeFieldOfView("right");

        fovLeft.upDegrees *= fovScale;
        fovLeft.downDegrees *= fovScale;
        fovLeft.leftDegrees *= fovScale;
        fovLeft.rightDegrees *= fovScale;

        fovRight.upDegrees *= fovScale;
        fovRight.downDegrees *= fovScale;
        fovRight.leftDegrees *= fovScale;
        fovRight.rightDegrees *= fovScale;

        hmdDevice.setFieldOfView(fovLeft, fovRight);
    }

    // if ('getRecommendedRenderTargetSize' in hmdDevice) {
        // var renderTargetSize = hmdDevice.getRecommendedRenderTargetSize();
        // document.getElementById("renderTarget").innerHTML = renderTargetSize.width + "x" + renderTargetSize.height;
    // }

    if ('getCurrentEyeFieldOfView' in hmdDevice) {
        fovLeft = hmdDevice.getCurrentEyeFieldOfView("left");
        fovRight = hmdDevice.getCurrentEyeFieldOfView("right");
    } else {
        fovLeft = hmdDevice.getRecommendedEyeFieldOfView("left");
        fovRight = hmdDevice.getRecommendedEyeFieldOfView("right");
    }

    cameraLeft.projectionMatrix = PerspectiveMatrixFromVRFieldOfView(fovLeft, 0.1, 1000);
    cameraRight.projectionMatrix = PerspectiveMatrixFromVRFieldOfView(fovRight, 0.1, 1000);
    }

    function PerspectiveMatrixFromVRFieldOfView(fov, zNear, zFar) {
    var outMat = new THREE.Matrix4();
    var out = outMat.elements;
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0);
    var downTan = Math.tan(fov.downDegrees * Math.PI/180.0);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0);

    var xScale = 2.0 / (leftTan + rightTan);
    var yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[4] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[12] = 0.0;

    out[1] = 0.0;
    out[5] = yScale;
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[13] = 0.0;

    out[2] = 0.0;
    out[6] = 0.0;
    out[10] = zFar / (zNear - zFar);
    out[14] = (zFar * zNear) / (zNear - zFar);

    out[3] = 0.0;
    out[7] = 0.0;
    out[11] = -1.0;
    out[15] = 0.0;

    return outMat;
    }

    function updateVRDevice() {
        if (!sensorDevice) return false;
        var vrState = sensorDevice.getState();

        cameraLeft.position.x = vrState.position.x * VR_POSITION_SCALE;
        cameraLeft.position.y = vrState.position.y * VR_POSITION_SCALE;
        cameraLeft.position.z = vrState.position.z * VR_POSITION_SCALE;
        cameraRight.position.x = vrState.position.x * VR_POSITION_SCALE;
        cameraRight.position.y = vrState.position.y * VR_POSITION_SCALE;
        cameraRight.position.z = vrState.position.z * VR_POSITION_SCALE;

        cameraLeft.position.y -= .032;
        cameraRight.position.y += .032;

        cameraLeft.quaternion.set(vrState.orientation.x, vrState.orientation.y, vrState.orientation.z, vrState.orientation.w);
        cameraRight.quaternion.set(vrState.orientation.x, vrState.orientation.y, vrState.orientation.z, vrState.orientation.w);

        return true;
    }

    function getScript(url,success){
        var script = document.createElement('script');
        script.src = url;
        var head = document.getElementsByTagName('head')[0], done=false;
        script.onload = script.onreadystatechange = function(){
            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done=true;
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    }

    function byId(id) {
        return document.getElementById(id);
    }

    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    };

    function radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    };

    function requestLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                
                console.log("Found location: ", position.coords);
                
                if (robots.length > 0) {
                    var robot = robots[0];
                    requestRoute(position.coords, { "latitude": robot.latitude, "longitude": robot.longitude });
                }
                
            }, function (err) {
                console.log("Error getting location: "+ err);
            });
        } else {
            console.log("Location not supported");
        }
    }

    function requestRoute(start, end) {
        var url = "https://router.project-osrm.org/viaroute?jsonp=?&z=10&loc="+ start.latitude +","+ start.longitude +"&loc="+ end.latitude +","+ end.longitude;
        $.ajax({
            dataType: "json",
            url: url,
            cache: true,
            success: function(result) {
                console.log("Got route: ", result);
                if (result && result.route_summary) {
                    var time = prettyTime(result.route_summary.total_time);
                    alert("The distance is "+ time);
                }
            }
        });
    }

    function prettyTime(seconds) {
        var hours   = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var seconds = seconds - (hours * 3600) - (minutes * 60);

        var str = "";
        if (hours > 0) {
            str += hours +" hours";
        }
        if (minutes > 0) {
            if (str != "") {
                str += ", ";
            }
            str += minutes +" minutes";
        }
        if (hours == 0 && minutes == 0) {
            str = "less than 1 minute";
        }

        return str;
    }

    function updateRobotsOnMap() {
        var hash = JSON.stringify(robotsList) +"-"+ publicRobotsSwitch;
        if (lastRobotsString != "" && lastRobotsString === hash) {
            // private robotsList is the same, so skipping
            return;
        } else {
            // robotsList is different, so updating
            lastRobotsString = hash;
        }

        robots = [];
        robotsPrivate = [];
        robotsPublic = [];

        if (robotsList.length > 0) {
            // for (var i = 0; i < robotsList.length; i++) {
            // 	if (robotsList[i].missingRobot == true && robotsList[i].status == kDRRobotStatusAway) {
            // 		// hide these
            // 	} else {
            // 		if (robotsList[i].public_key != null) {
            // 			robotsPublic.push(RobotWithSetup(robotsList[i].longitude, robotsList[i].latitude, robotsList[i]));
            // 		} else if (robotsList[i].public_key == null) {
            // 			robotsPrivate.push(RobotWithSetup(robotsList[i].longitude, robotsList[i].latitude, robotsList[i]));
            // 		}
            // 	}
            // }
            //
            // if (publicRobotsSwitch == 1) {
            // 	robots = robotsPublic;
            // } else {
            // 	robots = robotsPrivate;
            // }

            // add all robots, since we're getting rid of the private/public switch
            for (var i = 0; i < robotsList.length; i++) {
                robots.push(RobotWithSetup(robotsList[i].longitude, robotsList[i].latitude, robotsList[i]));
            }

            if (robots.length > 0) {
                map.calculateMarkers();
                if (shouldZoomAfterLoadingRobots) {
                    var locations = markerLayer.extent();
                    if (JSON.stringify(locations[0]["lat"]) == "null") {
                        // don't zoom, but let us zoom on the next one, if a robot appears
                        shouldZoomAfterLoadingRobots = true;
                    } else {
                        self.mapboxMap.setExtent(locations);

                        if (markerLayer.DRMarkersCount == 1) {
                            self.mapboxMap.zoomBy(2);
                            var extent = self.mapboxMap.getExtent();
                            var height = extent.north - extent.south;
                            var width = extent.west - extent.east;
                            var newNorth = extent.north + height/4;
                            var widthDivisor = (isChromeAndroid()) ? 1 : 4;
                            var newWest = extent.west + width/widthDivisor;
                            self.mapboxMap.setExtent(new MM.Extent(newNorth, newWest, extent.south + height/4, extent.east + width/4));
                            shouldZoomAfterLoadingRobots = false;
                        }
                    }

                    updateZoomers();
                    map.calculateMarkers();
                }

                hideNoRobotsConnectedMessage();
            } else {
                map.removeAllMarkers();
                showNoRobotsConnectedMessage();
            }
        } else {
            map.removeAllMarkers();
            showNoRobotsConnectedMessage();
        }
    }

    function showMessage(id) {
        $("#"+ id +" .shade").hide();
        $("#"+ id +" .message").css({ top: "-500px" });
        $("#"+ id).show();
        $("#"+ id +" .shade").fadeIn(200);
        $("#"+ id +" .message").animate({ top: "120px" }, 200);
    }

    function hideMessage(id) {
        $("#"+ id +" .shade").fadeOut(200);
        $("#"+ id +" .message").animate({ top: "-500px" }, 200, function () {
            $("#"+ id).hide();
        });
    }

    function showPrivateRobots() {
        publicRobotsSwitch = 0;
        shouldZoomAfterLoadingRobots = true;
        $("#segmentedPrivate").addClass("selected");
        $("#segmentedPublic").removeClass("selected");
        window.location.hash = "#private";
    }

    function showPublicRobots() {
        publicRobotsSwitch = 1;
        shouldZoomAfterLoadingRobots = true;
        $("#segmentedPrivate").removeClass("selected");
        $("#segmentedPublic").addClass("selected");
        window.location.hash = "#public";
    }

    function showWebPageDialog() {
        if (showingWebPage) {
            hideWebPage();
            return;
        }
        showMessage("showWebPage");
        $('#showWebPageURL').focus();
    }

    function toggleDisplayWebPage() {
        if (showingWebPage) {
            hideWebPage();
        } else {
            showWebPageDialog();
        }
    }

    function showWebPage() {
        opentokStopScreenSharing();

        var URL = $("#showWebPageURL").val();
        URL = (URL.indexOf('://') == -1) ? 'http://' + URL : URL;
        sendCommandWithData(kDRCommandWebURLShow, { "URL": URL });
        $("#showWebPage").hide();
        $("#displayWebPageButton").addClass("on");
        $("#displayWebPageContainer").show();
        showingWebPage = true;
    }

    function hideWebPage() {
        sendCommandWithData(kDRCommandWebURLHide);
        $("#displayWebPageButton").removeClass("on");
        $("#displayWebPageContainer").hide();
        showingWebPage = false;
    }

    function showSettings() {
        showMessage('settings');
        currentUser.getData(function () {
            if (configuration && configuration.data && configuration.data.company && configuration.data.company.name) {
                $("#accountOrganization").html(configuration.data.company.name);
            } else {
                $("#accountOrganization").html("(None)");
            }
            $("#accountEmail").html(currentUser.email);
        });
    }

    function installScreenSharingExtension() {
        if (getURLParameter("domain")) {
            // we can't do inline install when in an HTML frame
            window.open("https://chrome.google.com/webstore/detail/double-screen-sharing/pkciafnjgfphlemjdjldkcibniakgmmh");
        } else {
            // inline install
            chrome.webstore.install(undefined, function () {
                window.location.reload();
            }, function(err) {
                console.log(err);
            });
        }
    }

    function isChromeAndroid() {
        return (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0 && navigator.userAgent.toLowerCase().indexOf("android") >= 0);
    }

    function isIE() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        var appName = window.navigator.appName;
        return (appName === 'Microsoft Internet Explorer' ||                     		// IE <= 10
            (appName === 'Netscape' && userAgent.indexOf('trident') > -1) );     // IE >= 11
    };

    function toggleMultiparty() {
        if (sessionIsMultipartyHost) {
            endMultiparty();
        } else {
            showMultiparty();
        }
        updateUserInterface();
    }

    function showMultiparty() {
        $("#multipartyStep1").show();
        $("#multipartyStep2").hide();
        $("#multipartyStep3").hide();
        showMessage("multipartyMessage");
    }

    function beginMultiparty() {
        $("#multipartyStep1").hide();
        $("#multipartyStep2").show();
        $("#multipartyStep3").hide();
        showMessage("multipartyMessage");
        $("#multipartyAudioLevels").show();
        $("#multipartyAudioLevels .heading a").show();
        resetVideoLink(true);
    }

    function showMultipartyLink(link) {
        $("#multipartyLink").val(link);
        $("#multipartyStep1").hide();
        $("#multipartyStep2").hide();
        $("#multipartyStep3").show();
        $("#multipartyLink").focus();
    }

    function endMultiparty() {
        $("#multipartyStep1").hide();
        $("#multipartyStep2").hide();
        $("#multipartyStep3").hide();
        hideMessage("multipartyMessage");
        $("#multipartyAudioLevels .viewer").hide();
        $("#multipartyAudioLevels").hide();
        sessionIsMultipartyHost = false;
        multipartyLink = null;
        multipartyViewers = [];
        resetVideoLink();
    }

    function printTranslationTemplate() {
        var strings = {};
        $("[data-translate]").each(function () {
            strings[$(this).attr("data-translate")] = "";
        });
        strings = sortObject(strings);
        console.log(JSON.stringify(strings, undefined, 2));
    }

    function sortObject(o) {
        var sorted = {},
        key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        a.sort();

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }

        return sorted;
    }

    function promptToJoinMultipartySession() {
        console.log("join = "+ getURLParameter("join"));
        showMessage("joinMultiparty");
        $("#joinMultipartyName").focus();
    }

    function joinMultipartySession(key, name) {
        hideMessage('joinMultiparty');

        window.setTimeout(function () {
            sessionIsViewer = true;
            multipartyViewerId = makeInstallationId();
            multipartyViewerName = name;
            beginSession();
            $("#multipartyAudioLevels").show();
            $("#multipartyAudioLevels .heading a").hide();
            sendCommandWithData(kDRCommandJoinSession, { "key" : key, "viewerId": multipartyViewerId });
        }, 500);
    }

    function promptToWatchBroadcast() {
        console.log("watch = "+ getURLParameter("watch"));
        showMessage("watchBroadcast");
        $("#watchBroadcastButton").focus();
    }

    function addViewer(viewerId, name) {
        var viewer = {
            viewerId: viewerId,
            name: name
        };

        var foundViewer = false;
        for (var i = 0; i < multipartyViewers.length; i++) {
            var v = multipartyViewers[i];
            if (v && v.viewerId && v.viewerId == viewerId) {
                foundViewer = true;
            }
        }

        if (!foundViewer) {
            multipartyViewers.push(viewer);
        }

        $("#multipartyAudioLevels").append("<div id=\"multiparty_"+ sanitizedString(viewerId) +"\" class=\"viewer\"><div class=\"name\">"+ sanitizedString(name) +"</div><div class=\"audioLevel\"><div class=\"bar\"></div></div></div>");
        broadcastMultipartyViewersList();
    }

    function attachAudioToViewer(viewerId, streamId) {
        for (var i = 0; i < multipartyViewers.length; i++) {
            var v = multipartyViewers[i];
            if (v && v.viewerId && v.viewerId == viewerId) {
                multipartyViewers[i].streamId = streamId;
            }
        }
        $("#multiparty_"+ sanitizedString(viewerId) +" .audioLevel").attr("id", "stream_"+ sanitizedString(streamId));
        broadcastMultipartyViewersList();
    }

    function removeViewer(viewerId) {
        $("#multiparty_"+ sanitizedString(viewerId)).remove();
    }

    function removeViewerByStreamId(streamId) {
        $("#stream_"+ streamId).parent().remove();
    }

    function copyMultipartyLink() {
        prompt("Copy and send this link to your guests:", multipartyLink);
    }

    function broadcastMultipartyViewersList() {
        if (sessionIsMultipartyHost) {
            sendCommandWithData(kDRCommandMultipartyViewers, { viewers: multipartyViewers });
        }
    }

    function redrawMultipartyViewers() {
        $("#multipartyAudioLevels .viewer").remove();
        
        for (var i = 0; i < multipartyViewers.length; i++) {
            var v = multipartyViewers[i];
            if (v && v.viewerId) {
                addViewer(v.viewerId, v.name);
                if (v.streamId) {
                    attachAudioToViewer(v.viewerId, v.streamId);
                }
            }
        }
    }

    function sanitizedString(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    function setRelayServer(server) {
        if (server && server.length > 5) {
            sendCommandWithData(kDRCommandSetRelayServer, { server: server });
            relaySocket = io.connect(server, { secure: ('https:' == document.location.protocol), forceNew: true, 'force new connection': true, reconnect: false, reconnection: false });
            
            relaySocket.on('disconnect', function(){
                if (relaySocket != undefined) {
                    relaySocket.reconnect();
                }
            });

            console.log("Connecting to relay server: "+ server);
        }
    }

    function clearRelayServer() {
        sendCommand(kDRCommandSetRelayServer);
        if (relaySocket) {
            var temp = relaySocket;
            relaySocket = undefined;
            temp.disconnect();
            temp = undefined;
        }
    }

    function updateStats() {
        var subscriberSize;
        if (opentokSubscriber) {
            // opentokSubscriber.getStats(function (error, stats) {
            // 	console.log("Video packets lost: "+ stats.video.packetsLost);
            // });
            subscriberSize = opentokSubscriber.stream.videoDimensions;
        }
        
        var out = "";
        if (subscriberSize) {
            out += subscriberSize.width +" x "+ subscriberSize.height;
        }
        $("#qualityStats p").html(out);
    }

    function toggleQualityStats() {
        if ($("#qualityStats").is(":visible")) {
            $("#qualityStats").hide();
        } else {
            $("#qualityStats").show();
        }
    }
}]);
