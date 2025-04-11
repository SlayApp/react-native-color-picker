import { NativeModules } from 'react-native'

import { ColorPicker } from '../index'

jest.mock('react-native', () => {
	const reactNative = jest.requireActual('react-native')
	return {
		...reactNative,
		NativeModules: {
			...reactNative.NativeModules,
			ColorPickerModule: {
				show: jest.fn((options, successCallback, _errorCallback) => {
					successCallback('#FF0000')
				}),
				hide: jest.fn(),
				registerDevMenu: jest.fn(),
			},
		},
	}
})

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
	getEnforcing: jest.fn(() => ({
		show: jest.fn((options, successCallback, _errorCallback) => {
			successCallback('#FF0000')
		}),
		hide: jest.fn(),
		registerDevMenu: jest.fn(),
	})),
	get: jest.fn(() => null),
}))

jest.mock('react-native/Libraries/Modal/Modal', () => ({}))

jest.mock('react-native/Libraries/Settings/Settings', () => ({
	get: jest.fn(),
	set: jest.fn(),
}))

describe('ColorPicker', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('show', () => {
		it('should call the native module with correct parameters', async () => {
			const options = {
				color: '#00FF00',
				supportsAlpha: false,
				title: 'Test Color Picker',
			}

			const onColorSelected = jest.fn()
			const onDismissed = jest.fn()

			options.onColorSelected = onColorSelected
			options.onDismissed = onDismissed

			const colorPromise = ColorPicker.show(options)

			expect(NativeModules.ColorPickerModule.show).toHaveBeenCalledWith(
				{
					color: '#00FF00',
					supportsAlpha: false,
					title: 'Test Color Picker',
				},
				expect.any(Function),
				expect.any(Function),
			)

			const selectedColor = await colorPromise
			expect(selectedColor).toBe('#FF0000')
			expect(onColorSelected).toHaveBeenCalledWith('#FF0000')
		})

		it('should use default values when options are not provided', () => {
			ColorPicker.show()

			expect(NativeModules.ColorPickerModule.show).toHaveBeenCalledWith(
				{
					color: '#FF0000',
					supportsAlpha: true,
					title: 'Select a Color',
				},
				expect.any(Function),
				expect.any(Function),
			)
		})

		it('should reject the promise when color picker is dismissed', async () => {
			NativeModules.ColorPickerModule.show.mockImplementationOnce((options, successCallback, errorCallback) => {
				errorCallback()
			})

			const onDismissed = jest.fn()

			await expect(ColorPicker.show({ onDismissed })).rejects.toThrow('Color picker dismissed')
			expect(onDismissed).toHaveBeenCalled()
		})
	})

	describe('hide', () => {
		it('should call the native module hide method', () => {
			ColorPicker.hide()
			expect(NativeModules.ColorPickerModule.hide).toHaveBeenCalled()
		})
	})

	describe('registerDevMenu', () => {
		it('should call the native module registerDevMenu method in dev mode', () => {
			global.__DEV__ = true

			ColorPicker.registerDevMenu()
			expect(NativeModules.ColorPickerModule.registerDevMenu).toHaveBeenCalled()
		})

		it('should not call the native module registerDevMenu method in production mode', () => {
			global.__DEV__ = false

			ColorPicker.registerDevMenu()
			expect(NativeModules.ColorPickerModule.registerDevMenu).not.toHaveBeenCalled()
		})
	})

	describe('color utilities', () => {
		describe('toHex', () => {
			it('should return the hex value for a valid hex string', () => {
				expect(ColorPicker.toHex('#FF0000')).toBe('#FF0000')
			})

			it('should convert rgba string to hex', () => {
				const result = ColorPicker.toHex('rgba(255, 0, 0, 1)')
				expect(result).toMatch(/#FF0000/i)
			})

			it('should convert rgb string to hex', () => {
				const result = ColorPicker.toHex('rgb(255, 0, 0)')
				expect(result).toMatch(/#FF0000/i)
			})

			it('should convert color object to hex', () => {
				const result = ColorPicker.toHex({ r: 255, g: 0, b: 0, a: 1 })
				expect(result).toMatch(/#FF0000/i)
			})
		})

		describe('toRgba', () => {
			it('should return rgba string for a valid hex string', () => {
				const result = ColorPicker.toRgba('#FF0000')
				expect(result).toMatch(/rgba\(255,\s*0,\s*0,\s*1\)/i)
			})

			it('should return the rgba value for a valid rgba string', () => {
				expect(ColorPicker.toRgba('rgba(255, 0, 0, 1)')).toBe('rgba(255, 0, 0, 1)')
			})

			it('should convert rgb string to rgba', () => {
				const result = ColorPicker.toRgba('rgb(255, 0, 0)')
				expect(result).toMatch(/rgba\(255,\s*0,\s*0,\s*1\)/i)
			})

			it('should convert color object to rgba', () => {
				const result = ColorPicker.toRgba({ r: 255, g: 0, b: 0, a: 0.5 })
				expect(result).toMatch(/rgba\(255,\s*0,\s*0,\s*0.5\)/i)
			})
		})

		describe('toObject', () => {
			it('should convert hex string to color object', () => {
				const result = ColorPicker.toObject('#FF0000')
				expect(result).toEqual({ r: 255, g: 0, b: 0, a: 1 })
			})

			it('should convert rgba string to color object', () => {
				const result = ColorPicker.toObject('rgba(255, 0, 0, 0.5)')
				expect(result).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
			})

			it('should convert rgb string to color object', () => {
				const result = ColorPicker.toObject('rgb(255, 0, 0)')
				expect(result).toEqual({ r: 255, g: 0, b: 0, a: 1 })
			})
		})
	})
})
