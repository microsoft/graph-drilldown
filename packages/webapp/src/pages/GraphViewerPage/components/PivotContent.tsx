/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Pivot, PivotItem } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { BrowserOptions } from '~/types'

export interface PivotContentProps {
	setSelectedKey: (key: BrowserOptions) => void
	selectedKey: BrowserOptions
}

const styles = {
	link: {
		height: 24,
		lineHeight: 24,
	},
}

// Pivots content between Community Table and Hierarchy Browser
export const PivotContent: React.FC<PivotContentProps> = memo(
	function PivotContent({ setSelectedKey, selectedKey }) {
		const handleLinkClick = useCallback(
			(item?: PivotItem | undefined) => {
				if (item?.props.itemKey) {
					setSelectedKey(item.props.itemKey as BrowserOptions)
				}
			},
			[setSelectedKey],
		)
		return (
			<Container>
				<Pivot
					aria-label='Community table and Hierarchy browser pivot'
					selectedKey={selectedKey}
					onLinkClick={handleLinkClick}
					headersOnly={true}
					styles={styles}
				>
					<PivotItem
						headerText='Hierarchy browser'
						itemKey={BrowserOptions.Browser}
					/>
					<PivotItem
						headerText='Community table'
						itemKey={BrowserOptions.Table}
					/>
				</Pivot>
			</Container>
		)
	},
)

const Container = styled.div``
