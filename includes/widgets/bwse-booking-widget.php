<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * BWSE Booking Widget
 */
class BWSE_Booking extends \Elementor\Widget_Base {

	/**
	 * Get widget name.
	 */
	public function get_name() {
		return 'bwse_booking';
	}

	/**
	 * Get widget title.
	 */
	public function get_title() {
		return esc_html__( 'BestWestern.se Booking Form', 'bwse-booking' );
	}

	/**
	 * Get widget icon.
	 */
	public function get_icon() {
		return 'eicon-form-vertical';
	}

	/**
	 * Get widget categories.
	 */
	public function get_categories() {
		return [ 'basic' ];
	}

	/**
	 * Get widget keywords.
	 */
	public function get_keywords() {
		return [ 'bestwestern', 'form', 'hotel', 'booking' ];
	}

	/**
	 * Get script dependencies.
	 */
	public function get_script_depends() {
		return [ 'moment', 'daterangepicker', 'calender', 'room' ];
	}

	/**
	 * Get style dependencies.
	 */
	public function get_style_depends() {
		return [ 'daterangepicker', 'room' ];
	}

	/**
	 * Register widget controls.
	 */
	protected function register_controls() {

		// General Settings Tab Start
		$this->start_controls_section(
			'general_section_title',
			[
				'label' => esc_html__( 'General Settings', 'bwse-booking' ),
				'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'hotel_code',
			[
				'label' => esc_html__( 'Hotel Code', 'bwse-booking' ),
				'type' => \Elementor\Controls_Manager::TEXT,
				'input_type' => 'text',
				'placeholder' => esc_html__( 'Enter hotel code', 'bwse-booking' ),
				'description' => esc_html__( 'Enter the BestWestern hotel code', 'bwse-booking' ),
			]
		);

		$this->end_controls_section();
		// General Settings Tab End

	}

	/**
	 * Render widget output on the frontend.
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		$hotel_code = ! empty( $settings['hotel_code'] ) ? esc_attr( $settings['hotel_code'] ) : '';
		
		if ( empty( $hotel_code ) ) {
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<div style="padding: 20px; background: #f0f0f0; border: 1px dashed #ccc; text-align: center;">';
				echo esc_html__( 'Please enter a hotel code in the widget settings.', 'bwse-booking' );
				echo '</div>';
			}
			return;
		}

		$form_action = 'https://www.bestwestern.se/hotel/' . $hotel_code . '?type=HOTEL';
		$plugin_dir_url = plugin_dir_url( dirname( __FILE__ ) );
		?>

		<form method="get" action="<?php echo esc_url( $form_action ); ?>" target="_blank">
			<div class="mainSiteContainer">
				<div class="contentSection">
					<div class="mb_contentitem_container mb_contentitem_container_bwbooking">
						<div class="cs-bw-booking-bookingformContainer bwBookingContainerSingle">
							<div id="cs_bw_booking_form_findhotel" class="cs-bw-booking-findHotel">
								<div class="container">
									<div class="cs-bw-booking-findhoteloptions" id="find_hotel_options">

										<div id="booking-calendar" class="cs-bw-booking-calendar">
											<div class="cs-bw-booking-calendar__header">
												<img class="bw-icon" src="<?php echo esc_url( $plugin_dir_url . '../assets/images/calendar.svg' ); ?>" alt="<?php esc_attr_e( 'Calendar', 'bwse-booking' ); ?>">
												<input type="text" id="booking-datepicker" class="bw-input" spellcheck="false" readonly>
												<input type="hidden" id="startDate" name="startDate">
												<input type="hidden" id="endDate" name="endDate">
											</div>
										</div>

										<div id="booking-rooms" class="cs-bw-booking-rooms">
											<div class="cs-bw-booking-rooms__header">
												<img class="bw-icon" src="<?php echo esc_url( $plugin_dir_url . '../assets/images/group.svg' ); ?>" alt="<?php esc_attr_e( 'Rooms', 'bwse-booking' ); ?>">
												<input id="booking-rooms-calculations" class="bw-input" spellcheck="false" readonly>
												<input type="hidden" id="numberOfRooms" name="numberOfRooms">
											</div>
											<div id="booking-rooms-panel" class="cs-bw-booking-rooms-panel">
												<div id="rooms-panel-chambers" class="cs-bw-booking-rooms-panel__chambers">
													<div id="chambers-container"></div>
													<div class="cs-bw-booking-rooms-panel__add-chambre">
														<button type="button" id="booking-add-chambre">
															<img src="<?php echo esc_url( $plugin_dir_url . '../assets/images/plus.svg' ); ?>" alt="<?php esc_attr_e( 'Add', 'bwse-booking' ); ?>">
															<span id="addRooms"><?php esc_html_e( 'Add rooms', 'bwse-booking' ); ?></span>
														</button>
													</div>
												</div>
												
												<div class="cs-bw-booking-rooms-panel__footer">
													<span id="booking-calculations"></span>
													<button type="button" id="booking-close-rooms">
														<span id="bookingCancel"><?php esc_html_e( 'Cancel', 'bwse-booking' ); ?></span>
													</button>
												</div>  
											</div>
										</div>
										
										<div id="booking-codes" class="cs-bw-booking-codes">
											<input type="text" id="promoCode" name="promoCode" class="bw-input" spellcheck="false" placeholder="<?php esc_attr_e( 'Promo', 'bwse-booking' ); ?>">
										</div>

										<input type="submit" id="bookingButton" class="bookingButton" value="<?php esc_attr_e( 'Reserve', 'bwse-booking' ); ?>">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</form>

		<?php
	}

	/**
	 * Render widget output in the editor.
	 */
	protected function content_template() {
		?>
		<# 
		var hotelCode = settings.hotel_code;
		if ( ! hotelCode ) {
			#>
			<div style="padding: 20px; background: #f0f0f0; border: 1px dashed #ccc; text-align: center;">
				<?php esc_html_e( 'Please enter a hotel code in the widget settings.', 'bwse-booking' ); ?>
			</div>
			<#
			return;
		}
		
		var formAction = 'https://www.bestwestern.se/hotel/' + hotelCode + '?type=HOTEL';
		#>

		<form method="get" action="{{ formAction }}" target="_blank">
			<div class="mainSiteContainer">
				<div class="contentSection">
					<div class="mb_contentitem_container mb_contentitem_container_bwbooking">
						<div class="cs-bw-booking-bookingformContainer bwBookingContainerSingle">
							<div id="cs_bw_booking_form_findhotel" class="cs-bw-booking-findHotel">
								<div class="container">
									<div class="cs-bw-booking-findhoteloptions" id="find_hotel_options">

										<div id="booking-calendar" class="cs-bw-booking-calendar">
											<div class="cs-bw-booking-calendar__header">
												<img class="bw-icon" src="<?php echo esc_url( plugin_dir_url( dirname( __FILE__ ) ) . '../assets/images/calendar.svg' ); ?>" alt="Calendar">
												<input type="text" id="booking-datepicker" class="bw-input" spellcheck="false" readonly>
												<input type="hidden" id="startDate" name="startDate">
												<input type="hidden" id="endDate" name="endDate">
											</div>
										</div>

										<div id="booking-rooms" class="cs-bw-booking-rooms">
											<div class="cs-bw-booking-rooms__header">
												<img class="bw-icon" src="<?php echo esc_url( plugin_dir_url( dirname( __FILE__ ) ) . '../assets/images/group.svg' ); ?>" alt="Rooms">
												<input id="booking-rooms-calculations" class="bw-input" spellcheck="false" readonly>
												<input type="hidden" id="numberOfRooms" name="numberOfRooms">
											</div>
											<div id="booking-rooms-panel" class="cs-bw-booking-rooms-panel">
												<div id="rooms-panel-chambers" class="cs-bw-booking-rooms-panel__chambers">
													<div id="chambers-container"></div>
													<div class="cs-bw-booking-rooms-panel__add-chambre">
														<button type="button" id="booking-add-chambre">
															<img src="<?php echo esc_url( plugin_dir_url( dirname( __FILE__ ) ) . '../assets/images/plus.svg' ); ?>" alt="Add">
															<span id="addRooms"><?php esc_html_e( 'Add rooms', 'bwse-booking' ); ?></span>
														</button>
													</div>
												</div>
												
												<div class="cs-bw-booking-rooms-panel__footer">
													<span id="booking-calculations"></span>
													<button type="button" id="booking-close-rooms">
														<span id="bookingCancel"><?php esc_html_e( 'Cancel', 'bwse-booking' ); ?></span>
													</button>
												</div>  
											</div>
										</div>
										
										<div id="booking-codes" class="cs-bw-booking-codes">
											<input type="text" id="promoCode" name="promoCode" class="bw-input" spellcheck="false" placeholder="<?php esc_attr_e( 'Promo', 'bwse-booking' ); ?>">
										</div>

										<input type="submit" id="bookingButton" class="bookingButton" value="<?php esc_attr_e( 'Reserve', 'bwse-booking' ); ?>">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</form>
		<?php
	}
}