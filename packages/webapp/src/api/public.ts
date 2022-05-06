/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { fetchDSVTable } from './dsv'
import { extension } from './util'

/**
 * Fetch a file visible to the application in csv or tsv format,
 * such as from the public folder or any other no-auth url
 * @param url
 */
export async function fetchUrl(url: string): Promise<ColumnTable> {
	const ext = extension(url)
	switch (ext) {
		case 'csv':
		case 'tsv':
			return fetchDSVTable(url)
		default:
			throw new Error(`Unsupported file type: ` + ext)
	}
}
