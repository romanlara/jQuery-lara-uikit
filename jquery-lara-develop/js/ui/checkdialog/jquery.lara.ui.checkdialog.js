/* ====================================================================+
 * File name      : jquery.lara.ui.checkdialog.js
 * Beginning      : 2011-Dic-30
 * Last modified  : 2012-Ago-09
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Un dialogo de confirmacion.
 * ====================================================================+
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *	  jquery.ui.widget.js
 *    jquery.ui.button.js
 * 
 *  Aperos-Lara:
 *    none
 * 
 * --------------------------------------+
 * 
 * css file depends:
 *   jQuery:
 *     jquery-ui.css (custom)
 * 
 *   Aperos-Lara:
 *     jquery.lara.ui.checkdialog.css
 */

/*
 * v0.0.0 | 2011-Dic-30
 *     - Creación del widget.
 * 
 * v0.1.0 | 2012-Mar-28
 *   News:
 *     - Ahora es posible modificar su ancho.
 *     - Se agregó la posibilidad de darle un titulo al dialogo, y a su vez cambiarlo en tiempo de ejecución.
 * 
 *   Patching:
 *     - Se cambió la barra de titulo del lado izquierdo hacia arriba, esto es para evitar un error
 *       que descuadraba al diálogo en los navegadores Chrome, Safari y Opera en Mac OS X.
 * 
 * v0.2.0 | 2012-Jun-07
 *   New:
 *     - Ahora es posible tener checdialog sin el icono y el titulo.
 *     - Ahora cuando el dialogo se abre pone el foco en el primer botón que hay.
 * 
 *   Patching:
 *     - Se mejoró internamente la forma de crearse el widget.
 * 
 * --------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget ui checkdialog has been released.
 */

