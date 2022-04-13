/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	useBackgroundColor,
	useHoveredNodeColor,
	useNodeColorScale,
	useNodeIds,
	useNodeWeighter,
	useEdgeColorizer,
	useEdgeWeighter,
	useEdgeSizeRange,
	useNodeSizeRange,
	useNodePositions,
} from '../../hooks/graph'
import { Bounds } from '../../types'
import { usePositions } from './GraphViewer.hooks'
import { GraphContainer, InputGraph } from '@graspologic/graph'
import {
	GraphView,
	Camera,
	NodeSetHighlight,
	Nodes,
	Edges,
	HighlightHoveredNode,
} from '@graspologic/react'
import { GraphRenderer } from '@graspologic/renderer'
import { useCallback } from 'react'
import styled from 'styled-components'
import { NodeCollection } from '~/arquero'
import {
	useEdgesVisible,
	useNodesVisible,
	useSetHoveredNode,
	useGraphViewType,
	useSettings,
	useSelectedNodesState,
} from '~/state'

interface GraphViewerProps {
	data: InputGraph | GraphContainer
	width?: number
	height?: number
	hoveredNodes?: NodeCollection
	style?: React.CSSProperties
	cameraBounds?: Bounds
	onRendererInitialized?: (renderer: GraphRenderer) => void
	/**
	 * Transition time for animated node movements.
	 * Note that export requires 0 transition for detached rendering
	 * to work correctly.
	 */
	transition?: number
	interactive?: boolean
}

/**
 * This graph viewer is used for both the large graph and the minimap
 * @param param0
 */
export const GraphViewer = ({
	data,
	style,
	width = 1000,
	height = 1000,
	hoveredNodes,
	cameraBounds,
	onRendererInitialized,
	transition = 0,
	interactive = false,
}: GraphViewerProps) => {
	const [settings] = useSettings()

	const view = useGraphViewType()
	const positionMaps = usePositions(view)
	const nodePositions = useNodePositions(positionMaps, view, transition)
	const selectedIds = useSelectedNodesState() // selection via search
	const hoveredNodeIds = useNodeIds(hoveredNodes)

	const selectedNodeIds = useNodeIds(selectedIds)

	const backgroundColor = useBackgroundColor()
	const hoverColor = useHoveredNodeColor()

	const showNodes = useNodesVisible()
	const nodeColorizer = useNodeColorScale()
	const nodeWeighter = useNodeWeighter()
	const nodeRange = useNodeSizeRange()

	const showEdges = useEdgesVisible()
	const edgeColorizer = useEdgeColorizer()
	const edgeWeighter = useEdgeWeighter()
	const edgeRange = useEdgeSizeRange()

	const setHoveredNode = useSetHoveredNode()
	const handleNodeHover = useCallback(
		(id: string | undefined) => {
			setHoveredNode(id)
		},
		[setHoveredNode],
	)

	const handleInitialize = useCallback(
		renderer => onRendererInitialized && onRendererInitialized(renderer),
		[onRendererInitialized],
	)

	return (
		<FlexColumn
			style={{
				width,
				height,
				...style,
			}}
		>
			<GraphView
				data={data}
				backgroundColor={backgroundColor}
				onInitialize={handleInitialize}
				style={{
					flex: 1,
					width: undefined,
					height: undefined,
				}}
			>
				{interactive ? (
					<Camera bounds={cameraBounds} transitionDuration={transition} />
				) : null}
				<Edges
					color={edgeColorizer}
					weight={edgeWeighter}
					hideOnMove={settings.hideEdgesWhileMoving}
					disabled={!showEdges}
					minWidth={edgeRange[0]}
					maxWidth={edgeRange[1]}
				/>
				<Nodes
					disabled={!showNodes}
					color={nodeColorizer}
					position={nodePositions}
					weight={nodeWeighter}
					minRadius={nodeRange[0]}
					maxRadius={nodeRange[1]}
				/>
				<NodeSetHighlight
					key={`hovered`}
					vertexIds={hoveredNodeIds}
					color={hoverColor}
				/>
				<NodeSetHighlight
					key={`selected`}
					vertexIds={selectedNodeIds}
					color={hoverColor}
				/>
				<HighlightHoveredNode color={hoverColor} onHover={handleNodeHover} />
			</GraphView>
		</FlexColumn>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
`
