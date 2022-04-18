/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList } from '@data-wrangling-components/react'
import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'

import { useArqueroBigTable, useArqueroEdgeTable } from '~/arquero'
import { useFileManagement } from '~/hooks/files'

import { FileTable } from '@graph-drilldown/components'

export const FileList: React.FC = () => {
	const bigTable = useArqueroBigTable()
	const edgeTable = useArqueroEdgeTable()

	const { files, selectedFile, onFileSelected, doClearAll } =
		useFileManagement()

	return (
		<Container>
			<Files>
				<FileTable
					files={files}
					selected={selectedFile}
					onClick={onFileSelected}
				/>
				<Reset>
					{files.length > 0 ||
					bigTable.numRows() > 0 ||
					edgeTable.numRows() > 0 ? (
						<DefaultButton text="Clear all" onClick={doClearAll} />
					) : null}
				</Reset>
			</Files>

			{selectedFile && selectedFile.table ? (
				<Viewer>
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

const Files = styled.div`
	display: flex;
	flex-direction column;
	gap: 10px;
	margin-bottom: 10px;
`

const Viewer = styled.div`
	height: 600px;
	border: 1px solid ${({ theme }) => theme.application().border().hex()};
`

const Reset = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
`
