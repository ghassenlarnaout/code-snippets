<?php

/**
 * HTML for the welcome page.
 *
 * @package    Code_Snippets
 * @subpackage Views
 */

namespace Code_Snippets;

/**
 * Loaded from the Welcome_Menu class.
 *
 * @var Welcome_Menu $this
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

$welcome_data = $this->load_welcome_data();
$item_limit = 4;

$hero = $welcome_data['hero-item'][0];

$features = isset( $welcome_data['features'] ) && is_array( $welcome_data['features'] ) ?
	array_slice( $welcome_data['features'], 0, $item_limit ) :
	[];

$partners = isset( $welcome_data['partners'] ) && is_array( $welcome_data['partners'] ) ?
	array_slice( $welcome_data['partners'], 0, $item_limit ) :
	[];

?>

<div class="csp-wrap csp-welcome-wrap">
	<div class="csp-header-wrap">
		<div class="csp-header-logo-title">
			<img class="csp-logo"
			     width="50px"
			     src="<?php echo esc_url( plugins_url( 'assets/icon.svg', PLUGIN_FILE ) ); ?>"
			     alt="<?php esc_attr_e( 'Code Snippets Logo', 'code-snippets' ); ?>">
			<h1 class="csp-heading">
				<?php
				echo wp_kses(
					__( "Resources and <span>What's New</span>", 'code-snippets' ),
					[ 'span' => [] ]
				);
				?>
			</h1>
		</div>
		<ul class="csp-list-header-nav">
			<?php

			$links = [
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

			foreach ( $links as $link_name => $link_info ) {
				?>
				<li>
					<a href="<?php echo esc_url( $link_info['url'] ); ?>"
					   class="csp-link-nav csp-link-<?php echo esc_attr( $link_name ); ?>">
						<div class="csp-link-text">
							<span class="csp-link-text-top"><?php echo esc_html( $link_info['label'] ); ?></span>
						</div>
						<span class="dashicons dashicons-<?php echo esc_attr( $link_info['icon'] ); ?>"></span>
					</a>
				</li>
			<?php } ?>
		</ul>
	</div>
	<!-- Changelog and Key Feature -->
	<article class="csp-section-changes">
		<h2 class="csp-h2 csp-section-links-heading"><?php esc_html_e( 'Latest News…', 'code-snippets' ); ?>✨</h2>
		<div class="csp-section-changes-body">
			<div class="csp-section-changes-left-col csp-section-changes-col">
				<div class="csp-section-changes-right-col-bottom csp-card-white">
					<div class="csp-section-changes-header">
						<h2 class="csp-h2"><?php echo esc_html( $hero['name'] ); ?> 🚀</h2>
						<?php
						printf(
							'<a href="%s" class="csp-link csp-img-link" target="_blank">%s<span class="dashicons dashicons-external"></span></a>',
							esc_url( $hero['follow_url'] ),
							esc_attr__( 'Read more', 'code-snippets' )
						);
						?>
					</div>
					<div class="csp-section-changes-img-wrap">
						<div id="csp-loading-spinner" class="csp-loading-spinner"></div>
						<img id="csp-changes-img"
						     onload="hideLoadingAnimation()"
						     class="csp-section-changes-img"
						     src="<?php echo esc_url( $hero['image_url'] ); ?>"
						     alt="<?php esc_attr_e( 'Code Snippets AI', 'code-snippets' ); ?>);">
					</div>
				</div>
			</div>

			<div class="csp-section-changes-right-col csp-section-changes-col">
				<!-- Changelog - handle for pro? -->
				<div class="csp-section-changes-right-col-top csp-card-white">
					<div class="csp-section-changes-header">
						<h2 class="csp-h2">
							<?php
							/* translators: %s: current version number */
							echo esc_html( sprintf( __( "What's new in version %s", 'code-snippets' ), code_snippets()->version ) );
							?>
						</h2>
						<?php
						printf(
							'<a href="%s" class="csp-link">%s<span class="dashicons dashicons-external"></span></a>',
							esc_url( 'https://codesnippets.pro/changelog/' ),
							esc_html__( 'Full Changelog', 'code-snippets' )
						);
						?>
					</div>
					<div class="csp-section-changes-log">
						<p><?php esc_html_e( 'This update introduces significant improvements and bug fixes, with a focus on enhancing the current cloud sync and Code Snippets AI:', 'code-snippets' ); ?></p>
						<ul class="csp-changelog-list">
							<li>
								<strong><?php esc_html_e( 'Bug Fix: ', 'code-snippets' ); ?></strong>
								<?php esc_html_e( 'Import error when initialising cloud sync configuration.', 'code-snippets' ); ?>
							</li>
							<li>
								<strong><?php esc_html_e( 'Improvement: ', 'code-snippets' ); ?></strong>
								<?php esc_html_e( 'Added debug action for resetting snippets caches', 'code-snippets' ); ?>
							</li>
						</ul>
					</div>
				</div>
			</div>

		</div>
	</article>

	<section class="csp-section-links">
		<h2 class="csp-h2 csp-section-links-heading">
			<?php esc_html_e( 'Helpful articles…', 'code-snippets' ); ?>🎉
		</h2>
		<div class="csp-grid csp-grid-4">
			<?php foreach ( $features as $feature ) { ?>
				<div class="csp-card-item">
					<div class="csp-card-item-img-wrap">
						<img class="csp-card-item-img csp-card-img-square"
						     src="<?php echo esc_url( $feature['image_url'] ); ?>"
						     alt="<?php esc_attr_e( 'Feature image', 'code-snippets' ); ?>);">
					</div>
					<div class="csp-card-item-content">
						<p class="csp-h2 csp-card-item-title"><?php echo esc_html( $feature['title'] ); ?></p>
						<p class="csp-card-item-description"><?php echo esc_html( $feature['description'] ); ?></p>
					</div>
					<div class="csp-card-item-footer">
						<p class="csp-card-item-category"><?php echo esc_html( $feature['category'] ); ?></p>
						<a href="<?php echo esc_url( $feature['follow_url'] ); ?>"
						   class="csp-link" target="_blank">
							<?php esc_html_e( 'Read more', 'code-snippets' ); ?>
							<span class="dashicons dashicons-external"></span>
						</a>
					</div>
				</div>
			<?php } ?>
		</div>
	</section>

	<section class="csp-section-links csp-section-partners">
		<h2 class="csp-h2 csp-section-links-heading">
			<?php esc_html_e( 'Partners and Apps…', 'code-snippets' ); ?>🔥
		</h2>
		<div class="csp-grid csp-grid-4">
			<?php foreach ( $partners as $partner ) { ?>
				<div class="csp-card-item">
					<div class="csp-card-item-img-wrap">
						<img class="csp-card-item-img"
						     src="<?php echo esc_url( $partner['image_url'] ); ?>"
						     alt="<?php esc_html_e( 'Partner image', 'code-snippets' ); ?>">
					</div>
					<div class="csp-card-item-content">
						<p class="csp-h2 csp-card-item-title"><?php echo esc_html( $partner['title'] ); ?></p>
					</div>
					<div class="csp-partner-item-footer">
						<a href="<?php echo esc_url( $partner['follow_url'] ); ?>" class="csp-link" target="_blank">
							<?php esc_html_e( 'Go to Partner', 'code-snippets' ); ?>
							<span class="dashicons dashicons-external"></span></a>
					</div>
				</div>
			<?php } ?>
		</div>
	</section>
</div>

<script type="text/javascript">
	function hideLoadingAnimation() {
		document.getElementById('csp-loading-spinner').style.display = 'none'
		document.getElementById('csp-changes-img').style.display = 'block'
	}
</script>
