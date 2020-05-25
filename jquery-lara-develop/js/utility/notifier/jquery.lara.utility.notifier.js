/* ====================================================================+
 * File name      : jquery.lara.utility.notifier.js
 * Beginning      : 2011-Nov-07
 * Last modified  : 2012-May-14
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Un notificador de informacion.
 * ====================================================================+
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 *	  jquery.ui.widget.js
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
 *     jquery.lara.utility.notifier.css
 */

/*
 * v0.0.0 | 2011-Nov-07
 *     - Creación del widget
 * 
 * v0.1.0 | 2012-Ene-20
 *   News:
 *     - none.
 *   Patching:
 *     - Se eliminó la apariencia de notificadores sencillos, ahora solo se crean los complejos.
 * 
 * v0.2.0 | 2012-Ene-25
 *   News:
 *     - Nueva funcionalidad, ahora es posible cambiar el icono durante la ejecución.
 *     - Nueva funcionalidad, ahora es posible cambiar el titulo durante la ejecución.
 *   Patching:
 *     - none.
 * 
 * v0.3.0 | 2012-Feb-01
 *   News:
 *     - Nueva funcionalidad, ahora cada instancia tendrá un controlador de colas propio.
 *       Ya no es necesario utilizar el código JavaScript: jquery.lara.utility.notifier.ctrl.js,
 *       quién anteriormente se encargaba de manejar la cola de mensajes, puesto que ahora, el
 *       mismo notifier tiene su propio motor de colas, ya no se tiene que crear un objeto para
 *       cada uno, esto involucraba manejar por separado el widget del sistema de colas.
 *   Patching:
 *     - none.
 * 
 * v0.3.1 | 2012-May-04
 *   News:
 *     - none.
 *   Patching:
 *     - Se corrigió un problema que había con el contador de mensajes. Cuando más de un mensaje
 *       se enviaba a la cola a la velocidad del procesador, el primer mensaje recibia el número del
 *       segundo, mientras que éste y los demás recibian el que les correspondia. Esto implicaba confución
 *       y la creencia de que no se alcanso a ver el primer mensaje.
 * 
 * v0.4.0 | 2012-May-14
 *   News:
 *     - Nuevos paramentros en la función message(), ahora es posible, por orden en el que se agregan a la
 *       cola los mensajes, incluir el titulo y el icono para aclarar de que trata el mensaje nuevo.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget utility notifier has been released.
 */

