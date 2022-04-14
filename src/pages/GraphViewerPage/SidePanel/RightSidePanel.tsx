/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EdgeColorHeaderLegend } from '../../../components/legends/EdgeColorHeaderLegend'
import { EdgeOpacityHeaderLegend } from '../../../components/legends/EdgeOpacityHeaderLegend'
import { EdgeSizeHeaderLegend } from '../../../components/legends/EdgeSizeHeaderLegend'
import { NodeColorHeaderLegend } from '../../../components/legends/NodeColorHeaderLegend'
import { NodeOpacityHeaderLegend } from '../../../components/legends/NodeOpacityHeaderLegend'
import { NodeSizeHeaderLegend } from '../../../components/legends/NodeSizeHeaderLegend'
import { ToggleHeader } from '../../../controls/ToggleHeader'
import { ColumnEditorPanel } from './PanelComponents/ColumnEditorPanel'
import { EdgeColorControlsPanel } from './PanelComponents/EdgeColorControlsPanel'
import { EdgeOpacityControlsPanel } from './PanelComponents/EdgeOpacityControlsPanel'
import { EdgeSizeControlsPanel } from './PanelComponents/EdgeSizeControlsPanel'
import { Layout } from './PanelComponents/Layout'
import { NodeColorControlsPanel } from './PanelComponents/NodeColorControlsPanel'
import { NodeDetailsPanel } from './PanelComponents/NodeDetailsPanel'
import { NodeHoverHeader } from './PanelComponents/NodeHoverHeader'
import { NodeOpacityControlsPanel } from './PanelComponents/NodeOpacityControlsPanel'
import { NodeSizeControlsPanel } from './PanelComponents/NodeSizeControlsPanel'
import { SearchPanel } from './PanelComponents/SearchPanel'
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex-js-toolkit/themed-components'
import { format } from 'd3-format'
import { useCallback } from 'react'
import styled from 'styled-components'
import { useEdgeCount, useNodeCount } from '~/arquero'
import { QuickDrop } from '~/components/QuickDrop'
import {
	useEdgesVisible,
	useNodesVisible,
	useSetEdgesVisible,
	useSetNodesVisible,
} from '~/state'

export const GUTTER = 10

export interface RightSidePanelProps {
	style?: React.CSSProperties
}

export const RightSidePanel: React.FC<RightSidePanelProps> = ({ style }) => {
	const renderNodeHoverHeader = useCallback(() => <NodeHoverHeader />, [])
	const renderNodeColorHeader = useCallback(() => <NodeColorHeaderLegend />, [])
	const renderNodeOpacityHeader = useCallback(
		() => <NodeOpacityHeaderLegend />,
		[],
	)
	const renderNodeSizeHeader = useCallback(() => <NodeSizeHeaderLegend />, [])
	const renderEdgeColorHeader = useCallback(() => <EdgeColorHeaderLegend />, [])
	const renderEdgeOpacityHeader = useCallback(
		() => <EdgeOpacityHeaderLegend />,
		[],
	)
	const renderEdgeSizeHeader = useCallback(() => <EdgeSizeHeaderLegend />, [])

	return (
		<Container style={style}>
			<DisplayRelative>
				<SearchPanel />
				<NodesHeader />
				<CollapsiblePanelContainer>
					<CollapsiblePanel
						title={'Hovered node'}
						onRenderHeader={renderNodeHoverHeader}
					>
						<NodeDetailsPanel />
					</CollapsiblePanel>
					<CollapsiblePanel
						title={'Node color'}
						onRenderHeader={renderNodeColorHeader}
					>
						<NodeColorControlsPanel />
					</CollapsiblePanel>
					<CollapsiblePanel
						title={'Node opacity'}
						onRenderHeader={renderNodeOpacityHeader}
					>
						<NodeOpacityControlsPanel />
					</CollapsiblePanel>
					<CollapsiblePanel
						title={'Node size'}
						onRenderHeader={renderNodeSizeHeader}
					>
						<NodeSizeControlsPanel />
					</CollapsiblePanel>
					<EdgesHeader />
					<CollapsiblePanel
						title={'Edge color'}
						onRenderHeader={renderEdgeColorHeader}
					>
						<EdgeColorControlsPanel />
					</CollapsiblePanel>
					<CollapsiblePanel
						title={'Edge opacity'}
						onRenderHeader={renderEdgeOpacityHeader}
					>
						<EdgeOpacityControlsPanel />
					</CollapsiblePanel>
					<CollapsiblePanel
						title={'Edge size'}
						onRenderHeader={renderEdgeSizeHeader}
					>
						<EdgeSizeControlsPanel />
					</CollapsiblePanel>
					<CollapsiblePanel title={'Data editor'}>
						<ColumnEditorPanel />
					</CollapsiblePanel>
					<CollapsiblePanel title={'Layout'}>
						<Layout />
					</CollapsiblePanel>
					<CollapsiblePanel title={'Quick drop'} defaultExpanded={true}>
						<QuickDrop dropWidthSize={40} dropHeightSize={20} compact />
					</CollapsiblePanel>
				</CollapsiblePanelContainer>
			</DisplayRelative>
		</Container>
	)
}

const Container = styled.div`
	z-index: 10;
`
const DisplayRelative = styled.div`
	position: relative;
`
const pretty = format(',')

const NodesHeader = () => {
	const count = useNodeCount()
	const checked = useNodesVisible()
	const handleChecked = useSetNodesVisible()
	return (
		<ToggleHeader
			title={'Nodes'}
			subtitle={`${pretty(count)} node${count !== 1 ? 's' : ''}`}
			onChange={handleChecked}
			checked={checked}
			disabled={count === 0}
		/>
	)
}

const EdgesHeader = () => {
	const count = useEdgeCount()
	const checked = useEdgesVisible()
	const handleChecked = useSetEdgesVisible()
	return (
		<ToggleHeader
			title={'Edges'}
			subtitle={`${pretty(count)} edge${count !== 1 ? 's' : ''}`}
			onChange={handleChecked}
			checked={checked}
			disabled={count === 0}
		/>
	)
}
