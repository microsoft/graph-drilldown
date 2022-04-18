/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
//importing as aqtable because there's already a param named table in this file
import { table as aqtable } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableData } from 'arquero/dist/types/table/table'
import type { Community, Edge, ItemType, Node, TableBackedItem } from '@graph-drilldown/types'

class TableItemFacade implements TableBackedItem {
	private _table: ColumnTable
	private _index: number
	private _id: string
	constructor(table: ColumnTable, index: number, prefix: ItemType) {
		this._table = table
		this._index = index
		this._id = `${prefix}.id`
	}
	get table() {
		return this._table
	}
	get columns() {
		return this._table.columnNames()
	}
	get(col: string) {
		return this._table.column(col)?.get(this._index)
	}
	get id() {
		return this.get(this._id)
	}
}

class NodeFacade extends TableItemFacade implements Node {
	constructor(table: ColumnTable, index: number) {
		super(table, index, 'node')
	}
	get x() {
		return this.get('node.x')
	}
	get y() {
		return this.get('node.y')
	}
	get d() {
		return this.get('node.d')
	}
}

class CommunityFacade extends TableItemFacade implements Community {
	constructor(table: ColumnTable, index: number) {
		super(table, index, 'community')
	}
	get pid() {
		return this.get('community.pid')
	}
	get childCount() {
		return this.get('community.childCount')
	}
	get nodeCount() {
		return this.get('community.nodeCount')
	}
}

class EdgeFacade extends TableItemFacade implements Edge {
	constructor(table: ColumnTable, index: number) {
		super(table, index, 'edge')
	}
	get source() {
		return this.get('edge.source')
	}
	get target() {
		return this.get('edge.target')
	}
	get weight() {
		return this.get('edge.weight')
	}
}

type Callback<T> = (item: T, index: number) => any

export class TableCollection<T> {
	private _table: ColumnTable = aqtable({})
	private _prefix: string
	private _Ctor: any
	private _indices: number[] | undefined
	constructor(
		table: ColumnTable | undefined,
		prefix: string,
		indices?: number[],
	) {
		if (table) {
			this._table = table
		}
		this._prefix = prefix
		switch (prefix) {
			case 'node':
				this._Ctor = NodeFacade
				break
			case 'community':
				this._Ctor = CommunityFacade
				break
			case 'edge':
				this._Ctor = EdgeFacade
				break
			default:
				throw new Error(`Unsupported data type: ${prefix}`)
		}
		if (indices) {
			this._indices = indices
		}
	}
	get table(): ColumnTable {
		return this._table
	}
	get size(): number {
		if (this._indices) {
			return this._indices.length
		}
		return this._table.numRows()
	}
	getter(name: string) {
		return this._table.getter(name)
	}
	sort(definition: any) {
		if (this.size > 0) {
			this._table = this._table.orderby(definition)
		}
		return this
	}
	map(callback: Callback<T>, ordered = false): any[] {
		const output: T[] = []
		this.scan(idx => {
			const n = new this._Ctor(this._table, idx, this._prefix)
			if (idx === undefined) return
			output.push(callback(n, idx))
		}, ordered)
		return output
	}
	forEach(callback: Callback<T>, ordered = false) {
		this.scan((idx: number | undefined) => {
			const n = new this._Ctor(this._table, idx)
			if (idx === undefined) return
			callback(n, idx)
		}, ordered)
	}
	toMap(): Map<string, T> {
		const map = new Map<string, T>()
		this.scan((idx: number | undefined) => {
			const n = new this._Ctor(this._table, idx)
			const id = n.id
			map.set(id, n)
		})
		return map
	}
	toSet(): Set<T> {
		const set = new Set<T>()
		this.scan((idx: number | undefined) => {
			const n = new this._Ctor(this._table, idx)
			set.add(n)
		})
		return set
	}
	toArray(ordered = false): T[] {
		const arr: T[] = []
		this.scan((idx: number | undefined) => {
			arr.push(new this._Ctor(this._table, idx))
		}, ordered)
		return arr
	}
	// TODO: it would be nicer api-wise to integrate the offset/count params into the map method, but we have to pull out the scan
	page(callback: Callback<T>, offset, count): T[] {
		const arr: T[] = []
		const indices = this._indices || []
		for (let i = offset; i < offset + count; i++) {
			const idx = indices[i] || i
			const obj = new this._Ctor(this._table, idx)
			arr.push(callback(obj, idx))
		}
		return arr
	}
	// does a toArray with subsetting based on proportion of total items
	// note that this could use underlying arquero table sampling for actual random,
	// but the perf of that has not been checked, and it needs to account for groups
	sample(proportion: number): T[] {
		const arr: T[] = []
		const ratio = Math.floor(1 / proportion)
		this.scan((idx: number | undefined) => {
			if (idx !== undefined && idx % ratio === 0) {
				arr.push(new this._Ctor(this._table, idx))
			}
		})
		return arr
	}
	/**
	 * Direct passthrough to table scan, but using provided indices if present.
	 * This lets us create collections that are a "view" over the top of a larger
	 * table.
	 * Arquero doesn't support the notion of iterating groups directly, so this provides
	 * that.
	 * @param callback
	 * @param ordered
	 */
	scan(
		callback: (
			row?: number | undefined,
			data?: TableData | any[] | undefined,
			stop?: (() => void) | undefined,
		) => void,
		ordered = false,
	) {
		// note that we assume provided indices are already ordered
		if (this._indices) {
			const data = this._table.data()
			let cont = true
			const stop = () => (cont = false)
			this._indices.every(idx => {
				callback(idx, data, stop)
				return cont
			})
		} else {
			return this._table.scan(callback, ordered)
		}
	}
}

export class CommunityCollection extends TableCollection<Community> {
	constructor(table?: ColumnTable, indices?: number[]) {
		super(table, 'community', indices)
	}
}

export class NodeCollection extends TableCollection<Node> {
	constructor(table?: ColumnTable, indices?: number[]) {
		super(table, 'node', indices)
	}
}

export class EdgeCollection extends TableCollection<Edge> {
	constructor(table?: ColumnTable, indices?: number[]) {
		super(table, 'edge', indices)
	}
}
