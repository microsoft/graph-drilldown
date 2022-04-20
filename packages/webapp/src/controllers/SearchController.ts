/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CommunityCollection,
	listColumnNames,
	NodeCollection,
} from '@graph-drilldown/arquero'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export class SearchController {
	public searching = false
	public canSearch = false
	public error
	public nodeResults
	public communityResults
	private _params
	constructor(options: {
		nodes: any
		communities: any
		onStart?: any
		onFinish?: any
	}) {
		this._params = options
		this.canSearch = options.nodes.size > 0 || options.communities.size > 0
	}
	private _start() {
		this.searching = true
		this.error = undefined
		this.nodeResults = undefined
		this.communityResults = undefined
		this._params.onStart && this._params.onStart(this)
	}
	private _finish(nodes, comms, err) {
		this.searching = false
		this.error = err
		this.nodeResults = nodes
		this.communityResults = comms
		this._params.onFinish && this._params.onFinish(this)
	}
	search(match) {
		console.log('searching', match)
		const { nodes, communities } = this._params
		this._start()
		// debounce with timeout so render loop can update
		setTimeout(() => {
			const columns = listColumnNames(nodes)
			const [communityResults, nodeResults, error] = getMatchingValuesByRow(
				nodes,
				communities,
				columns,
				match,
			)
			this._finish(nodeResults, communityResults, error)
		}, 10)
	}
}

const getColumnByRow = (table, col, row, searchValue): [string, boolean] => {
	const stringValue = table.get(col, row)
	let isInSearch = false
	if (stringValue.indexOf(searchValue) > -1) {
		isInSearch = true
	}
	return [stringValue, isInSearch]
}

interface SearchByIndex {
	index: number
	matchColumns: string[]
	'community.id': string
	'node.id'?: string
	[col: string]: unknown
}

const getMatchingValuesByRow = (
	nodes: ColumnTable,
	communities: ColumnTable,
	columns: string[],
	searchValue: string,
): [CommunityCollection, NodeCollection, string | undefined] => {
	console.time('match')
	const matches: SearchByIndex[] = []
	nodes.scan(row => {
		const o = columns.reduce(
			(acc, col) => {
				const [value, isInSearch] = getColumnByRow(nodes, col, row, searchValue)
				if (isInSearch) {
					acc.isInSearch = true
					acc.matchColumns.push(col)
				}
				acc[col] = value
				acc.index = row
				return acc
			},
			{ isInSearch: false, matchColumns: [] } as any,
		)

		if (o.isInSearch) {
			matches.push(o)
		}
	})
	// currently only handling match on node.id or community.id
	const seen = new Set<string>([])
	const [nodeids, nodeCommIds, communityIds] = matches.reduce(
		(acc, d) => {
			if (d.matchColumns.includes('node.id')) {
				const nodeid = d['node.id']!
				if (!seen.has(nodeid)) {
					acc[1].push(d['community.id'])
					seen.add(nodeid)
				}
			}
			if (d.matchColumns.includes('community.id')) {
				acc[2].push(d['community.id'])
			}

			return acc
		},
		[seen, [], []] as [Set<string>, string[], string[]],
	)
	const communityResults = communities
		.params({ match: communityIds })
		.filter((d: any, $: any) => op.includes($.match, d['community.id'], 0))
		.ungroup()

	const nodeResults = nodes
		.params({ match: Array.from(nodeids), commIds: nodeCommIds })
		.filter(
			(d: any, $: any) =>
				op.includes($.match, d['node.id'], 0) &&
				op.includes($.commIds, d['community.id'], 0),
		)
		.ungroup()
	const ccTable = new CommunityCollection(communityResults)
	const nodeTable = new NodeCollection(nodeResults)
	const message =
		ccTable.size === 0 && nodeTable.size === 0
			? `No results found for "${searchValue}"`
			: undefined
	console.timeEnd('match')

	return [ccTable, nodeTable, message]
}
