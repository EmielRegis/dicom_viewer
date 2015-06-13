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

function showModal(name) {
    $('#option-modal .photo img').attr('src', name);
    $('#option-modal .group input[value="All"]').attr('checked', true);
    $('#option-modal').modal('show');
}
function accept(newUrl) {
    $('#option-modal .accept').on('click', function () {
        var val = $("input[type='radio']:checked").val();
        // unbindZoomCallback();
        redrawCanvas(newUrl, val);
        //enableZoom(url);
        $('#option-modal').modal('hide');
       
    });
}

function clearModalCallback() {
    $('#option-modal').on('hidden.bs.modal', function () {
        $('#option-modal .accept').unbind('click');
        $('#option-modal').unbind('hidden.bs.modal');
    })
}

function loadMiniaturesMenu(url) {
    reqUrl = '/Dicom/GetFramesCount/' + url;
    $.ajax({
        url: reqUrl, success: function (result) {
            setAllMiniatures(parseInt(result), url);
            $('.miniature-menu .miniature-img img').on('click', function () {
                var name = $(this).attr('src');
                showModal(name);
              
                var res = name.split("/");
                console.log(res);
                var newUrl = res[res.length - 2] + '/' + res[res.length - 1];
                console.log(newUrl);
                accept(newUrl);
                clearModalCallback();
            });
        }
    });
}