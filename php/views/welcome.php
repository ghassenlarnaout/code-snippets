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

$hero = $this->get_hero_item();

?>

<div class="csp-welcome-wrap">
	<div class="csp-welcome-header">
		<header class="csp-welcome-logo">
			<img width="50px"
			     src="<?php echo esc_url( plugins_url( 'assets/icon.svg', PLUGIN_FILE ) ); ?>"
			     alt="<?php esc_attr_e( 'Code Snippets Logo', 'code-snippets' ); ?>">
			<h1>
				<?php echo wp_kses( __( "Resources and <span>What's New</span>", 'code-snippets' ), [ 'span' => [] ] ); ?>
			</h1>
		</header>
		<ul class="csp-welcome-nav">
			<?php foreach ( $this->get_header_links() as $link_name => $link_info ) { ?>
				<li>
					<a href="<?php echo esc_url( $link_info['url'] ); ?>" target="_blank"
					   class="csp-link-<?php echo esc_attr( $link_name ); ?>">
						<span><?php echo esc_html( $link_info['label'] ); ?></span>
						<span class="dashicons dashicons-<?php echo esc_attr( $link_info['icon'] ); ?>"></span>
					</a>
				</li>
			<?php } ?>
		</ul>
	</div>

	<article class="csp-section-changes">
		<h2>
			<span class="dashicons dashicons-pressthis"></span>
			<?php esc_html_e( 'Latest news', 'code-snippets' ); ?>
		</h2>
		<div class="csp-cards">
			<a class="csp-card" href="<?php echo esc_url( $hero['follow_url'] ); ?>" target="_blank">
				<header>
					<span class="dashicons dashicons-external"></span>
					<h3><?php echo esc_html( $hero['name'] ); ?></h3>
				</header>
				<figure>
					<div id="csp-loading-spinner" class="csp-loading-spinner"></div>
					<img id="csp-changes-img"
					     onload="hideLoadingAnimation()"
					     class="csp-section-changes-img"
					     src="<?php echo esc_url( $hero['image_url'] ); ?>"
					     alt="<?php esc_attr_e( 'Latest news image', 'code-snippets' ); ?>);">
				</figure>
			</a>

			<a class="csp-card" href="https://wordpress.org/plugins/code-snippets/changelog" target="_blank"
			   title="<?php esc_html_e( 'Read the full changelog', 'code-snippets' ); ?>">
				<header>
					<span class="dashicons dashicons-external"></span>
					<h3>
						<?php
						/* translators: %s: current plugin version number. */
						echo esc_html( sprintf( __( "What's new in version %s", 'code-snippets' ), code_snippets()->version ) );
						?>
					</h3>
				</header>
				<div class="csp-section-changes-log">
					<p><?php echo esc_html( $this->get_changelog_desc() ); ?></p>
					<ul class="csp-changelog-list">
						<?php foreach ( $this->get_latest_changes() as $change ) { ?>
							<li>
								<strong><?php echo esc_html( $change['title'] ); ?></strong>
								<?php echo esc_html( $change['desc'] ); ?>
							</li>
						<?php } ?>
					</ul>
				</div>
			</a>
		</div>
	</article>

	<section class="csp-section-articles csp-section-links">
		<h2>
			<span class="dashicons dashicons-sos"></span>
			<?php esc_html_e( 'Helpful articles', 'code-snippets' ); ?>
		</h2>
		<div class="csp-cards">
			<?php foreach ( $this->get_remote_items( 'features' ) as $feature ) { ?>
				<a class="csp-card"
				   href="<?php echo esc_url( $feature['follow_url'] ); ?>" target="_blank"
				   title="<?php esc_html_e( 'Read more', 'code-snippets' ); ?>">
					<figure>
						<img src="<?php echo esc_url( $feature['image_url'] ); ?>"
						     alt="<?php esc_attr_e( 'Feature image', 'code-snippets' ); ?>);">
					</figure>
					<header>
						<h3><?php echo esc_html( $feature['title'] ); ?></h3>
						<p class="csp-card-item-description"><?php echo esc_html( $feature['description'] ); ?></p>
					</header>
					<footer>
						<p class="csp-card-item-category"><?php echo esc_html( $feature['category'] ); ?></p>
						<span class="dashicons dashicons-external"></span>
					</footer>
				</a>
			<?php } ?>
		</div>
	</section>

	<section class="csp-section-links csp-section-partners">
		<h2>
			<span class="dashicons dashicons-admin-site"></span>
			<?php esc_html_e( 'Partners and apps', 'code-snippets' ); ?>
		</h2>
		<div class="csp-cards">
			<?php foreach ( $this->get_remote_items( 'partners' ) as $partner ) { ?>
				<a class="csp-card"
				   href="<?php echo esc_url( $partner['follow_url'] ); ?>" target="_blank"
				   title="<?php esc_attr_e( 'Go to Partner', 'code-snippets' ); ?>">
					<figure>
						<img src="<?php echo esc_url( $partner['image_url'] ); ?>"
						     alt="<?php esc_attr_e( 'Partner image', 'code-snippets' ); ?>">
					</figure>
					<header>
						<span class="dashicons dashicons-external"></span>
						<h3><?php echo esc_html( $partner['title'] ); ?></h3>
					</header>
				</a>
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
