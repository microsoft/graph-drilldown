/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	useHoveredNodeColor,
	useSelectedNodeColor,
	useAOIBoundsColor,
	useMiniMapNodeColor,
	useBackgroundColor,
	useNodeIds,
} from '../../hooks/graph'
import { Bounds } from '../../types'
import { useAOIBounds, usePlotTheme } from './MiniMap.hooks'
import { GraphContainer, InputGraph } from '@graspologic/graph'
import { GraphView, NodeSetHighlight, Nodes } from '@graspologic/react'
import { useCallback } from 'react'
import styled from 'styled-components'
import { NodeCollection } from '~/arquero'

export interface MinimapProps {
	data: InputGraph | GraphContainer
	width: number
	height: number
	hoveredNodes?: NodeCollection
	selectedNodes?: NodeCollection
	minRadius?: number
	maxRadius?: number
	aoiBounds?: Bounds
}

export const Minimap = ({
	data,
	width,
	height,
	minRadius = 1,
	maxRadius = 1,
	hoveredNodes,
	selectedNodes,
	aoiBounds,
}: MinimapProps) => {
	const hoveredNodeIds = useNodeIds(hoveredNodes)
	const selectedNodeIds = useNodeIds(selectedNodes)

	const backgroundColor = useBackgroundColor()
	const selectedColor = useSelectedNodeColor()
	const boundsColor = useAOIBoundsColor()
	const hoverColor = useHoveredNodeColor()
	const nodeColor = useMiniMapNodeColor()
	const colorize = useCallback(() => nodeColor, [nodeColor])

	// aoi will be tied to actual pixel dimensions, so we need to adjust the 0-1 scaling to fit
	const { x, y, w, h, showAoi } = useAOIBounds(height, width, aoiBounds)
	const plotTheme = usePlotTheme(width, height)

	return (
		<Container width={width} height={height}>
			<GraphView
				data={data}
				backgroundColor={backgroundColor}
				style={plotTheme}
			>
				<Nodes color={colorize} minRadius={minRadius} maxRadius={maxRadius} />
				<NodeSetHighlight
					key={`selected`}
					vertexIds={selectedNodeIds}
					color={selectedColor}
				/>
				<NodeSetHighlight
					key={`hovered`}
					vertexIds={hoveredNodeIds}
					color={hoverColor}
				/>
			</GraphView>
			{showAoi ? (
				<Aoi>
					<Svg width={width} height={height}>
						<rect
							stroke={boundsColor}
							strokeOpacity={0.6}
							strokeWidth={1.0}
							x={x}
							y={y}
							width={w}
							height={h}
							fill={'transparent'}
						/>
					</Svg>
				</Aoi>
			) : null}
		</Container>
	)
}

const Container = styled.div<{ width: number; height: number }>`
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
`

const Aoi = styled.div`
	position: relative;
`

const Svg = styled.svg`
	pointer-events: none;
	position: absolute;
	left: 10px;
	bottom: 0px;
`
