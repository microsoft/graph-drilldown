/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { parseDSVTable } from '../../api'
import { FileDrop } from '../../controls/FileDrop'
import { variants } from '../../styles'
import { FileOrigin, ItemType } from '../../types'
import { DefaultButton, Text } from '@fluentui/react'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import {
	useArqueroAddTable,
	useArqueroBigTable,
	useArqueroEdgeTable,
	useClearAllData,
} from '~/arquero'
import { useAddFile, useClearFiles } from '~/state'

const SQUARE = 80

export interface QuickDropProps {
	dropWidthSize?: number
	dropHeightSize?: number
	compact?: boolean
}

/**
 * This component presents a quick-drop area for users to load data into the app
 * and have it automatically processed according to its type.
 * @param param0
 */
export const QuickDrop: React.FC<QuickDropProps> = ({
	dropWidthSize = SQUARE,
	dropHeightSize = SQUARE,
	compact = false,
}) => {
	const bigTable = useArqueroBigTable()
	const edgeTable = useArqueroEdgeTable()
	const addTable = useArqueroAddTable()
	const addFile = useAddFile()
	const resetTables = useClearAllData()
	const resetFiles = useClearFiles()

	const handleFileLoad = useCallback(
		(content: string, type: ItemType, fileName: string) => {
			const table = parseDSVTable(fileName, content)
			addTable(table, type)
			addFile({
				origin: FileOrigin.Local,
				url: fileName,
				tableType: type,
				table,
				rows: table.numRows(),
			})
		},
		[addTable, addFile],
	)

	const handleResetClick = useCallback(() => {
		resetTables()
		resetFiles()
	}, [resetTables, resetFiles])

	return (
		<Container>
			<DropArea>
				<FileDrop
					onFileLoad={handleFileLoad}
					type={'node'}
					width={dropWidthSize}
					height={dropHeightSize}
					compact={compact}
				/>
				<FileDrop
					onFileLoad={handleFileLoad}
					type={'edge'}
					width={dropWidthSize}
					height={dropHeightSize}
					compact={compact}
				/>
				<FileDrop
					onFileLoad={handleFileLoad}
					type={'join'}
					width={dropWidthSize}
					height={dropHeightSize}
					compact={compact}
				/>
				<FileDrop
					onFileLoad={handleFileLoad}
					type={'community'}
					width={dropWidthSize}
					height={dropHeightSize}
					compact={compact}
				/>
			</DropArea>
			{!compact ? (
				<HelperText>
					<Text variant={variants.medium}>
						Files must have a <b>header row</b>, an <b>id</b> column, and use{' '}
						<b>csv</b> or <b>tsv</b> format
					</Text>
				</HelperText>
			) : null}
			<Reset>
				{(bigTable.numRows() > 0 || edgeTable.numRows() > 0) && compact ? (
					<DefaultButton text="Clear all" onClick={handleResetClick} />
				) : null}
			</Reset>
		</Container>
	)
}

const Container = styled.div`
	margin: 10px;
	margin-bottom: 10px;
`
const HelperText = styled.div`
	margin-top: 8px;
	text-align: center;
`

const DropArea = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
`

const Reset = styled.div`
	margin-top: 10px;
	display: flex;
	justify-content: center;
`
