/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import type { Position, ResizableDelta } from 'react-rnd'

import { COMMANDBAR_HEIGHT } from '~/styles'

import type { IPosition } from './useGraphDimensions'
export enum CSSFilter {
	NONE = 'none',
	GRAYSCALE = 'grayscale(75%)',
}

export enum DIRECTION {
	UP = 'up',
	DOWN = 'down',
}

export interface IResizeHandlersProps {
	height: number
	position: IPosition
	setPosition: (pos: IPosition) => void
	setGraphFilter: (filter: CSSFilter) => void
}

export interface IResizeHandlers {
	handleResizeStop: (
		e: MouseEvent,
		direction: any,
		ref: React.ElementRef<'div'>,
		delta: ResizableDelta,
		pos: Position,
	) => void
	handleButtonClick: (direction: DIRECTION) => void
	handleResizeStart: (
		e: any,
		direction: any,
		ref: React.ElementRef<'div'>,
		delta: ResizableDelta,
		pos: Position,
	) => void
}

export function useResizeHandlers({
	height,
	position,
	setPosition,
	setGraphFilter,
}: IResizeHandlersProps): IResizeHandlers {
	const handleResizeStart = useCallback(
		() => setGraphFilter(CSSFilter.GRAYSCALE),
		[setGraphFilter],
	)

	const handleButtonClick = useCallback(
		(direction: DIRECTION) => {
			if (direction === DIRECTION.DOWN) {
				const y = height - COMMANDBAR_HEIGHT
				setPosition(
					Object.assign({}, { ...position, y, height: COMMANDBAR_HEIGHT }),
				)
			}
			if (direction === DIRECTION.UP) {
				const maxHeight = height * 0.5 // default to 50% of screen
				const y = height - maxHeight
				setPosition(Object.assign({}, { ...position, y, height: maxHeight }))
			}
		},
		[position, height, setPosition],
	)
	const handleResizeStop = useCallback(
		(
			e: MouseEvent,
			direction: any,
			ref: React.ElementRef<'div'>,
			delta: ResizableDelta,
			pos: Position,
		) => {
			if (direction === 'top') {
				let y = position.y - delta.height
				const newHeight = position.height + delta.height
				let h = newHeight
				const maxHeight = height * 0.75
				// min height = COMMANDBAR_HEIGHT
				if (newHeight < COMMANDBAR_HEIGHT) {
					h = COMMANDBAR_HEIGHT
					y = height - COMMANDBAR_HEIGHT
				}
				if (newHeight > maxHeight) {
					h = maxHeight
					y = height - maxHeight
				}
				setPosition({ x: 0, y, height: h })
			}

			setGraphFilter(CSSFilter.NONE)
		},
		[position, height, setPosition, setGraphFilter],
	)

	return { handleResizeStop, handleButtonClick, handleResizeStart }
}
