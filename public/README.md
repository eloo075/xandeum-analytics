# Public Assets Directory

Place your logo file here as `logo.png` or `logo.svg`.

## Logo Requirements

- **Recommended format**: PNG or SVG
- **Recommended size**: 48x48px to 128x128px (will be scaled as needed)
- **File name**: `logo.png` or `logo.svg`
- **Transparent background**: Recommended for best appearance

## Logo Color Extraction

After adding your logo, you can extract the primary color and update the CSS variable in `app/globals.css`:

```css
:root {
  --logo-color: R, G, B; /* Replace with your logo's primary color RGB values */
}
```

For example, if your logo's primary color is `#FF6B35`, you would use:
```css
--logo-color: 255, 107, 53;
```

This color will automatically be applied to all time-related elements (uptime, last seen, etc.).



