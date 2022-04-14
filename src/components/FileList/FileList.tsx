/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FileTable } from '../FileTable/FileTable'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
} from '@data-wrangling-components/react'
import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'
import { useArqueroBigTable, useArqueroEdgeTable } from '~/arquero'
import { useFileManagement } from '~/hooks/files'

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
					<ArqueroTableHeader
						name={selectedFile.name}
						table={selectedFile.table}
					/>
					<ArqueroDetailsList
						table={selectedFile.table}
						isHeadersFixed
						features={{
							smartHeaders: true,
						}}
					/>
				</Viewer>
			) : null}
		</Container>
	)
}

const Container = styled.div``

const Files = styled.div``

const Viewer = styled.div`
	margin: 20px;
	height: 600px;
`

const Reset = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	margin: 20px;
`
