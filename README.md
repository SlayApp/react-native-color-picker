# react-native-color-picker

A React Native color picker component that uses native UI components for both iOS and Android platforms.

## Features

-   Native color picker UI for both iOS and Android
-   Support for hex, RGBA, and RGB color formats
-   Alpha channel support (optional)
-   Promise-based API
-   TypeScript support
-   Color format conversion utilities

## Installation

```bash
npm install react-native-color-picker
# or
yarn add react-native-color-picker
```

### iOS

For iOS, you need to install the pods:

```bash
cd ios && pod install && cd ..
```

## Usage

```typescript
import ColorPicker from 'react-native-color-picker'

// Basic usage
try {
	const color = await ColorPicker.show({
		color: '#FF0000', // Initial color
		supportsAlpha: true, // Enable alpha channel
		title: 'Select a Color', // Android only
	})
	console.log('Selected color:', color)
} catch (error) {
	console.log('Color picker dismissed')
}

// Using callbacks
ColorPicker.show({
	color: 'rgba(255, 0, 0, 0.5)',
	onColorSelected: color => {
		console.log('Selected color:', color)
	},
	onDismissed: () => {
		console.log('Color picker dismissed')
	},
})

// Color format conversion
const hexColor = ColorPicker.toHex('rgba(255, 0, 0, 0.5)')
const rgbaColor = ColorPicker.toRgba('#FF0000')
const colorObject = ColorPicker.toObject('rgba(255, 0, 0, 0.5)')
```

## API

### ColorPicker.show(options?: ColorPickerOptions): Promise<string>

Shows the color picker dialog.

#### Options

| Property        | Type                                                      | Default          | Description                               |
| --------------- | --------------------------------------------------------- | ---------------- | ----------------------------------------- |
| color           | string \| { r: number; g: number; b: number; a?: number } | '#FF0000'        | Initial color value                       |
| supportsAlpha   | boolean                                                   | true             | Whether to enable alpha channel selection |
| title           | string                                                    | 'Select a Color' | Dialog title (Android only)               |
| onColorSelected | (color: string) => void                                   | -                | Callback when a color is selected         |
| onDismissed     | () => void                                                | -                | Callback when the picker is dismissed     |

### ColorPicker.hide(): void

Hides the color picker dialog.

### ColorPicker.toHex(color: string \| ColorObject): string

Converts a color to hex format (e.g., '#FF0000').

### ColorPicker.toRgba(color: string \| ColorObject): string

Converts a color to RGBA format (e.g., 'rgba(255, 0, 0, 1)').

### ColorPicker.toObject(color: string): ColorObject

Converts a color string to an object with r, g, b, a properties.

### ColorPicker.registerDevMenu(): void

Registers the color picker with the React Native dev menu.

## License

MIT © SLAY GmbH
