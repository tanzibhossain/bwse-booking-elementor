var languageCode, mode, rooms, roomsScrollTopPosition, theIx, activeSelectBoxMonth, activeSelectBoxDirection;
rooms = [];
var adultsLimitValue = 6,
	adultsDefaultValue = 1,
	childsLimitValue = 5,
	childsDefaultValue = 0

languageCode = document.documentElement.lang;

if(languageCode == "sv-SE") {
	var bookingResources = { 
		"calculationsResources": { "Adult": "vuxen", "Adults": "vuxna", "Child": "barn", "Childs": "barn", "Room": "rum", "Rooms": "rum" }, 
		"chambreResources": { "Adults": "Vuxna", "ChildrenAge": "0-12 år", "Childrens": "Barn", "RemoveRoom": "Ta bort rum", "Room": "Rum" }
	};

	document.getElementById("addRooms").textContent= "Lägg till rum";
	document.getElementById("bookingCancel").textContent= "Klar";
	document.getElementById("promoCode").placeholder= "Bokningskod";
	document.getElementById("bookingButton").value= "Sök";
}
else {
	var bookingResources = { 
		"calculationsResources": { "Adult": "Adult", "Adults": "Adults", "Child": "Child", "Childs": "Childs", "Room": "Room", "Rooms": "Room" }, 
		"chambreResources": { "Adults": "Adults", "ChildrenAge": "0-12 year", "Childrens": "Childrens", "RemoveRoom": "Remove Room", "Room": "Room" }
	};
}

function InitializeBookings() {
	
	jQuery("#booking-rooms-panel").on("click", function() {
		event.stopPropagation();
	});

	jQuery("#booking-close-rooms").on("click", function() {
		document.getElementById("booking-rooms-panel").style.display = "none"
	});

	jQuery("#booking-add-chambre").on("click", function() {
		if (AddRoom(), AddChambre(), OnAddRoomScroll(), rooms.length >= 9) {
			var n = document.getElementsByClassName("cs-bw-booking-rooms-panel__add-chambre")[0];
			n.style.display = "none"
		}
	});

	// Click Handling
	jQuery("#booking-calendar").on("click", function() {
		event.stopPropagation();
		jQuery(".cs-bw-booking-rooms-panel").hide()
	});

	jQuery("#booking-rooms").on("click", function() {
		event.stopPropagation();
		document.getElementById("booking-rooms-panel").style.display = "flex";
	});

	jQuery("#booking-codes").on("click", function() {
		event.stopPropagation();
		jQuery(".cs-bw-booking-rooms-panel").hide()
	});

	jQuery(document).mouseup(function(e) {
		var container = jQuery("#booking-rooms-panel");
		// if the target of the click isn't the container nor a descendant of the container
		if (!container.is(e.target) && container.has(e.target).length === 0) 
		{
			container.hide();
		}
	});
	
	AddRoom();
	AddChambre();
	SetRoomsScrollEvent();
}

function CloseOthersBookingElements(n) {
	jQuery("#booking-rooms")[0].id != n.id && jQuery(".cs-bw-booking-rooms-panel").hide();
	document.getElementById("booking-datepicker").style.display = "none"
	
}

function RoomObject(n, t) {
	this.adultCount = n;
	this.childrensAge = t
}

function AddRoom() {
	var n = rooms.length;
	n >= 9 || (rooms.push(new RoomObject(1, [])), UpdateBookingCalculations())
}

function RemoveRoom(n) {
	rooms.splice(n, 1);
	UpdateBookingCalculations()
}

function AddChild(n, t) {
	var i = rooms[n].childrensAge.length;
	i >= 5 || (rooms[n].childrensAge.push(t), UpdateBookingCalculations())
}

function RemoveChild(n) {
	rooms[n].childrensAge.pop();
	UpdateBookingCalculations()
}

function AddAdult(n) {
	var t = rooms[n].adultCount;
	t >= 6 || (rooms[n].adultCount += 1, UpdateBookingCalculations())
}

function RemoveAdult(n) {
	var t = rooms[n].adultCount;
	t <= 1 || (rooms[n].adultCount -= 1, UpdateBookingCalculations())
}

function UpdateBookingCalculations() {
	for (var u, i = rooms.length, n = 0, t = 0, r = 0; r < rooms.length; r++) u = rooms[r], n += u.adultCount, t += u.childrensAge.length;
	var e = n == 1 ? bookingResources.calculationsResources.Adult : bookingResources.calculationsResources.Adults,
		s = t == 1 ? bookingResources.calculationsResources.Child : bookingResources.calculationsResources.Childs,
		o = i == 1 ? bookingResources.calculationsResources.Room : bookingResources.calculationsResources.Rooms,
		f;
	f = t > 0 ? n + " " + e + ", " + t + " " + s + ", " + i + " " + o : n + " " + e + ", " + i + " " + o;
	document.getElementById("booking-rooms-calculations").value = f;
	document.getElementById("booking-calculations").innerText = f;
	document.getElementById("numberOfRooms").value = i
}

