/* ====================================================================+
 * Nombre del Archivo : jquery.lara.utility.ctrl.notifier.js
 * Comienzo			  : 2011-Nov-10
 * Ultima Modificacion: 2011-Dic-09
 * 
 * Autor			  : Lara E.M.S. Roman
 * version			  : 1.0.1
 * 
 * Descripcion		  : Un sistema que controla las notificaciones.
 * ====================================================================+
 */

/**
 * Un sistema que controla las notificaciones.
 * @author Lara E.M.S. Roman
 * @since 2011-Nov-10
 * @version 1.0.1
 */

/*
 * js file depends:
 * 	jQuery:
 *    jquery.ui.core.js
 * 
 *  Aperos-Lara:
 *    jquery.lara.utility.notifier.js
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

/**
 * Descripcion Detallada:
 *      CtrldNotificador(), es un sistema que presenta en orden las notificaciones que,
 *      cualquier programa que lo use, pueda mandar sus notificaciones a la cola.
 *      
 *      Tiene la capacidad de controlar en general todos los tipos de notificadores que
 *      hayan sido creados, o si se prefiere, puede crear tantos Controladores de Notificaciones
 *      como tipos de notificadores que puedan haber, es decir, cada notificador tendría su propio
 *      controlador.
 */

function ctrlnotifier(notifier) {
	var self = this;
	var queue = [];
	var counter = 0;
	var quantity = 0;
	var interval = null;
	var actualNotifier = null;
	var actualNotifierNumber = 0;
	var specificNotices = (notifier === "" || notifier === null || notifier === undefined) ? ":utility-notifier" : notifier;
	
	var setNotificationInterval = function() {
		interval = setInterval(readVisibility, 100);
	}
	
	var removeInterval = function() {
		clearInterval(interval);
		interval = null;
	}
	
	var readVisibility = function() {
		if ($(specificNotices).is(":visible")) {
			if (queue.length > 0) {
				$(actualNotifier)
					.notifier("labelQuantityMsg", "Mensajes: " + (queue[0].nmr) + 
								 "/" + (quantity + 1) + " (" + (queue.length) + ")");
			}
		} else if (!$(specificNotices).is(":visible")) {
			if (queue.length > 0) {
				$(queue[0].ntf)
					.notifier("message", queue[0].msg)
					.notifier("labelQuantityMsg", "Mensajes: " + (queue[0].nmr) + 
								 "/" + (quantity + 1) + " (" + (queue.length) + ")")
					.notifier("open");
				
				actualNotifier = queue[0].ntf;
				actualNotifierNumber = queue[0].nmr;
				removeQueue();
			}
		}
	}
	
	self.newMessage = function(notifier, message) {
		var notifier = (notifier === "" || notifier === null || notifier === undefined) ? specificNotices : notifier;
		
		addQueue(notifier, message);
		
		if (interval === null) { setNotificationInterval(); }
	}
	
	var addQueue = function(notifier, message) {
		queue.push({
			ntf: notifier,
			msg: message,
			nmr: (counter + 1)
		});
		counter++;
		quantity = counter;
	}
	
	var removeQueue = function() {
		queue.shift();
		
		if (!(queue.length > 0)) {
			counter = 0;
			
			$(actualNotifier)
				.notifier("labelQuantityMsg", "Mensajes: " + ((quantity === 1) ? quantity : (quantity + 1)) +
							 "/" + ((quantity === 1) ? quantity : (quantity + 1)) + 
							 " (" + (queue.length) + ")");
			
			removeInterval();
							 
		}
	}
};
