/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { QuickDrop } from '../../../../QuickDrop'
import { FileUploadMessage } from './FileUploadMessage'
import { DefaultButton } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'
import {
	useArqueroBigTable,
	useArqueroEdgeTable,
	useClearAllData,
} from '~/arquero'
import { useClearFiles, useFilesList } from '~/state'

export const FileDropPanel: React.FC = () => {
	const bigTable = useArqueroBigTable()
	const edgeTable = useArqueroEdgeTable()

	const resetTables = useClearAllData()
	const files = useFilesList()
	const resetFiles = useClearFiles()

	const handleResetClick = useCallback(() => {
		resetTables()
		resetFiles()
	}, [resetTables, resetFiles])

	return (
		<Container>
			<QuickDrop />
			<Files>
				<FileUploadMessage files={files} />
			</Files>
			<Reset>
				{files.length > 0 ||
				bigTable.numRows() > 0 ||
				edgeTable.numRows() > 0 ? (
					<DefaultButton text="Clear all" onClick={handleResetClick} />
				) : null}
			</Reset>
		</Container>
	)
}

const Container = styled.div``

const Files = styled.div``

const Reset = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 10px;
`
