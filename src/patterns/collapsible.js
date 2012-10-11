/*
 * changes:
 * - open($el, opts) instead of open($el, duration)
 * - same for close
 */
define([
    'jquery',
    '../logging',
    '../registry'
], function($, logging, registry) {
    var log = logging.getLogger('collapsible');

    var pattern_spec = {
        name: "collapsible",
        trigger: ".pat-collapsible",
        init: function($el, opts) {
            // create collapsible structure
            var $ctrl = $el.children(':first'),
                $content = $el.children(':gt(0)'),
                $panel;
            if ($content.length > 0) {
                $panel = $content.wrapAll('<div class="panel-content" />')
                    .parent();
            } else {
                $panel = $('<div class="panel-content" />').insertAfter($ctrl);
            }

            // set initial state
            if ((opts && opts.closed) || $el.hasClass("closed")) {
                $el.removeClass("closed");
                pattern_spec.close($el, {duration: 0});
            } else {
                $el.addClass("open");
                $el.trigger('patterns-collapsible-open');
            }

            // bind to click events
            $ctrl.on("click.pat-collapsible", function() { pattern_spec.toggle($el, "fast"); });

            return $el;
        },
        destroy: function($el) {
            var $ctrl = $el.children(':first');
            $ctrl.off('.pat-collapsible');
        },
        open: function($el, opts) {
            opts = opts || {};
            if ($el.hasClass("open")) return null;

            pattern_spec.toggle($el, opts.duration);

            // allow for chaining
            return $el;
        },
        close: function($el, opts) {
            opts = opts || {};
            if ($el.hasClass("closed")) return null;
            pattern_spec.toggle($el, opts);

            // allow for chaining
            return $el;
        },
        toggle: function($el, opts) {
            opts = opts || {};
            var $panel = $el.find('.panel-content');
            if ($el.hasClass("closed")) {
                $el.trigger('patterns-collapsible-open');
                pattern_spec._transit($el, $panel, "closed", "open", opts.duration);
            } else {
                $el.trigger('patterns-collapsible-close');
                pattern_spec._transit($el, $panel, "open", "closed", opts.duration);
            }

            // allow for chaining
            return $el;
        },

        _transit: function($el, $panel, from_cls, to_cls, duration) {
            duration = duration || 0; // Handle undefined/null durations
            $el.removeClass(from_cls);
            if (duration) $el.addClass("in-progress");
            $panel.slideToggle(duration, function() {
                if (duration) $el.removeClass("in-progress");
                $el.addClass(to_cls);
            });
        }
    };

    registry.register(pattern_spec);
    return pattern_spec; // XXX For testing only
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
