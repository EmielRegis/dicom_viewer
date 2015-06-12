var imageObj, zoomCallback;
function fillCanvas(canvas, url, scale, translat) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.canvas.width = $('.main-content').width();
    ctx.canvas.height = parseInt(window.innerHeight) - 130;
    if (!scale) scale = 1;
    imageObj = new Image();
    imageObj.onload = function () {
        var width = imageObj.naturalWidth;
        var height = imageObj.naturalHeight;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        if (translat) {
            console.log(translat);  
            ctx.translate(translat.x, translat.y);
        }
        ctx.drawImage(imageObj, -width / 2, -height / 2);
    };
    imageObj.src = '/Dicom/GetImage/' + url;

}
function loadMainContent(url) {
    reqUrl = '/Dicom/Image/' + url;
    $.ajax({
        url: reqUrl, success: function (result) {
            $(".main-content").empty();
            $(".main-content").append(result);
            canvas = reFillCanvasAfterAjax(url);
            enableZoom(canvas, url);
        }
    });
}
function reFillCanvasAfterAjax(url) {
    canvas = document.getElementById("canvas");
    fillCanvas(canvas, url);
    return canvas;
}

function changeZoom(canvas, url, zoom, translation) {
    fillCanvas(canvas, url, zoom, translation);

}

function enableZoom(canvas, url) {
    var zoom = 1; translation = {};
    translation.x = 0;
    translation.y = 0;
    $('input.zoom-change').on('click', function () {
        if ($(this).hasClass('zoom-in')) {
            zoom += 0.25;
        } else {
            if (zoom > 0.25) zoom -= 0.25;
        }
        if (canvas && url) {
            changeZoom(canvas, url, zoom, translation);
        }

    });
    $('canvas').bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            zoom += 0.25;
        }
        else {
            if (zoom > 0.25) zoom -= 0.25;
        }
        if (canvas && url) {
            changeZoom(canvas, url, zoom, translation);
        }
    });

    $('input.up').on('click', function () {
        translation.y += 5;
        if (canvas && url) {
            changeZoom(canvas, url, zoom, translation);
        }
    });

    $('input.down').on('click', function () {
        translation.y -= 5;
        if (canvas && url) {
            changeZoom(canvas, url, zoom, translation);
        }
    });

    $('input.left').on('click', function () {
        translation.x += 5;
        if (canvas && url) {
            changeZoom(canvas, url, zoom, translation);
        }
    });

    $('input.right').on('click', function () {
        translation.x -= 5;
        if (canvas && url) {
            changeZoom(canvas, url, zoom, translation);
        }
    });
}

function unbindZoomCallback() {
    $('input.zoom-change').unbind('click');
    $('canvas').unbind("mousewheel");
    $('input.up').unbind('click');
    $('input.down').unbind('click');
    $('input.left').unbind('click');
    $('input.right').unbind('click');
}

function redrawCanvas(canvas, url) {
    unbindZoomCallback();
    fillCanvas(canvas, url);
    enableZoom(canvas, url);
}