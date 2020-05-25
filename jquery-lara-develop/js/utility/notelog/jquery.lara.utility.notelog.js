/* ====================================================================+
 * File name      : jquery.lara.utility.notelog.js
 * Beginning      : 2012-Ene-17
 * Last modified  : 2012-Ene-17
 * 
 * Author         : Lara E.M.S. Roman
 * version lib    : 1.0.0
 * version widget : 1.0.0
 * 
 * Description    : Una bitacora de actividades.
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
 *     jquery.lara.utility.notelog.css
 */

/*
 * v0.0.0 | 2012-Ene-17
 *     - Creación del widget.
 * 
 * ---------------------------------------------------------------------------------------------------
 * v1.0.0 | 2012-Jul-26
 *     - widget utility notelog has been released.
 */

(function($, undefined) {
	$.widget("utility.notelog", {
		versionLibrary: "1.0.0",
		version: "1.0.0",
		
		options: {
			oddColor: "#eee",
			evenColor: "#fff",
			oddTextColor: "",
			evenTextColor: "",
			
			width: "100%",
			height: "auto",
			
			timeFormat: "[hh]:[mm]:[ss]",
			dateFormat: "[yy]/[mm]/[dd]", // Se aceptan {dayName} & {monthName}
			messageFormat: "({date}-{time}) {scope}: {msg}",
			
			dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			monthNames: ['January','February','March','April','May','June',
			             'July','August','September','October','November','December'],
			             
			militaryTime: false
		},
		
		_create: function() {
			var self = this,
				o = self.options;
			
			this.notelog = this.element
				.addClass("ui-utility-notelog ui-widget ui-widget-content")
				.attr("role", "log")
				.css({
					width: o.width,
					height: o.height
				});
			
			if (!this.notelog.children().is("div")) {
				this.content = $("<div></div>")
					.addClass("ui-utility-notelog-content")
					.appendTo(this.notelog);
			} else {
				this.content = this.notelog
					.children()
					.addClass("ui-utility-notelog-content");
			}
			
			this.refresh();
		},
		
		refresh: function() {
			var self = this,
				o = self.options,
				height = this.content.height(),
				positionPixels = 100 / 100 * height;;
			
			this.content
				.find("span:odd")
					.css("background-color", o.oddColor)
					.css("color", o.oddTextColor)
				.end()
				.find("span:even")
					.css("background-color", o.evenColor)
					.css("color", o.evenTextColor);
	
			this.notelog
				.scrollTop(positionPixels);
		
		},
		
		destroy: function() {
			$.Widget.prototype.destroy.call(this, arguments);
			
			this.content
				.removeClass("ui-utility-notelog-content");
			
			this.element
				.removeClass("ui-utility-notelog ui-widget ui-widget-content")
				.removeAttr("role");
		},
		
		addLog: function(scope, msg) {
			var self = this,
				o = self.options,
				objDate = new Date(),
				day = objDate.getDay(),
				date = objDate.getDate(),
				month = objDate.getMonth(),
				year = objDate.getFullYear(),
				hours = objDate.getHours(),
				minutes = objDate.getMinutes(),
				seconds = objDate.getSeconds(),
				meridiem = "",
				fullTime = "",
				fullDate = "",
				fullMessage = "";
			
			if (o.militaryTime) {
				if(hours >= 12) {
					hours -= 12;
					meridiem = " p.m.";
				} else {
					meridiem = " a.m.";
				}
			}
			
			fullTime = o.timeFormat;
			fullDate = o.dateFormat;
			fullMessage = o.messageFormat;
			
			fullTime = o.timeFormat + meridiem;
			
			fullTime = fullTime.replace("[hh]", this._getTwoDigits(hours));
			fullTime = fullTime.replace("[mm]", this._getTwoDigits(minutes));
			fullTime = fullTime.replace("[ss]", this._getTwoDigits(seconds));
			
			fullDate = fullDate.replace("[dd]", date);
			fullDate = fullDate.replace("{dayName}", this._getDayName(day));
			fullDate = fullDate.replace("{monthName}", this._getMonthName(month));
			fullDate = fullDate.replace("[mm]", this._getTwoDigits(month + 1));
			fullDate = fullDate.replace("[yy]", year);
			
			fullMessage = fullMessage.replace("{scope}", scope);
			fullMessage = fullMessage.replace("{date}", fullDate);
			fullMessage = fullMessage.replace("{time}", fullTime);
			fullMessage = fullMessage.replace("{msg}", msg);
			
			this.content
				.append("<span style='display: block;'>" + fullMessage + "</span>");
			
			this.refresh();
		},
		
		_getTwoDigits: function(digit) {
			return (digit >= 10) ? digit : '0' + digit;
		},
		
		_getDayName: function(digit) {
			return this.options.dayNames[digit];
		},
		
		_getMonthName: function(digit) {
			return this.options.monthNames[digit];
		},
		
		_setOptions: function() {
			$.Widget.prototype._setOptions.apply(this, arguments);
			this.refresh();
		},
		
		_setOption: function(key, value) {
			var self = this,
				o = self.options;
			
			switch(key) {
				case "width":
					this.notelog.css("width", o.width);
					break;
				case "height":
					this.notelog.css("height", o.height);
					break;
			}
			
			$.Widget.prototype._setOption.call(this, key, value);
		}
	});
})(jQuery);
