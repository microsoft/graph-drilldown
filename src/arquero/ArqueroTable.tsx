/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import React, { useMemo } from 'react'

export interface ArqueroTableProps {
	table: table
	/**
	 * Direct pass-through to Arquero table options
	 */
	options?: any
	/**
	 * Style for container div
	 */
	style?: React.CSSProperties
	hideHeaders?: boolean
}

/**
 * Straightforward React wrapper to render an Arquero table.
 * Thinks directly to toHTML method, setting as innerHTML
 */
export const ArqueroTable: React.FC<ArqueroTableProps> = ({
	table,
	options,
	style,
	hideHeaders = false,
}) => {
	const html = useMemo(() => {
		const opts: any = { ...options }
		if (hideHeaders) {
			opts.style = {
				...opts.style,
				thead: 'display:none;',
			}
		}
		return table.toHTML(opts)
	}, [table, options, hideHeaders])
	return <div style={style} dangerouslySetInnerHTML={{ __html: html }} />
}
