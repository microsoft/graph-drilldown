/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Minimap } from '../../../../Minimap'
import { BreadcrumbPanel } from './PanelComponents/BreadcrumbPanel'
import { CommunityPanel } from './PanelComponents/CommunityPanel'
import { useDimensions } from '@essex-js-toolkit/hooks'
import { Text } from '@fluentui/react'
import { useMemo, useRef, memo } from 'react'
import styled from 'styled-components'
import { useArqueroHoveredNodes, useArqueroSelectedNodes } from '~/arquero'
import { useDataBounds, useStaticInputGraph } from '~/hooks/graph'
import { useSettings } from '~/state'
import { BREAD_CRUMB_STYLES, HEADER_HEIGHT, variants } from '~/styles'

const textContainerLabel = 15
const headerLabelStyle = {
	margin: 2,
	marginLeft: 4,
	marginBottom: 10,
	maxHeight: textContainerLabel,
	textAlign: 'center',
} as React.CSSProperties

export interface LeftSidePanelProps {
	style?: React.CSSProperties
	height: number
	width: number
}
export const LeftSidePanel: React.FC<LeftSidePanelProps> = memo(
	function LeftSidePanel({ style, height, width }) {
		const ref = useRef(null)
		const dimensions = useDimensions(ref)

		const [settings] = useSettings()
		const miniMapSize = settings.showMiniMap ? width : 0

		const data = useStaticInputGraph()
		const hoveredNodes = useArqueroHoveredNodes()
		const selectedNodes = useArqueroSelectedNodes()
		const dataBounds = useDataBounds()

		const communityHeight = useMemo(() => {
			const breadcrumbContainer = dimensions?.height || 100
			return height - (breadcrumbContainer + miniMapSize + HEADER_HEIGHT)
		}, [height, dimensions, miniMapSize])
		const miniMap = useMemo(() => {
			const padding = 0
			if (settings.showMiniMap) {
				return (
					<MiniMapContainer>
						<Minimap
							data={data}
							width={width - padding}
							height={miniMapSize - padding}
							minRadius={settings.miniMapNodeRadius}
							maxRadius={settings.miniMapNodeRadius}
							hoveredNodes={hoveredNodes}
							selectedNodes={selectedNodes}
							aoiBounds={dataBounds}
						/>
					</MiniMapContainer>
				)
			}
			return null
		}, [
			width,
			settings,
			hoveredNodes,
			dataBounds,
			selectedNodes,
			data,
			miniMapSize,
		])

		const communityStyle = useMemo(
			() => ({ maxHeight: communityHeight }),
			[communityHeight],
		)

		const communityPanelStyle = useMemo(
			() => ({
				overflow: 'auto',
				maxHeight: communityHeight - (textContainerLabel + 50),
			}),
			[communityHeight],
		)
		return (
			<Container style={style}>
				<BreadcrumbContainer ref={ref}>
					<BreadcrumbPanel styles={BREAD_CRUMB_STYLES} />
				</BreadcrumbContainer>
				<CommunityContainer style={communityStyle}>
					<HeaderLabel style={headerLabelStyle}>
						<Text variant={variants.mediumPlus}>
							{' '}
							<b>Communities</b>
						</Text>
					</HeaderLabel>
					<CommunityPanelContainer tabIndex={0} style={communityPanelStyle}>
						<CommunityPanel />
					</CommunityPanelContainer>
				</CommunityContainer>
				{miniMap}
			</Container>
		)
	},
)

// border: ${({ theme }) => `1px solid ${theme.application().faint().hex()}`};
const Container = styled.div``

const BreadcrumbContainer = styled.div``

const CommunityContainer = styled.div``

const HeaderLabel = styled.div``

const CommunityPanelContainer = styled.div``

const MiniMapContainer = styled.div`
	position: absolute;
	bottom: ${HEADER_HEIGHT - 1}px;
`
