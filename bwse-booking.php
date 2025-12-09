<?php
/**
 * Plugin Name: BestWestern.se Booking form for Elementor
 * Description: Simple booking form for BestWestern.se hotels & resorts.
 * Version:     2.0.0
 * Author:      Md Tanzib Hossain
 * Author URI:  https://tanzibhossain.com/
 * Text Domain: bwse-booking
 * Requires at least: 5.0
 * Requires PHP: 7.0
 * Elementor tested up to: 3.25.0
 * Elementor Pro tested up to: 3.25.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register BWSE Booking Widget
 */
function register_bwse_booking_widget( $widgets_manager ) {

	require_once( __DIR__ . '/includes/widgets/bwse-booking-widget.php' );
	
	// Use the new register() method instead of deprecated register_widget_type()
	$widgets_manager->register( new \BWSE_Booking() );

}
add_action( 'elementor/widgets/register', 'register_bwse_booking_widget' );

/**
 * Register widget scripts
 */
function register_widget_scripts() {
	wp_register_script( 'moment', '//cdn.jsdelivr.net/momentjs/latest/moment-with-locales.min.js', array( 'jquery' ), '1.0.0', true );
	wp_register_script( 'daterangepicker', '//cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js', array( 'jquery', 'moment' ), '1.0.0', true );
	wp_register_script( 'calender', plugins_url( 'assets/js/calender.js', __FILE__ ), array( 'jquery', 'daterangepicker' ), '2.0.0', true );
	wp_register_script( 'room', plugins_url( 'assets/js/room.js', __FILE__ ), array( 'jquery' ), '2.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'register_widget_scripts' );

/**
 * Register widget styles
 */
function register_widget_styles() {
	wp_register_style( 'reset', plugins_url( 'assets/css/reset.css', __FILE__ ), array(), '2.0.0' );
	wp_register_style( 'daterangepicker', plugins_url( 'assets/css/daterangepicker.css', __FILE__ ), array(), '2.0.0' );
	wp_register_style( 'room', plugins_url( 'assets/css/room.css', __FILE__ ), array(), '2.0.0' );
}
add_action( 'wp_enqueue_scripts', 'register_widget_styles' );

/**
 * Check if Elementor is installed and activated
 */
function bwse_booking_check_elementor() {
	if ( ! did_action( 'elementor/loaded' ) ) {
		add_action( 'admin_notices', 'bwse_booking_admin_notice_missing_elementor' );
		return;
	}

	// Check for required Elementor version
	if ( ! version_compare( ELEMENTOR_VERSION, '3.0.0', '>=' ) ) {
		add_action( 'admin_notices', 'bwse_booking_admin_notice_minimum_elementor_version' );
		return;
	}
}
add_action( 'plugins_loaded', 'bwse_booking_check_elementor' );

/**
 * Admin notice for missing Elementor
 */
function bwse_booking_admin_notice_missing_elementor() {
	if ( isset( $_GET['activate'] ) ) {
		unset( $_GET['activate'] );
	}

	$message = sprintf(
		/* translators: 1: Plugin name 2: Elementor */
		esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'bwse-booking' ),
		'<strong>' . esc_html__( 'BestWestern.se Booking Form', 'bwse-booking' ) . '</strong>',
		'<strong>' . esc_html__( 'Elementor', 'bwse-booking' ) . '</strong>'
	);

	printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );
}

/**
 * Admin notice for minimum Elementor version
 */
function bwse_booking_admin_notice_minimum_elementor_version() {
	if ( isset( $_GET['activate'] ) ) {
		unset( $_GET['activate'] );
	}

	$message = sprintf(
		/* translators: 1: Plugin name 2: Elementor 3: Required Elementor version */
		esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'bwse-booking' ),
		'<strong>' . esc_html__( 'BestWestern.se Booking Form', 'bwse-booking' ) . '</strong>',
		'<strong>' . esc_html__( 'Elementor', 'bwse-booking' ) . '</strong>',
		'3.0.0'
	);

	printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );
}