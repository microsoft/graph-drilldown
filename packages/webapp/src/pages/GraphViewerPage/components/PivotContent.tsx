/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// control style height for pivot items, doesn't seem like option in Pivot Style Props?
import './Pivot.css'

import { Pivot, PivotItem } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { BrowserOptions } from '~/types'

export interface PivotContentProps {
	setSelectedKey: (key: BrowserOptions) => void
	selectedKey: BrowserOptions
}

const getTabId = (itemKey: string) => {
	return `ShapeColorPivot_${itemKey}`
}

// Pivots content between Community Table and Hierarchy Browser
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
					aria-label="Community table and Hierarchy browser pivot"
					selectedKey={selectedKey}
					onLinkClick={handleLinkClick}
					headersOnly={true}
					getTabId={getTabId}
				>
					<PivotItem
						headerText="Hierarchy browser"
						itemKey={BrowserOptions.Browser}
					/>
					<PivotItem
						headerText="Community table"
						itemKey={BrowserOptions.Table}
					/>
				</Pivot>
			</Container>
		)
	},
)

const Container = styled.div``
