/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Settings as AutoSettings } from '@essex-js-toolkit/themed-components'
import { useCallback } from 'react'

export interface FeaturesProps {
	settings: any
	onChange?: (settings: any) => void
}

export const Features = ({ settings, onChange }: FeaturesProps) => {
	const handleFeaturesChange = useCallback(
		(key: string, value: any) => {
			if (onChange) {
				const updated = { ...settings }
				updated[key] = value
				onChange(updated)
			}
		},
		[onChange, settings],
	)

	return <AutoSettings settings={settings} onChange={handleFeaturesChange} />
}
