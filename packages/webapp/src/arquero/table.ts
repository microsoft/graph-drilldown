/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { all, not, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { ROOT_COMMUNITY_ID } from '../constants'
import type { ColumnDef } from '@graph-drilldown/types'

/**
 * Extracts the objects from a single-row table.
 * This is commonly needed when doing rollups that output
 * a single row of stats.
 * @param table
 */
// TODO: this is pretty basic, but the intent would be to provide optional
// transformers per column or as a whole
export function one(table: ColumnTable): { [key: string]: any } {
	return table.objects()[0]
}

/**
 * Return a selection mapping that renames columns with a prefix.
 * @param table table to enumerate and rename columns
 * @param prefix prefix to add to column names
 * @param exclude exclusion list if you want to retain some original columns
 */
export function rename(table: ColumnTable, prefix: string, exclude?: string[]) {
	const ex = new Set(exclude)
	return table.columnNames().reduce((obj: any, name: string) => {
		if (ex.has(name) || name.startsWith(prefix)) {
			obj[name] = name
		} else {
			obj[name] = `${prefix}${name}`
		}
		return obj
	}, {})
}

export function hasColumn(table: ColumnTable, column: string) {
	return table.columnNames().some(name => name === column)
}

export function columnTypes(table: ColumnTable) {
	if (table.numRows() === 0) {
		return []
	}
	return table.columnNames().map(name => ({
		name,
		type: typeof table.get(name, 0),
	}))
}

export function recomputeCommunityStats(table: ColumnTable, force?: boolean) {
	const selected = force
		? table.select(not(['community.nodeCount', 'community.childCount']))
		: table
	const mergedChildCount = checkAndAddChildCount(selected)
	const mergedNodeCount = checkAndAddNodeCount(mergedChildCount)
	return mergedNodeCount
}

/**
 * Check to ensure a table contains an expected column.
 * If not, cycle through valid alternates and rename as
 * the expected column. If still no success, use a fallback
 * function to define the column.
 * @param table
 * @param name
 * @param variants
 * @param fallback
 */
function ensureColumn(
	table: ColumnTable,
	name: string,
	variants: string[],
	fallback: (table: ColumnTable) => ColumnTable,
) {
	if (hasColumn(table, name)) {
		return table
	}
	let fixed
	variants.some(variant => {
		if (hasColumn(table, variant)) {
			fixed = table.select(all(), {
				[variant]: name,
			})
			return true
		}
		return false
	})
	return fixed || fallback(table)
}

/**
 * Check the columns to make sure we have a node.id,
 * falling back on other common options.
 * In the worst case, we select the first column.
 * @param table
 */
function ensureNodeId(table: ColumnTable) {
	return ensureColumn(table, 'node.id', ['id', 'ID', 'nodeId'], table => {
		// just pick the first - this is risky, but sometimes we don't have a header at all
		const column = table.columnNames()[0]
		return table.select(all(), {
			[column]: 'node.id',
		})
	})
}

/**
 * Check the colunns to make sure we have a community id ('cid').
 * This is required at a basic level for all node tables, so if one isn't
 * present we just default to '0' as an id
 * @param table
 */
function ensureCommunityId(table: ColumnTable) {
	return ensureColumn(
		table,
		'community.id',
		['node.community', 'cid', 'community', 'clusterId'],
		table => {
			return table.derive({
				'community.id': () => '0',
			})
		},
	)
}

function ensureParentCommunityId(table: ColumnTable) {
	return ensureColumn(
		table,
		'community.pid',
		['pid', 'parentCluster', 'parent'],
		table => {
			return table
				.params({
					pid: ROOT_COMMUNITY_ID,
				})
				.derive({
					'community.pid': (_, $: any) => $.pid,
				})
		},
	)
}

// TEMP: make sure there are no empties, which some csvs have
// use our -1 default.
// TODO: use empty as default instead of -1, which need broader refactor
function fixPid(table: ColumnTable) {
	return table
		.params({
			pid: ROOT_COMMUNITY_ID,
		})
		.derive({
			'community.pid': (d: any, $: any) => d['community.pid'] || $.pid,
		})
}

function ensureX(table: ColumnTable) {
	return ensureColumn(table, 'node.x', ['x', 'X'], table => {
		return table.derive({
			'node.x': () => Math.random(),
		})
	})
}

function ensureY(table: ColumnTable) {
	return ensureColumn(table, 'node.y', ['y', 'Y'], table => {
		return table.derive({
			'node.y': () => Math.random(),
		})
	})
}

function ensureD(table: ColumnTable) {
	return ensureColumn(table, 'node.d', ['d', 'D', 'size', 'weight'], table => {
		return table.derive({
			'node.d': () => 1,
		})
	})
}

function ensureNodeLabel(table: ColumnTable) {
	return ensureColumn(table, 'node.label', ['label', 'name'], table => {
		return table.derive({
			'node.label': (d: any) => d['node.id'],
		})
	})
}

function ensureEdgeSource(table: ColumnTable) {
	return ensureColumn(table, 'edge.source', ['source', 'src'], table => {
		return table.derive({
			'edge.source': () => '0',
		})
	})
}

function ensureEdgeTarget(table: ColumnTable) {
	return ensureColumn(table, 'edge.target', ['target', 'tgt'], table => {
		return table.derive({
			'edge.target': () => '1',
		})
	})
}

function ensureEdgeWeight(table: ColumnTable) {
	return ensureColumn(table, 'edge.weight', ['weight', 'value'], table => {
		return table.derive({
			'edge.weight': () => 1,
		})
	})
}

function ensureEdgeId(table: ColumnTable) {
	return ensureColumn(table, 'edge.id', ['id', 'edgeId'], table => {
		return table.derive({
			'edge.id': (d: any) => `${d['edge.source']}-${d['edge.target']}`,
		})
	})
}

// normalizes x and y in a single operation because we need to maintain aspect ratio
export function normalizeXY(table: ColumnTable) {
	const bounds = table.rollup({
		xMin: op.min('node.x'),
		xMax: op.max('node.x'),
		yMin: op.min('node.y'),
		yMax: op.max('node.y'),
	})
	const xRange = bounds.get('xMax', 0) + Math.abs(bounds.get('xMin', 0))
	const yRange = bounds.get('yMax', 0) + Math.abs(bounds.get('yMin', 0))
	const aspect = xRange / yRange
	return table
		.params({
			xMin: Math.abs(bounds.get('xMin', 0)),
			xRange,
			yMin: Math.abs(bounds.get('yMin', 0)),
			yRange,
			aspect,
		})
		.derive({
			'node.x': (d: any, $: any) =>
				((d['node.x'] + $.xMin) / $.xRange) * $.aspect,
			'node.y': (d: any, $: any) => (d['node.y'] + $.yMin) / $.yRange,
		})
}

function normalizeD(table: ColumnTable) {
	// for the node size, the range should always be positive
	// we usually specify a minimum of 5 in the files - we do
	// not want those going to 0 once normalized, so here we
	// just norm by the max
	const bounds = table.rollup({
		max: op.max('node.d'),
	})
	return table
		.params({
			max: bounds.get('max', 0),
		})
		.derive({
			'node.d': (d: any, $: any) => d['node.d'] / $.max,
		})
}

const prefixes = {
	node: true,
	community: true,
	edge: true,
}
// our current "data model" expects every column to have a type prefix
// used for filtering views, etc.
// this will find any unprefixed columns and add the specified one to them
function prefixRemaining(table: ColumnTable, prefix: string) {
	const columns = table.columnNames(name => {
		const pref = name.split('.')[0]
		return !prefixes[pref]
	})
	const spec = columns.reduce((acc, col) => {
		acc[col] = `${prefix}.${col}`
		return acc
	}, {})
	return table.select(all(), spec)
}

/**
 * Apply a list of functions to a table in series, returning the final output.
 * Helper because Arquero does not have something akin to d3's `call`.
 * @param table
 * @param functions
 */
export function chain(
	table: ColumnTable,
	functions: ((table: ColumnTable) => ColumnTable)[],
) {
	return functions.reduce((acc, cur) => cur(acc), table)
}

/**
 * Take a starter node table and ensure it has all the required columns (or default values)
 * @param table
 * @param type
 */
export function initializeNodeTable(table: ColumnTable, fromEdges = false) {
	const starter = fromEdges
		? table
				.fold(['source', 'target'])
				.dedupe('value')
				.ungroup()
				.select({ value: 'id' })
		: table

	return chain(starter, [
		ensureNodeId,
		ensureNodeLabel,
		ensureCommunityId,
		ensureParentCommunityId,
		ensureX,
		ensureY,
		ensureD,
		normalizeXY,
		normalizeD,
		table => prefixRemaining(table, 'node'),
		checkAndAddChildCount,
		checkAndAddNodeCount,
	])
}

export function initializeJoinTable(table: ColumnTable) {
	return chain(table, [ensureNodeId, ensureCommunityId])
}

export function initializeEdgeTable(table: ColumnTable) {
	return chain(table, [
		ensureEdgeSource,
		ensureEdgeTarget,
		ensureEdgeId,
		ensureEdgeWeight,
		table => prefixRemaining(table, 'edge'),
	])
}

export function initializeCommunityTable(table: ColumnTable) {
	return chain(table, [
		ensureCommunityId,
		table => prefixRemaining(table, 'community'),
	])
}

export function joinNodeCommunityTables(
	nodes: ColumnTable,
	communities: ColumnTable,
) {
	const leftKey = 'node.id'
	const rightKey = 'node.id'

	// ensure the community table (right)
	const safe = chain(communities, [
		ensureNodeId,
		ensureCommunityId,
		ensureParentCommunityId,
		fixPid,
		table => prefixRemaining(table, 'community'),
	])

	const joined = joinWithReplace(nodes, safe, [leftKey, rightKey])
	// if the communities join doesn't have precomputes, run them now
	const rollup = recomputeCommunityStats(
		joined,
		!hasColumn(communities, 'community.childCount') ||
			!hasColumn(communities, 'community.nodeCount'),
	)
	return rollup
}

/**
 * Simple join that replaces any columns in the left with matching columns in the right.
 * Normal arquero behavior is the rename collisions, but we have so much dependence on
 * expected columns that this causes problems.
 * It's especially frequent because the join keys are renamed,
 * so this lets us join and exclude the key
 * @param left
 * @param right
 * @param leftKey
 * @param rightKey
 */
export function joinWithReplace(
	left: ColumnTable,
	right: ColumnTable,
	joinDefinition: any,
) {
	return left.join(right, joinDefinition, [not(right.columnNames()), all()])
}

/**
 * Join a new table to existing, using strict rules of id and prefix.
 * I.e., this is not a general-purpose join util, but rather one that
 * simplifies our joins by assuming an id column and a prefix for output columns.
 * @param left
 * @param right
 * @param type
 * @param leftKey optional explicit left key, otherwise it will use `${type}.id`
 * @param rightKey optional explicit right key, otherwise it will use 'id'
 */
export function joinDataTables(
	left: ColumnTable,
	right: ColumnTable,
	type: string,
	leftKey?: string,
	rightKey = 'id',
) {
	const joinKey = leftKey || `${type}.id`
	// for any new columns, we'll add the object type prefix (i.e., node or community),
	// and preserve the required 'id' column. note that node and community ids are stored as
	// strings in csv, so we need to override potential autotyping performed by arquero
	// TODO: this disallows joining of existing columns,
	// because that results in unpredictable column names
	// we could allow overwrite OR make sure the new columns have an intentional new suffix so the existing ones
	// do not receive a new suffix

	// avoid existing columns so they don't collide
	// unless we're doing that on purpose!
	const exclude = new Set(left.columnNames())
	const filter = (name: string) => !exclude.has(name)
	// TODO: flexibility ideas: we require an ID column now, but this could also (a) just use the first column,
	// and (b) auto-generate an incremental id if none appears present
	const toMerge = right
		// rename all new columns with their prefix except the id
		.select((table: ColumnTable) => rename(table, `${type}.`, [rightKey]))
		.select((table: ColumnTable) => table.columnNames(filter))
	return left.join(toMerge, [joinKey, rightKey], [all(), not(rightKey)])
}

/**
 * This checks the main table for community.childCount column and computes if missing
 * @param main current fully-populated table with joined communities
 * @param communities flat community list to rollup childCount
 */
export function checkAndAddChildCount(main: ColumnTable) {
	if (hasColumn(main, 'community.childCount')) {
		return main
	}

	// TODO: is there a faster way to compute this without involving a secondary table?
	const childCount = main
		.dedupe('community.id')
		.groupby('community.pid')
		.count({ as: 'community.childCount' })

	return main
		.join_left(
			childCount,
			['community.id', 'community.pid'],
			[all(), not('community.pid')],
		)
		.derive({
			// join will leave empty cells where there is no match
			// TODO: can join op be enhanced to provide a fallback fill?
			'community.childCount': (d: any) => d['community.childCount'] || 0,
		})
}

/**
 * This checks the main table for a community.nodeCount column and computes if missing
 * @param main current fully-populated table with joined communities
 */
export function checkAndAddNodeCount(main: ColumnTable) {
	if (hasColumn(main, 'community.nodeCount')) {
		return main
	}
	return main
		.groupby('community.id')
		.derive({
			'community.nodeCount': op.count(),
		})
		.ungroup()
}

/**
 * Create a set of ColumnDefs by enumerating the table.
 * Optional set of column names indicating they are read-only (i.e., not deletable in UI)
 * @param table
 * @param readOnlyNames
 */
export function listColumnDefs(
	table: ColumnTable,
	readOnlyNames?: Set<string>,
): ColumnDef[] {
	if (table.numRows() === 0) {
		return []
	}
	return table.columnNames().map(name => ({
		name,
		type: name.split('.')[0] as 'node' | 'community',
		dataType: typeof table.get(name, 0),
		readOnly: readOnlyNames && readOnlyNames.has(name),
	}))
}

export function listColumnNames(table: ColumnTable): string[] {
	const defs = listColumnDefs(table)
	return defs.map(d => d.name)
}

export function findGroupIndices(
	table: ColumnTable,
	field: string,
	value: any,
) {
	if (table.numRows() > 0) {
		const groups = table.groups()
		const index = groups.rows.findIndex(
			(rowIndex: number) => table.get(field, rowIndex) === value,
		)
		return table.partitions()[index]
	}
}
