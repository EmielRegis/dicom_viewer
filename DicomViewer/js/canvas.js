﻿var imageObj, zoomCallback;
function drawOnCanvas(canvas, ctx, url) {
    imageObj = new Image();
    imageObj.onload = function () {
        var width = imageObj.naturalWidth;
        var height = imageObj.naturalHeight;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.drawImage(imageObj, -width / 2, -height / 2);
    };
    imageObj.src = '/Dicom/GetImage/' + url;
}

function fillCanvas(url, half) {
    var wid = $('.main-content').width();
    $('.canvas-container.canvas-left').removeClass('hidden');
    if (half) {
        wid = Math.floor(wid / 2) - 2;
    } else {
        $('.canvas-container.canvas-right').addClass('hidden');
    }
    var canvasL = document.getElementById('canvas');
    var ctx = canvasL.getContext("2d");
    ctx.clearRect(0, 0, canvasL.width, canvasL.height); 
    ctx.canvas.width = wid;
    ctx.canvas.height = parseInt(window.innerHeight) - 130;
    drawOnCanvas(canvasL, ctx, url);
}
function fillRightCanvas(url) {
    $('.canvas-container.canvas-right').removeClass('hidden');
    var canvasL = document.getElementById('canvas');
    var canvasR = document.getElementById('canvas-right');
    if (canvasL.width > ($('.main-content').width()) / 2) {
        $('.canvas-container.canvas-left').addClass('hidden');
        var ctxL = canvasL.getContext("2d");
        ctxL.clearRect(0, 0, canvasL.width, canvasL.height);
        ctxL.canvas.width = Math.floor($('.main-content').width() / 2) - 2;
    }
    var ctx = canvasR.getContext("2d");
    ctx.canvas.width = Math.floor($('.main-content').width() / 2) - 2;
    ctx.canvas.height = parseInt(window.innerHeight) - 130;
    drawOnCanvas(canvasL, ctx, url);
}

function changeZoomAndTranslat(canv, translat, scale, url) {
    var canvas = document.getElementById(canv);
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
            fillCanvas(url);
            enableZoom(url, true);
        }
    });
}

function enableZoom(url, left) {
    var zoomL = 1, zoomR = 1, translationL = {}, translationR = {};
    translationR.x = 0;
    translationR.y = 0;
    translationL.x = 0;
    translationL.y = 0;
    if (left) {
        $('.canvas-left button.zoom-change').on('click', function () {
            if ($(this).hasClass('zoom-in')) {
                zoomL += 0.25;
            } else {
                if (zoomL > 0.25) zoomL -= 0.25;
            }
            if (url) {
                changeZoomAndTranslat('canvas', translationL, zoomL, url);
            }
        });
        $('#canvas').bind('mousewheel', function (e) {
            if (e.originalEvent.wheelDelta / 120 > 0) {
                zoomL += 0.25;
            }
            else {
                if (zoomL > 0.25) zoomL -= 0.25;
            }
            if (url) {
                changeZoomAndTranslat('canvas', translationL, zoomL, url);
            }
        });

        $('.canvas-left button.up').on('click', function () {
            translationL.y += 5;
            if (url) {
                changeZoomAndTranslat('canvas', translationL, zoomL, url);
            }
        });

        $('.canvas-left button.down').on('click', function () {
            translationL.y -= 5;
            if (url) {
                changeZoomAndTranslat('canvas', translationL, zoomL, url);
            }
        });

        $('.canvas-left button.left').on('click', function () {
            translationL.x += 5;
            if (url) {
                changeZoomAndTranslat('canvas', translationL, zoomL, url);
            }
        });

        $('.canvas-left button.right').on('click', function () {
            translationL.x -= 5;
            if (url) {
                changeZoomAndTranslat('canvas', translationL, zoomL, url);
            }
        });
    } else {
        $('.canvas-right button.zoom-change').on('click', function () {
            if ($(this).hasClass('zoom-in')) {
                zoomR += 0.25;
            } else {
                if (zoomR > 0.25) zoomR -= 0.25;
            }
            if (url) {
                changeZoomAndTranslat('canvas-right', translationR, zoomR, url);
            }

        });

        $('#canvas-right').bind('mousewheel', function (e) {
            if (e.originalEvent.wheelDelta / 120 > 0) {
                zoomR += 0.25;
            }
            else {
                if (zoomR > 0.25) zoomR -= 0.25;
            }
            if (url) {
                changeZoomAndTranslat('canvas-right', translationR, zoomR, url);
            }
        });

        $('.canvas-right button.up').on('click', function () {
            translationR.y += 5;
            if (url) {
                changeZoomAndTranslat('canvas-right', translationR, zoomR, url);
            }
        });

        $('.canvas-right button.down').on('click', function () {
            translationR.y -= 5;
            if (url) {
                changeZoomAndTranslat('canvas-right', translationR, zoomR, url);
            }
        });

        $('.canvas-right button.left').on('click', function () {
            translationR.x += 5;
            if (url) {
                changeZoomAndTranslat('canvas-right', translationR, zoomR, url);
            }
        });

        $('.canvas-right button.right').on('click', function () {
            translationR.x -= 5;
            if (url) {
                changeZoomAndTranslat('canvas-right', translationR, zoomR, url);
            }
        });
    }
}

function unbindZoomCallback() {
    unbindLeftZoomCallback();
    unbindRightZoomCallback();
}

function unbindLeftZoomCallback() {
    $('.canvas-left button').unbind('click');
    $('#canvas').unbind("mousewheel");
}

function unbindRightZoomCallback() {
    $('.canvas-right button').unbind('click');
    $('#canvas-right').unbind("mousewheel");
}

function redrawCanvas(url, val) {
    
    switch (val) {
        case 'Right':
            unbindRightZoomCallback();
            fillRightCanvas(url);
            enableZoom(url, false);
            break;
        case 'Left':
            unbindLeftZoomCallback();
            fillCanvas(url, true);
            enableZoom(url, true);
            break;
        default:
            unbindZoomCallback();
            fillCanvas(url);
            enableZoom(url, true);
    }
    
}