function ScrollInRoomsPanel() {
	var n = document.getElementById("rooms-panel-chambers");
	n && (n.scrollTop = roomsScrollTopPosition)
}

function SetRoomsScrollEvent() {
	var n = document.getElementById("rooms-panel-chambers");
	n && n.addEventListener("scroll", n => {
		roomsScrollTopPosition = n.target.scrollTop
	})
}

function OnAddRoomScroll() {
	var n = document.getElementById("rooms-panel-chambers").scrollHeight;
	document.getElementById("rooms-panel-chambers").scrollTop = n
}

function AddChambre() {

	var i = document.getElementById("chambers-container"),
		t = document.getElementsByClassName("cs-bw-booking-chambre");
	if (!(t.length >= 9)) {
		var r = t.length + 1,
			n = "chambre-" + (t.length + 1),
			u = '<div id="' + n + '" class="cs-bw-booking-chambre">' + 
			'<h5>' + bookingResources.chambreResources.Room + " " + r + '<\/h5>' + 
			'<div class="cs-bw-booking-chambre__adults"><span>' + bookingResources.chambreResources.Adults + '<\/span>' + 
			'<div class="cs-bw-booking-round-input">' + 
			'<div class="cs-bw-booking-round-input__decrement">' + 
			'<button type="button" id="' + n + '-decrement-adults-button" onclick="DecrementAdultsInputValue(\'' + n + '\')"><img src="../wp-content/plugins/bwse-booking-elementor/assets/images/minus-circled.svg" /><\/button><\/div>' + 
			'<div class="cs-bw-booking-round-input__value"><input type="text" id="' + n + '-adults-input-value" name="numAdults[' + t.length + ']"><\/input><\/div>' + 
			'<div class="cs-bw-booking-round-input__increment"><button type="button" id="' + n + '-increment-adults-button" onclick="IncrementAdultsInputValue(\'' + n + '\')"><img src="../wp-content/plugins/bwse-booking-elementor/assets/images/plus-circled.svg" /><\/button><\/div><\/div><\/div>'+
			'<div class="cs-bw-booking-chambre__childs"><div class="cs-bw-booking-chambre-childs-age">' + 
			'<span class="cs-bw-booking-chambre-childs-age__child">' + bookingResources.chambreResources.Childrens + '<\/span>' + 
			'<span class="cs-bw-booking-chambre-childs-age__age">' + bookingResources.chambreResources.ChildrenAge + '<\/span><\/div>' + 
			'<div class="cs-bw-booking-round-input"><div class="cs-bw-booking-round-input__decrement">' + 
			'<button type="button" id="' + n + '-decrement-childs-button" onclick="DecrementChildsInputValue(\'' + n + '\')"><img src="../wp-content/plugins/bwse-booking-elementor/assets/images/minus-circled.svg" /><\/button><\/div>' + 
			'<div class="cs-bw-booking-round-input__value"><input type="text" id="' + n + '-childs-input-value" name="numChild[' + t.length + ']"><\/input><\/div>' + 
			'<div class="cs-bw-booking-round-input__increment"><button type="button" id="' + n + '-increment-childs-button" onclick="IncrementChildsInputValue(\'' + n + '\')"><img src="../wp-content/plugins/bwse-booking-elementor/assets/images/plus-circled.svg" /><\/button><\/div><\/div><\/div>' + 
			'<div class="cs-bw-booking-chambre__remove-chamber"><button type="button" onclick="RemoveChambre(\'' + n + '\')"><img src="../wp-content/plugins/bwse-booking-elementor/assets/images/minus.svg" /><span>' + bookingResources.chambreResources.RemoveRoom + "<\/span><\/button><\/div><\/div>";
		i.insertAdjacentHTML("beforeend", u);
		SetDefaultChambreValues(n,t);
		r == 1 && (i.getElementsByClassName("cs-bw-booking-chambre__remove-chamber")[0].style.display = "none")
	}
}

function RemoveChambre(n) {
	if (document.getElementById(n).remove(), ReOrderChambres(), RemoveRoom(n.slice(-1) - 1), rooms.length < 9) {
		var t = document.getElementsByClassName("cs-bw-booking-rooms-panel__add-chambre")[0];
		t.style.display = "block"
	}
	ScrollInRoomsPanel()
}

