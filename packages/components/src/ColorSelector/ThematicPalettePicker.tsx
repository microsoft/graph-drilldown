/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getNamedSchemeColor } from '@thematic/color'
import { useThematic } from '@thematic/react'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import type { ColorSelectorProps } from './ColorSelector.types'

export const ThematicPalettePicker: React.FC<ColorSelectorProps> = ({
	encoding,
	onChange,
}) => {
	const theme = useThematic()
	const paths = useMemo(() => listThematicColors(), [])

	const handleChipClick = useCallback(
		(path: string) => onChange({ thematicSchemePath: path }),
		[onChange],
	)
	const chips = useMemo(() => {
		return paths.map((path, index) => {
			const color = getNamedSchemeColor(theme.scheme, path)
			return (
				<Chip
					title={color.toString()}
					background={color.hex()}
					border={
						path === encoding.thematicSchemePath
							? `3px solid ${theme.application().accent().hex()}`
							: `1px solid ${theme.plotArea().stroke().hex()}`
					}
					role={'button'}
					tabIndex={index}
					key={`thematic-palette-picker-chip-${path}`}
					onClick={() => handleChipClick(path)}
					// TODO: these key defaults should check for enter. same with ColumnEditor
					onKeyDown={() => handleChipClick(path)}
				/>
			)
		})
	}, [theme, paths, encoding, handleChipClick])
	return (
		<Container>
			<Grid>{chips}</Grid>
		</Container>
	)
}

const Container = styled.div`
	margin-top: 8px;
`

const Grid = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`

const Chip = styled.div<{ background: string; border: string }>`
	margin: 4px;
	width: 20px;
	height: 20px;
	cursor: pointer;
	border: ${({ border }) => border};
	background: ${({ background }) => background};
`

/**
 * List the theme color options,
 * compatible with the getNamedColor function.
 * Note that we don't really want all the options
 * on the scheme, just a selection of obvious ones.
 */
export function listThematicColors() {
	const nominals = new Array(10).fill('nominal').map((a, i) => `${a}[${i}]`)
	return [
		'faintAnnotation',
		'lowContrastAnnotation',
		'midContrastAnnotation',
		'highContrastAnnotation',
		...nominals,
	]
}
