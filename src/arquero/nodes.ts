// eslint-disable-next-line
import { op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'

export interface ArqueroNode {
	['node.id']: string
	['node.x']: number
	['node.y']: number
}

/**
 * Gets default rolled up node stats within a quantile range.
 * @param table assumed pre-grouped table (e.g., by parent id)
 * @param quantile
 */
export function getNodeStats(table: ColumnTable, quantile = 1) {
	if (!table || table.numRows() === 0 || quantile === 1) {
		return [
			{
				minX: 0,
				maxX: 1,
				minY: 0,
				maxY: 1,
				minD: 0,
				maxD: 1,
			},
		]
	}

	const rollup = table.rollup({
		minX: op.quantile('node.x', 1 - quantile),
		maxX: op.quantile('node.x', quantile),
		minY: op.quantile('node.y', 1 - quantile),
		maxY: op.quantile('node.y', quantile),
		minD: op.quantile('node.d', 1 - quantile),
		maxD: op.quantile('node.d', quantile),
	})
	return rollup.objects()[0]
}
