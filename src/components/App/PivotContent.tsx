/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BrowserOptions } from '../../types'
import { Pivot, PivotItem } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
// control style height for pivot items, doesn't seem like option in Pivot Style Props?
import './Pivot.css'

export interface PivotContentProps {
	setSelectedKey: (key: BrowserOptions) => void
	selectedKey: BrowserOptions
}

const getTabId = (itemKey: string) => {
	return `ShapeColorPivot_${itemKey}`
}

// Pivots content between Community Lineup Table and Hierarchy Browser
export const PivotContent: React.FC<PivotContentProps> = memo(
	function PivotContent({ setSelectedKey, selectedKey }) {
		const handleLinkClick = useCallback(
			(item?: PivotItem | undefined) => {
				if (item && item.props.itemKey) {
					setSelectedKey(item.props.itemKey as BrowserOptions)
				}
			},
			[setSelectedKey],
		)
		return (
			<Container>
				<Pivot
					aria-label="Community Lineup and Hierarchy Browser Pivot"
					selectedKey={selectedKey}
					onLinkClick={handleLinkClick}
					headersOnly={true}
					getTabId={getTabId}
				>
					<PivotItem
						headerText="Hierarchy Browser"
						itemKey={BrowserOptions.Browser}
					/>
					<PivotItem
						headerText="Community Lineup"
						itemKey={BrowserOptions.Lineup}
					/>
				</Pivot>
			</Container>
		)
	},
)

const Container = styled.div``
