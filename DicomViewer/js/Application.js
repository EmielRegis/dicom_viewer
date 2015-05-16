function fillCanvas(canvas, url, scale) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.canvas.width = $('.main-content').width();
    ctx.canvas.height = window.innerHeight;
    if(scale)ctx.scale(scale, scale);
    var imageObj = new Image();
    imageObj.onload = function () {
        var width = imageObj.naturalWidth;
        var height = imageObj.naturalHeight;
        ctx.drawImage(imageObj, 0, 0, width, height);
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
            zoom++;
        } else {
           if(zoom > 1) zoom--;
        }
        if (canvas && url) {
            changeZoom(canvas, url, zoom);
        }
    });
}


$(document).ready(function () {
    var canvas, url, zoom = 1;

    $('.table.left-menu-table .img-name').on('click', function () {
        url = $(this).attr('id')
        canvas = document.getElementById("canvas");
        if (canvas) {
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