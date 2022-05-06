/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDimensions } from '@essex/hooks'
import { Text } from '@fluentui/react'
import { memo, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { useDataBounds, useStaticInputGraph } from '~/hooks/graph'
import { useSelection } from '~/hooks/useSelection'
import { useSettings } from '~/state'
import { BREAD_CRUMB_STYLES, HEADER_HEIGHT, variants } from '~/styles'

import { Minimap } from './Minimap'
import { BreadcrumbPanel } from './panels/BreadcrumbPanel'
import { CommunityPanel } from './panels/CommunityPanel'

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

		const { selectedNodes, hoveredNodes } = useSelection()
		const dataBounds = useDataBounds()

		const communityHeight = useMemo(() => {
			const breadcrumbContainer = dimensions?.height || 100
			return height - (breadcrumbContainer + miniMapSize + HEADER_HEIGHT)
		}, [height, dimensions, miniMapSize])

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
				{settings.showMiniMap ? (
					<MiniMapContainer>
						<Minimap
							data={data}
							width={width}
							height={miniMapSize}
							minRadius={settings.miniMapNodeRadius}
							maxRadius={settings.miniMapNodeRadius}
							hoveredNodes={hoveredNodes}
							selectedNodes={selectedNodes}
							aoiBounds={dataBounds}
						/>
					</MiniMapContainer>
				) : null}
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
