/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useColorPickerProps } from '@essex/components'
import type { IColor } from '@fluentui/react'
import { ColorPicker } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'

import type { ColorSelectorProps } from './ColorSelector.types.js'

export const FixedPicker: React.FC<ColorSelectorProps> = ({
	encoding,
	onChange,
}) => {
	const handlePickerChange = useCallback(
		(e, color: IColor) => {
			onChange({
				value: `#${color.hex}`,
			})
		},
		[onChange],
	)

	const colorPickerProps = useColorPickerProps({}, 'small')
	return (
		<Container>
			<ColorPicker
				color={encoding.value || 'none'}
				onChange={handlePickerChange}
				alphaType="none"
				{...colorPickerProps}
			/>
		</Container>
	)
}

const Container = styled.div`
	margin-top: 8px;
`
