
var $ = jQuery.noConflict();

(function($) {
    "use strict";

    /*-------------------------------------------------*/
    /* =  loader
    /*-------------------------------------------------*/
    Pace.on("done", function(){
        $("#myloader").fadeOut(500);
    });

    setTimeout(function() {$('#myloader').fadeOut(500)}, 3500)
    /*-------------------------------------------------*/
    /* =  Menu
    /*-------------------------------------------------*/
    try {
        $('.menu-button').on("click",function() {
            $('#menu').toggleClass('open');
            $('#menu').addClass('animated slideInRight');
        });
        $('button.close-menu').on("click",function() {
            $('#menu').removeClass('animated slideInRight');
            $('#menu').addClass('animated fadeOutRight');
            setTimeout(function(){ 
                $('#menu').toggleClass('open');
                $('#menu').removeClass('animated fadeOutRight');
            },1000);
        });
        $('.menu-holder ul > li:not(.submenu) > a').on("click",function() {
            $('#menu').toggleClass('open');
            $('#menu').removeClass('animated slideInRight');
        });
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Slider
    /*-------------------------------------------------*/
    try {
        $(window).load(function() {
            $('.flexslider').flexslider({
                animation: "fade",
                controlNav: false,
                useCSS: false,
                start: function(){
                    $('.slides').show();
                }
            });
        });
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Instafeed
    /*-------------------------------------------------*/
    var settings = {"accessToken":"", "userId":"401494815"}; //Add your access token and the instagram user id to show the profile. AccessToken to test 393402381.1677ed0.d26e74eb93b04d9b8b729cdf097c3f55
    try {
        var userFeed = new Instafeed({
            get: 'user',
            userId: settings.userId,
            accessToken: settings.accessToken,
            resolution: 'standard_resolution',
            limit: 6,
            template: '<li class="col-sm-2 col-xs-4"><a href="{{link}}" target="_blank" class="image"><img src="{{image}}" /></a></li>'
        });
        userFeed.run();
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Isotope
    /*-------------------------------------------------*/
    try {
        var $mainContainer=$('.works-items');
       $mainContainer.imagesLoaded( function(){

            var $container=$('.works-items').isotope({itemSelector:'.one-item'});

            $('#works .filters').on('click','li',function(){

 $container.isotope({
                    filter:"*"});

  
                var filterValue=$(this).attr('data-filter');

            $container.isotope({
                    filter:filterValue});
            }).on('arrangeComplete',function(){


});

            $('#works .filters').each(function(i,buttonGroup){
                var $buttonGroup=$(buttonGroup);
                $buttonGroup.on('click','li',function(){
                    $buttonGroup.find('.is-checked').removeClass('is-checked');
                    $(this).addClass('is-checked');
                });

            });
            
        });
    } catch(err) {

    }
    //portfolio with border
    try {
        var $mainContainerBorder=$('.works-items.border');
       $mainContainerBorder.imagesLoaded( function(){
          $('.works-items').removeClass('hidden');
$('.loader').hide();
            var $container=$('.works-items.border').isotope({
                itemSelector:'.one-item',
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: '.one-item',
                    gutter: 30
                },
                percentPosition: true
            });

            $('#works .filters').on('click','li',function(){
                var filterValue=$(this).attr('data-filter');$container.isotope({
                    filter:filterValue});
            });
            $('#works .filters').each(function(i,buttonGroup){
                var $buttonGroup=$(buttonGroup);
                $buttonGroup.on('click','li',function(){
                    $buttonGroup.find('.is-checked').removeClass('is-checked');
                    $(this).addClass('is-checked');
                });

            });

        });
    } catch(err) {

    }
    //blog masonry
    try {
        var $blogContainer = $('.masonry-grid');
        $blogContainer.imagesLoaded( function(){
            $blogContainer.isotope({itemSelector: '.masonry-item', layoutMode: 'masonry'});
        });
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Magnific popup
    /*-------------------------------------------------*/
$('.openVideo, .lightbox').magnificPopup({
type: 'inline',
callbacks: {
  open: function() {
    $('html').css('margin-right', 0);
    // Play video on open:
    $(this.content).find('video')[0].play();
    },
  close: function() {
    // Reset video on close:
    $(this.content).find('video')[0].load();
    }
  }
});

    try {
        $('.works-itemsss').each(function() { // the containers for all your galleries
            $(this).magnificPopup({
                delegate: '.lightbox',
                type: 'iframe',   
                gallery: {
                    enabled:true
                },
                callbacks:{
                    beforeOpen:function(){
                        $("body").css({"margin-right":"-17px"})
                    },
                    beforeClose:function() {
                        $("body").css({"margin-right":"0"});

                    }
                }
            });
        });
$('.popup-player').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
    iframe: {
        markup: '<div class="mfp-iframe-scaler">'+
                '<div class="mfp-close"></div>'+
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
              '</div>',

        srcAction: 'iframe_src',
        }
});
        $('.popup-youtube, .popup-vimeo, .popup-gmaps, .popup-video').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,

        fixedContentPos: false
        });
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Count increment
    /*-------------------------------------------------*/
    try {
        $('#counters').appear(function() {
            $('#counters .statistic span').countTo({
                speed: 4000,
                refreshInterval: 60,
                formatter: function (value, options) {
                    return value.toFixed(options.decimals);
                }
            });
        });
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Contact Form
    /*-------------------------------------------------*/
    var submitContact = $('#submit-contact'),
        message = $('#msg');

    submitContact.on('click', function(e){
        e.preventDefault();

        var $this = $(this);

        $.ajax({
            type: "POST",
            url: 'contact.php',
            dataType: 'json',
            cache: false,
            data: $('#contact-form').serialize(),
            success: function(data) {

                if(data.info !== 'error'){
                    $this.parents('form').find('input[type=text],textarea,select').filter(':visible').val('');
                    message.hide().removeClass('success').removeClass('error').addClass('success').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
                } else {
                    message.hide().removeClass('success').removeClass('error').addClass('error').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
                }
            }
        });
    });

})(jQuery);

$(document).ready(function($) {
    "use strict";
    
    /*-------------------------------------------------*/
    /* =  Carousel
    /*-------------------------------------------------*/
    try {
        $(".carousel-news").owlCarousel({
            loop:true,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            items:1,
            autoplay:true,
            autoplayHoverPause:true
        });

        $(".testimonials-carousel").owlCarousel({
            loop:true,
            animateOut: 'fadeOut',
            animateIn: 'flipInX',
            items:1,
            autoplay:true,
            autoplayHoverPause:true
        });

        $(".image-carousel").owlCarousel({
            loop:true,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            items:1,
            autoplay:true,
            autoplayHoverPause:true,
            dots:false
        });

        $(".team-carousel").owlCarousel({
            responsiveClass:true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:1
                },
                1000:{
                    items:3,
                    loop:false
                }
            }
        });
        $(".sponsor-carousel").owlCarousel({
            loop:true,
            autoplay:true,
            dots:false,
            autoplayTimeout:3000,
            responsiveClass:true,
            responsive:{
                0:{
                    items:2
                },
                600:{
                    items:2
                },
                1000:{
                    items:4,
                    loop:true
                }
            }
        });
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Skills
    /*-------------------------------------------------*/
    try {
        $('#skills').appear(function() {
            jQuery('.skill-list li span').each(function(){
                jQuery(this).animate({
                    width:jQuery(this).attr('data-percent')
                },2000);
            });
        });
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Parallax
    /*-------------------------------------------------*/
    try {
        $('.parallax').scrolly({bgParallax: true});
    } catch(err) {

    }
    /*-------------------------------------------------*/
    /* =  Scroll between sections
    /*-------------------------------------------------*/
    $('nav ul li a[href*=#]').on("click",function(event) {
        var $this = $(this);
        var offset = -70;
        $.scrollTo( $this.attr('href') , 850, { easing: 'swing' , offset: offset , 'axis':'y' } );
        event.preventDefault();
    });
    $('footer a[href*=#]').on("click",function(event) {
        var $this = $(this);
        var offset = -70;
        $.scrollTo( $this.attr('href') , 1000, { easing: 'swing' , offset: offset , 'axis':'y' } );
        event.preventDefault();
    });

});