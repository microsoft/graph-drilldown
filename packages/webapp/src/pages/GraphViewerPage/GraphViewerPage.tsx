/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, Suspense, useMemo, useRef, useState } from 'react'
import type { RndResizeStartCallback } from 'react-rnd'
import styled from 'styled-components'

import { GraphPanel } from './components/GraphPanel'
import { LeftSidePanel } from './components/LeftSidePanel'
import { ResizableBrowser } from './components/ResizableBrowser'
import { RightSidePanel } from './components/RightSidePanel'
import { StyledSpinnner } from './components/StyledSpinner'
import {
	CSSFilter,
	useGraphDimensions,
	useLayoutStyle,
	useResizeHandlers,
} from './GraphViewerPage.hooks'

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
			<Suspense fallback={<Placeholder />}>
				<LeftSidePanel
					style={leftSidePanelStyle}
					height={height}
					width={leftPanelWidth}
				/>
			</Suspense>
			<Suspense fallback={<Placeholder />}>
				<RightSidePanel style={rightSidePanelStyle} />
			</Suspense>
			<GraphContainer style={graphContainerStyle}>
				<Suspense fallback={<StyledSpinnner />}>
					<GraphPanelContainer style={graphStyle}>
						<GraphPanel width={width} height={graphHeight} />
					</GraphPanelContainer>
				</Suspense>
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
