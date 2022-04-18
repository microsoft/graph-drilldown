/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { FileTable } from '@graph-drilldown/components'
import styled from 'styled-components'

import { useArqueroBigTable, useArqueroEdgeTable } from '~/arquero'
import { useFileManagement } from '~/hooks/files'

import { QuickDrop } from '../../../../components/QuickDrop'

export const FileDropPanel: React.FC = () => {
	const bigTable = useArqueroBigTable()
	const edgeTable = useArqueroEdgeTable()

	const { files, doClearAll } = useFileManagement()

	return (
		<Container>
			<QuickDrop />
			<Files>
				<FileTable files={files} />
			</Files>
			<Reset>
				{files.length > 0 ||
				bigTable.numRows() > 0 ||
				edgeTable.numRows() > 0 ? (
					<DefaultButton text="Clear all" onClick={doClearAll} />
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
