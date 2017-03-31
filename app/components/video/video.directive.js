var videoComponent = angular.module('VideoComponent', []);

videoComponent.directive('videoComponent', function () {
    return {
        restrict: 'AE',
        scope: { url: '=' },
        templateUrl: 'components/video/video.html',
        controller: videoController,
        controllerAs: 'video'
    }
});

function videoController($scope, $rootScope, $timeout, $http) {
    var _self = this;

    var connectionType = $rootScope.connectionType;
    var webRTCHost = $rootScope.webRTCHost;
    var port = $rootScope.webRTCPort;
    var socket = io(connectionType+'://'+webRTCHost+':'+port); /* BOYD IP: 10.162.161.103*/ /*NOSI IP: 10.143.8.155 */

    var localStream;
    var pc;
    var offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
    };
    var remoteCandidates = [];
    var peerConnectionDidCreate = false;
    var candidateDidReceived = false;
    var ruid;
    var luid;

    var startTime;
    var localVideo = document.getElementById('localVideo');
    var remoteVideo = document.getElementById('remoteVideo');

    var uuid = guid();

    _self.usersList = [];

    init();

    function init() {
        _self.title = "Live Feed";

        _self.showYourNameDiv = true;
        _self.showUserListDiv = false;
//        _self.showVideoDiv = false;
        $("#videoPage").hide();
        _self.hideNoiseImage = false;

//        __setDivHeight();
//        $(window).resize(function() {
//            __setDivHeight();
//        });

        socket.on('register succeed', function(msg){
          _self.socket = socket;
          console.log("_self.socket", _self.socket);
          Cookies.set('uuid', uuid);
        });

        socket.on('new user', function(data){
            if(_self.showUserListDiv == true){
                _self.usersList.push(data);
                $scope.$apply();
            }
        });

        socket.on('user leave', function(data){
            if(_self.showUserListDiv == true){
                for(var i=0; i<_self.usersList.length; i++){
                    if(_self.usersList[i].name == data.name){
                        _self.usersList.splice(i, 1);
                    }
                }
            }
        });

        socket.on('chat message', function(data){
            //dispatch signal messages to corresponding functions, ie ,
            //onRemoteOffer/ onRemoteAnswer/onRemoteIceCandidate
            //IS this message to me ?
            if(data.to != uuid){
                return;
            }
            //
            if(data.type == 'signal'){
                onSignalMessage(data);
            }else if(data.type == 'text'){
                console.log('received text message from ' + data.from + ', content: ' + data.content);
            }else{
                console.log('received unknown message type ' + data.type + ' from ' + data.from);
            }
        });

        socket.on('connect', function(){
        });

        _self.getUserName = function(userName){
            console.log("userName", userName);
            __register(userName);

            $timeout(function(){

                // Simple GET request example:
                $http({
                  method: 'GET',
                  url: 'http://'+webRTCHost+':'+port+'/listUsers?paramOne=1&paramX=abc'
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
//                    angular.forEach(response.data, function(v, k){
//                        _self.usersList.push(v);
//                    });
                    _self.usersList = response.data;
                    console.log('listUsers: ', _self.usersList);
                    _self.showYourNameDiv = false;
                    _self.showUserListDiv = true;
//                    _self.showVideoDiv = false;
                    $("#videoPage").hide();
                }, function errorCallback(response) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                  console.log("error", response);
                });
            }, 1000);
        }

        _self.getUserId = function(uid){
            if(uid == uuid){return;}
            console.log('click user ' + uid);
            _self.remoteUUID = uid;
            Cookies.set('remoteUUID', uid);
            startVideo();
            $timeout(function(){
                console.log('video page did show');
                console.log('local: ' + uuid);
                luid = Cookies.get('uuid');
                console.log('local in cookie: ' + luid);
                ruid = Cookies.get('remoteUUID');
                console.log('remote ' + ruid);
                start();
            }, 1000);
        }

        _self.getUserName("Supervisor");
    }

    _self.back = function(){
//        _self.showYourNameDiv = true;
//        _self.showUserListDiv = false;
////        _self.showVideoDiv = false;
//        $("#videoPage").hide();
        window.location.reload();
    }

    function __setDivHeight(){
        $timeout(function(){
            var divWidth = $rootScope.videoDivWidth;
            var divHeight = $rootScope.videoDivHeight;

            _self.videoWrapperId = {
                 'height': 'auto',
                 'width': divWidth+'px'
            }
            console.log("_self.videoWrapperId", _self.videoWrapperId);
        }, 1000);
    }

    function start() {
        _self.showYourNameDiv = false;
        _self.showUserListDiv = false;
//        _self.showVideoDiv = true;
        $("#videoPage").show();
        console.log('start');
        trace('Requesting local stream');
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        .then(gotStream)
        .catch(function(e) {
            alert('getUserMedia() error: ' + e.name);
        });
    }
    function startVideo(){
        isCaller = true;
    }

    function gotStream(stream) {
        trace('Received local stream');
        localVideo.srcObject = stream;
        localStream = stream;
        localVideo.addEventListener('loadedmetadata', function() {
            trace('Local video videoWidth: ' + this.videoWidth +
            'px,  videoHeight: ' + this.videoHeight + 'px');
        });


        call();
    }

    function call() {
        trace('Starting call');
        startTime = window.performance.now();
        var videoTracks = localStream.getVideoTracks();
        var audioTracks = localStream.getAudioTracks();
        if (videoTracks.length > 0) {
            trace('Using video device: ' + videoTracks[0].label);
        }

        if (audioTracks.length > 0) {
            trace('Using audio device: ' + audioTracks[0].label);
        }

//        var configuration = { "iceServers": [{ "urls": "stun:stun.ideasip.com" }] };
        var configuration = { "iceServers": [{ "urls": "stun:127.0.0.1" }] };
        pc = new RTCPeerConnection(configuration);
        trace('Created local peer connection object pc');

        pc.onicecandidate = function(e) {
            onIceCandidate(pc, e);
        };

        pc.oniceconnectionstatechange = function(e) {
            onIceStateChange(pc, e);
        };

        pc.onaddstream = gotRemoteStream;

        pc.addStream(localStream);
        trace('Added local stream to pc');

        peerConnectionDidCreate = true;

        if(isCaller){
            trace(' createOffer start');
            pc.createOffer(
                offerOptions
            ).then(
                onCreateOfferSuccess,
                onCreateSessionDescriptionError
            );
        }else{
            onAnswer();
        }
    }

    function onIceStateChange(pc, event) {
        if (pc) {
            trace( ' ICE state: ' + pc.iceConnectionState);
            console.log('ICE state change event: ', event);
        }
    }

    function onIceCandidate(pc, event) {
        if (event.candidate) {
            trace( ' ICE candidate: \n' + event.candidate.candidate);

            //Send candidate to remote side
            var message = {from: luid, to:ruid, type: 'signal', subtype: 'candidate', content: event.candidate, time:new Date()};
            socket.emit('chat message', message);
        }
    }

    function gotRemoteStream(e) {
        remoteVideo.srcObject = e.stream;
        remoteVideo.addEventListener('loadedmetadata', function() {
            trace('Remote video videoWidth: ' + this.videoWidth +
            'px,  videoHeight: ' + this.videoHeight + 'px');
        });

        remoteVideo.onresize = function() {
            trace('Remote video size changed to ' +
            remoteVideo.videoWidth + 'x' + remoteVideo.videoHeight);
            // We'll use the first onsize callback as an indication that video has started
            // playing out.
            if (startTime) {
                var elapsedTime = window.performance.now() - startTime;
                trace('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
                startTime = null;
            }
        };
        trace('pc received remote stream');
    }

    function onCreateSessionDescriptionError(error) {
        trace('Failed to create session description: ' + error.toString());
    }

    function onCreateOfferSuccess(desc) {
        trace('Offer from pc\n' + desc.sdp);
        trace('pc setLocalDescription start');
        pc.setLocalDescription(desc).then(
        function() {
            onSetLocalSuccess(pc);
        },
            onSetSessionDescriptionError
        );

        //Send offer to remote side
        var message = {from: luid, to:ruid, type: 'signal', subtype: 'offer', content: desc, time:new Date()};
        socket.emit('chat message', message);
    }

    function onSetLocalSuccess(pc) {
        trace(' setLocalDescription complete');
    }

    function onSetSessionDescriptionError(error) {
        trace('Failed to set session description: ' + error.toString());
    }

    function onAnswer(){
        var remoteOffer = Cookies.getJSON('offer');

        pc.setRemoteDescription(remoteOffer).then(function(){onSetRemoteSuccess(pc)}, onSetSessionDescriptionError);

        pc.createAnswer().then(
            onCreateAnswerSuccess,
            onCreateSessionDescriptionError
        );
    }

    function onSetRemoteSuccess(pc) {
        trace(' setRemoteDescription complete');
        applyRemoteCandidates();
    }

    function applyRemoteCandidates(){
        var candidates = Cookies.getJSON('candidate');
        for(var candidate in candidates){
            addRemoteCandidate(candidates[candidate]);
        }
        Cookies.remove('candidate');
    }

    function onCreateAnswerSuccess(desc) {
        trace('onCreateAnswerSuccess');
        pc.setLocalDescription(desc).then(
        function() {
            onSetLocalSuccess(pc);
        },
            onSetSessionDescriptionError
        );

        //Sent answer to remote side
        var message = {from: luid, to:ruid, type: 'signal', subtype: 'answer', content: desc, time:new Date()};
        socket.emit('chat message', message);
    }

    function onSetLocalSuccess(pc) {
        trace(' setLocalDescription complete');
    }

    function onSignalMessage(m){
        if(m.subtype == 'offer'){
            console.log('got remote offer from ' + m.from + ', content ' + m.content);
            Cookies.set('remoteUUID', m.from);
            onSignalOffer(m.content);
        }else if(m.subtype == 'answer'){
            onSignalAnswer(m.content);
        }else if(m.subtype == 'candidate'){
            onSignalCandidate(m.content);
        }else if(m.subtype == 'close'){
            onSignalClose();
        }else{
            console.log('unknown signal type ' + m.subtype);
        }
    }

    function onSignalOffer(offer){
        Cookies.set('offer', offer);
        answerCall();
    }

    function onSignalAnswer(answer){
        onRemoteAnswer(answer);
    }

    function onRemoteAnswer(answer){
        trace('onRemoteAnswer : ' + answer);
        pc.setRemoteDescription(answer).then(function(){onSetRemoteSuccess(pc)}, onSetSessionDescriptionError);
    }

    function onSignalCandidate(candidate){
        onRemoteIceCandidate(candidate);
    }

    function onRemoteIceCandidate(candidate){
        trace('onRemoteIceCandidate : ' + candidate);
        if(peerConnectionDidCreate){
            addRemoteCandidate(candidate);
        }else{
            //remoteCandidates.push(candidate);
            var candidates = Cookies.getJSON('candidate');
            if(candidateDidReceived){
                candidates.push(candidate);
            }else{
                candidates = [candidate];
                candidateDidReceived = true;
            }
            Cookies.set('candidate', candidates);
        }
    }

    function addRemoteCandidate(candidate){
        pc.addIceCandidate(candidate).then(
            function() {
                onAddIceCandidateSuccess(pc);
            },
            function(err) {
                onAddIceCandidateError(pc, err);
            });
    }

    function onAddIceCandidateSuccess(pc) {
        trace( ' addIceCandidate success');
    }

    function onAddIceCandidateError(pc, error) {
        trace( ' failed to add ICE Candidate: ' + error.toString());
    }

    function onSignalClose(){
        trace('Call end ');
        pc.close();
        pc = null;

        closeMedia();
        clearView();
        location.href = '#listPage';
    }

    function answerCall(){
        var str = "Robot";
        $timeout(function(){
            angular.forEach(_self.usersList, function(v, k){
            _self.hideNoiseImage = true;
                if((v.name).toLowerCase() == str.toLowerCase()){
                    _self.hideNoiseImage = true;
                } else {
                    console.log("user is not in our list");
                }
            });
            if(_self.hideNoiseImage == true){
                isCaller = false;
                console.log('video page did show');
                console.log('local: ' + uuid);
                luid = Cookies.get('uuid');
                console.log('local in cookie: ' + luid);
                ruid = Cookies.get('remoteUUID');
                console.log('remote ' + ruid);
                start();
                $timeout(function(){
                    _self.showYourNameDiv = false;
                    _self.showUserListDiv = false;
                }, 500);
            }
//                    isCaller = false;
//                    console.log('video page did show');
//                    console.log('local: ' + uuid);
//                    luid = Cookies.get('uuid');
//                    console.log('local in cookie: ' + luid);
//                    ruid = Cookies.get('remoteUUID');
//                    console.log('remote ' + ruid);
//                    start();
//                    $timeout(function(){
//                        _self.showYourNameDiv = false;
//                        _self.showUserListDiv = false;
//                    }, 500);
        }, 1000);

    }

    function hangup() {
      trace('Hangup call');
      pc.close();
      pc = null;

      closeMedia();
      clearView();

      //Send candidate to remote side
        var message = {from: luid, to:ruid, type: 'signal', subtype: 'close', content: 'close', time:new Date()};
        socket.emit('chat message', message);
    }

    function closeMedia(){
        localStream.getTracks().forEach(function(track){track.stop();});
    }

    function clearView(){
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
    }

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    function __register(userName){
        var info = {name: userName, uuid: uuid};
        socket.emit('register', info);
    }

    function trace(arg) {
        var now = (window.performance.now() / 1000).toFixed(3);
        console.log(now + ': ', arg);
    }

    function hangup() {
        trace('Hangup call');
        pc.close();
        pc = null;

        closeMedia();
        clearView();

        //Send candidate to remote side
        var message = {from: luid, to:ruid, type: 'signal', subtype: 'close', content: 'close', time:new Date()};
        socket.emit('chat message', message);
    }

    _self.callHangupFn = function(){
//        socket.on('disconnect', function(){
//        });
        $timeout(function(){
            hangup();
            _self.hideNoiseImage = false;
            $("#videoPage").hide();
        },100);
    }

    $("#videoBackButton").click(function(){
//        _self.showYourNameDiv = false;
//        _self.showUserListDiv = true;
////        _self.showVideoDiv = false;
//        $("#videoPage").hide();
//        $scope.apply();
//
        window.location.reload();
    });

//    $("#remoteVideo").click(function(){
//        var elem = document.getElementById("remoteVideo");
//        if (elem.requestFullscreen) {
//          elem.requestFullscreen();
//        } else if (elem.mozRequestFullScreen) {
//          elem.mozRequestFullScreen();
//        } else if (elem.webkitRequestFullscreen) {
//          elem.webkitRequestFullscreen();
//        }
//    });
}