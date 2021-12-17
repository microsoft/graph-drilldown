/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFile } from '../../types'
import { FileUploadMessage } from '../App/commands/modals/panels/FileUploadMessage'
import { DefaultButton } from '@fluentui/react'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import {
	useArqueroBigTable,
	useArqueroEdgeTable,
	useClearAllData,
} from '~/arquero'
import { ArqueroTable } from '~/arquero/ArqueroTable'
import { useClearFiles, useFilesList } from '~/state'

// TODO: this is expected to be a robust file list with selections, etc.
// at the moment it is a copy of the file drop panel used in modals
export const FileList: React.FC = () => {
	const bigTable = useArqueroBigTable()
	const edgeTable = useArqueroEdgeTable()

	const resetTables = useClearAllData()
	const files = useFilesList()
	const resetFiles = useClearFiles()

	const [selectedFile, setSelectedFile] = useState<DataFile>()
	const handleFileClick = useCallback(file => setSelectedFile(file), [])
	const handleResetClick = useCallback(() => {
		resetTables()
		resetFiles()
	}, [resetTables, resetFiles])

	return (
		<Container>
			<Files>
				<FileUploadMessage files={files} onClick={handleFileClick} />
			</Files>
			<Reset>
				{files.length > 0 ||
				bigTable.numRows() > 0 ||
				edgeTable.numRows() > 0 ? (
					<DefaultButton text="Clear all" onClick={handleResetClick} />
				) : null}
			</Reset>
			{selectedFile && selectedFile.table ? (
				<Viewer>
					<h3>{selectedFile.url}</h3>
					<ArqueroTable table={selectedFile?.table} options={{ limit: 10 }} />
				</Viewer>
			) : null}
		</Container>
	)
}

const Container = styled.div``

const Files = styled.div``

const Viewer = styled.div`
	margin: 20px;
`

const Reset = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	margin: 20px;
`