(function($, undefined) {
	var idIncremental = 0;
	
	$.widget("utility.notifier", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		options: {
			width: null,           // Para establecer el ancho de la notificacion, si no, el ancho es automatico.
			textSize: "1em",       // Para establecer el tamaño del texto.
			of: window,
			position: {
				my: "center top",
				at: "center top"
			},
			
			autoOpen: true,       // True para abrirse cuando es creado.
			message: null,        // Un mensaje para la inicializacion.
			icon: null,
			
			autoClose: true,      // False, el usuario lo cierra. True, el sistema lo cierra.
			title: null,          // Para indicar que notificacion es, solo si autoCerrar esta en false.
			shortcutkeys: "",     // Para cerrar la notificacion con teclado, solo si autoCerrar esta en false.
			messageCloseFormat: "Press {shortcutkey} to close this message.",
			
			delay: 2000,          // Durabilidad en la que se mantiene visible la notificacion.
			show: null,           // Efecto y/o tiempo para su visualizacion.
			hide: null            // Efecto y/o tiempo para su ocultacion.
		},
		
		_create: function() {
			var self = this
				o = self.options;
			var  title = (this.element.attr("title")) ? this.element.attr("title") : o.title;
			
			this.queue = [];      // Cola, para guardar los mensajes y su número de lugar.
			this.counter = 0;     // El contador de mensajes, y para determinar la cantidad total que varia.
			this.quantity = 0;    // Para la cantidad total inicial que se mantiene estable.
			this.interval = null; // Para guardar el intervalo que verifica la disponibilidad de mostrar el siguiente mensaje.
			
			this.element
				.addClass("ui-utility-notifier ui-widget ui-widget-content ui-corner-all")
				.attr("number", this.element.attr("id") + "-" + idIncremental++)
				.attr("role", "dialog")
				.attr("aria-hide", "true")
				.css("width", (typeof o.width === "string") ? o.width : o.width + "px")
				.hide();
			
			this.content = $('<div class="ui-utility-notifier-content" />')
				.attr("role", "content")
				.css("font-size", o.textSize)
				.appendTo(this.element);
			
			this.titlebar = $('<div class="ui-utility-notifier-titlebar ui-corner-all" />')
				.attr("role", "titlebar")
				.prependTo(this.element);
				
			this.title = $('<span class="ui-utility-notifier-title">' + title + '</span>')
				.appendTo(this.titlebar);
				
			this.buttonClose = $('<a href="#" class="ui-utility-notifier-close ui-corner-all" />')
				.appendTo(this.titlebar);
				
			this.iconClose = $('<span class="ui-icon ui-icon-close">close</span>')
				.appendTo(this.buttonClose);
					
			this.closingPane = $('<div class="ui-utility-notifier-closingpane ui-widget-content">')
				.attr("role", "closingpane")
				.appendTo(this.element);
				
			this.quantityMsg = $('<div class="ui-utility-notifier-quantity-msg" />').insertAfter(this.content);
				
			this.legend = $('<span class="ui-utility-notifier-legend"></span>')
				.appendTo(this.closingPane);
			
			this.buttonClose
				.bind("mouseover.notifier", function(event) {
					if (o.disabled) { return; }
					$(this).addClass("ui-state-hover");
					event.stopPropagation();
					event.preventDefault();
				})
				.bind("mouseout.notifier", function(event) {
					if (o.disabled) { return; }
					$(this).removeClass("ui-state-hover");
					event.stopPropagation();
					event.preventDefault();
				})
				.bind("click.notifier", function(event) {
					if (o.disabled) { return; }
					self.close();
					event.stopPropagation();
					event.preventDefault();
				});
			
			shortcut.add(o.shortcutkeys, function(event) {
				if (o.disabled) { return; }
				if (!self.element.is(":visible")) { return; }
				self.close();
			});
			
			this._icon(o.icon);
			this._legend();
		},
		
		_init: function() {
			var self = this,
				o = self.options;
				
			if (o.autoOpen) {
				this.message(o.message);
			}
		},
		
		_refresh: function() {
			var self = this,
				o = self.options;
			
			if (this.element.is(":visible")) {
				if (this.queue.length > 0) {
					this._labelQuantityMsg("Mensajes: " + (this.queue[0].nmr) + 
								  "/" + (this.quantity) + " (" + (this.queue.length - 1) + ")");
				}
			} else if (!this.element.is(":visible")) {
				if (this.queue.length > 0) {
					this.content.find("div").remove();
					this.content.append("<div>" + this.queue[0].msg + "</div>");
					if (this.queue[0].ttl != undefined) { this.title.html(this.queue[0].ttl) }
					if (this.queue[0].ico != undefined) { this._icon(this.queue[0].ico); }
					
					this._labelQuantityMsg("labelQuantityMsg", "Mensajes: " + (this.queue[0].nmr) + 
								  "/" + (this.quantity) + " (" + (this.queue.length - 1) + ")")
					this.open();
				}
			}
		},
		
		_destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			if (!this.options.autoClose) {
				this.legend.remove();
				this.quantityMsg.remove();
				this.closingPane.remove();
				this.iconClose.remove();
				this.buttonClose
					.unbind(".notifier")
					.remove();
				this.title.remove();
				this.titlebar.remove();
				
				shortcut.remove(this.options.shortcutkeys);
			}
			
			this.content.remove();
			this.element
				.removeClass("ui-utility-notifier ui-widget ui-widget-content ui-corner-all")
				.removeAttr("role")
				.removeAttr("aria-hide")
				.removeAttr("style")
				.show();
		},
		
		_setInterval: function() {
			var self = this;
			
			this.interval = setInterval(function() { self._refresh(); }, 100);
		},
		
		_removeInterval: function() {
			var self = this;
			
			clearInterval(self.interval);
			this.interval = null;
		},
		
		_addQueue: function(message, title, icon) {
			this.queue.push({
				nmr: (this.counter + 1),
				msg: message,
				ttl: title,
				ico: icon
			});
			this.counter++;
			this.quantity = this.counter;
		},
		
		_removeQueue: function() {
			var self = this;
			
			this.queue.shift();
		
			if (!(this.queue.length > 0)) {
				this.counter = 0;
				/*
				this._labelQuantityMsg("Mensajes: " + ((this.quantity === 1) ? this.quantity : (this.quantity + 1)) +
							 "/" + ((this.quantity === 1) ? this.quantity : (this.quantity + 1)) + 
							 " (" + (this.queue.length) + ")");
				*/
				this._removeInterval();
			}
		},
		
		_labelQuantityMsg: function(msg) {
			this.quantityMsg.html(msg);
		},
		
		message: function(message, title, icon) {
			var self = this,
				o = self.options;
				
			this._addQueue(message, title, icon);
		
			if (this.interval === null) { self._setInterval(); }
		},
		
		_legend: function() {
			var self = this,
				o = self.options,
				legend = "";
			
			legend = o.messageCloseFormat;
			legend = legend.replace("{shortcutkey}", o.shortcutkeys);
			this.legend.html(legend);
		},
		
		_icon: function(icon) {
			this.content
				.find(".ui-icon")
					.remove();
					
			this.content
				.prepend('<span class="ui-icon ' + icon + '"></span>');
		},
		
		open: function() {
			var self = this,
				o = self.options;
			
			if (o.show !== null) {
				this.element
					.css({ top: 0, left: 0 })
					.position($.extend({ of: o.of }, o.position))
					.show(o.show)
					.attr("aria-hide", "false");
			} else {
				this.element
					.css({ top: 0, left: 0 })
					.position($.extend({ of: o.of }, o.position))
					.show()
					.attr("aria-hide", "false");
			}
			
			if (o.autoClose) {
				this.timer = setTimeout(function() {
					self.close();
				}, o.delay);
			}
		},
		
		close: function() {
			var self = this,
				o = self.options;
			
			this._removeQueue();
			
			if (o.hide !== null) {
				this.element
					.hide(o.hide)
					.attr("aria-hide", "true");
			} else {
				this.element
					.hide()
					.attr("aria-hide", "true");
			}
			
			if (o.autoClose) {
				clearTimeout(this.timer);
			}
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
		},
		
		_setOption: function(key, value) {
			var self = this,
				o = self.options;
			
			switch (key) {
				case "icon":
					this._icon(value);
					break;
				case "title":
					this.title.html(value);
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);