/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphRenderer } from '@graspologic/renderer'
import { useCallback, useEffect, useState } from 'react'

import type { ImageSaveSettings } from '../ImageSettings'

/**
 * Saves image from renderer when requested.
 * @param settings Image settings to apply to download.
 * @param renderer Instantiated renderer.

 */
export function useSaveImage(
	settings: ImageSaveSettings,
	renderer?: GraphRenderer,
) {
	const [saving, setSaving] = useState<boolean>(false)
	const doSave = useCallback(() => setSaving(true), [setSaving])

	useEffect(() => {
		if (renderer && saving) {
			// need to force resize on the renderer directly
			renderer.resize(settings.size, settings.size)
			renderer.makeDirty()
			renderer.render()
			const { view } = renderer
			const data = (view as HTMLCanvasElement).toDataURL('image/png', 1)
			const link = document.createElement('a')
			link.download = settings.filename
			link.href = data
			link.click()
			setSaving(false)
		}
	}, [renderer, saving, settings, setSaving])

	return {
		saving,
		doSave,
	}
}
