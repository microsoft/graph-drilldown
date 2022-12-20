/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Settings as AutoSettings } from '@essex/components'
import { useCallback } from 'react'

export interface SettingsProps {
	settings: any
	groups?: any
	onChange?: (settings: any) => void
}

export const Settings = ({ settings, groups, onChange }: SettingsProps) => {
	const handleSettingsChange = useCallback(
		(key: string, value: any) => {
			if (onChange) {
				const updated = { ...settings }
				updated[key] = value
				onChange(updated)
			}
		},
		[onChange, settings],
	)
	return (
		<AutoSettings
			settings={settings}
			groups={groups}
			onChange={handleSettingsChange}
		/>
	)
}
