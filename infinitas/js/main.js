$(document).ready(function(){
    var header = $('.banner');
    var range = 175;
    $(window).on('scroll', function () {
        var st = $(this).scrollTop();
        header.each(function () {
            var offset = $(this).offset().top;
            var height = $(this).outerHeight();
            offset = offset + height / 2;
            $(this).css({ 'opacity': 1 - (st*0.002) });
        });
    });
});