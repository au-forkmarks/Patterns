define([
    "jquery",
    "./depends_parse"
], function($, parser) {
    function DependsHandler($el, expression) {
        var $context = $el.closest("form");
        if (!$context.length) {
            // Use topmost element instead of document directly in case we are
            // inside a shadow DOM fragment.
            var root=$el[0];
            while (root.parentNode!==null)
                root=root.parentNode;
            $context=$(root);
        }
        this.$el=$el;
        this.$context=$context;
        this.ast=parser.parse(expression);  // TODO: handle parse exceptions here
    }

    DependsHandler.prototype = {
        _findInputs: function(name) {
            var inputs = this.$context[0].querySelectorAll(
                        "input[name='"+name+"'],"+
                        "select[name='"+name+"'],"+
                        "textarea[name='"+name+"']");
            if (inputs.length)
                return $(inputs);
            else
                return $("#"+name);
        },

        _getValue: function(name) {
            var $input = this._findInputs(name);
            if (!$input.length)
                return null;

            if ($input.attr("type")==="radio" || $input.attr("type")==="checkbox")
                return $input.filter(":checked").val() || null;
            else
                return $input.val();
        },
        
        getAllInputs: function() {
            var todo = [this.ast],
                $inputs = $(),
                node;

            while (todo.length) {
                node=todo.shift();
                if (node.input)
                    $inputs=$inputs.add(this._findInputs(node.input));
                if (node.children && node.children.length)
                    todo.push.apply(todo, node.children);
            }
            return $inputs;
        },

        _evaluate: function(node) {
            var value = node.input ? this._getValue(node.input) : null,
                i;

            switch (node.type) {
                case "NOT":
                    return !this._evaluate(node.children[0]);
                case "AND":
                    for (i=0; i<node.children.length; i++)
                        if (!this._evaluate(node.children[i]))
                            return false;
                    return true;
                case "OR":
                    for (i=0; i<node.children.length; i++)
                        if (this._evaluate(node.children[i]))
                            return true;
                    return false;
                case "comparison":
                    switch (node.operator) {
                        case "=":
                            return node.value==value;
                        case "!=":
                            return node.value!=value;
                        case "<=":
                            return value<=node.value;
                        case "<":
                            return value<node.value;
                        case ">":
                            return value>node.value;
                        case ">=":
                            return value>=node.value;
                        case "~=":
                            if (value===null)
                                return false;
                            return value.indexOf(node.value)!=-1;
                    }
                    break;
                case "truthy":
                    return !!value;
            }
        },

        evaluate: function() {
            return this._evaluate(this.ast);
        }
    };

    return DependsHandler;
});