(function($, undefined) {
	var attrFn = $.attrFn || {    // Esto es necesario para los botones.
			val: true,
			css: true,
			html: true,
			text: true,
			data: true,
			width: true,
			height: true,
			offset: true,
			click: true
		};
	
	$.widget("ui.checkdialog", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		_icon: "ui-icon-help",    // Para recordar el anterior icono y poderlo sustituir.
		
		options: {
			width: null,          // Para establecer el ancho del checkdialog, si no, el ancho es automatico.
			position: {           // Posicion en la pantalla que toma el dialogo.
				my: "center center",
				at: "center center"
			},
			
			autoOpen: true,       // True para abrirse cuando es creado.
			modal: false,         // Crea un panel de toda la ventana detras del checkdialog, evita pasar los eventos al fondo.
			
			icon: "ui-icon-help", // Icono que aparece en la barra de titulo.
			title: "Dialog",      // Titulo que aparece en la barra de titulo
			buttons: {},          // Botones con los que toma una sola decicion el usuario.
			
			/* Todos los efectos funcionan, excepto:
			 * Show: highlight, size, transfer.
			 * Hide: highlight, shake, size, transfer.
			 */
			show: null,          // Efecto y/o tiempo para su visualizacion.
			hide: null           // Efecto y/o tiempo para su ocultacion.
		},
		
		_create: function() {
			var self = this,
				o = self.options;
				
			this.checkdialog = $("<div></div>")
				.addClass("ui-checkdialog ui-widget ui-widget-content ui-corner-all")
				.attr("role", "dialog")
				.attr("aria-hide", "true")
				.css("width", (o.width === null || o.width === undefined || o.width === "") ? "" :
						(typeof o.width === "string") ? o.width : o.width + "px")
				.appendTo(document.body)
				.hide();
			
			this.titlebar = $("<div></div>")
				.addClass("ui-checkdialog-titlebar ui-widget-header ui-corner-top")
				.attr("role", "presentation")
				.appendTo(this.checkdialog);
			
			this.icon = $('<span class="ui-icon ' + o.icon + ' ui-checkdialog-icon" />')
				.appendTo(this.titlebar);
			this.title = $('<a href="#" class="ui-checkdialog-title" />')
				.html((this.element.attr("title")) ? this.element.attr("title") : o.title)
				.appendTo(this.titlebar)
				
			this.wrapContent = $("<div></div>")
				.addClass("ui-checkdialog-wrap-content ui-widget-content ui-corner-bottom")
				.appendTo(this.checkdialog);
			
			this.content = this.element
				.addClass("ui-checkdialog-content")
				.attr("role", "content-dialog")
				.appendTo(this.wrapContent);
			
			// ------------
			/*this.checkdialog = this.element
				.addClass("ui-checkdialog ui-widget ui-widget-content ui-corner-all")
				.attr("role", "dialog")
				.attr("aria-hide", "true")
				.css("width", (o.width === null || o.width === undefined || o.width === "") ? "" :
						(typeof o.width === "string") ? o.width : o.width + "px")
				.hide();*/
			/*
			this.titlebar = $('<div class="ui-checkdialog-titlebar ui-widget-header ui-corner-top" />')
				.attr("role", "presentation")
				.appendTo(this.checkdialog);*/
			/*
			this.wrapContent = $('<div class="ui-checkdialog-wrap-content ui-widget-content ui-corner-bottom" />')
				.appendTo(this.checkdialog);*/
			/*
			this.content = $('<div class="ui-checkdialog-content" />')
				.attr("role", "content")
				.appendTo(this.wrapContent);*/
			
			// --------------------------------------------------------+
			this._createButtons(o.buttons);
			//this.message(o.message);
			this._icon = o.icon;
			//this.refresh();
			
			if (o.icon == "") {
				this.icon.removeClass("ui-icon");
				this.titlebar.css("padding", "0.8em 0.5em");
			}
			if (o.title != "") {
				this.titlebar.css("padding", "0.4em 0.5em");
			}
			
			// --------------------------------------------------------+			
			$("body").append(this.checkdialog);
		},
		
		_init: function() {
			var self = this,
				o = self.options;
				
			if (o.autoOpen) { this.open(); }
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			if (this.overlay) { this.overlay.destroy(); }
			
			this.icon.remove();
			this.title.remove();
			this.titlebar.remove();
			
			this.wrapContent.find(".ui-checkdialog-buttonpane").remove();
			
			this.content
				.unwrap()
				.unwrap()
				.removeClass("ui-checkdialog-content")
				.removeAttr("role");
		},
		
		_createButtons: function(buttons) {
			var self = this,
				o = self.options,
				hasButtons = false,
				uiCheckdialogButtonPane = $("<div></div>")
					.addClass(
						"ui-checkdialog-buttonpane " +
						"ui-helper-clearfix"
					),
				uiButtonSet = $("<div></div>")
					.addClass("ui-checkdialog-buttonset")
					.appendTo(uiCheckdialogButtonPane);
			
			self.wrapContent.find(".ui-checkdialog-buttonpane").remove();
			
			if (typeof buttons === 'object' && buttons !== null) {
				$.each(buttons, function() {
					return !(hasButtons = true);
				});
			}
			if (hasButtons) {
				$.each(buttons, function(name, props) {
					props = $.isFunction(props) ? { click: props, text: name } : props;
					var button = $('<button type="button"></button>')
						.click(function() {
							props.click.apply(self.element[0], arguments);
						})
						.appendTo(uiButtonSet);
					
					$.each(props, function(key, value) {
						if (key === "click") {
							return;
						}
						if (key in attrFn) {
							button[key](value);
						} else {
							button.attr(key, value);
						}
					});
					if ($.fn.button) {
						button.button();
					}
				});
				uiCheckdialogButtonPane.appendTo(self.wrapContent);
			}
		},
		
		open: function() {
			var self = this,
				o = self.options;
			
			this.preopen();
			
			this.overlay = o.modal ? new $.ui.checkdialog.overlay(self) : null;
			if (this.overlay) {
				$.each($.ui.checkdialog.overlay.instances, function(index) {
					$.ui.checkdialog.overlay.instances[index].unbind(".checkdialog");
				});
				$.each($.ui.checkdialog.overlay.instances, function(index) {
					$.ui.checkdialog.overlay.instances[index].bind("click.checkdialog", function(event) {
						self._tabbable();
					});
				});
				/*
				$.ui.checkdialog.overlay.instances[0]
					.bind("click.checkdialog", function(event) {
						self._tabbable();
					});*/
			}
			
			if (o.show !== null) {
				this.checkdialog
					.css({ top: 0, left: 0 })
					.position($.extend({ of: window }, o.position))
					.show(o.show)
					.attr("aria-hide", "false");
			} else {
				this.checkdialog
					.css({ top: 0, left: 0 })
					.position($.extend({ of: window }, o.position))
					.show()
					.attr("aria-hide", "false");
			}
			
			this._tabbable();
		},
		
		_tabbable: function() {
			var self = this,
				o = self.options;
			
			// prevent tabbing out of modal dialogs
			if ( o.modal ) {
				this.checkdialog.bind( "keydown.ui-checkdialog", function( event ) {
					if ( event.keyCode !== $.ui.keyCode.TAB ) {
						return;
					}

					var tabbables = $(':tabbable', this),
						first = tabbables.filter(':first'),
						last  = tabbables.filter(':last');
		
					if (event.target === last[0] && !event.shiftKey) {
						first.focus(1);
						return false;
					} else if (event.target === first[0] && event.shiftKey) {
						last.focus(1);
						return false;
					}
				});
			}

			// set focus to the first tabbable element in the content area or the first button
			// if there are no tabbable elements, set focus on the dialog itself
			$(self.element.find(':tabbable').get().concat(
				self.checkdialog.find('.ui-checkdialog-buttonpane :tabbable').get().concat(
					self.checkdialog.get()))).eq(0).focus();
		},
		
		close: function() {
			var self = this,
				o = self.options;
			
			if (this.overlay) {
				$.each($.ui.checkdialog.overlay.instances, function(index) {
					$.ui.checkdialog.overlay.instances[index].unbind(".checkdialog");
				});
				//$.ui.checkdialog.overlay.instances[0].unbind(".checkdialog");
				this.overlay.destroy();
			}
			
			if (o.hide !== null) {
				this.checkdialog
					.hide(o.hide)
					.attr("aria-hide", "true");
			} else {
				this.checkdialog
					.hide()
					.attr("aria-hide", "true");
			}
				
			this.preclose();
		},
		
		preopen: function(event) {
			var ui = {
				item: this.element
			};
				
			this._trigger("preopen", event, ui);
		},
		
		preclose: function(event) {
			var ui = {
				item: this.element
			};
				
			this._trigger("preclose", event, ui);
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			//this.refresh();
		},
		
		_setOption: function(key, value) {
			var self = this,
				o = self.options;
			
			switch (key) {
				case "width":
					this.checkdialog.css("width", (value === null || value === undefined || value === "") ? "" :
						(typeof value === "string") ? value : value + "px");
					break;
				case "icon":
					if (value != "") {
						this.icon.addClass("ui-icon");
						this.icon.removeClass(this._icon);
						this.icon.addClass(value);
						this._icon = value;
						this.titlebar.css("padding", "0.4em 0.5em");
					} else {
						this.icon.removeClass("ui-icon");
						this.titlebar.css("padding", "0.8em 0.5em");
					}
					break;
				case "title":
					this.title.html(value);
					break;
				case "message":
					this.message(value);
					break;
				case "buttons":
					this._createButtons(value);
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
	
	/* Todo el codigo siguiente es tomado del dialog del framework jQuery.
	 * Es el creador del overlay, cuando modal es true. */
	$.extend($.ui.checkdialog, {
		version: "1.8.16",

		uuid: 0,
		maxZ: 0,

		overlay: function(checkdialog) {
			this.$el = $.ui.checkdialog.overlay.create(checkdialog);
		}
	});
	
	$.extend($.ui.checkdialog.overlay, {
		instances: [],
		// reuse old instances due to IE memory leak with alpha transparency (see #5185)
		oldInstances: [],
		maxZ: 0,
		events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
			function(event) { return event + '.dialog-overlay'; }).join(' '),
		create: function(checkdialog) {
			if (this.instances.length === 0) {
				// prevent use of anchors and inputs
				// we use a setTimeout in case the overlay is created from an
				// event that we're going to be cancelling (see #2804)
				setTimeout(function() {
					// handle $(el).dialog().dialog('close') (see #4065)
					if ($.ui.checkdialog.overlay.instances.length) {
						$(document).bind($.ui.checkdialog.overlay.events, function(event) {
							// stop events if the z-index of the target is < the z-index of the overlay
							// we cannot return true when we don't want to cancel the event (#3523)
							if ($(event.target).zIndex() < $.ui.checkdialog.overlay.maxZ) {
								return false;
							}
						});
					}
				}, 1);

				// allow closing by pressing the escape key
				$(document).bind('keydown.dialog-overlay', function(event) {
					if (checkdialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE) {
					
						checkdialog.close(event);
						event.preventDefault();
					}
				});

				// handle window resize
				$(window).bind('resize.dialog-overlay', $.ui.checkdialog.overlay.resize);
			}

			var $el = (this.oldInstances.pop() || $('<div></div>').addClass('ui-widget-overlay'))
				.appendTo(document.body)
				.css({
					width: this.width(),
					height: this.height()
				});

			if ($.fn.bgiframe) {
				$el.bgiframe();
			}
	
			this.instances.push($el);
			return $el;
		},

		destroy: function($el) {
			var indexOf = $.inArray($el, this.instances);
			if (indexOf != -1){
				this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
			}
	
			if (this.instances.length === 0) {
				$([document, window]).unbind('.dialog-overlay');
			}

			$el.remove();
			
			// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
			var maxZ = 0;
			$.each(this.instances, function() {
				maxZ = Math.max(maxZ, this.css('z-index'));
			});
			this.maxZ = maxZ;
		},

		height: function() {
			var scrollHeight,
				offsetHeight;
			// handle IE 6
			if ($.browser.msie && $.browser.version < 7) {
				scrollHeight = Math.max(
					document.documentElement.scrollHeight,
					document.body.scrollHeight
				);
				offsetHeight = Math.max(
					document.documentElement.offsetHeight,
					document.body.offsetHeight
				);
	
				if (scrollHeight < offsetHeight) {
					return $(window).height() + 'px';
				} else {
					return scrollHeight + 'px';
				}
			// handle "good" browsers
			} else {
				return $(document).height() + 'px';
			}
		},

		width: function() {
			var scrollWidth,
				offsetWidth;
			// handle IE
			if ( $.browser.msie ) {
				scrollWidth = Math.max(
					document.documentElement.scrollWidth,
					document.body.scrollWidth
				);
				offsetWidth = Math.max(
					document.documentElement.offsetWidth,
					document.body.offsetWidth
				);
	
				if (scrollWidth < offsetWidth) {
					return $(window).width() + 'px';
				} else {
					return scrollWidth + 'px';
				}
			// handle "good" browsers
			} else {
				return $(document).width() + 'px';
			}
		},

		resize: function() {
			/* If the dialog is draggable and the user drags it past the
			 * right edge of the window, the document becomes wider so we
			 * need to stretch the overlay. If the user then drags the
			 * dialog back to the left, the document will become narrower,
			 * so we need to shrink the overlay to the appropriate size.
			 * This is handled by shrinking the overlay before setting it
			 * to the full document size.
			 */
			var $overlays = $([]);
			$.each($.ui.checkdialog.overlay.instances, function() {
				$overlays = $overlays.add(this);
			});

			$overlays.css({
				width: 0,
				height: 0
			}).css({
				width: $.ui.checkdialog.overlay.width(),
				height: $.ui.checkdialog.overlay.height()
			});
		}
	});

	$.extend($.ui.checkdialog.overlay.prototype, {
		destroy: function() {
			$.ui.checkdialog.overlay.destroy(this.$el);
		}
	});
})(jQuery);