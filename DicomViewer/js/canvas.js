var imageObj, zoomCallback;
function fillCanvas(url, pos) {
    var wid = $('.main-content').width();
    if (pos) {
        wid = Math.floor(wid / 2) - 2;
    }
    else {
        $('.canvas-container.canvas-right').addClass('hidden');
        $('.canvas-container.canvas-left').removeClass('hidden');
    }
    var canvasL = document.getElementById('canvas');
    var canvasR = document.getElementById('canvas-right');
    var ctxR = canvasR.getContext("2d");
    var ctx = canvasL.getContext("2d");
    ctx.clearRect(0, 0, canvasL.width, canvasL.height);
   
    
    ctx.canvas.width = wid;
    ctx.canvas.height = parseInt(window.innerHeight) - 130;
    imageObj = new Image();
    imageObj.onload = function () {
        var width = imageObj.naturalWidth;
        var height = imageObj.naturalHeight;
        ctx.translate(canvasL.width / 2, canvasL.height / 2);
        ctx.drawImage(imageObj, -width / 2, -height / 2);
    };
    imageObj.src = '/Dicom/GetImage/' + url;

}
function fillRightCanvas(url) {
    var canvasL = document.getElementById('canvas');
    var canvasR = document.getElementById('canvas-right');
    if (canvasL.width > ($('.main-content').width()) / 2) {
        var ctxL = canvasL.getContext("2d");
        ctxL.clearRect(0, 0, canvasL.width, canvasL.height);
        ctxL.canvas.width = Math.floor($('.main-content').width() / 2) - 2;
    }
    var ctx = canvasR.getContext("2d");
    ctx.canvas.width = Math.floor($('.main-content').width() / 2) - 2;
    ctx.canvas.height = parseInt(window.innerHeight) - 130;
    var scale, translat;
    if (!scale) scale = 1;
    imageObj = new Image();
    imageObj.onload = function () {
        var width = imageObj.naturalWidth;
        var height = imageObj.naturalHeight;
        ctx.translate(canvasL.width / 2, canvasL.height / 2);
        ctx.scale(scale, scale);
        if (translat) {
            ctx.translate(translat.x, translat.y);
        }
        ctx.drawImage(imageObj, -width / 2, -height / 2);
    };
    imageObj.src = '/Dicom/GetImage/' + url;
    $('.canvas-container.canvas-right').toggleClass('hidden');
}

function changeZoomAndTranslat(left, translat, scale, url) {
    console.log('change');
    var canvas;
    if (left) {
        canvas = document.getElementById('canvas');
    } else {
       canvas = document.getElementById('canvas-right');
    }
    var ctx = canvas.getContext("2d");
    canvas.width = canvas.width;
    imageObj = new Image();
    imageObj.onload = function () {
        var width = imageObj.naturalWidth;
        var height = imageObj.naturalHeight;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if(scale) ctx.scale(scale, scale);
        if (translat) {
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
            reFillCanvasAfterAjax(url);
            enableZoom(url);
        }
    });
}
function reFillCanvasAfterAjax(url) {
    fillCanvas(url);
}

function enableZoom(url) {
    var zoom = 1; translation = {};
    translation.x = 0;
    translation.y = 0;
    $('input.zoom-change').on('click', function () {
        if ($(this).hasClass('zoom-in')) {
            zoom += 0.25;
        } else {
            if (zoom > 0.25) zoom -= 0.25;
        }
        if (url) {
            changeZoomAndTranslat(true, translation, zoom, url);
        }

    });
    $('#canvas').bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            zoom += 0.25;
        }
        else {
            if (zoom > 0.25) zoom -= 0.25;
        }
        if (url) {
            changeZoomAndTranslat(true, translation, zoom, url);
        }
    });

    $('#canvas-right').bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            zoom += 0.25;
        }
        else {
            if (zoom > 0.25) zoom -= 0.25;
        }
        if (url) {
            changeZoomAndTranslat(false, translation, zoom, url);
        }
    });

    $('.canvas-left input.up').on('click', function () {
        translation.y += 5;
        if (url) {
            changeZoomAndTranslat(true, translation, zoom, url);
        }
    });

    $('.canvas-right input.up').on('click', function () {
        translation.y += 5;
        if (url) {
            changeZoomAndTranslat(false, translation, zoom, url);
        }
    });

    $('.canvas-left input.down').on('click', function () {
        translation.y -= 5;
        if (url) {
            changeZoomAndTranslat(true, translation, zoom, url);
        }
    });

    $('.canvas-right input.down').on('click', function () {
        translation.y -= 5;
        if (url) {
            changeZoomAndTranslat(false, translation, zoom, url);
        }
    });

    $('.canvas-left input.left').on('click', function () {
        translation.x += 5;
        if (url) {
            changeZoomAndTranslat(true, translation, zoom, url);
        }
    });

    $('.canvas-right input.left').on('click', function () {
        translation.x += 5;
        if (url) {
            changeZoomAndTranslat(false, translation, zoom, url);
        }
    });

    $('.canas-left input.right').on('click', function () {
        translation.x -= 5;
        if (url) {
            changeZoomAndTranslat(true, translation, zoom, url);
        }
    });

    $('.canvas-right input.right').on('click', function () {
        translation.x -= 5;
        if (url) {
            changeZoomAndTranslat(false, translation, zoom, url);
        }
    });
}

function unbindZoomCallback() {
    $('input.zoom-change').unbind('click');
    $('#canvas').unbind("mousewheel");
    $('#canvas-right').unbind("mousewheel");
    $('.canvas-left input.up').unbind('click');
    $('.canvas-left input.down').unbind('click');
    $('.canvas-left input.left').unbind('click');
    $('.canvas-left input.right').unbind('click');
    $('.canvas-right input.up').unbind('click');
    $('.canvas-right input.down').unbind('click');
    $('.canvas-right input.left').unbind('click');
    $('.canvas-right input.right').unbind('click');
}

function redrawCanvas(url, pos) {
    unbindZoomCallback();
    fillCanvas(url, pos);
    enableZoom(url);
}