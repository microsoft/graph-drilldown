/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnEditor } from '../../../../../ColumnEditor'
import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'
import { useArqueroBigTable, useArqueroEdgeTable } from '~/arquero'
import { useFileManagement } from '~/hooks/files'

export const ColumnEditorPanel = () => {
	const bigTable = useArqueroBigTable()
	const edgeTable = useArqueroEdgeTable()

	const { doClearAll } = useFileManagement()

	return (
		<Content>
			<ColumnEditor />
			<Reset>
				{bigTable.numRows() > 0 || edgeTable.numRows() > 0 ? (
					<DefaultButton text="Clear all" onClick={doClearAll} />
				) : null}
			</Reset>
		</Content>
	)
}

const Content = styled.div`
	margin: 20px;
	margin-bottom: 10px;
	text-align: center;
	justify-content: center;
`

const Reset = styled.div`
	margin-top: 10px;
`
