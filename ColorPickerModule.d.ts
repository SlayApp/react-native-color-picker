/**
 * Type definitions for the ColorPickerModule
 */
export interface ColorPickerModuleType {
	/**
	 * Shows the color picker with the specified options.
	 */
	show: (
		options: {
			color?: string
			supportsAlpha?: boolean
			title?: string
		},
		onColorSelected: (color: string) => void,
		onDismissed: () => void,
	) => void

	/**
	 * Hides the color picker programmatically.
	 */
	hide: () => void

	/**
	 * Registers the color picker with the React Native dev menu.
	 */
	registerDevMenu: () => void
}

declare const ColorPickerModule: ColorPickerModuleType
export default ColorPickerModule
