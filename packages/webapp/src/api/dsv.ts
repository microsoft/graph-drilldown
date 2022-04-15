/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { extension } from './util'

const identity = (d: any) => d

const fns = {
	id: identity,
	ID: identity,
	nodeId: identity,
	cid: identity,
	clusterId: identity,
	community: identity,
	communityId: identity,
	pid: identity,
	parentCluster: identity,
	parent: identity,
	parentId: identity,
	source: identity,
	target: identity,
}

export async function fetchDSVTable(url: string): Promise<ColumnTable> {
	return fetch(url)
		.then(res => res.text())
		.then(content => parseDSVTable(url, content))
}

export function parseDSVTable(filename: string, content: string): ColumnTable {
	const ext = extension(filename)
	const table = fromCSV(content, {
		header: true,
		// handle a bunch of standard id fields as strings
		parse: fns,
		delimiter: ext === 'csv' ? ',' : '\t',
	})
	return table
}
