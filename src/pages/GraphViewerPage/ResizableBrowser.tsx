/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CommunityLineup } from '../../components/CommunityLineup'
import { HierarchyBrowserPanel } from '../../components/HierarchyBrowserPanel'
import { PivotContent } from '../../components/App/PivotContent'
import { IPosition } from './GraphViewerPage.hooks'
import { DIRECTION } from './hooks/useResizeHandlers'
import { IconButton } from '@fluentui/react'
import { memo, useMemo, useCallback, useState } from 'react'
import { Rnd, RndResizeStartCallback } from 'react-rnd'
import styled from 'styled-components'
import { HEADER_HEIGHT } from '~/styles'
import { BrowserOptions } from '~/types'

export type Enable = {
	bottom?: boolean
	bottomLeft?: boolean
	bottomRight?: boolean
	left?: boolean
	right?: boolean
	top?: boolean
	topLeft?: boolean
	topRight?: boolean
}

const enabledState = {
	bottom: false,
	bottomLeft: false,
	bottomRight: false,
	left: false,
	right: false,
	top: true,
	topLeft: false,
	topRight: false,
}

export interface GraphPanelProps {
	width: number
	handleResizeStop: (
		e: any,
		direction: any,
		ref: any,
		delta: any,
		position: any,
	) => any
	handleResizeStart: RndResizeStartCallback
	handleButtonClick: (dir: DIRECTION) => void
	position: IPosition
}
const HEIGHT_MIN = 100
export const ResizableBrowser: React.FC<GraphPanelProps> = memo(
	function ResizableBrowser({
		width,
		position,
		handleResizeStop,
		handleResizeStart,
		handleButtonClick,
	}) {
		const isDefaultOpen = useMemo(
			() => position.height > HEIGHT_MIN,
			[position],
		)

		const [panelContent, setPanelContent] = useState<BrowserOptions>(
			BrowserOptions.Lineup,
		)

		const iconName = useMemo(
			() => (isDefaultOpen ? 'DoubleChevronDown12' : 'DoubleChevronUp12'),
			[isDefaultOpen],
		)

		const handleClick = useCallback(() => {
			const direction = isDefaultOpen ? DIRECTION.DOWN : DIRECTION.UP
			handleButtonClick(direction)
		}, [handleButtonClick, isDefaultOpen])

		const tableHeight = useMemo(
			() => position.height - HEADER_HEIGHT,
			[position],
		)

		const content = useMemo(() => {
			if (panelContent === BrowserOptions.Browser) {
				return <HierarchyBrowserPanel />
			}
			return <CommunityLineup width={width} height={tableHeight} />
		}, [panelContent, width, tableHeight])

		return (
			<StyledRnd
				size={{ width, height: position.height }}
				position={{ x: 0, y: position.y }}
				bounds="parent"
				onResizeStop={handleResizeStop}
				disableDragging={true}
				enableResizing={enabledState}
				onResizeStart={handleResizeStart}
			>
				<BottomContainer isDefaultOpen={isDefaultOpen}>
					<Header>
						<IconButton
							iconProps={{
								iconName,
							}}
							text="Resize Viewer"
							title="Resize Viewer"
							onClick={handleClick}
						/>
						<PivotContent
							selectedKey={panelContent}
							setSelectedKey={setPanelContent}
						/>
					</Header>
					<PanelContainer isDefaultOpen={isDefaultOpen}>
						{content}
					</PanelContainer>
				</BottomContainer>
			</StyledRnd>
		)
	},
)

const Header = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

const BottomContainer = styled.div<{ isDefaultOpen?: boolean }>`
	width: 100%;
	height: 100%;
	background: ${({ theme }) => theme.application().background().hex()};
	border: 1px solid ${({ theme }) => theme.application().border().hex()};
	text-align: center;
	overflow-x: hidden;
	overflow-y: ${({ isDefaultOpen }) => (isDefaultOpen ? 'auto' : 'hidden')};
`

const PanelContainer = styled.div<{ isDefaultOpen?: boolean }>`
	visibility: ${({ isDefaultOpen }) => (isDefaultOpen ? 'visible' : 'hidden')};
`

const StyledRnd = styled(Rnd)`
	position: absolute;
	width: 100%;
	height: 100%;
`
