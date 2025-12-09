<?php
/**
 * Plugin Name: BestWestern.se Booking form for Elementor
 * Description: Simple booking form for BestWestern.se hotels & resorts.
 * Version:     1.0.0
 * Author:      Md Tanzib Hossain
 * Author URI:  https://tanzibhossain.com/
 * Text Domain: bwse-booking
 */

 /**
 * Elementor tested up to: 3.16.5
 * Elementor Pro tested up to: 3.16.2
 */

function register_bwse_booking_widget( $widgets_manager ) {

	require_once( __DIR__ . '/includes/widgets/bwse-booking-widget.php' );
	$widgets_manager->register( new \BWSE_Booking() );

}
add_action( 'elementor/widgets/register', 'register_bwse_booking_widget' );

function register_widget_scripts() {
	wp_register_script( 'moment', '//cdn.jsdelivr.net/momentjs/latest/moment-with-locales.min.js', array( 'jquery' ), '1.0.0', true );
	wp_register_script( 'daterangepicker', '//cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js', array( 'jquery' ), '1.0.0', true );
	wp_register_script( 'calender', plugins_url( 'assets/js/calender.js', __FILE__ ) );
	wp_register_script( 'room', plugins_url( 'assets/js/room.js', __FILE__ ) );
}
add_action( 'wp_enqueue_scripts', 'register_widget_scripts' );

function register_widget_styles() {
	wp_register_style( 'reset', plugins_url( 'assets/css/reset.css', __FILE__ ) );
	wp_register_style( 'daterangepicker', plugins_url( 'assets/css/daterangepicker.css', __FILE__ ) );
	wp_register_style( 'room', plugins_url( 'assets/css/room.css', __FILE__ ) );
}
add_action( 'wp_enqueue_scripts', 'register_widget_styles' );