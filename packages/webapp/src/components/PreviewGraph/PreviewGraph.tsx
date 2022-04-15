/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

import { useInternedGraph } from '~/state/caches'

import { GraphViewer } from '../GraphViewer'

export interface PreviewGraphProps {
	width: number
	height: number
}

export const PreviewGraph = ({ width, height }) => {
	const data = useInternedGraph()
	const plotStyle = usePlotStyle()
	return (
		<GraphViewer width={width} height={height} data={data} style={plotStyle} />
	)
}

function usePlotStyle() {
	const theme = useThematic()
	return useMemo(
		() => ({
			border: `1px solid ${theme.plotArea().stroke().hex()}`,
			background: theme.plotArea().fill().hex(),
		}),
		[theme],
	)
}
