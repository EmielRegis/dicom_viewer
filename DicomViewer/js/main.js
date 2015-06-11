
$(document).ready(function () {
    $('.table.left-menu-table .img-name').on('click', function () {
        url = $(this).attr('id');
        canvas = document.getElementById("canvas");
        loadMainContent(url);
        loadMiniaturesMenu(url);
        if (canvas) {
            unbindZoomCallback();
            fillCanvas(canvas, url);
            enableZoom(canvas, url);
        }
        else {
            loadMainContent(url);
            loadMiniaturesMenu(url);
        }
    });
});