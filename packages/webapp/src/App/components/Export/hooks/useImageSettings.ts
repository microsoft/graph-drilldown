/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'

import type { ImageSaveSettings } from '../ImageSettings'

const DEFAULT_IMAGE_SETTINGS = {
	filename: 'graph',
	size: 2000,
}

export function useImageSettings() {
	const [settings, setImageSettings] = useState<ImageSaveSettings>(
		DEFAULT_IMAGE_SETTINGS,
	)

	const onSettingsChange = useCallback((s) => setImageSettings(s), [])

	return {
		settings,
		onSettingsChange,
	}
}
