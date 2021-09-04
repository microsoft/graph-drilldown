/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { DataFile } from '~/types'

export interface FilesLoaded {
	files: DataFile[]
	onClick?: (file: DataFile) => void
}

export const FileUploadMessage: React.FC<FilesLoaded> = memo(
	function FileUploadMessage({ files, onClick }) {
		const handleClick = useCallback(
			(file: DataFile) => {
				onClick && onClick(file)
			},
			[onClick],
		)
		return (
			<Container>
				<Separator />
				<Table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Source</th>
							<th>Type</th>
							<th>Rows</th>
						</tr>
					</thead>
					<tbody>
						{files.length > 0 ? (
							files.map(file => {
								return (
									<tr
										key={`loaded-file-${file.url}`}
										onClick={() => handleClick(file)}
										style={{
											cursor: onClick ? 'pointer' : 'default',
										}}
									>
										<Td>{file.url}</Td>
										<Td>{file.origin}</Td>
										<Td>{file.tableType || 'unknown'}</Td>
										<Td>{file.rows}</Td>
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
	},
)

const Container = styled.div`
	margin: 10px;
	margin-bottom: 10px;
`

const Table = styled.table`
	width: 100%;
`
const Td = styled.td`
	margin: 4px;
`
