import { NativeModules, Platform } from 'react-native'

/* global __DEV__ */

const LINKING_ERROR =
	`The package 'react-native-color-picker' doesn't seem to be linked. Make sure: \n\n` +
	Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo Go\n'

const ColorPickerModule = NativeModules.ColorPickerModule
	? NativeModules.ColorPickerModule
	: new Proxy(
			{},
			{
				get() {
					throw new Error(LINKING_ERROR)
				},
			},
		)

/**
 * Convert color to hex format
 * @param {string|object} color - Color in any supported format
 * @returns {string} - Hex string (e.g., '#FF0000')
 */
const toHex = color => {
	if (typeof color === 'string') {
		if (color.startsWith('#')) {
			return color
		}

		if (color.startsWith('rgba')) {
			const rgba = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
			if (rgba) {
				const [, r, g, b, a] = rgba.map(Number)
				return rgbaToHex(r, g, b, a)
			}
		}

		if (color.startsWith('rgb')) {
			const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
			if (rgb) {
				const [, r, g, b] = rgb.map(Number)
				return rgbToHex(r, g, b)
			}
		}

		return color // Return as is if format not recognized
	} else if (typeof color === 'object') {
		const { r, g, b, a = 1 } = color
		return a < 1 ? rgbaToHex(r, g, b, a) : rgbToHex(r, g, b)
	}

	return '#FF0000' // Default to red if invalid input
}

/**
 * Convert color to RGBA format
 * @param {string|object} color - Color in any supported format
 * @returns {string} - RGBA string (e.g., 'rgba(255, 0, 0, 1)')
 */
const toRgba = color => {
	if (typeof color === 'string') {
		if (color.startsWith('#')) {
			const { r, g, b, a } = hexToRgba(color)
			return `rgba(${r}, ${g}, ${b}, ${a})`
		}

		if (color.startsWith('rgba')) {
			return color
		}

		if (color.startsWith('rgb')) {
			const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
			if (rgb) {
				const [, r, g, b] = rgb.map(Number)
				return `rgba(${r}, ${g}, ${b}, 1)`
			}
		}

		return 'rgba(255, 0, 0, 1)' // Default to red if format not recognized
	} else if (typeof color === 'object') {
		const { r, g, b, a = 1 } = color
		return `rgba(${r}, ${g}, ${b}, ${a})`
	}

	return 'rgba(255, 0, 0, 1)' // Default to red if invalid input
}

/**
 * Convert color to object format
 * @param {string} color - Color in string format
 * @returns {object} - Object with r, g, b, a properties
 */
const toObject = color => {
	if (typeof color === 'string') {
		if (color.startsWith('#')) {
			return hexToRgba(color)
		}

		if (color.startsWith('rgba')) {
			const rgba = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
			if (rgba) {
				const [, r, g, b, a] = rgba.map(Number)
				return { r, g, b, a }
			}
		}

		if (color.startsWith('rgb')) {
			const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
			if (rgb) {
				const [, r, g, b] = rgb.map(Number)
				return { r, g, b, a: 1 }
			}
		}
	}

	return { r: 255, g: 0, b: 0, a: 1 } // Default to red if invalid input
}

const rgbToHex = (r, g, b) => {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

const rgbaToHex = (r, g, b, a) => {
	const alpha = Math.round(a * 255)
		.toString(16)
		.padStart(2, '0')
		.toUpperCase()
	return `${rgbToHex(r, g, b)}${alpha}`
}

const hexToRgba = hex => {
	hex = hex.replace('#', '')

	let r,
		g,
		b,
		a = 1

	if (hex.length === 3) {
		r = parseInt(hex.charAt(0) + hex.charAt(0), 16)
		g = parseInt(hex.charAt(1) + hex.charAt(1), 16)
		b = parseInt(hex.charAt(2) + hex.charAt(2), 16)
	} else if (hex.length === 6) {
		r = parseInt(hex.substring(0, 2), 16)
		g = parseInt(hex.substring(2, 4), 16)
		b = parseInt(hex.substring(4, 6), 16)
	} else if (hex.length === 8) {
		r = parseInt(hex.substring(0, 2), 16)
		g = parseInt(hex.substring(2, 4), 16)
		b = parseInt(hex.substring(4, 6), 16)
		a = parseInt(hex.substring(6, 8), 16) / 255
	}

	return { r, g, b, a }
}

/**
 * React Native Color Picker
 */
export const ColorPicker = {
	/**
	 * Show the color picker
	 * @param {object} options - Configuration options
	 * @param {string} [options.color='#FF0000'] - Initial color
	 * @param {boolean} [options.supportsAlpha=true] - Whether alpha channel is supported
	 * @param {string} [options.title] - Title for the picker (Android only)
	 * @param {function} [options.onColorSelected] - Callback when color is selected
	 * @param {function} [options.onDismissed] - Callback when picker is dismissed
	 * @returns {Promise<string>} - Promise that resolves with the selected color
	 */
	show: (options = {}) => {
		const {
			color = '#FF0000',
			supportsAlpha = true,
			title = 'Select a Color',
			onColorSelected,
			onDismissed,
		} = options

		return new Promise((resolve, reject) => {
			ColorPickerModule.show(
				{ color, supportsAlpha, title },
				selectedColor => {
					if (onColorSelected) {
						onColorSelected(selectedColor)
					}
					resolve(selectedColor)
				},
				() => {
					if (onDismissed) {
						onDismissed()
					}
					reject(new Error('Color picker dismissed'))
				},
			)
		})
	},

	/**
	 * Hide the color picker
	 */
	hide: () => {
		ColorPickerModule.hide()
	},

	toHex,
	toRgba,
	toObject,

	/**
	 * Register with React Native dev menu
	 */
	registerDevMenu: () => {
		if (__DEV__) {
			ColorPickerModule.registerDevMenu()
		}
	},
}

export default ColorPicker
