/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnStats } from '../types'
import { TableCollection } from './TableCollection'
import { one } from './table'
import { histogram, Histogram } from '@essex-js-toolkit/toolbox'
// eslint-disable-next-line
import { op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { precisionFixed } from 'd3-format'

export function getColumnStats(table: ColumnTable, name?: string): ColumnStats {
	if (!table || table.numRows() === 0 || table.numCols() === 0 || !name) {
		return {
			dataType: '',
			precision: 0,
			unique: [],
			domain: [0, 1],
			domain95: [0, 1],
			domain99: [0, 1],
		}
	}

	const type = typeof table.get(name, 0)

	const stats = one(
		table.rollup({
			min: op.min(name),
			max: op.max(name),
			q01: op.quantile(name, 0.01),
			q05: op.quantile(name, 0.05),
			q95: op.quantile(name, 0.95),
			q99: op.quantile(name, 0.99),
			unique: op.array_agg_distinct(name),
		}),
	)

	const ret: ColumnStats = {
		dataType: type,
		precision: getPrecision([stats.min, stats.max], stats.uniques),
		unique: stats.unique,
		domain: [stats.min, stats.max],
		domain95: [stats.q05, stats.q95],
		domain99: [stats.q01, stats.q99],
	}

	return ret
}

// compute a suggested precision based on 100 divisions of the data range
export function getPrecision(domain = [0, 1], values?: number[]): number {
	const spread = domain[1] - domain[0]
	const whole = checkWhole(values)
	return whole ? 0 : precisionFixed(spread / 100)
}

function checkWhole(numbers?: number[]): boolean {
	if (!numbers) {
		return false
	}
	return numbers.every(n => Number.isInteger(n))
}

export function getColumnHistogram(
	table: ColumnTable,
	name?: string,
): Histogram {
	if (!table || table.numRows() === 0 || !name) {
		return []
	}

	const type = name.split('.')[0]
	const collection = new TableCollection(table, type)

	// TODO: use the binTableColumn function, but this does not produce the same type of bins as the histogram utility
	const histo = histogram(collection.toArray(), 100, (d: any) => d.get(name))

	return histo
}

/**
 * This function takes an arquero table and bins the values of a specified column
 * into a fixed set of quantiles from 0-1.0.
 * // TODO: use op.ntile??
 * @param table
 * @param column
 */
export function binTableColumn(table: ColumnTable, column: string): any[] {
	const quantileOps = new Array(100).fill(1).reduce((acc, cur, idx) => {
		acc[idx] = op.quantile(column, idx / 100)
		return acc
	}, {} as any)

	const domain = one(
		table.rollup({
			min: op.min(column),
			max: op.max(column),
		}),
	)

	const binned = table.rollup({
		...quantileOps,
	})

	// craft a set of d3-style bins to push data into
	const bins = Object.values(binned.objects()[0]).map((v, i, a) => {
		const arr = [] as any
		arr.x0 = v
		if (i === a.length - 1) {
			arr.x1 = domain.max
		} else {
			arr.x1 = a[i + 1]
		}
		return arr
	})

	// fill the bins
	table.scan((idx: number | undefined) => {
		const value = table.get(column, idx)
		const binIndex = bins.findIndex(bin => value >= bin.x0 && value < bin.x1)
		// bin maxes are exclusive except for the last bin
		// https://github.com/d3/d3-array/blob/v2.8.0/README.md#_bin
		const bin = binIndex < 0 ? bins.length - 1 : binIndex
		bins[bin].push(value)
	})
	return bins
}
