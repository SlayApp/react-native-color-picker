declare module 'react-native-color-picker' {
	export interface ColorPickerOptions {
		/**
		 * Initial color value. Can be hex string, rgba string, or object with r,g,b,a properties
		 * @default '#FF0000'
		 */
		color?: string | { r: number; g: number; b: number; a?: number }

		/**
		 * Whether alpha channel selection is supported
		 * @default true
		 */
		supportsAlpha?: boolean

		/**
		 * Title for the color picker dialog (Android only)
		 * @default 'Select a Color'
		 */
		title?: string

		/**
		 * Callback when a color is selected
		 */
		onColorSelected?: (color: string) => void

		/**
		 * Callback when the picker is dismissed without selection
		 */
		onDismissed?: () => void
	}

	export interface ColorObject {
		r: number
		g: number
		b: number
		a: number
	}

	export interface ColorPickerInterface {
		/**
		 * Show the color picker
		 * @param options Configuration options
		 * @returns Promise that resolves with the selected color or rejects if dismissed
		 */
		show(options?: ColorPickerOptions): Promise<string>

		/**
		 * Hide the color picker
		 */
		hide(): void

		/**
		 * Convert color to hex format
		 * @param color Color in any supported format
		 * @returns Hex string (e.g., '#FF0000')
		 */
		toHex(color: string | ColorObject): string

		/**
		 * Convert color to RGBA format
		 * @param color Color in any supported format
		 * @returns RGBA string (e.g., 'rgba(255, 0, 0, 1)')
		 */
		toRgba(color: string | ColorObject): string

		/**
		 * Convert color to object format
		 * @param color Color in string format
		 * @returns Object with r, g, b, a properties
		 */
		toObject(color: string): ColorObject

		/**
		 * Register with React Native dev menu
		 */
		registerDevMenu(): void
	}

	const ColorPicker: ColorPickerInterface
	export default ColorPicker
}
