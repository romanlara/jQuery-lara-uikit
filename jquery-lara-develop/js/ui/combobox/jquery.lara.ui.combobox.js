/* ====================================================================+
 * File name      : jquery.lara.ui.combobox.js
 * Beginning      : 2012-Ene-26
 * Last modified  : 2012-Ene-26
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 0.0.0.0
 * version widget :   0.0.0
 * 
 * Description    : Un combo con autocomplete.
 * ====================================================================+
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *	  jquery.ui.widget.js
 * 
 *  Aperos-Lara:
 *    ninguno
 * 
 * --------------------------------------+
 * 
 * css file depends:
 *   jQuery:
 *     jquery-ui.css (custom)
 * 
 *   Aperos-Lara:
 *     jquery.lara.ui.combobox.css
 */

/*
 * v0.0.0 | 2012-Ene-26
 *     - Creación del widget.
 * 
 * v1.0.0 | 0000-none-00
 *     - widget ui combobox has been released.
 */

(function($, undefined) {
	$.widget("ui.combobox", {
		versionLibrary: "0.0.0",
		version: "0.0.0",
		
		options: {
			
		},
		
		_create: function() {
			var self = this,
				select = this.element.hide(),
				selected = select.children(":selected"),
				value = selected.val() ? selected.text() : "";
			var input = this.input = $("<input>")
					.insertAfter(select)
					.val(value)
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: function(request, response) {
							var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
							response(select.children("option").map(function() {
								var text = $(this).text();
								if (this.value && (!request.term || matcher.test(text)))
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>"),
										value: text,
										option: this
									};
							}));
						},
						select: function(event, ui) {
							ui.item.option.selected = true;
							self._trigger("selected", event, {
								item: ui.item.option
							});
						},
						change: function(event, ui) {
							if (!ui.item) {
								var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
									valid = false;
								select.children("option").each(function() {
									if ($(this).text().match(matcher)) {
										this.selected = valid = true;
										return false;
									}
								});
								if (!valid) {
									// remove invalid value, as it didn't match anything
									$(this).val("");
									select.val("");
									input.data("autocomplete").term = "";
									return false;
								}
							}
						}
					})
					.addClass("ui-combobox-autocomplete ui-widget ui-widget-content ui-corner-left");

			input.data("autocomplete")._renderItem = function(ul, item) {
				return $("<li></li>" )
					.data("item.autocomplete", item)
					.append("<a>" + item.label + "</a>")
					.appendTo(ul);
			};

			this.button = $("<button type='button'>&nbsp;</button>")
				.addClass("ui-combobox-button")
				.attr("tabIndex", -1)
				.attr("title", "Show All Items")
				.insertAfter(input)
				.button({
					icons: {
						primary: "ui-icon-triangle-1-s"
					},
					text: false
				})
				.removeClass("ui-corner-all")
				.addClass("ui-corner-right ui-button-icon")
				.click(function() {
					if (self.options.disabled) { return; }
					// close if already visible
					if ( input.autocomplete("widget").is(":visible")) {
						input.autocomplete("close");
						return;
					}

					// work around a bug (likely same cause as #5265)
					$(this).blur();

					// pass empty string as value to search for, displaying all results
					input.autocomplete("search", "");
					input.focus();
			});
		},

		destroy: function() {
			this.input.remove();
			this.button.remove();
			this.element.show();
			$.Widget.prototype.destroy.call(this);
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
		},
		
		_setOption: function(key, value) {
			switch (key) {
				case "disabled":
					if (value) {
						this.input
							.attr("disabled", "disabled")
							.addClass("ui-state-disabled")
							.attr("aria-disabled", "true")
							.autocomplete("disable");
						this.button
							.button("disable");
					} else {
						this.input
							.removeAttr("disabled")
							.removeClass("ui-state-disabled")
							.attr("aria-disabled", "false")
							.autocomplete("enable");
						this.button
							.button("enable");
					}
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})( jQuery );