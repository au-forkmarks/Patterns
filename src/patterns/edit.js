define([
    'require',
    '../lib/aloha-loader',
    '../logging',
    '../patterns'
], function(require) {
    log = require('../logging').getLogger('edit');
    
    // Grab a element of the editor controls
    var init = function($el, opts) {
        var $form    = $el.parents('form'),
            $ctrls   = $('.editor-ctrls'),
            buttons  = {};
                
 
        // ensure form is ajaxified
        var ajaxify = require('../patterns').ajaxify.init;
        ajaxify($form);
  
        // I have taken the liberty of commenting out buttons
        // that I believe serve no purpose, if they end up being
        // critical, just uncomment.
        
        // buttons.b                   = $ctrls.find('.strong');
        buttons.bold                = $ctrls.find('.strong');
        // buttons.i                   = $ctrls.find('.emphasised');
        buttons.italic              = $ctrls.find('.emphasised');
        // buttons.ol                  = $ctrls.find('.list-ordered');
        buttons.insertorderedlist   = $ctrls.find('.list-ordered');
        // buttons.ul                  = $ctrls.find('.list-unordered');
        buttons.insertunorderedlist = $ctrls.find('.list-unordered');
        //buttons.insertparagraph     = $ctrls.find('.paragraph');
        buttons.clear               = $ctrls.find('.clear');
        // buttons.h1                  = $ctrls.find('.header_1');
        buttons.inserth1            = $ctrls.find('.header_1');
        // buttons.h2                  = $ctrls.find('.header_2');
        buttons.inserth2            = $ctrls.find('.header_2');
        // buttons.h3                  = $ctrls.find('.header_3');
        buttons.inserth3            = $ctrls.find('.header_3');
        buttons.upload_image        = $ctrls.find('.upload_image');
        buttons.link_image          = $ctrls.find('.link_image');

        // This doesn't check if we're in a ContentEditable :S 
        // It replaces headings rather than toggling as well,
        // both of these are pretty easy fixes 
        // - Zephyr
        var wrap_selection = function(wrap_html){
            var selection_node = $(window.getSelection().anchorNode);
            selection_node.unwrap();
            selection_node.wrap(wrap_html); 
        };

        var button_handler = {
                'bold'                  : function(){ document.execCommand('bold'); }, 
                'italic'                : function(){ document.execCommand('italic'); },
                'clear'                 : function(){ return 0; },
                'insertparagraph'       ; function(){ return 0; },
                'insertorderedlist'     : function(){ document.execCommand('insertorderedlist'); },
                'insertunorderedlist'   : function(){ document.execCommand('insertunorderedlist'); },
                'inserth1'              : function(){ wrap_selection('<h1>') },
                'inserth2'              : function(){ wrap_selection('<h2>') },
                'inserth3'              : function(){ wrap_selection('<h3>') },
                'upload_image'          : function(){ document.execCommand(); },
                'link_image'            : function(){ 
                                                var source = prompt('URL of Image');
                                                if(source) { 
                                                  document.execCommand('insertImage', false, source); 
                                                }
                                          }
            };

        var button_click = function(element) {
            buttons[element].toggleClass('selected'); 
            button_handler[element]();
        }
 
        // bind click to button_click()/1
        for (var key in buttons) {
                buttons[key].click(function(element){
                 // I'm returning within to generate
                 // a closure so key doesn't end up 
                 // capturing the last value of
                 // buttons[]
                 return function() {
                        log.debug(element); 
                        button_click(element);
                        };
            }(key));
        }
        // Enables contentEditable
        $('form').attr('contenteditable','true');
       
         var setstate = function(selection) {
             var markup = selection.markupEffectiveAtStart;
          if (!markup) return;
             $ctrls.find('*').removeClass('selected');
             $.each(markup, function(idx, el) {
                 var tag = el.nodeName.toLowerCase(),
                 $button = buttons[tag];
                 if ($button) $button.addClass('selected');
                 log.debug('selected', tag);
             });
         };
     };
    
     var pattern = {
        markup_trigger: 'form textarea.edit',
        initialised_class: 'edit',
        init: init
    };
    return pattern;
});
