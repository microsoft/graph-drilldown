/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FileTable } from '../FileTable/FileTable'
import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'
import { useArqueroBigTable, useArqueroEdgeTable } from '~/arquero'
import { ArqueroTable } from '~/arquero/ArqueroTable'
import { useFileManagement } from '~/hooks/files'

// TODO: this is expected to be a robust file list with selections, etc.
// at the moment it is a copy of the file drop panel used in modals
export const FileList: React.FC = () => {
	const bigTable = useArqueroBigTable()
	const edgeTable = useArqueroEdgeTable()

	const { files, selectedFile, onFileSelected, doClearAll } =
		useFileManagement()

	return (
		<Container>
			<Files>
				<FileTable files={files} onClick={onFileSelected} />
			</Files>
			<Reset>
				{files.length > 0 ||
				bigTable.numRows() > 0 ||
				edgeTable.numRows() > 0 ? (
					<DefaultButton text="Clear all" onClick={doClearAll} />
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
