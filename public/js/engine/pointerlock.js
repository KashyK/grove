var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var hud = document.getElementById('hud');

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function (event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

            controls.enabled = true;

            blocker.style.display = 'none';

            hud.style.display = '';

        }
        else {

            controls.enabled = false;

            hud.style.display = 'none';

            $('#pause').modal('open');

            // blocker.style.display = '-webkit-box';
            // blocker.style.display = '-moz-box';
            // blocker.style.display = 'box';

            // instructions.style.display = '';

        }

    }

    var pointerlockerror = function (event) {
        instructions.style.display = '';
    }

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    function click(event) {

        toggleFullScreen();

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if (/Firefox/i.test(navigator.userAgent)) {

            var fullscreenchange = function (event) {

                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                    document.removeEventListener('fullscreenchange', fullscreenchange);
                    document.removeEventListener('mozfullscreenchange', fullscreenchange);

                    element.requestPointerLock();
                }

            }

            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        }
        else {

            element.requestPointerLock();

        }

    }

    document.body.addEventListener('click', click, false);

}
else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API. Please open in chrome';

}

function toggleFullScreen() {
    var i = document.body;
    // go full-screen
    if (i.requestFullscreen) {
        i.requestFullscreen();
    }
    else if (i.webkitRequestFullscreen) {
        i.webkitRequestFullscreen();
    }
    else if (i.mozRequestFullScreen) {
        i.mozRequestFullScreen();
    }
    else if (i.msRequestFullscreen) {
        i.msRequestFullscreen();
    }
}