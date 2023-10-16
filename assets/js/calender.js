jQuery(document).ready(function($) {

    // Date Range Selector
    var lang = moment.locale(document.documentElement.lang.slice(0, -3));
    var start = moment();
    var end = moment().add(1, "days");

    function cb(start, end) {
        jQuery("#booking-datepicker").html(start.format("D MMM") + " - " + end.format("D MMM"));
        jQuery("#startDate").val(start.format('YYYY-MM-DD'));
        jQuery("#endDate").val(end.format('YYYY-MM-DD'));

        jQuery("#numberOfRooms").val('1');
        jQuery("#chambre-1-adults-input-value").val('1');
        jQuery("#chambre-1-childs-input-value").val('1');
    }
    
    jQuery("#booking-datepicker").daterangepicker({
        startDate: start,
        endDate: end,
        minDate: start,
        // autoApply: true,
        autoUpdateInput: true,
        locale: {
            format: "D MMM",
        }
    });

    jQuery('#booking-datepicker').on('show.daterangepicker', function(ev, picker) {
        jQuery("#startDate").val(start.format('YYYY-MM-DD'));
        jQuery("#endDate").val(picker.endDate.format('YYYY-MM-DD'));
    });

    jQuery('#daterange').on('cancel.daterangepicker', function(ev, picker) {
        cb(start, end);
    });

    jQuery('#booking-datepicker').on('apply.daterangepicker', function(ev, picker) {
        jQuery("#startDate").val(picker.startDate.format('YYYY-MM-DD'));
        jQuery("#endDate").val(picker.endDate.format('YYYY-MM-DD'));
    });
    
    cb(start, end);

    // Promo Validation
    jQuery('#promoCode').blur(function(){
        if($(this).val()){
            jQuery(this).attr('name', 'promoCode')
            jQuery('<input type="hidden" id="ratePlan" name="ratePlan" value="PROMO">').insertBefore(this);
        }
        else {
            jQuery(this).removeAttr('name');
            jQuery("#ratePlan").remove();
        }
    });
    
});