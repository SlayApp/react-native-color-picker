import { TurboModuleRegistry } from 'react-native'
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport'

export interface Spec extends TurboModule {
	show(
		options: {
			color: string
			supportsAlpha: boolean
			title?: string
		},
		onColorSelected: (color: string) => void,
		onDismissed: () => void,
	): void

	hide(): void

	registerDevMenu(): void
}

export default TurboModuleRegistry.getEnforcing<Spec>('ColorPickerModule')
