var imageObj, zoomCallback;
function fillCanvas(canvas, url, scale) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.canvas.width = $('.main-content').width();
    ctx.canvas.height = window.innerHeight;
    if (!scale) scale = 1;
    imageObj = new Image();
    imageObj.onload = function () {
        var width = imageObj.naturalWidth;
        var height = imageObj.naturalHeight;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.drawImage(imageObj, -width / 2, -height / 2);
    };
    imageObj.src = '/Dicom/GetImage/' + url;

}

function loadMainContent(reqUrl) {
    reqUrl = '/Dicom/Image/' + reqUrl;
    $.ajax({
        url: reqUrl, success: function (result) {
            $(".main-content").empty();
            $(".main-content").append(result);
        }
    });
}
function reFillCanvasAfterAjax(url) {
    canvas = document.getElementById("canvas");
    fillCanvas(canvas, url);
    return canvas;
}

function changeZoom(canvas, url, zoom) {
    fillCanvas(canvas, url, zoom);

}

function enableZoom(canvas, url) {
    var zoom = 1;
    $('input.zoom-change').on('click', function () {
        if ($(this).hasClass('zoom-in')) {
            zoom += 0.25;
        } else {
            if (zoom > 0.25) zoom -= 0.25;
        }
        if (canvas && url) {
            changeZoom(canvas, url, zoom);
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
            changeZoom(canvas, url, zoom);
        }
    });
}

function unbindZoomCallback() {
    $('input.zoom-change').unbind('click');
    $('canvas').unbind("mousewheel");
}


$(document).ready(function () {
    var canvas, url, zoom = 1;

    $('.table.left-menu-table .img-name').on('click', function () {
        url = $(this).attr('id')
        canvas = document.getElementById("canvas");
        if (canvas) {
            unbindZoomCallback();
            fillCanvas(canvas, url);
            enableZoom(canvas, url);
        }
        else {
            loadMainContent(url);
            $(document).ajaxComplete(function () {
                canvas = reFillCanvasAfterAjax(url);
                enableZoom(canvas, url);
            });
        }
    });









});