function ReOrderChambres() {
	for (var n, e, o, s, a, i, h, r, u, c, f, l = document.getElementsByClassName("cs-bw-booking-chambre"), t = 0; t < l.length; 
	t++) n = l[t], e = t + 1, n.id = "chambre-" + e, o = n.getElementsByTagName("h5")[0], o.innerText = o.innerText.replace(/.$/, e), s = n.getElementsByClassName("cs-bw-booking-chambre__remove-chamber")[0], s && (a = s.getElementsByTagName("button")[0], a.setAttribute("onclick", "RemoveChambre('" + n.id + "')")), i = n.getElementsByClassName("cs-bw-booking-chambre__adults")[0].getElementsByClassName("cs-bw-booking-round-input__decrement")[0].getElementsByTagName("button")[0], i && (i.id = n.id + "-decrement-adults-button", i.setAttribute("onclick", "DecrementAdultsInputValue('" + n.id + "')")), h = n.getElementsByClassName("cs-bw-booking-chambre__adults")[0].getElementsByClassName("cs-bw-booking-round-input__value")[0].getElementsByTagName("input")[0], h && (h.id = n.id + "-adults-input-value"), r = n.getElementsByClassName("cs-bw-booking-chambre__adults")[0].getElementsByClassName("cs-bw-booking-round-input__increment")[0].getElementsByTagName("button")[0], r && (r.id = n.id + "-increment-adults-button", r.setAttribute("onclick", "IncrementAdultsInputValue('" + n.id + "')")), u = n.getElementsByClassName("cs-bw-booking-chambre__childs")[0].getElementsByClassName("cs-bw-booking-round-input__decrement")[0].getElementsByTagName("button")[0], u && (u.id = n.id + "-decrement-childs-button", u.setAttribute("onclick", "DecrementChildsInputValue('" + n.id + "')")), c = n.getElementsByClassName("cs-bw-booking-chambre__childs")[0].getElementsByClassName("cs-bw-booking-round-input__value")[0].getElementsByTagName("input")[0], c && (c.id = n.id + "-childs-input-value"), f = n.getElementsByClassName("cs-bw-booking-chambre__childs")[0].getElementsByClassName("cs-bw-booking-round-input__increment")[0].getElementsByTagName("button")[0], f && (f.id = n.id + "-increment-childs-button", f.setAttribute("onclick", "IncrementChildsInputValue('" + n.id + "')"))
}

function SetDefaultChambreValues(n) {
	document.getElementById(n + "-adults-input-value").value = adultsDefaultValue;
	document.getElementById(n + "-childs-input-value").value = childsDefaultValue;

	ManageInputs("", n + "-decrement-adults-button", adultsDefaultValue, adultsDefaultValue, adultsLimitValue);
	ManageInputs("", n + "-decrement-childs-button", childsDefaultValue, childsDefaultValue, childsLimitValue)
}

function DecrementValue(n) {
	var n = parseInt(n);
	return n - 1
}

function IncrementValue(n) {
	var n = parseInt(n);
	return n + 1
}

function DecrementAdultsInputValue(n) {
	var t = document.getElementById(n + "-adults-input-value");
	t.value = DecrementValue(t.value);
	ManageInputs(n + "-increment-adults-button", n + "-decrement-adults-button", t.value, adultsDefaultValue, adultsLimitValue);
	RemoveAdult(n.slice(-1) - 1)
}

function IncrementAdultsInputValue(n) {
	var t = document.getElementById(n + "-adults-input-value");
	t.value = IncrementValue(t.value);
	ManageInputs(n + "-increment-adults-button", n + "-decrement-adults-button", t.value, adultsDefaultValue, adultsLimitValue);
	AddAdult(n.slice(-1) - 1)
}

function DecrementChildsInputValue(n) {
	var t = document.getElementById(n + "-childs-input-value");
	t.value = DecrementValue(t.value);
	ManageInputs(n + "-increment-childs-button", n + "-decrement-childs-button", t.value, childsDefaultValue, childsLimitValue);
	RemoveChild(n.slice(-1) - 1)
}

function IncrementChildsInputValue(n) {
	var t = document.getElementById(n + "-childs-input-value");
	t.value = IncrementValue(t.value);
	ManageInputs(n + "-increment-childs-button", n + "-decrement-childs-button", t.value, childsDefaultValue, childsLimitValue);
	AddChild(n.slice(-1) - 1)
}

function ManageInputs(n, t, i, r, u) {
	var f = document.getElementById(n),
		e = document.getElementById(t);
	f && (i >= u ? f.setAttribute("disabled", "") : f.removeAttribute("disabled"));
	e && (i > r ? e.removeAttribute("disabled") : e.setAttribute("disabled", ""))
}

jQuery(function() {
	InitializeBookings();
});