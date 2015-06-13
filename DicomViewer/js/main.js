
$(document).ready(function () {
    $('.table.left-menu-table .img-name').on('click', function () {
        unbindZoomCallback();
        url = $(this).attr('id');
        canvas = document.getElementById("canvas");
        loadMainContent(url);
        loadMiniaturesMenu(url);
        if (canvas) {
            redrawCanvas(url);
        }
    });
});