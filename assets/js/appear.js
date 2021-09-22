/*
 * jQuery.appear
 * https://github.com/bas2k/jquery.appear/
 * http://code.google.com/p/jquery-appear/
 * http://bas2k.ru/
 *
 * Copyright (c) 2009 Michael Hixson
 * Copyright (c) 2012-2014 Alexander Brovikov
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 */
/*
Assesment js
*/
(function ($, Modernizr) {
    // Default State
    var isAnimating = false,
      animateInClass = $("#select-entrances").val(),
      animateOutClass = $("#select-exits").val(),
      // Cache Selectors
      $container = $("#form__container"),
      $progress = $("#form__progress"),
      $select = $("select"),
      $entrances = $("#select-entrances"),
      $exits = $("#select-exits"),
      // Browsers emit custom event on css animation end
      animateEndEvent =
        "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
  
    /**
     * Reset all animation State
     * @param {obj} $current exiting field obj
     * @param {obj} $next    entering field obj
     */
    function resetAnimation($current, $next) {
      isAnimating = false;
      $current.removeClass("is-current animated " + animateOutClass);
      $next.removeClass(animateInClass);
    }
  
    /**
     * Run animation
     * @param {obj} $current exiting field obj
     * @param {obj} $next    entering field obj
     */
    function startAnimation($current, $next) {
      if (isAnimating || !Modernizr.cssanimations) {
        return;
      }
  
      // set flag to debounce multiple clicks
      isAnimating = true;
  
      // begin animating out field
      $current.addClass(animateOutClass);
  
      // begin animating in field
      $next.addClass(animateInClass).one(animateEndEvent, function () {
        resetAnimation($current, $next);
      });
    }
  
    /**
     * Helper action to click first input on field
     */
    function clickField() {
      $(".field.is-current").find("input:first").click();
    }
  
    /**
     * Helper action to set height of container
     * @param {number} height set container value
     */
    function setContainerHeight(height) {
      $container.height(height);
    }
  
    /**
     *
     * Fade out all labeles except selected
     * @param {object} el current label being clicked
     */
    function fadeLabels(el) {
      var $siblings = $(el).siblings("label");
      return $siblings
        .addClass("animated fadeOut")
        .one(animateEndEvent, function () {
          setTimeout(function () {
            $siblings.removeClass("fadeOut");
          }, 1000);
        });
    }
  
    /**
     * Start animation process
     */
    function handleClick(e) {
      if (isAnimating) {
        return;
      }
      var $this = $(this).parent(".field");
      var $next = $this.is(":last-child")
        ? $this.parent().children(":first")
        : $this.next();
  
      // Set container height to height of next field
      setContainerHeight($next.outerHeight());
  
      // Update progress dots
      setProgressDot($next);
  
      // Fade all labels except selected
      fadeLabels(e.target);
  
      // let user feel like selection was made, then start animation
      setTimeout(function () {
        $next.addClass("is-current animated");
        startAnimation($this, $next);
      }, 200);
  
      setTimeout(function () {
        $("input").prop("checked", false);
      }, 1000);
    }
  
    /**
     * set anim classes and click form
     */
    function handleSelect() {
      animateInClass = $entrances.val();
      animateOutClass = $exits.val();
      clickField();
    }
  
    /**
     * Randomize select dropdowns
     * @param {obj} e jquery event obj
     */
    function handleLucky(e) {
      e.preventDefault();
      if (isAnimating) {
        return;
      }
  
      $select.each(function (i, obj) {
        var $obj = $(obj);
        var $options = $obj.find("option");
        var rand = Math.floor(Math.random() * $options.length);
        $obj.val($options.eq(rand).val());
      });
  
      handleSelect();
    }
  
    /**
     * Create progress list based on length of questions
     */
    function setupProgress() {
      var val = $(".field").length;
      var i = 0;
      while (i < val) {
        $progress.append("<li/>");
        i++;
      }
      setProgressDot();
    }
  
    /**
     * Update progress dot to current question
     * @param {object} $el $ object representing next question
     */
    function setProgressDot($el) {
      $progress
        .find("li")
        .removeClass("is-current")
        .eq($el ? $(".field").index($el) : 0)
        .addClass("is-current");
    }
  
    /**
     * Setup all listeners on page
     */
    function setupListeners() {
      $container.on("click", "label", handleClick);
      $select.on("change", handleSelect);
      $lucky.on("click", handleLucky);
    }
  
    function init() {
      // Setup first field
      var $firstField = $container.children(":first");
      $firstField.addClass("is-current animated");
      setContainerHeight($firstField.outerHeight());
  
      // setup progress bar
      setupProgress();
  
      // Add listeners to page
      setupListeners();
    }
  
    init();
  })(window.jQuery, window.Modernizr);
//end assesment js  

(function($) {
    $.fn.appear = function(fn, options) {

        var settings = $.extend({

            //arbitrary data to pass to fn
            data: undefined,

            //call fn only on the first appear?
            one: true,

            // X & Y accuracy
            accX: 0,
            accY: 0

        }, options);

        return this.each(function() {

            var t = $(this);

            //whether the element is currently visible
            t.appeared = false;

            if (!fn) {

                //trigger the custom event
                t.trigger('appear', settings.data);
                return;
            }

            var w = $(window);

            //fires the appear event when appropriate
            var check = function() {

                //is the element hidden?
                if (!t.is(':visible')) {

                    //it became hidden
                    t.appeared = false;
                    return;
                }

                //is the element inside the visible window?
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;

                var ax = settings.accX;
                var ay = settings.accY;
                var th = t.height();
                var wh = w.height();
                var tw = t.width();
                var ww = w.width();

                if (y + th + ay >= b &&
                    y <= b + wh + ay &&
                    x + tw + ax >= a &&
                    x <= a + ww + ax) {

                    //trigger the custom event
                    if (!t.appeared) t.trigger('appear', settings.data);

                } else {

                    //it scrolled out of view
                    t.appeared = false;
                }
            };

            //create a modified fn with some additional logic
            var modifiedFn = function() {

                //mark the element as visible
                t.appeared = true;

                //is this supposed to happen only once?
                if (settings.one) {

                    //remove the check
                    w.unbind('scroll', check);
                    var i = $.inArray(check, $.fn.appear.checks);
                    if (i >= 0) $.fn.appear.checks.splice(i, 1);
                }

                //trigger the original fn
                fn.apply(this, arguments);
            };

            //bind the modified fn to the element
            if (settings.one) t.one('appear', settings.data, modifiedFn);
            else t.bind('appear', settings.data, modifiedFn);

            //check whenever the window scrolls
            w.scroll(check);

            //check whenever the dom changes
            $.fn.appear.checks.push(check);

            //check now
            (check)();
        });
    };

    //keep a queue of appearance checks
    $.extend($.fn.appear, {

        checks: [],
        timeout: null,

        //process the queue
        checkAll: function() {
            var length = $.fn.appear.checks.length;
            if (length > 0) while (length--) ($.fn.appear.checks[length])();
        },

        //check the queue asynchronously
        run: function() {
            if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
            $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
        }
    });

    //run checks when these methods are called
    $.each(['append', 'prepend', 'after', 'before', 'attr',
        'removeAttr', 'addClass', 'removeClass', 'toggleClass',
        'remove', 'css', 'show', 'hide'], function(i, n) {
        var old = $.fn[n];
        if (old) {
            $.fn[n] = function() {
                var r = old.apply(this, arguments);
                $.fn.appear.run();
                return r;
            }
        }
    });

})(jQuery);
