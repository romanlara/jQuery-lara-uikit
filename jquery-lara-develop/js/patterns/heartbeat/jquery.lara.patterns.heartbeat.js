/* ====================================================================+
 * File name     : jquery.lara.patterns.heartbeat.js
 * Beginning     : 2011-Feb-11
 * Last modified : 2012-Feb-14
 * 
 * Author        : Lara E.M.S. Roman
 * version       : 1.0.0
 * 
 * Description   : Un latido de corazón, para indicarle al servidor que
 *                 el usuario está trabajando, y así, no cierre su sesión.
 * ====================================================================+
 */

/**
 * Un latido de corazón, para indicarle al servidor que
 * el usuario está trabajando, y así, no cierre su sesión.
 * @author Lara E.M.S. Roman
 * @since 2011-Feb-11
 * @version 1.0.0
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
 *     none
 * 
 *   Aperos-Lara:
 *     none
 */

/*
 * v1.0.0 | 2011-Feb-07
 *     - Creación del widget
 */

(function($, undefined) {
	$.widget("patterns.heartbeat", {
		version: "1.0.0",
		
		options: {
			url: "",
			delay: 3000,
			autoStart: true,
			autoRestart: true
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.heartIsAlive = false;
			
			this.element
				.hide()
				.ajaxStart(function() {
					if (self.heartIsAlive) {
						self.stop();
					}
				})
				.ajaxStop(function() {
					if (o.autoRestart) {
						if (!self.heartIsAlive) {
							self.start();
						}
					}
				});
		},
		
		_init: function() {
			if (this.options.autoStart) {
				if (!this.heartIsAlive) {
					this.start();
				}
			}
		},
		
		refresh: function() {
			
		},
		
		destroy: function() {
			this.stop();
		},
		
		start: function() {
			var self = this,
				o = self.options;
			
			this.heartIsAlive = true;
			
			this.timer = setInterval(function() {
				$.ajax({
					url: o.url,
					success: function() {
						$("#log").notelog("addLog", "Heartbeat", "Late");
						if (!o.autoRestart) {
							self.start();
						}
					}
				});
			}, o.delay);
		},
		
		stop: function() {
			var self = this,
				o = self.options;
			
			$("#log").notelog("addLog", "Heartbeat", "Muere");
			clearInterval(this.timer);
			this.heartIsAlive = false;
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			this.refresh();
		},
		
		_setOption: function(key, value) {
			var self = this,
				o = self.options;
			
			switch (key) {
				case "disabled":
					if (value) {
						self.element
							.removeClass("design-heartbeat-disabled ui-state-disabled")
					}
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);