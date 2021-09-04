import { Theme } from '@thematic/core'
import 'styled-components'

declare module 'styled-components' {
	export interface DefaultTheme extends Theme {}
}

declare module 'arquero' {
	interface GroupBySpecification {
		names: string[]
		get: any[]
		rows: number[]
		size: number
		keys: Uint32Array
	}

	interface table {
		// table meta
		numCols: () => number
		numRows: () => number
		totalRows: () => number
		isFiltered: () => boolean
		isGrouped: () => boolean
		isOrdered: () => boolean
		groups: () => GroupBySpecification
		params: (params?: any) => table | any
		// table columns
		columnNames: (filter?: any) => string[]
		// verbs
		// https://uwdata.github.io/arquero/api/verbs
		derive: (values: any) => table
		filter: (criteria: any) => table
		groupby: (keys: any) => table
		ungroup: () => table
		orderby: (keys: any) => table
		unorder: () => table
		rollup: (values: any) => table
		count: (options?: any) => table
		sample: (size: number, options?: any) => table
		select: (...values: any) => table
		reify: (indices?: number[]) => table
		// join verbs
		join: (other: table, on?: any, values?: any, options?: any) => table
		join_left: (other: table, on?: any, values?: any, options?: any) => table
		join_right: (other: table, on?: any, values?: any, options?: any) => table
		lookup: (other: table, on?: any, values?: any) => table
		semijoin: (other: table, on?: any) => table
		concat: (other: table | table[]) => table
		// reshape verbs
		fold: (values: any, options?: any) => table
		pivot: (keys: any, values?: any, options?: any) => table
		unroll: (values: any, options?: any) => table
		// set verbs
		dedupe: (values: any) => table
		// table values
		data: () => any
		get: (name: string, row: number) => any
		getter: (name: string) => any
		indices: (order?: boolean) => Uint32Array
		partitions: (order?: boolean) => Uint32Array[]
		scan: (
			callback: (row: number, data: any, stop: () => void) => void,
			order?: boolean,
		) => void
		// output
		objects(options?: any): any[]
		print(options?: any): void
	}

	function table(): table
	function from(objects: any): table
	function fromCSV(text: string, options?: any): table

	function not(args?: any): any
	function all(args?: any): any
	function desc(args?: any): any

	const op = {
		count: () => any,
		min: (field: string) => any,
		max: (field: string) => any,
		quantile: (field: string, p: number) => any,
		values: (field: string) => any,
		unique: (field: string) => any,
		sum: (value: any) => any,
		any: (field: string) => any,
		has: (obj: any, property: string) => any,
		// window functions
		ntile: (num: number) => any,
		rank: () => any,
		row_number: () => any,
		cume_dist: () => any,
	}
}
