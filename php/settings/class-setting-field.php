<?php
/**
 * This file handles rendering the settings fields
 *
 * @since      2.0.0
 * @package    Code_Snippets
 * @subpackage Settings
 */

namespace Code_Snippets\Settings;

/**
 * Represents a single setting field
 *
 * @property-read string                $desc               Field description.
 * @property-read string                $label              Field label.
 * @property-read string                $type               Field type.
 * @property-read string                $name               Setting name.
 *
 * @property-read int                   $min                Minimum value (for numerical inputs).
 * @property-read int                   $max                Maximum value(for numerical inputs).
 * @property-read array<string, string> $options            List of options for a select or checkboxes field.
 * @property-read callable              $render_callback    Custom function to use when rendering a callback field.
 * @property-read callable              $sanitize_callback  Custom function to use when sanitize the setting value.
 * @property-read mixed                 $default            Default setting value.
 *
 * @property-read string                $input_name         Value of `name` HTML attribute on an input element.
 */
class Setting_Field {

	/**
	 * Input field identifier.
	 *
	 * @var string
	 */
	private $field_id;

	/**
	 * Settings section identifier.
	 *
	 * @var string
	 */
	private $section;

	/**
	 * List of possible arguments.
	 *
	 * @var array<string, mixed>
	 */
	private $args = array(
		'desc'    => '',
		'label'   => '',
		'min'     => null,
		'max'     => null,
		'options' => [],
	);

	/**
	 * Class constructor.
	 *
	 * @param string               $section_id Settings section identifier.
	 * @param string               $field_id   Setting field identifier.
	 * @param array<string, mixed> $args       The setting field attributes.
	 */
	public function __construct( $section_id, $field_id, array $args ) {
		$this->field_id = $field_id;
		$this->section = $section_id;
		$this->args = array_merge( $this->args, $args );
	}

	/**
	 * Retrieve a single setting attribute.
	 *
	 * @param string $argument Attribute name.
	 *
	 * @return mixed Attribute value.
	 */
	public function __get( $argument ) {

		if ( 'input_name' === $argument ) {
			return sprintf( 'code_snippets_settings[%s][%s]', $this->section, $this->field_id );
		}

		return $this->args[ $argument ];
	}

	/**
	 * Retrieve the saved value for this setting.
	 *
	 * @return mixed
	 */
	private function get_saved_value() {
		return get_setting( $this->section, $this->field_id );
	}

	/**
	 * Render the setting field
	 */
	public function render() {
		$method_name = 'render_' . $this->type . '_field';

		if ( method_exists( $this, $method_name ) ) {
			call_user_func( array( $this, $method_name ) );
		} else {
			// Error message, not necessary to translate.
			printf( 'Cannot render a %s field.', esc_html( $this->type ) );
			return;
		}

		if ( $this->desc ) {
			echo '<p class="description">', wp_kses_post( $this->desc ), '</p>';
		}
	}

	/**
	 * Render a callback field.
	 */
	public function render_callback_field() {
		call_user_func( $this->render_callback );
	}

	/**
	 * Render a single checkbox field.
	 *
	 * @param string  $input_name Input name.
	 * @param string  $label      Input label.
	 * @param boolean $checked    Whether the checkbox should be checked.
	 */
	private static function render_checkbox( $input_name, $label, $checked ) {

		$checkbox = sprintf(
			'<input type="checkbox" name="%s"%s>',
			esc_attr( $input_name ),
			checked( $checked, true, false )
		);

		$kses = [
			'input' => [
				'type'    => [],
				'name'    => [],
				'checked' => [],
			],
		];

		if ( $label ) {
			printf(
				'<label>%s %s</label>',
				wp_kses( $checkbox, $kses ),
				wp_kses_post( $label )
			);
		} else {
			echo wp_kses( $checkbox, $kses );
		}
	}

	/**
	 * Render a checkbox field for a setting
	 *
	 * @since 2.0.0
	 */
	public function render_checkbox_field() {
		$this->render_checkbox( $this->input_name, $this->label, $this->get_saved_value() );
	}

	/**
	 * Render a checkbox field for a setting
	 *
	 * @since 2.0.0
	 */
	public function render_checkboxes_field() {
		$saved_value = $this->get_saved_value();
		$saved_value = is_array( $saved_value ) ? $saved_value : [];

		echo '<fieldset>';
		printf( '<legend class="screen-reader-text"><span>%s</span></legend>', esc_html( $this->name ) );

		foreach ( $this->options as $option => $label ) {
			$this->render_checkbox( $this->input_name . "[$option]", $label, in_array( $option, $saved_value, true ) );
			echo '<br>';
		}

		echo '</fieldset>';
	}

	/**
	 * Render a basic text field for an editor setting.
	 */
	private function render_text_field() {

		printf(
			'<input id="%s" type="text" name="%s" value="%s" class="regular-text %s">',
			esc_attr( $this->element_id ),
			esc_attr( $this->input_name ),
			esc_attr( $this->get_saved_value() ),
			esc_attr( $this->element_id ),
		);

		if ( $this->label ) {
			echo ' ' . wp_kses_post( $this->label );
		}
	}

	/**
	 * Render a number select field for an editor setting
	 *
	 * @since 2.0.0
	 */
	private function render_number_field() {

		printf(
			'<input type="number" name="%s" value="%s"',
			esc_attr( $this->input_name ),
			esc_attr( $this->get_saved_value() )
		);

		if ( is_numeric( $this->min ) ) {
			printf( ' min="%d"', intval( $this->min ) );
		}

		if ( is_numeric( $this->max ) ) {
			printf( ' max="%d"', intval( $this->max ) );
		}

		echo '>';

		if ( $this->label ) {
			echo ' ' . wp_kses_post( $this->label );
		}
	}

	/**
	 * Render a number select field for an editor setting
	 *
	 * @since 3.0.0
	 */
	private function render_select_field() {
		$saved_value = $this->get_saved_value();
		printf( '<select name="%s">', esc_attr( $this->input_name ) );

		foreach ( $this->options as $option => $option_label ) {
			printf(
				'<option value="%s"%s>%s</option>',
				esc_attr( $option ),
				selected( $option, $saved_value, false ),
				esc_html( $option_label )
			);
		}

		echo '</select>';
	}

	/**
	 * Render a button to verify cloud api 
	 *
	 * @since 3.0.0
	 */
	private function render_button_field() {

        printf(
            '<button class="button button-secondary" type="button" id="%s">%s</button>',
            esc_html( $this->button_id ),
            esc_html( $this->button_label )
        );
	}

	/**
	 * Render a hidden input field for an editor setting.
	 */
	private function render_hidden_field() {

		printf(
			'<input id="%s" type="hidden" name="%s" value="%s" class="%s">',
			esc_attr( $this->element_id ),
			esc_attr( $this->input_name ),
			esc_attr( $this->get_saved_value() ? $this->get_saved_value() : $this->default ),
			esc_attr( $this->element_id ),
		);
	}
}
