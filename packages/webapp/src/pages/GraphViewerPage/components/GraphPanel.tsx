/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphRenderer } from '@graspologic/renderer'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { useArqueroHoveredNodes } from '~/arquero'
import { useDynamicCameraBounds, useInputGraph } from '~/hooks/graph'

import { GraphViewer } from '~/components/GraphViewer'

const TRANSITION = 1000

export interface GraphPanelProps {
	width: number
	height: number
	onRendererReady?: (renderer: GraphRenderer) => void
}

export const GraphPanel: React.FC<GraphPanelProps> = memo(function GraphPanel({
	width,
	height,
	onRendererReady,
}) {
	const data = useInputGraph()
	const hoveredNodes = useArqueroHoveredNodes()
	const cameraBounds = useDynamicCameraBounds()

	const handleRendererInitialized = useCallback(
		renderer => {
			if (onRendererReady) {
				onRendererReady(renderer)
			}
		},
		[onRendererReady],
	)
	return (
		<Container>
			<GraphViewer
				data={data}
				width={width}
				height={height}
				hoveredNodes={hoveredNodes}
				cameraBounds={cameraBounds}
				onRendererInitialized={handleRendererInitialized}
				transition={TRANSITION}
				interactive
			/>
		</Container>
	)
})

const Container = styled.div``
