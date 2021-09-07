/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnEditor } from '../../../../../ColumnEditor'
import { DefaultButton } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'
import {
	useArqueroBigTable,
	useArqueroEdgeTable,
	useClearAllData,
} from '~/arquero'
import { useClearFiles } from '~/state'

export const ColumnEditorPanel = () => {
	const bigTable = useArqueroBigTable()
	const edgeTable = useArqueroEdgeTable()
	const resetTables = useClearAllData()
	const resetFiles = useClearFiles()

	const handleResetClick = useCallback(() => {
		resetTables()
		resetFiles()
	}, [resetTables, resetFiles])

	return (
		<Content>
			<ColumnEditor />
			<Reset>
				{bigTable.numRows() > 0 || edgeTable.numRows() > 0 ? (
					<DefaultButton text="Clear all" onClick={handleResetClick} />
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
