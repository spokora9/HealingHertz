# PWA Icons

## Source Icon
`icon-source.svg` - Source SVG file with Bell Audio branding

## Required Icon Sizes
Generate PNG files from the source SVG at the following sizes:

### Standard Icons
- `icon-16x16.png` - Browser favicon
- `icon-32x32.png` - Browser favicon
- `icon-72x72.png` - iOS home screen (non-retina iPad)
- `icon-96x96.png` - Android home screen
- `icon-128x128.png` - Chrome Web Store
- `icon-144x144.png` - Windows tile
- `icon-152x152.png` - iOS home screen (iPad retina)
- `icon-192x192.png` - Android home screen (HDPI)
- `icon-384x384.png` - Android splash screen
- `icon-512x512.png` - Android home screen (XXXHDPI) - **Must be maskable**

### Apple Specific
- `apple-touch-icon.png` (180x180) - iOS home screen icon

### Shortcuts
- `shortcut-meditation.png` (96x96) - Meditation shortcut icon
- `shortcut-binaural.png` (96x96) - Binaural beats shortcut icon

### SVG Icons
- `safari-pinned-tab.svg` - Safari pinned tab (monochrome)

## Generation Commands

### Using ImageMagick
```bash
# Install ImageMagick if needed
# brew install imagemagick  # macOS
# apt-get install imagemagick  # Linux

# Generate all PNG sizes
for size in 16 32 72 96 128 144 152 192 384 512; do
  convert icon-source.svg -resize ${size}x${size} icon-${size}x${size}.png
done

# Generate Apple touch icon
convert icon-source.svg -resize 180x180 apple-touch-icon.png

# Generate shortcut icons
convert icon-source.svg -resize 96x96 shortcut-meditation.png
convert icon-source.svg -resize 96x96 shortcut-binaural.png
```

### Using Online Tools
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

### Maskable Icon
The 512x512 icon should be maskable (safe zone in center). Use:
- [Maskable.app](https://maskable.app/) to test and generate

## Quick Setup
```bash
npm install -g pwa-asset-generator
pwa-asset-generator icon-source.svg ./icons --background "#0a0a0b" --maskable
```
