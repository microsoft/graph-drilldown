/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ImageSaveSettings } from '../ImageSettings'
import { GraphRenderer } from '@graspologic/renderer'
import { useEffect } from 'react'

/**
 * Saves image from renderer when requested.
 * @param save Indicates if the renderer should be used to save an image.
 * @param settings Image settings to apply to download.
 * @param renderer Instantiated renderer.
 * @param onComplete Callback that fires when save is complete.
 */
export function useSaveImage(
	save: boolean,
	settings: ImageSaveSettings,
	renderer?: GraphRenderer,
	onComplete?: () => void,
) {
	useEffect(() => {
		if (renderer && save) {
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
			onComplete && onComplete()
		}
	}, [renderer, save, settings, onComplete])
}
