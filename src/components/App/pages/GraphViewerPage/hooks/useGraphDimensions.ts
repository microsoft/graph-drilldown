/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDimensions } from '@essex-js-toolkit/hooks'
import { useMemo, useState } from 'react'
import { HEADER_HEIGHT, PANEL_WIDTH } from '~/styles'

const PADDING = 5

export interface IGraphDimensions {
	width: number
	height: number
	rightPanelWidth: number
	leftPanelWidth: number
	browserWidth: number
}

export interface IPosition {
	y: number
	x: number
	height: number
}

export function useGraphDimensions(
	ref: any,
): [IGraphDimensions, IPosition, (pos: IPosition) => void] {
	const [position, setPosition] = useState<IPosition>({
		x: 0,
		y: 0,
		height: HEADER_HEIGHT,
	})
	const dimensions = useDimensions(ref)
	const graphDimensions = useMemo(() => {
		if (dimensions) {
			const { width, height } = dimensions
			// TODO: these can flex, but a strict 20% can be quite large
			// maybe usea % with hard min/max widths
			const leftPanelWidth = PANEL_WIDTH // width * 0.2
			const rightPanelWidth = PANEL_WIDTH // width * 0.2
			const resizeWidth =
				width - PADDING * 2 - (leftPanelWidth + rightPanelWidth)
			const browserWidth = width - leftPanelWidth - PADDING * 2
			const dims = {
				width: resizeWidth,
				height: height,
				leftPanelWidth,
				rightPanelWidth,
				browserWidth,
			}
			setPosition({
				x: 0,
				y: height - HEADER_HEIGHT,
				height: HEADER_HEIGHT,
			})
			return dims
		}
		return {
			width: 1200,
			height: 1200,
			rightPanelWidth: 0,
			leftPanelWidth: 0,
			browserWidth: 1200,
		}
	}, [dimensions, setPosition])
	return [graphDimensions, position, setPosition]
}
