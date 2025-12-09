(function($) {
	'use strict';

	var baseUrl = window.location.origin;
	var languageCode, mode, rooms, roomsScrollTopPosition, theIx, activeSelectBoxMonth, activeSelectBoxDirection;
	rooms = [];
	var adultsLimitValue = 6,
		adultsDefaultValue = 1,
		childsLimitValue = 5,
		childsDefaultValue = 0;

	var bookingResources;

	function initializeLanguage() {
		languageCode = document.documentElement.lang;

		if(languageCode == "sv-SE") {
			bookingResources = { 
				"calculationsResources": { "Adult": "vuxen", "Adults": "vuxna", "Child": "barn", "Childs": "barn", "Room": "rum", "Rooms": "rum" }, 
				"chambreResources": { "Adults": "Vuxna", "ChildrenAge": "0-12 år", "Childrens": "Barn", "RemoveRoom": "Ta bort rum", "Room": "Rum" }
			};

			// Only set text if elements exist
			var addRoomsEl = document.getElementById("addRooms");
			var bookingCancelEl = document.getElementById("bookingCancel");
			var promoCodeEl = document.getElementById("promoCode");
			var bookingButtonEl = document.getElementById("bookingButton");

			if (addRoomsEl) addRoomsEl.textContent = "Lägg till rum";
			if (bookingCancelEl) bookingCancelEl.textContent = "Klar";
			if (promoCodeEl) promoCodeEl.placeholder = "Bokningskod";
			if (bookingButtonEl) bookingButtonEl.value = "Sök";
		}
		else {
			bookingResources = { 
				"calculationsResources": { "Adult": "Adult", "Adults": "Adults", "Child": "Child", "Childs": "Childs", "Room": "Room", "Rooms": "Room" }, 
				"chambreResources": { "Adults": "Adults", "ChildrenAge": "0-12 year", "Childrens": "Childrens", "RemoveRoom": "Remove Room", "Room": "Room" }
			};
		}
	}

	function InitializeBookings() {
		
		// Check if required elements exist before initializing
		if (!$('#booking-rooms-panel').length || !$('#booking-calendar').length) {
			return;
		}

		$("#booking-rooms-panel").on("click", function(event) {
			event.stopPropagation();
		});

		$("#booking-close-rooms").on("click", function() {
			var panel = document.getElementById("booking-rooms-panel");
			if (panel) panel.style.display = "none";
		});

		$("#booking-add-chambre").on("click", function() {
			if (AddRoom(), AddChambre(), OnAddRoomScroll(), rooms.length >= 9) {
				var n = document.getElementsByClassName("cs-bw-booking-rooms-panel__add-chambre")[0];
				if (n) n.style.display = "none";
			}
		});

		// Click Handling
		$("#booking-calendar").on("click", function(event) {
			event.stopPropagation();
			$(".cs-bw-booking-rooms-panel").hide();
		});

		$("#booking-rooms").on("click", function(event) {
			event.stopPropagation();
			var panel = document.getElementById("booking-rooms-panel");
			if (panel) panel.style.display = "flex";
		});

		$("#booking-codes").on("click", function(event) {
			event.stopPropagation();
			$(".cs-bw-booking-rooms-panel").hide();
		});

		$(document).mouseup(function(e) {
			var container = $("#booking-rooms-panel");
			// if the target of the click isn't the container nor a descendant of the container
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				container.hide();
			}
		});

		AddRoom();
		AddChambre();
		SetRoomsScrollEvent();
	}

	function CloseOthersBookingElements(n) {
		var bookingRooms = $("#booking-rooms")[0];
		if (bookingRooms && bookingRooms.id != n.id) {
			$(".cs-bw-booking-rooms-panel").hide();
		}
		var datepicker = document.getElementById("booking-datepicker");
		if (datepicker) datepicker.style.display = "none";
	}

	function RoomObject(n, t) {
		this.adultCount = n;
		this.childrensAge = t;
	}

	function AddRoom() {
		var n = rooms.length;
		if (n < 9) {
			rooms.push(new RoomObject(1, []));
			UpdateBookingCalculations();
		}
	}

	function RemoveRoom(n) {
		rooms.splice(n, 1);
		UpdateBookingCalculations();
	}

	function AddChild(n, t) {
		var i = rooms[n].childrensAge.length;
		if (i < 5) {
			rooms[n].childrensAge.push(t);
			UpdateBookingCalculations();
		}
	}

	function RemoveChild(n) {
		rooms[n].childrensAge.pop();
		UpdateBookingCalculations();
	}

	function AddAdult(n) {
		var t = rooms[n].adultCount;
		if (t < 6) {
			rooms[n].adultCount += 1;
			UpdateBookingCalculations();
		}
	}

	function RemoveAdult(n) {
		var t = rooms[n].adultCount;
		if (t > 1) {
			rooms[n].adultCount -= 1;
			UpdateBookingCalculations();
		}
	}

	function UpdateBookingCalculations() {
		var u, i = rooms.length, n = 0, t = 0;
		
		for (var r = 0; r < rooms.length; r++) {
			u = rooms[r];
			n += u.adultCount;
			t += u.childrensAge.length;
		}

		var e = n == 1 ? bookingResources.calculationsResources.Adult : bookingResources.calculationsResources.Adults,
			s = t == 1 ? bookingResources.calculationsResources.Child : bookingResources.calculationsResources.Childs,
			o = i == 1 ? bookingResources.calculationsResources.Room : bookingResources.calculationsResources.Rooms,
			f;

		f = t > 0 ? n + " " + e + ", " + t + " " + s + ", " + i + " " + o : n + " " + e + ", " + i + " " + o;
		
		var roomsCalc = document.getElementById("booking-rooms-calculations");
		var bookingCalc = document.getElementById("booking-calculations");
		var numberOfRooms = document.getElementById("numberOfRooms");

		if (roomsCalc) roomsCalc.value = f;
		if (bookingCalc) bookingCalc.innerText = f;
		if (numberOfRooms) numberOfRooms.value = i;
	}

	function ScrollInRoomsPanel() {
		var n = document.getElementById("rooms-panel-chambers");
		if (n) {
			n.scrollTop = roomsScrollTopPosition;
		}
	}

	function SetRoomsScrollEvent() {
		var n = document.getElementById("rooms-panel-chambers");
		if (n) {
			n.addEventListener("scroll", function(event) {
				roomsScrollTopPosition = event.target.scrollTop;
			});
		}
	}

	function OnAddRoomScroll() {
		var chamber = document.getElementById("rooms-panel-chambers");
		if (chamber) {
			var n = chamber.scrollHeight;
			chamber.scrollTop = n;
		}
	}

	function AddChambre() {
		var i = document.getElementById("chambers-container");
		if (!i) return;

		var t = document.getElementsByClassName("cs-bw-booking-chambre");
		if (t.length >= 9) return;

		var r = t.length + 1,
			n = "chambre-" + (t.length + 1),
			u = '<div id="' + n + '" class="cs-bw-booking-chambre">' + 
			'<h6>' + bookingResources.chambreResources.Room + " " + r + '</h6>' + 
			'<div class="cs-bw-booking-chambre__adults"><span>' + bookingResources.chambreResources.Adults + '</span>' + 
			'<div class="cs-bw-booking-round-input">' + 
			'<div class="cs-bw-booking-round-input__decrement">' + 
			'<button type="button" id="' + n + '-decrement-adults-button" onclick="window.DecrementAdultsInputValue(\'' + n + '\')"><img src="' + baseUrl + '/wp-content/plugins/bwse-booking-elementor/assets/images/minus-circled.svg" /></button></div>' + 
			'<div class="cs-bw-booking-round-input__value"><input type="text" id="' + n + '-adults-input-value" name="numAdults[' + t.length + ']" readonly></input></div>' + 
			'<div class="cs-bw-booking-round-input__increment"><button type="button" id="' + n + '-increment-adults-button" onclick="window.IncrementAdultsInputValue(\'' + n + '\')"><img src="' + baseUrl + '/wp-content/plugins/bwse-booking-elementor/assets/images/plus-circled.svg" /></button></div></div></div>'+
			'<div class="cs-bw-booking-chambre__childs"><div class="cs-bw-booking-chambre-childs-age">' + 
			'<span class="cs-bw-booking-chambre-childs-age__child">' + bookingResources.chambreResources.Childrens + '</span>' + 
			'<span class="cs-bw-booking-chambre-childs-age__age">' + bookingResources.chambreResources.ChildrenAge + '</span></div>' + 
			'<div class="cs-bw-booking-round-input"><div class="cs-bw-booking-round-input__decrement">' + 
			'<button type="button" id="' + n + '-decrement-childs-button" onclick="window.DecrementChildsInputValue(\'' + n + '\')"><img src="' + baseUrl + '/wp-content/plugins/bwse-booking-elementor/assets/images/minus-circled.svg" /></button></div>' + 
			'<div class="cs-bw-booking-round-input__value"><input type="text" id="' + n + '-childs-input-value" name="numChild[' + t.length + ']" readonly></input></div>' + 
			'<div class="cs-bw-booking-round-input__increment"><button type="button" id="' + n + '-increment-childs-button" onclick="window.IncrementChildsInputValue(\'' + n + '\')"><img src="' + baseUrl + '/wp-content/plugins/bwse-booking-elementor/assets/images/plus-circled.svg" /></button></div></div></div>' + 
			'<div class="cs-bw-booking-chambre__remove-chamber"><button type="button" onclick="window.RemoveChambre(\'' + n + '\')"><img src="' + baseUrl + '/wp-content/plugins/bwse-booking-elementor/assets/images/minus.svg" /><span>' + bookingResources.chambreResources.RemoveRoom + "</span></button></div></div>";
		
		i.insertAdjacentHTML("beforeend", u);
		SetDefaultChambreValues(n, t);
		
		if (r == 1) {
			var removeButtons = i.getElementsByClassName("cs-bw-booking-chambre__remove-chamber");
			if (removeButtons.length > 0) {
				removeButtons[0].style.display = "none";
			}
		}
	}

	function RemoveChambre(n) {
		var element = document.getElementById(n);
		if (element) {
			element.remove();
			ReOrderChambres();
			RemoveRoom(n.slice(-1) - 1);
			
			if (rooms.length < 9) {
				var t = document.getElementsByClassName("cs-bw-booking-rooms-panel__add-chambre")[0];
				if (t) t.style.display = "block";
			}
			ScrollInRoomsPanel();
		}
	}

	function ReOrderChambres() {
		var l = document.getElementsByClassName("cs-bw-booking-chambre");
		
		for (var t = 0; t < l.length; t++) {
			var n = l[t];
			var e = t + 1;
			n.id = "chambre-" + e;
			
			var h6 = n.getElementsByTagName("h6")[0];
			if (h6) {
				h6.innerText = bookingResources.chambreResources.Room + " " + e;
			}
			
			var s = n.getElementsByClassName("cs-bw-booking-chambre__remove-chamber")[0];
			if (s) {
				var a = s.getElementsByTagName("button")[0];
				if (a) a.setAttribute("onclick", "window.RemoveChambre('" + n.id + "')");
			}
			
			var adultsDecrement = n.querySelector(".cs-bw-booking-chambre__adults .cs-bw-booking-round-input__decrement button");
			if (adultsDecrement) {
				adultsDecrement.id = n.id + "-decrement-adults-button";
				adultsDecrement.setAttribute("onclick", "window.DecrementAdultsInputValue('" + n.id + "')");
			}
			
			var adultsInput = n.querySelector(".cs-bw-booking-chambre__adults .cs-bw-booking-round-input__value input");
			if (adultsInput) {
				adultsInput.id = n.id + "-adults-input-value";
			}
			
			var adultsIncrement = n.querySelector(".cs-bw-booking-chambre__adults .cs-bw-booking-round-input__increment button");
			if (adultsIncrement) {
				adultsIncrement.id = n.id + "-increment-adults-button";
				adultsIncrement.setAttribute("onclick", "window.IncrementAdultsInputValue('" + n.id + "')");
			}
			
			var childsDecrement = n.querySelector(".cs-bw-booking-chambre__childs .cs-bw-booking-round-input__decrement button");
			if (childsDecrement) {
				childsDecrement.id = n.id + "-decrement-childs-button";
				childsDecrement.setAttribute("onclick", "window.DecrementChildsInputValue('" + n.id + "')");
			}
			
			var childsInput = n.querySelector(".cs-bw-booking-chambre__childs .cs-bw-booking-round-input__value input");
			if (childsInput) {
				childsInput.id = n.id + "-childs-input-value";
			}
			
			var childsIncrement = n.querySelector(".cs-bw-booking-chambre__childs .cs-bw-booking-round-input__increment button");
			if (childsIncrement) {
				childsIncrement.id = n.id + "-increment-childs-button";
				childsIncrement.setAttribute("onclick", "window.IncrementChildsInputValue('" + n.id + "')");
			}
		}
	}

	function SetDefaultChambreValues(n) {
		var adultsInput = document.getElementById(n + "-adults-input-value");
		var childsInput = document.getElementById(n + "-childs-input-value");

		if (adultsInput) adultsInput.value = adultsDefaultValue;
		if (childsInput) childsInput.value = childsDefaultValue;

		ManageInputs("", n + "-decrement-adults-button", adultsDefaultValue, adultsDefaultValue, adultsLimitValue);
		ManageInputs("", n + "-decrement-childs-button", childsDefaultValue, childsDefaultValue, childsLimitValue);
	}

	function DecrementValue(n) {
		var n = parseInt(n);
		return n - 1;
	}

	function IncrementValue(n) {
		var n = parseInt(n);
		return n + 1;
	}

	function DecrementAdultsInputValue(n) {
		var t = document.getElementById(n + "-adults-input-value");
		if (!t) return;
		
		t.value = DecrementValue(t.value);
		ManageInputs(n + "-increment-adults-button", n + "-decrement-adults-button", t.value, adultsDefaultValue, adultsLimitValue);
		RemoveAdult(n.slice(-1) - 1);
	}

	function IncrementAdultsInputValue(n) {
		var t = document.getElementById(n + "-adults-input-value");
		if (!t) return;
		
		t.value = IncrementValue(t.value);
		ManageInputs(n + "-increment-adults-button", n + "-decrement-adults-button", t.value, adultsDefaultValue, adultsLimitValue);
		AddAdult(n.slice(-1) - 1);
	}

	function DecrementChildsInputValue(n) {
		var t = document.getElementById(n + "-childs-input-value");
		if (!t) return;
		
		t.value = DecrementValue(t.value);
		ManageInputs(n + "-increment-childs-button", n + "-decrement-childs-button", t.value, childsDefaultValue, childsLimitValue);
		RemoveChild(n.slice(-1) - 1);
	}

	function IncrementChildsInputValue(n) {
		var t = document.getElementById(n + "-childs-input-value");
		if (!t) return;
		
		t.value = IncrementValue(t.value);
		ManageInputs(n + "-increment-childs-button", n + "-decrement-childs-button", t.value, childsDefaultValue, childsLimitValue);
		AddChild(n.slice(-1) - 1);
	}

	function ManageInputs(n, t, i, r, u) {
		var f = n ? document.getElementById(n) : null;
		var e = document.getElementById(t);
		
		if (f) {
			if (i >= u) {
				f.setAttribute("disabled", "");
			} else {
				f.removeAttribute("disabled");
			}
		}
		
		if (e) {
			if (i > r) {
				e.removeAttribute("disabled");
			} else {
				e.setAttribute("disabled", "");
			}
		}
	}

	// Expose functions to window object for inline onclick handlers
	window.RemoveChambre = RemoveChambre;
	window.DecrementAdultsInputValue = DecrementAdultsInputValue;
	window.IncrementAdultsInputValue = IncrementAdultsInputValue;
	window.DecrementChildsInputValue = DecrementChildsInputValue;
	window.IncrementChildsInputValue = IncrementChildsInputValue;

	// Initialize when DOM is ready
	$(function() {
		initializeLanguage();
		InitializeBookings();
	});

})(jQuery);