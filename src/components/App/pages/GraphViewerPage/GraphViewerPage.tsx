/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphPanel } from './GraphPanel'
import { ResizableBrowser } from './ResizableBrowser'
import { LeftSidePanel, RightSidePanel } from './SidePanel'
import { StyledSpinnner } from './StyledSpinner'
import {
	CSSFilter,
	useGraphDimensions,
	useLayoutStyle,
	useResizeHandlers,
} from './hooks'
import React, { useRef, useMemo, useState, memo } from 'react'
import { RndResizeStartCallback } from 'react-rnd'
import styled from 'styled-components'

export const GraphViewerPage: React.FC = memo(function GraphViewerPage() {
	const ref = useRef(null)
	const [graphDimensions, position, setPosition] = useGraphDimensions(ref)
	const { width, height, leftPanelWidth, rightPanelWidth, browserWidth } =
		graphDimensions

	const [graphFilter, setGraphFilter] = useState<CSSFilter>(CSSFilter.NONE)

	const { handleResizeStart, handleButtonClick, handleResizeStop } =
		useResizeHandlers({ height, position, setPosition, setGraphFilter })

	const graphHeight = useMemo(
		() => height - position.height,
		[height, position],
	)
	const {
		graphContainerStyle,
		graphStyle,
		rightSidePanelStyle,
		leftSidePanelStyle,
	} = useLayoutStyle(
		leftPanelWidth,
		rightPanelWidth,
		height,
		graphHeight,
		graphFilter,
	)

	return (
		<Container ref={ref}>
			<React.Suspense fallback={<Placeholder />}>
				<LeftSidePanel
					style={leftSidePanelStyle}
					height={height}
					width={leftPanelWidth}
				/>
			</React.Suspense>
			<React.Suspense fallback={<Placeholder />}>
				<RightSidePanel style={rightSidePanelStyle} />
			</React.Suspense>
			<GraphContainer style={graphContainerStyle}>
				<React.Suspense fallback={<StyledSpinnner />}>
					<GraphPanelContainer style={graphStyle}>
						<GraphPanel width={width} height={graphHeight} />
					</GraphPanelContainer>
				</React.Suspense>
				<ResizableBrowser
					width={browserWidth}
					handleResizeStop={handleResizeStop}
					handleResizeStart={handleResizeStart as RndResizeStartCallback}
					handleButtonClick={handleButtonClick}
					position={position}
				/>
			</GraphContainer>
		</Container>
	)
})

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	background: ${({ theme }) => theme.plotArea().fill().hex()};
	overflow: hidden;
`

const GraphContainer = styled.div``

const GraphPanelContainer = styled.div``

const Placeholder = styled.div``
