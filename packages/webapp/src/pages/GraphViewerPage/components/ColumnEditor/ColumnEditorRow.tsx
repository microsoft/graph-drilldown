/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import type { ColumnDefinition } from '@graph-drilldown/types'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useNodeColorEncoding } from '~/state'

export interface ColumnEditorRowProps {
	column: ColumnDefinition
	browserVisible: boolean
	onDeleteRequested?: (column: ColumnDefinition) => void
	onVisibilityChange?: (column: ColumnDefinition, state: boolean) => void
	index: number
}

export const ColumnEditorRow: React.FC<ColumnEditorRowProps> = ({
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
		() => onVisibilityChange?.(column, browserVisible),
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
						title='delete'
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
						<IconButton title='toggle view' iconProps={{ iconName }} />
					</Cell>
				</td>
			) : null}
		</tr>
	)
}

const Cell = styled.div``
