# Logo Setup Guide

## Adding Your Logo

1. **Place your logo file** in the `public` directory:
   - File name: `logo.png` or `logo.svg`
   - Recommended size: 48x48px to 128x128px
   - Format: PNG (with transparency) or SVG

2. **The logo will automatically appear** in the dashboard header once the file is in place.

## Setting the Logo Color for Time Elements

After adding your logo, extract its primary color and update the CSS variable:

1. **Extract the RGB values** of your logo's primary color
   - Use an image editor or online tool to get RGB values
   - Example: If your logo color is `#FF6B35`, the RGB is `255, 107, 53`

2. **Update `app/globals.css`**:
   ```css
   :root {
     --logo-color: 255, 107, 53; /* Replace with your logo's RGB values */
   }
   ```

3. **Time elements will automatically use this color**:
   - Uptime displays
   - "Last Seen" timestamps
   - Average uptime in stats cards

## Quick Color Extraction Tools

- **Online**: Use [imagecolorpicker.com](https://imagecolorpicker.com) or similar
- **Photoshop/GIMP**: Use the color picker tool
- **Browser DevTools**: Inspect the logo image and use the color picker

## Example

If your logo's primary color is a vibrant blue (`#0EA5E9`):
```css
:root {
  --logo-color: 14, 165, 233; /* RGB values for #0EA5E9 */
}
```

The time-related elements throughout the dashboard will now match your logo color!



