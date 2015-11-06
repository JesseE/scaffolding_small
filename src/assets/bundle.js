var header = 2;/**
 * Created by jesseeikema on 11/5/15.
 */
var footer = 1;
var $ = require('jquery');
var slick = require('slick-carousel');

$('.responsive').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidewsToScroll: 1,
    arrows: true,

    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ]
});
var header = 2;
/**
 * Created by jesseeikema on 11/5/15.
 */
var header = 1;
var footer = 2;
var header = 4;
