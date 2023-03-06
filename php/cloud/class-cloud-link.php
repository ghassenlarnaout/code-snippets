<?php

namespace Code_Snippets\Cloud;

use Data_Item;
use function Code_Snippets\code_snippets_build_tags_array;

/**
 * A connection between a local snippet and remote cloud snippet.
 *
 * @package Code_Snippets
 *
 * @property integer $local_id         ID of local snippet as stored in WordPress database, if applicable.
 * @property string  $cloud_id         ID and ownership status of remote snippet on cloud platform, if applicable.
 * @property boolean $in_codevault     Whether the remote snippet is stored in the users' codevault.
 * @property boolean $update_available If synchronised, whether there is an update available on the cloud platform.
 */
class Cloud_Link extends Data_Item {

	/**
	 * Constructor function
	 *
	 * @param array<string, mixed>|object $data Initial data fields.
	 */
	public function __construct( $data = null ) {
		parent::__construct(
			[
				'local_id'         => 0,
				'cloud_id'         => '',
				'in_codevault'     => false,
				'update_available' => false,
			],
			$data
		);
	}

	/**
	 * Prepare a value before it is stored.
	 *
	 * @param mixed  $value Value to prepare.
	 * @param string $field Field name.
	 *
	 * @return mixed Value in the correct format.
	 */
	protected function prepare_field( $value, $field ) {
		switch ( $field ) {
			case 'local_id':
				return absint( $value );

			case 'remote_id':
				// TODO: add better sanitization here.
				return (string) $value;

			case 'in_codevault':
			case 'update_available':
				return is_bool( $value ) ? $value : (bool) $value;

			default:
				return $value;
		}
	}
}
