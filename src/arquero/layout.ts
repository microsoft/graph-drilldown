/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PositionMap } from '@graspologic/graph'
import { desc } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'

// TODO: we may want to provide fallback checks for
// position columns, in the case that arbitrary non-layout data was
// loaded by the user

function getters(table: ColumnTable) {
	return {
		id: table.getter('node.id'),
		x: table.getter('node.x'),
		y: table.getter('node.y'),
	}
}
export function deriveLayoutPositions(table: ColumnTable): PositionMap {
	const positions = {} as PositionMap
	if (table.numRows() === 0) {
		return positions
	}
	const { id, x, y } = getters(table)
	table.scan((idx: number | undefined) => {
		positions[id(idx)] = {
			x: x(idx),
			y: y(idx),
		}
	})
	return positions
}

export function deriveSmallMultiplePositions(table: ColumnTable): PositionMap {
	const positions: PositionMap = {}
	if (table.numRows() === 0) {
		return positions
	}
	const { id, x, y } = getters(table)
	const grouped = table.groupby('community.id')
	const partitions = grouped.partitions()
	const layout = grid(partitions.length)

	let cell = 0

	grouped
		.count()
		.orderby(desc('count'))
		.scan((idx: number | undefined) => {
			if (idx === undefined) return
			const indices = partitions[idx]
			indices.forEach((index: number) => {
				positions[id(index)] = layout(cell, x(index), y(index))
			})
			cell++
		}, true)

	return positions
}

/**
 * Grid generator that assigns x/y positions based on the grid cell index.
 * This  figured out how to divide the available space into cells,
 * where each cell has a size allocated (derived from the total and width).
 * It returns a function that computes the x/y position based on the original
 * layout x/y + the grid cell index.
 * I.e., it performs a translation from full-space x/y to cell x/y.
 * @param count number of total grid cells
 * @param width width in pixels of the output grid
 */
function grid(count: number, columnCount = 8) {
	if (count <= 1) {
		return (cell: number, x: number, y: number) => ({
			x,
			y,
		})
	}
	const proportion = 1 / columnCount
	const cols = Math.ceil(1 / proportion)
	const rows = Math.ceil(count / cols)
	return (cell: number, x: number, y: number) => {
		const row = Math.floor(cell / cols)
		const col = cell - row * cols
		const baseX = (1 / cols) * col
		const baseY = (1 / rows) * row
		return {
			x: x * proportion + baseX,
			y: y * proportion + (1 - baseY - 1 / rows),
		}
	}
}
