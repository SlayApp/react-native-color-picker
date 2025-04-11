import ColorPickerModule from './ColorPickerModule'

export interface ColorPickerOptions {
	color?: string
	supportsAlpha?: boolean
	title?: string
	onColorSelected?: (color: string) => void
	onDismissed?: () => void
}

export interface ColorObject {
	r: number
	g: number
	b: number
	a: number
}

const DEFAULT_OPTIONS: ColorPickerOptions = {
	color: '#FF0000',
	supportsAlpha: true,
	title: 'Select a Color',
}

/**
 * A cross-platform color picker component that uses native UI components
 * on both iOS and Android.
 */
export const ColorPicker = {
	/**
	 * Shows the color picker with the specified options.
	 * Returns a promise that resolves with the selected color or rejects if dismissed.
	 */
	show(options: ColorPickerOptions = {}): Promise<string> {
		const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

		return new Promise((resolve, reject) => {
			ColorPickerModule.show(
				mergedOptions,
				(color: string) => {
					if (options.onColorSelected) {
						options.onColorSelected(color)
					}
					resolve(color)
				},
				() => {
					if (options.onDismissed) {
						options.onDismissed()
					}
					reject(new Error('Color picker dismissed'))
				},
			)
		})
	},

	/**
	 * Hides the color picker programmatically.
	 */
	hide(): void {
		ColorPickerModule.hide()
	},

	/**
	 * Registers the color picker with the React Native dev menu.
	 * Only works in development mode.
	 */
	registerDevMenu(): void {
		if (__DEV__) {
			ColorPickerModule.registerDevMenu()
		}
	},

	/**
	 * Converts a color to hex format.
	 */
	toHex(color: string | ColorObject): string {
		if (typeof color === 'string') {
			if (color.startsWith('#')) {
				return color
			} else if (color.startsWith('rgb')) {
				return this.rgbaToHex(color)
			}
		} else if (typeof color === 'object') {
			return this.rgbaToHex(`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`)
		}

		return '#FF0000'
	},

	/**
	 * Converts a color to RGBA format.
	 */
	toRgba(color: string | ColorObject): string {
		if (typeof color === 'string') {
			if (color.startsWith('rgba')) {
				return color
			} else if (color.startsWith('rgb(')) {
				const rgb = color.match(/\d+/g)
				if (rgb && rgb.length >= 3) {
					return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`
				}
			} else if (color.startsWith('#')) {
				return this.hexToRgba(color)
			}
		} else if (typeof color === 'object') {
			return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
		}

		return 'rgba(255, 0, 0, 1)'
	},

	/**
	 * Converts a color to an object with r, g, b, a properties.
	 */
	toObject(color: string): ColorObject {
		let rgba = color
		if (color.startsWith('#')) {
			rgba = this.hexToRgba(color)
		} else if (color.startsWith('rgb(')) {
			rgba = this.toRgba(color)
		}

		const parts = rgba.match(/\d+(\.\d+)?/g)
		if (parts && parts.length >= 4) {
			return {
				r: parseInt(parts[0] || '0', 10),
				g: parseInt(parts[1] || '0', 10),
				b: parseInt(parts[2] || '0', 10),
				a: parseFloat(parts[3] || '1'),
			}
		} else if (parts && parts.length >= 3) {
			return {
				r: parseInt(parts[0] || '0', 10),
				g: parseInt(parts[1] || '0', 10),
				b: parseInt(parts[2] || '0', 10),
				a: 1,
			}
		}

		return { r: 255, g: 0, b: 0, a: 1 }
	},

	rgbToHex(r: number, g: number, b: number): string {
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
	},

	rgbaToHex(rgba: string): string {
		const parts = rgba.match(/\d+(\.\d+)?/g)
		if (parts && parts.length >= 3) {
			const r = parseInt(parts[0] || '0', 10)
			const g = parseInt(parts[1] || '0', 10)
			const b = parseInt(parts[2] || '0', 10)

			return this.rgbToHex(r, g, b)
		}

		return '#FF0000'
	},

	hexToRgba(hex: string): string {
		const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
		const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex)

		if (result) {
			const r = parseInt(result[1] || '0', 16)
			const g = parseInt(result[2] || '0', 16)
			const b = parseInt(result[3] || '0', 16)

			return `rgba(${r}, ${g}, ${b}, 1)`
		}

		return 'rgba(255, 0, 0, 1)'
	},
}

export default ColorPicker
