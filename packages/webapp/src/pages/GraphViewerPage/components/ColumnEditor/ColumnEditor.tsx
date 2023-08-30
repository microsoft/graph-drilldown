/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

import { useColumns } from './ColumnEditor.hooks'
import { ColumnEditorRow } from './ColumnEditorRow'

export const ColumnEditor = () => {
	const { columns, doRemoveColumn, onVisibilityChange, getIsVisible } =
		useColumns()

	return (
		<Table>
			<thead>
				<tr>
					<th>column</th>
					<th>data type</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{columns.map((column, index) => {
					const browserVisible = getIsVisible(column)
					return (
						<ColumnEditorRow
							key={`column-editor-${column.name}`}
							column={column}
							onDeleteRequested={doRemoveColumn}
							browserVisible={browserVisible}
							onVisibilityChange={onVisibilityChange}
							index={index}
						/>
					)
				})}
			</tbody>
		</Table>
	)
}

const Table = styled.table`
	font-size: 12px;
	width: 100%;
	text-align: left;
	align-content: center;
`
