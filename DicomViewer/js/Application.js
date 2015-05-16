function fillCanvas(canvas, url) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.canvas.width = $('.main-content').width();
    ctx.canvas.height = window.innerHeight;
    var imageObj = new Image();
    imageObj.onload = function () {
        ctx.drawImage(imageObj, 0, 0);
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
    $(document).ajaxComplete(function () {
        canvas = document.getElementById("canvas");
        fillCanvas(canvas, url);
    });
}


$(document).ready(function () {
    
    $('.table.left-menu-table .img-name').on('click', function () {
       var url = $(this).attr('id')
        var canvas = document.getElementById("canvas");
        if (canvas) fillCanvas(canvas, url);
        else {
            loadMainContent(url);
            reFillCanvasAfterAjax(url);
        }
    });

   



});