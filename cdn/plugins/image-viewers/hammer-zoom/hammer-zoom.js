var element = document.getElementById('drag')
var hammertime = new Hammer(element, {});

hammertime.get('pinch').set({ enable: true });
hammertime.get('pan').set({ threshold: 0 });

var pinchZoomOrigin = undefined;
var fixHammerjsDeltaIssue = undefined;
var pinchStart = { x: undefined, y: undefined }
var lastEvent = undefined;

var originalSize = { width: 328, height: 328 }
var current = { x: 0, y: 0, z: 1, zooming: false, width: originalSize.width * 1, height: originalSize.height * 1, }
var last = { x: current.x, y: current.y, z: current.z }

function getRelativePosition(element, point, originalSize, scale)
{
    var domCoords = getCoords(element);

    var elementX = point.x - domCoords.x;
    var elementY = point.y - domCoords.y;

    var relativeX = elementX / (originalSize.width * scale / 2) - 1;
    var relativeY = elementY / (originalSize.height * scale / 2) - 1;
    return { x: relativeX, y: relativeY }
}

function getCoords(elem)
{
    // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { x: Math.round(left), y: Math.round(top) };
}

function scaleFrom(zoomOrigin, currentScale, newScale)
{
    var currentShift = getCoordinateShiftDueToScale(originalSize, currentScale);
    var newShift = getCoordinateShiftDueToScale(originalSize, newScale)

    var zoomDistance = newScale - currentScale

    var shift = {
        x: currentShift.x - newShift.x,
        y: currentShift.y - newShift.y,
    }

    var output = {
        x: zoomOrigin.x * shift.x,
        y: zoomOrigin.y * shift.y,
        z: zoomDistance
    }
    return output
}

function getCoordinateShiftDueToScale(size, scale)
{
    var newWidth = scale * size.width;
    var newHeight = scale * size.height;
    var dx = (newWidth - size.width) / 2
    var dy = (newHeight - size.height) / 2
    return {
        x: dx,
        y: dy
    }
}

hammertime.on('doubletap', function (e)
{
    var scaleFactor = 1;
    if (current.zooming === false)
    {
        current.zooming = true;
    } else
    {
        current.zooming = false;
        scaleFactor = -scaleFactor;
    }

    element.style.transition = "0.3s";
    setTimeout(function ()
    {
        element.style.transition = "none";
    }, 300)

    var zoomOrigin = getRelativePosition(element, { x: e.center.x, y: e.center.y }, originalSize, current.z);
    var d = scaleFrom(zoomOrigin, current.z, current.z + scaleFactor)
    current.x += d.x;
    current.y += d.y;
    current.z += d.z;

    last.x = current.x;
    last.y = current.y;
    last.z = current.z;

    update();
})

hammertime.on('pan', function (e)
{
    if (lastEvent !== 'pan')
    {
        fixHammerjsDeltaIssue = {
            x: e.deltaX,
            y: e.deltaY
        }
    }

    current.x = last.x + e.deltaX - fixHammerjsDeltaIssue.x;
    current.y = last.y + e.deltaY - fixHammerjsDeltaIssue.y;
    lastEvent = 'pan';
    update();
})

hammertime.on('pinch', function (e)
{
    var d = scaleFrom(pinchZoomOrigin, last.z, last.z * e.scale)
    current.x = d.x + last.x + e.deltaX;
    current.y = d.y + last.y + e.deltaY;
    current.z = d.z + last.z;
    lastEvent = 'pinch';
    update();
})

hammertime.on('pinchstart', function (e)
{
    pinchStart.x = e.center.x;
    pinchStart.y = e.center.y;
    pinchZoomOrigin = getRelativePosition(element, { x: pinchStart.x, y: pinchStart.y }, originalSize, current.z);
    lastEvent = 'pinchstart';
})

hammertime.on('panend', function (e)
{
    last.x = current.x;
    last.y = current.y;
    lastEvent = 'panend';
})

hammertime.on('pinchend', function (e)
{
    last.x = current.x;
    last.y = current.y;
    last.z = current.z;
    lastEvent = 'pinchend';
})

function update()
{
    current.height = originalSize.height * current.z;
    current.width = originalSize.width * current.z;
    element.style.transform = "translate3d(" + current.x + "px, " + current.y + "px, 0) scale(" + current.z + ")";
}