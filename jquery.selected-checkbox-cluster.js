; (function ($) {
    "use strict";
    var DEFAULTS = {
        // DOM customization
        customClusterWrapperClass: '.filter-cluster',
        clusterContainer: null,

        // CALLBACKS
        onCheckCheckbox: function (checkbox) { },
        onUncheckCheckbox: function (checkbox) { },
        onAddLabel: function (label) { },
        onRemoveLabel: function (label) { },
        labelTemplate: '<div data-value><span></span><button class="btn btn-danger delete-label"><span>&times;</span></button></div>'
    },
        pluginName = 'selectedCheckboxCluster';

    function SelectedCheckboxCluster(element, options) {
        this.element = element;
        this.settings = $.extend({}, DEFAULTS, options);
        this.init();
    }

    $.extend(SelectedCheckboxCluster.prototype, {
        init: function () {
            // Initializing plugin's checkboxes, if any.
            this.checkboxes = $(this.element).find(':checkbox')

            if (this.isStructureValid()) {
                this._createClusterDOMStructure();
            } else {
                console.error('Invalid structure D:');
            }
        },
        // Validates the structure based on the cluster settings.
        isStructureValid: function () {
            var $clusterContainer = this.settings.clusterContainer;

            return $clusterContainer != null && // Container has a value
                $clusterContainer.length > 0 && // Container has some element
                this.checkboxes.length > 0; // Have checkboxes
        },
        _createClusterDOMStructure: function () {
            // Configuring the cluster box
            var $clusterBox = $('<div class="checkbox-label-cluster"></div>');
            $clusterBox.addClass(this.settings.customClusterWrapperClass);

            this.settings.clusterContainer.prepend($clusterBox);
            this.$clusterBox = $clusterBox;
            this._configureCheckboxesTriggers();
        },
        _configureCheckboxesTriggers: function () {
            var base = this;
            $(this.checkboxes).change(function (e) {
                var $checkbox = $(e.currentTarget),
                    $labelDOMObject = base._createLabelDOMObject($checkbox)
                if ($(this).prop('checked')) {
                    base.settings.onCheckCheckbox.call(base, $checkbox);
                    if ($labelDOMObject) {
                        base.settings.onAddLabel.call(base, $labelDOMObject);
                        base._addLabelToContainer($labelDOMObject);
                    }
                } else {
                    base.settings.onUncheckCheckbox.call(base, $checkbox);
                    base._removeLabelFromContainer($checkbox);
                }
            });
        },
        _addLabelToContainer: function ($label) {
            this.$clusterBox.append($label);
        },
        _removeLabelFromContainer: function ($checkbox) {
            var $label = this._findLabelByCheckbox($checkbox);
            if ($label.length > 0) {
                $label.remove();
            }
        },
        _findLabelByCheckbox: function ($checkbox) {
            return this.$clusterBox.find('[data-value="' + $checkbox.val() + '"]')
        },
        _deleteLabelButtonClick: function ($label) {
            var $checkbox = $(this.checkboxes).filter('[data-label="' + $label.data('value') + '"]');
            $label.remove();
            if ($checkbox) {
                $checkbox.prop('checked', false);
            }
        },
        _createLabelDOMObject: function ($checkbox) {
            var $label = $(DEFAULTS.labelTemplate),
                base = this;
            $label.attr('data-value', $checkbox.val());
            $label.find('span:first').html($checkbox.data('label'));

            // Configuring triggers for when the user clicks the "delete" button.
            $label.find('.delete-label').click(function (e) {
                // Could prevent a form from submit.
                e.preventDefault();

                base.settings.onRemoveLabel.call(base, $label);
                base._deleteLabelButtonClick($label);
            })

            return $label;
        }
    });

    $.fn[pluginName] = function (options) {
        return new SelectedCheckboxCluster(this, options);
    }
})(jQuery);