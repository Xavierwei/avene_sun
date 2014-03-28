/*
 * page base action
 */
LP.use(['jquery', 'api', 'easing', 'skrollr', 'flash-detect', 'hammer', 'transit', 'queryloader'] , function( $ , api ){
    'use strict'

    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > 0;
	var isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') > 0;
	var windWidth = $(window).width() - 90;

    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode(
                "@-ms-viewport{width:auto!important}"
            )
        );
        document.getElementsByTagName("head")[0].
            appendChild(msViewportStyle);
    }
    
    $(window).bind('orientationchange', function() {
        var o = window.orientation;

        if (o != 90 && o != -90) {
            $('.turn_device').hide();
        } else {
            $('.turn_device').show();
        }
    });


    LP.action('close_popup', function(){
        $('.page2share').fadeOut();
        $('.page2pop').fadeOut();
    });

    LP.action('open_home_video', function(){
        LP.compile( 'flash-player-template' , {} , function( html ){
            $('body').append(html);
            $('.overlay').fadeIn();
            $('.popup').css({top:'-50%'}).fadeIn().dequeue().animate({top:'50%'}, 800, 'easeOutQuart');
        });
    });

    LP.action('close_pop', function(){
        $('.overlay').fadeOut();
        $('.popup').fadeOut(
            function(){
                $('.overlay,.popup').remove();
            }
        );
    });

    LP.action('expand_video', function(){
        $('.page3-video').animate({height:535}, 800, 'easeOutQuart');
        LP.compile( 'flash-player-template' , {} , function( html ){
            $('.page3-video').append(html);
            $('.page3-video .video-player').delay(800).fadeIn(500);
        });
    });


    var init = function(){
        $(document.body).queryLoader2({
            onLoading : function( percentage ){
                var per = parseInt(percentage);
                $('.loading-percentage').html(per+'%');
                $('.loading-bar').css({'width':per+'%'});
            },
            onComplete : function(){
                $('.loading-wrap').fadeOut();

                /* for animation */
                var isUglyIe = $.browser.msie && $.browser.version <= 8;
                if(isUglyIe && $('#scheme').length > 0)
                    return;
                var ANIMATE_NAME = "data-animate";
                $('[' + ANIMATE_NAME + ']')
                    .each(function(){
                        var $dom = $(this);
                        var tar = $dom.data('animate');
                        var browser = $dom.data('browser');
                        var style = $dom.data('style');
                        var time = parseInt( $dom.data('time') );
                        var delay = $dom.data('delay') || 0;
                        var easing = $dom.data('easing');
                        var begin = $dom.data('begin');
                        tar = tar.split(';');
                        var tarCss = {} , tmp;
                        if(browser == 'uglyie' && isUglyIe) {
                            return;
                        }
                        for (var i = tar.length - 1; i >= 0; i--) {
                            tmp = tar[i].split(':');
                            if( tmp.length == 2 )
                                tarCss[ tmp[0] ] = $.trim(tmp[1]);
                        }
                        if( isUglyIe && tarCss.opacity !== undefined ){
                            delete tarCss.opacity;
                        }


                        style = style.split(';');
                        var styleCss = {} , tmp;
                        for (var i = style.length - 1; i >= 0; i--) {
                            tmp = style[i].split(':');
                            if( tmp.length == 2 )
                                styleCss[ tmp[0] ] = $.trim(tmp[1]);
                        }
                        if( isUglyIe && styleCss.opacity !== undefined ){
                            delete styleCss.opacity;
                        }
                        $dom.css(styleCss).delay( delay )
                            .animate( tarCss , time , easing );
                        if( begin ){
                            setTimeout(function(){
                                animation_begins[begin].call( $dom );
                            } , delay);
                        }
                    });

                var timeoffset = isUglyIe?0:0;
                setTimeout(function(){
                    var s = skrollr.init({
                        smoothScrollingDuration:200,
                        smoothScrolling:true,
                        forceHeight: false
                    });

                },timeoffset);
            }
        });
    }

    if(!$('html').hasClass('touch')) {
        init();
        $('.header .logo img').ensureLoad(function(){
            $(this).fadeIn(1000);
        });
    }


    jQuery.fn.extend({
        ensureLoad: function(handler) {
            return this.each(function() {
                if(this.complete) {
                    handler.call(this);
                } else {
                    $(this).load(handler);
                }
            });
        }
    });




});

function playComplete(){
    $('.video-player').fadeOut();
    $('.page3-video').animate({height:139});
}
