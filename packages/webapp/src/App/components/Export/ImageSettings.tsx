/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NumberSpinButton } from '@essex-js-toolkit/themed-components'
import { TextField } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'

export interface ImageSaveSettings {
	filename: string
	size: number
}

export interface ImageSettingsProps {
	settings: ImageSaveSettings
	onChange?: (settings: ImageSaveSettings) => void
}
export const ImageSettings: React.FC<ImageSettingsProps> = ({
	onChange,
	settings,
}) => {
	const handleFilenameChange = useCallback(
		(e, value) => {
			onChange &&
				onChange({
					...settings,
					filename: value,
				})
		},
		[onChange, settings],
	)

	const handleSizeChange = useCallback(
		value => {
			onChange &&
				onChange({
					...settings,
					size: value,
				})
		},
		[onChange, settings],
	)

	return (
		<Container>
			<TextField
				label={'Filename'}
				value={settings.filename}
				suffix={'.png'}
				onChange={handleFilenameChange}
				styles={{
					// TODO: this is a kludge to align the label with the NumberSpinButton next to it
					fieldGroup: {
						marginTop: 3,
					},
				}}
			/>
			<Size>
				<NumberSpinButton
					label={'Size (px)'}
					value={settings.size}
					onChange={handleSizeChange}
					incrementButtonAriaLabel="increment size (px)"
					decrementButtonAriaLabel="decrement size (px)"
				/>
			</Size>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	justify-content: space-between;
`

const Size = styled.div`
	width: 25%;
`
