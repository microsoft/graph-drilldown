/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, Spinner } from '@fluentui/react'
import type { GraphRenderer } from '@graspologic/renderer'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useCreateRenderer, useSaveImage } from './Export.hooks'
import type { ImageSaveSettings } from './ImageSettings'
import { ImageSettings } from './ImageSettings'

const DEFAULT_IMAGE_SETTINGS = {
	filename: 'graph',
	size: 2000,
}

export const Export: React.FC = () => {
	const [renderer, setRenderer] = useState<GraphRenderer>()
	const [create, setCreate] = useState<boolean>(false)
	const [save, setSave] = useState<boolean>(false)
	const handleExportClick = useCallback(() => {
		setCreate(true)
		setSave(true)
	}, [])
	const [imageSettings, setImageSettings] = useState<ImageSaveSettings>(
		DEFAULT_IMAGE_SETTINGS,
	)
	const handleImageSettingsChange = useCallback(s => setImageSettings(s), [])
	const handleOnRenderer = useCallback(r => setRenderer(r), [])
	const handleSaveComplete = useCallback(() => setSave(false), [])
	useCreateRenderer(create, handleOnRenderer)
	useSaveImage(save, imageSettings, renderer, handleSaveComplete)

	return (
		<Container>
			<ImageSettings
				settings={imageSettings}
				onChange={handleImageSettingsChange}
			/>
			<ActionButton
				title={'Save graph image'}
				iconProps={{ iconName: 'Download' }}
				onClick={handleExportClick}
			>
				Save
			</ActionButton>
			{save ? <Spinner label={'Preparing image...'} /> : null}
		</Container>
	)
}

const Container = styled.div``
