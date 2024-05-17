<?php

namespace Code_Snippets;

use Code_Snippets\Cloud\Cloud_Search_List_Table;
use function Code_Snippets\Settings\get_setting;

/**
 * This class handles the welcome menu.
 *
 * @since   3.7.0
 * @package Code_Snippets
 */
class Welcome_Menu extends Admin_Menu {

	/**
	 *  URL for the welcome page data.
	 *
	 * @var string
	 */
	const WELCOME_JSON_URL = 'https://codesnippets.pro/wp-content/uploads/cs_welcome/cs_welcome.json';

	/**
	 * Class constructor
	 */
	public function __construct() {
		parent::__construct(
			'welcome',
			_x( "What's New", 'menu label', 'code-snippets' ),
			__( 'Welcome to Code Snippets', 'code-snippets' )
		);
	}

	/**
	 * Load the current welcome data from the Code Snippets website.
	 *
	 * @return array<string, mixed>
	 */
	public function load_welcome_data(): array {
		$welcome_data = wp_remote_get( self::WELCOME_JSON_URL );
		return json_decode( wp_remote_retrieve_body( $welcome_data ), true );
	}


	/**
	 * Enqueue assets necessary for the welcome menu.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		wp_enqueue_style(
			'code-snippets-welcome',
			plugins_url( 'dist/welcome.css', PLUGIN_FILE ),
			[],
			PLUGIN_VERSION
		);
	}
}
