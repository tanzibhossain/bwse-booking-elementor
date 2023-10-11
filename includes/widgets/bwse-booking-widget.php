<?php
class BWSE_Booking extends \Elementor\Widget_Base {

	public function get_script_depends() {
		return [ 'moment', 'daterangepicker', 'calender', 'room' ];
	}

	public function get_style_depends() {
		return [ 'reset', 'daterangepicker', 'room' ];
	}
	
	public function get_name() {
		return 'bwse_booking';
	}

	public function get_title() {
		return esc_html__( 'BestWestern.se Booking Form', 'bwse-booking' );
	}

	public function get_icon() {
		return 'eicon-form-vertical';
	}

	public function get_categories() {
		return [ 'basic' ];
	}

	public function get_keywords() {
		return [ 'bestwestern', 'form', 'hotel', 'booking' ];
	}

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
				'input_type' => 'number',
				'placeholder' => esc_html__( 'Hotel code', 'bwse-booking' ),
			]
		);

		$this->end_controls_section();

		// General Settings Tab End

	}

	protected function render() {
		$settings = $this->get_settings_for_display();
		?>

		<form method="get" action="https://www.bestwestern.se/<?php echo $settings['hotel_code']; ?>?type=HOTEL" target="_blank">
			<div class="mainSiteContainer">
				<div class="contentSection">
					<div class="mb_contentitem_container mb_contentitem_container_bwbooking">
						<div class="cs-bw-booking-bookingformContainer bwBookingContainerSingle">
							<div id="cs_bw_booking_form_findhotel" class="cs-bw-booking-findHotel">
								<div class="container">
									<div class="cs-bw-booking-findhoteloptions" id="find_hotel_options">

										<div id="booking-calendar" class="cs-bw-booking-calendar">
											<div class="cs-bw-booking-calendar__header">
												<img class="bw-icon" src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../assets/images/calendar.svg'; ?>" style="border-width:0">
												<input type="text" id="booking-datepicker" class="bw-input" spellcheck="false" readonly>
												<input type="hidden" id="startDate" name="startDate">
												<input type="hidden" id="endDate" name="endDate">
											</div>
										</div>

										<div id="booking-rooms" class="cs-bw-booking-rooms">
											<div class="cs-bw-booking-rooms__header">
												<img class="bw-icon" src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../assets/images/group.svg'; ?>">
												<input id="booking-rooms-calculations" class="bw-input" spellcheck="false" readonly>
												<input type="hidden" id="numberOfRooms" name="numberOfRooms">
											</div>
											<div id="booking-rooms-panel" class="cs-bw-booking-rooms-panel">
												<div id="rooms-panel-chambers" class="cs-bw-booking-rooms-panel__chambers">
													<div id="chambers-container"></div>
													<div class="cs-bw-booking-rooms-panel__add-chambre">
														<button type="button" id="booking-add-chambre">
															<img src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '../assets/images/plus.svg'; ?>" style="border-width:0">
															<span>Add rooms</span>
														</button>
													</div>
												</div>
												
												<div class="cs-bw-booking-rooms-panel__footer">
													<span id="booking-calculations"></span>
													<button type="button" id="booking-close-rooms">
														<span>Cancel</span>
													</button>
												</div>  
											</div>
										</div>
										
										<div id="booking-codes" class="cs-bw-booking-codes">
											<input type="text" id="promoCode" name="promoCode" class="bw-input" spellcheck="false" placeholder="Booking Code">
										</div>

										<input type="submit" class="bookingButton" value="Reserve">
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