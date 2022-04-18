/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useArqueroColumnList, useArqueroRemoveColumns } from '~/arquero'
import { useBrowserColumns, useNodeColorEncoding } from '~/state'

import type { ColumnDef } from '@graph-drilldown/types'

export const ColumnEditor = () => {
	const columns = useArqueroColumnList()
	const removeColumns = useArqueroRemoveColumns()
	const [browserColumns, setBrowserColumns] = useBrowserColumns()
	const onVisibilityChange = useCallback(
		(updated: ColumnDef, prevState: boolean) => {
			const name = updated.name
			const state = !prevState
			const copy = new Set(browserColumns)
			if (!state) {
				copy.delete(name)
			} else {
				copy.add(name)
			}
			setBrowserColumns(copy)
		},
		[setBrowserColumns, browserColumns],
	)
	const handleDeleteRequested = useCallback(
		(column: ColumnDef) => removeColumns([column.name]),
		[removeColumns],
	)
	const getVisibleState = useCallback(
		(column: ColumnDef) => {
			if (browserColumns.size > 0) {
				return browserColumns.has(column.name)
			}
			return false
		},
		[browserColumns],
	)
	return (
		<Table>
			<thead>
				<tr>
					<th>column</th>
					<th>data type</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{columns.map((column, index) => {
					const browserVisible = getVisibleState(column)
					return (
						<ColumnRow
							key={`column-editor-${column.name}`}
							column={column}
							onDeleteRequested={handleDeleteRequested}
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

interface ColumnRowProps {
	column: ColumnDef
	browserVisible: boolean
	onDeleteRequested?: (column: ColumnDef) => void
	onVisibilityChange?: (column: ColumnDef, state: boolean) => void
	index: number
}
const ColumnRow: React.FC<ColumnRowProps> = ({
	column,
	onDeleteRequested,
	browserVisible,
	onVisibilityChange,
	index,
}) => {
	// TEMP: this is to prevent removal of the current visual column
	// it would be better for the removal to cascade and a new column selected automatically?
	const encoding = useNodeColorEncoding()

	const deletionDisabled = useMemo(
		() => column.readOnly || column.name === encoding.field,
		[column, encoding],
	)

	const handleDeleteClick = useCallback(
		() => !deletionDisabled && onDeleteRequested && onDeleteRequested(column),
		[column, onDeleteRequested, deletionDisabled],
	)
	const handleVisibleClick = useCallback(
		() => onVisibilityChange && onVisibilityChange(column, browserVisible),
		[onVisibilityChange, browserVisible, column],
	)
	const iconName = useMemo(
		() => (browserVisible ? 'RedEye' : 'Hide'),
		[browserVisible],
	)

	const tabIndex = useMemo(
		() => (deletionDisabled ? -1 : index),
		[deletionDisabled, index],
	)

	return (
		<tr>
			<td>{column.name}</td>
			<td>{column.dataType}</td>
			<td>
				<Cell
					onClick={handleDeleteClick}
					onKeyDown={handleDeleteClick}
					tabIndex={tabIndex}
				>
					<IconButton
						title="delete"
						iconProps={{ iconName: 'delete' }}
						disabled={column.readOnly || column.name === encoding.field}
					/>
				</Cell>
			</td>
			{column.name !== 'node.id' ? (
				<td>
					<Cell
						onClick={handleVisibleClick}
						onKeyDown={handleVisibleClick}
						tabIndex={index}
					>
						<IconButton title="toggle view" iconProps={{ iconName }} />
					</Cell>
				</td>
			) : null}
		</tr>
	)
}

const Table = styled.table`
	font-size: 12px;
	width: 100%;
	text-align: left;
	align-content: center;
`

const Cell = styled.div``
