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
	protected const WELCOME_JSON_URL = 'https://codesnippets.pro/wp-content/uploads/cs_welcome/cs_welcome.json';

	/**
	 * Limit of number of items to display when loading lists of items.
	 *
	 * @var int
	 */
	protected const ITEM_LIMIT = 4;

	/**
	 * Data fetched from the remote API.
	 *
	 * @var ?array
	 */
	protected $remote_data = null;

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
	 * Load remote welcome data when the page is loaded.
	 *
	 * @return void
	 */
	public function load() {
		parent::load();

		$welcome_data_response = wp_remote_get( self::WELCOME_JSON_URL );
		$this->remote_data = json_decode( wp_remote_retrieve_body( $welcome_data_response ), true );
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

	/**
	 * Retrieve remote data for the hero item.
	 *
	 * @return array{follow_url: string, name: string, image_url: string}
	 */
	protected function get_hero_item(): array {
		return array_merge(
			[
				'follow_url' => '',
				'name'       => '',
				'image_url'  => '',
			],
			isset( $this->remote_data['hero-item'][0] ) && is_array( $this->remote_data['hero-item'][0] ) ?
				$this->remote_data['hero-item'][0] : []
		);
	}

	/**
	 * Parse a list of remote items, ensuring there are no missing keys and a limit number is enforced.
	 *
	 * @param 'features'|'partners' $remote_key Key from remote data to parse.
	 *
	 * @return array<array{follow_url: string, image_url: string, title: string}>
	 */
	protected function get_remote_items( string $remote_key ): array {
		if ( ! isset( $this->remote_data[ $remote_key ] ) || ! is_array( $this->remote_data[ $remote_key ] ) ) {
			return [];
		}

		$limit = max( self::ITEM_LIMIT, count( $this->remote_data[ $remote_key ] ) );
		$items = [];

		$default_item = [
			'follow_url' => '',
			'image_url'  => '',
			'title'      => '',
		];

		for ( $i = 0; $i < $limit; $i++ ) {
			$items[] = array_merge( $default_item, $this->remote_data[ $remote_key ][ $i ] );
		}

		return $items;
	}

	/**
	 * Retrieve a description of the latest changelog change.
	 *
	 * @return string
	 */
	protected function get_changelog_desc(): string {
		return __( 'This update introduces significant improvements and bug fixes, with a focus on enhancing the current cloud sync and Code Snippets AI.', 'code-snippets' );
	}

	/**
	 * Retrieve a list of latest changes for display.
	 *
	 * @return array<array{title: string, desc: string}>
	 */
	protected function get_latest_changes(): array {
		return [
			[
				'title' => __( 'Bug Fix: ', 'code-snippets' ),
				'desc'  => __( 'Import error when initialising cloud sync configuration.', 'code-snippets' ),
			],
			[
				'title' => __( 'Improvement: ', 'code-snippets' ),
				'desc'  => __( 'Added debug action for resetting snippets caches', 'code-snippets' ),
			],
		];
	}

	/**
	 * Retrieve a list of links to display in the page header.
	 *
	 * @return array<string, array{url: string, icon: string, label: string}>
	 */
	protected function get_header_links(): array {
		return [
			'cloud'     => [
				'url'   => 'https://codesnippets.cloud',
				'icon'  => 'cloud',
				'label' => __( 'Cloud', 'code-snippets' ),
			],
			'resources' => [
				'url'   => 'https://help.codesnippets.pro/',
				'icon'  => 'sos',
				'label' => __( 'Support', 'code-snippets' ),
			],
			'community' => [
				'url'   => 'https://www.facebook.com/groups/282962095661875/',
				'icon'  => 'facebook',
				'label' => __( 'Community', 'code-snippets' ),
			],
			'pro'       => [
				'url'   => 'https://codesnippets.pro/pricing/',
				'icon'  => 'cart',
				'label' => __( 'Get Pro', 'code-snippets' ),
			],
		];
	}
}
