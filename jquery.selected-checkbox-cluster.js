/**
 * Selected Checkbox Cluster
 * Copyright 2018-2018 Júnior Garcia
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

;(function ($) {
    "use strict";
    let DEFAULTS = {
          // DOM customization
          customClusterWrapperClass: 'filter-cluster',
          clusterContainerSelector: null,
  
          // CALLBACKS
          onCheckCheckbox: function (checkbox) {
          },
          onUncheckCheckbox: function (checkbox) {
          },
          onAddLabel: function (label) {
          },
          onRemoveLabel: function (label) {
          },
          labelTemplate: '<div data-value><span></span><button class="btn btn-danger delete-label"><span>&times;</span></button></div>'
        },
        pluginName = 'selectedCheckboxCluster';
  
    function SelectedCheckboxCluster(element, options) {
      this.element = element;
      this.settings = $.extend({}, DEFAULTS, options);
  
      // The structural components of the cluster.
      this._components = {};
      this.init();
    }
  
    $.extend(SelectedCheckboxCluster.prototype, {
      init: function () {
        // Initializing plugin's checkboxes, if any.
        this.checkboxes = $(this.element).find(':checkbox');
  
        // Certifying that `clusterContainerSelector` exists.
        this._components.$clusterContainer = this.settings.clusterContainerSelector ?
            $(this.settings.clusterContainerSelector) : this.element;
  
        if (this._isStructureValid()) {
          this._createClusterDOMStructure();
        } else {
          console.error('Invalid structure D:');
        }
      },
      // Validates the structure based on the cluster settings.
      _isStructureValid: function () {
        return this._components.$clusterContainer != null && // Container has a value
            this._components.$clusterContainer.length > 0 && // Container has some element
            this.checkboxes.length > 0; // Have checkboxes
      },
      _createClusterDOMStructure: function () {
        // Configuring the cluster box
        let $clusterBox = $('<div class="checkbox-label-cluster"></div>');
        $clusterBox.addClass(this.settings.customClusterWrapperClass);
        $clusterBox.prependTo(this._components.$clusterContainer);
        this.$clusterBox = $clusterBox;
        this._configureCheckboxesTriggers();
      },
      _configureCheckboxesTriggers: function () {
        let base = this;
        $(this.checkboxes).change(function (e) {
          let $checkbox = $(e.currentTarget),
              $labelDOMObject = base._createLabelDOMObject($checkbox);
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
        let $label = this._findLabelForCheckbox($checkbox);
        if ($label.length > 0) {
          $label.remove();
        }
      },
      _findLabelForCheckbox: function ($checkbox) {
        return this.$clusterBox.find('[data-value="' + $checkbox.val() + '"]');
      },
      _findCheckboxForLabel: function ($label) {
        return $(this.checkboxes).filter('[value="' + $label.data('value') + '"]');
      },
      _deleteLabelButtonClick: function ($label) {
        let $checkbox = this._findCheckboxForLabel($label);
        $label.remove();
        if ($checkbox) {
          $checkbox.prop('checked', false);
        }
      },
      _createLabelDOMObject: function ($checkbox) {
        let $label = $(DEFAULTS.labelTemplate),
            base = this;
        $label.attr('data-value', $checkbox.val());
        $label.find('span:first').html($checkbox.data('label'));
  
        // Configuring triggers for when the user clicks the "delete" button.
        $label.find('.delete-label').click(function (e) {
          // Could prevent a form from submit.
          e.preventDefault();
  
          base.settings.onRemoveLabel.call(base, $label);
          base._deleteLabelButtonClick($label);
        });
  
        return $label;
      }
    });
  
    $.fn[pluginName] = function (options) {
      return new SelectedCheckboxCluster(this, options);
    }
  })(jQuery);