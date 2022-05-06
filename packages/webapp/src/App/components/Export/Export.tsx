/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, Spinner } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'

import {
	useCreateRenderer,
	useImageSettings,
	useSaveImage,
} from './Export.hooks'
import { ImageSettings } from './ImageSettings'

export const Export: React.FC = () => {
	const { settings, onSettingsChange } = useImageSettings()

	const { renderer, doCreate } = useCreateRenderer()

	const { saving, doSave } = useSaveImage(settings, renderer)

	const handleExportClick = useCallback(() => {
		doCreate()
		doSave()
	}, [doCreate, doSave])

	return (
		<Container>
			<ImageSettings settings={settings} onChange={onSettingsChange} />
			<ActionButton
				title={'Save graph image'}
				iconProps={{ iconName: 'Download' }}
				onClick={handleExportClick}
			>
				Save
			</ActionButton>
			{saving ? <Spinner label={'Preparing image...'} /> : null}
		</Container>
	)
}

const Container = styled.div``
