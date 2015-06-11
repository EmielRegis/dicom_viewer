function fillMiniatureMenu(item, number) {
    var url = '/Dicom/GetImageMiniature/' + item + '/' + number;
    var li = '<li class="miniature-img"><img data-id="' + number + '" src="' + url + '"></img></li>';
    $('.miniature-menu').append(li);
}

function setAllMiniatures(number, name) {
    $('.miniature-menu').empty();
    for (var i = 0; i < number; i++) {
        fillMiniatureMenu(name, i);
    }
}

function loadMiniaturesMenu(url) {
    reqUrl = '/Dicom/GetFramesCount/' + url;
    console.log(reqUrl);
    $.ajax({
        url: reqUrl, success: function (result) {
            setAllMiniatures(parseInt(result), url);
            $('img').on('click', function () {
                console.log('click');
                var name = $(this).attr('src');
                console.log(name);
            });
        }
    });
}