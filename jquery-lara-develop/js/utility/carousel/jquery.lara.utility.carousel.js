/* ====================================================================+
 * File name      : jquery.lara.utility.carousel.js
 * Beginning      : 2012-Mar-17
 * Last modified  : 2012-Mar-17
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 0.0.0.0
 * version widget :   0.0.0
 * 
 * Description    : Un carrusel de imagenes y/o elementos cuales quiera.
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
 *     jquery.lara.utility.carousel.css
 */

/*
 * v0.0.0 | 2012-Mar-17
 *     - Creación del widget.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-May-04
 *     - widget utility carousel has been released.
 */

(function($, undefined) {
	$.widget("utility.carousel", {
		versionLibrary: "0.0.0.0",
		version: "0.0.0",
		
		_actual: true,
		
		options: {
			fps: [1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1]
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.carousel = this.element
				.addClass("ui-utility-carousel")
				.attr("role", "carousel");
			
			this.viewfinder = $('<div></div>')
				.addClass("ui-utility-carousel-viewfinder");
			this.carousel.wrap(this.viewfinder);
			this.viewfinder = this.carousel.parent();
			
			this.counter = $('<ul></ul>')
				.addClass("ui-utility-carousel-counter")
				.attr("role", "counter-carousel")
				.insertAfter(this.viewfinder);
			
			this.refresh();
			
			this.viewfinder
				.prev(".ui-utility-carousel-prev")
				.bind("click.carousel", function() {
					if (o.disabled) { return; }
					self._slide(1);
				})
				.css("margin-top", (this.viewfinder.outerHeight() / 2));
			this.viewfinder
				.next(".ui-utility-carousel-next")
				.bind("click.carousel", function() {
					if (o.disabled) { return; }
					self._slide(-1);
				})
				.css("margin-top", (this.viewfinder.outerHeight() / 2));
		},
		
		_init: function() {
			this.index = 0;
			this._select(this.index);
		},
		
		refresh: function() {
			var desktops = this.desktops = this.element
				.children("div:not(.ui-utility-carousel-desktop)")
				.addClass("ui-utility-carousel-desktop ui-widget ui-helper-reset")
				.attr("role", "desktop-carousel");
			
			this.desktopsTotal = this.desktops.length - 1;
			
			this._resize();
			this._createControls();
			this._createCounter();
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			this.viewfinder
				.prev(".ui-utility-carousel-prev")
				.unbind(".carousel")
				.remove();
			this.viewfinder
				.next(".ui-utility-carousel-next")
				.unbind(".carousel")
				.remove();
			this.counter
				.removeClass("ui-utility-carousel-counter")
				.removeAttr("role")
				.remove();
			this.viewfinder
				.removeClass("ui-utility-carousel-viewfinder");
			this.carousel
				.unwrap()
				.removeClass("ui-utility-carousel")
				.removeAttr("role")
				.css("position", "")
				.css("height", "")
				.css("width", "");
			this.carousel
				.children()
				.removeClass("ui-utility-carousel-desktop ui-widget ui-helper-reset")
				.removeAttr("role")
				.css("float", "")
				.css("height", "")
				.css("width", "")
				.css("top", "")
				.css("left", "");
		},
		
		_resize: function() {
			var self = this;
				o = self.options,
				highest = 0;
			
			this.width = this.viewfinder.outerWidth();
			
			for (i=0; i <= this.desktopsTotal; i++) {
				var height = this.desktops.eq(i).outerHeight();
				
				(height > highest) ? highest = height : highest = highest;
			}
			
			this.viewfinder
				.css({
					"height": (highest) + "px",
					"width": (this.width) + "px"
				});
			this.carousel
				.css({
					"height": (highest) + "px",
					"width": (this.width * this.desktops.length) + "px",
					"position": "absolute",
					"top": 0,
					"left": 0
				});
    	
    		for(i=0; i <= this.desktopsTotal; i++){
    			this.desktops.eq(i)
    				.css({
    					"height": (highest) + "px",
    					"width": (this.width) + "px",
    					"float": "left"
    				});
    		}
		},
		
		_createControls: function() {
			var self = this,
				o = self.options;
			
			var buttonPrev = $('<button></button>')
				.addClass("ui-utility-carousel-prev ui-utility-carousel-controls")
				.insertBefore(this.viewfinder);
			var buttonNext = $('<button></button>')
				.addClass("ui-utility-carousel-next ui-utility-carousel-controls")
				.insertAfter(this.viewfinder);
		},
		
		_createCounter: function() {
			var self = this,
				o = self.options;
			
			this.counter.children().remove();
			this.counter.width(this.width);
			
			for (i=0; i <= this.desktopsTotal; i++) {
				this.counter.append('<li>' + (i + 1) + '</li>');
			}
		},
		
		_slide: function(x) {
			var self = this,
				o = self.options;
			
			if (this._actual) {
				if ((x === -1 && this.index != this.desktopsTotal) || (x === 1 && this.index != 0)) {
					this._actual = false;
					var position = 0;
					
					this.interval = setInterval(function() {
						if (position < o.fps.length) {
							var ini = parseFloat(self.carousel.css("left"));
							
							self.carousel.css("left", (ini + ((self.width * (o.fps[position] / 100)) * x)) + 'px');
							position++;
						} else {
							self._unselect(self.index);
							(x == -1) ? self.index++ : self.index--;
							self._select(self.index);
							position = 0;
							self._actual = true;
							clearInterval(self.interval);
						}
					}, 50);
				}
			}
		},
		
		_select: function(index) {
			this.counter.children().eq(index).addClass("ui-utility-carousel-selected");
		},
		
		_unselect: function(index) {
			this.counter.children().eq(index).removeClass("ui-utility-carousel-selected");
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			this.refresh();
		},
		
		_setOption: function(key, value) {
			var self = this,
				o = self.options;
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);