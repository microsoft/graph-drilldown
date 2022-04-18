/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { memo } from 'react'
import styled from 'styled-components'

import type { DataFile } from '@graph-drilldown/types'

import { useRowHandling } from './FileTable.hooks'

export interface FileTableProps {
	files: DataFile[]
	selected?: DataFile
	onClick?: (file: DataFile) => void
}

/**
 * Displays a list of table files with some basic metadata and a click handler.
 */
export const FileTable: React.FC<FileTableProps> = memo(function FileTable({
	files,
	selected,
	onClick,
}) {
	const theme = useThematic()
	const { hovered, onRowHover, onRowClick } = useRowHandling(onClick)
	return (
		<Container>
			<Table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Source</th>
						<th>Type</th>
						<th>Rows</th>
						<th>Cols</th>
					</tr>
				</thead>
				<tbody>
					{files.length > 0 ? (
						files.map(file => {
							const background =
								selected === file
									? theme.application().accent().hex()
									: hovered === file
									? theme.application().faint().hex()
									: 'none'
							return (
								<tr
									key={`loaded-file-${file.url}`}
									onClick={() => onRowClick(file)}
									onMouseEnter={() => onRowHover(file)}
									onMouseLeave={() => onRowHover(undefined)}
									style={{
										cursor: onClick ? 'pointer' : 'default',
										background,
									}}
								>
									<Td>{file.url}</Td>
									<Td>{file.origin}</Td>
									<Td>{file.tableType || 'unknown'}</Td>
									<Td>
										<Num>{file.rows}</Num>
									</Td>
									<Td>
										<Num>{file.cols}</Num>
									</Td>
								</tr>
							)
						})
					) : (
						<tr>
							<td>none loaded</td>
						</tr>
					)}
				</tbody>
			</Table>
		</Container>
	)
})

const Container = styled.div``

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	border: 1px solid ${({ theme }) => theme.application().border().hex()};
`
const Td = styled.td`
	margin: 4px;
	padding: 4px;
	border: 1px solid ${({ theme }) => theme.application().border().hex()};
`

const Num = styled.div`
	width: 100%;
	text-align: right;
`
