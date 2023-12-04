/**
 * This component is used to ensure that the HTML element has a background color
 * that matches the theme. This is necessary because before the StylesheetBehaviors
 * component can apply the correct theme, the HTML element will have a default
 * background color which might not match the device settings.
 */
export function ThemeSyncScript() {
  return (
    <>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="hsl(0 0% 100%)"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="hsl(240, 4%, 5%)"
      />
      {/* Block rendering and set the css variables based on media preferences */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
					(function() {
						const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
						if (isDark) {
              document.documentElement.classList.remove('light');
							document.documentElement.classList.add('dark');
						} else {
							document.documentElement.classList.remove('dark');
							document.documentElement.classList.add('light');
						}
					})();
					`,
        }}
      />
    </>
  )
}