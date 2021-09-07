/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { HEADER_HEIGHT } from '~/styles'
interface ILayoutStyle {
	leftSidePanelStyle: React.CSSProperties
	rightSidePanelStyle: React.CSSProperties
	graphContainerStyle: React.CSSProperties
	graphStyle: React.CSSProperties
}
export function useLayoutStyle(
	leftPanelWidth,
	rightPanelWidth,
	height,
	graphHeight,
	graphFilter,
): ILayoutStyle {
	const leftSidePanelStyle = useMemo(
		(): React.CSSProperties => ({
			height,
			width: leftPanelWidth,
			position: 'absolute',
			left: '0px',
			top: HEADER_HEIGHT,
		}),
		[leftPanelWidth, height],
	)

	// adjustable size panel
	const rightSidePanelStyle = useMemo(
		(): React.CSSProperties => ({
			height: graphHeight,
			maxHeight: graphHeight,
			width: rightPanelWidth,
			position: 'absolute',
			right: '0px',
			top: '0px',
			overflow: 'auto',
		}),
		[rightPanelWidth, graphHeight],
	)
	const graphContainerStyle: React.CSSProperties = useMemo(
		() => ({
			position: 'absolute',
			left: leftPanelWidth + 6,
			top: 0,
			border: '1px solid transparent',
		}),
		[leftPanelWidth],
	)

	const graphStyle: React.CSSProperties = useMemo(
		() => ({
			height: graphHeight,
			filter: graphFilter,
		}),
		[graphHeight, graphFilter],
	)

	return {
		graphContainerStyle,
		graphStyle,
		rightSidePanelStyle,
		leftSidePanelStyle,
	}
}
