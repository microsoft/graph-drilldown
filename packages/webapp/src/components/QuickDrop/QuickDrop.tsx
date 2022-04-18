/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Text } from '@fluentui/react'
import type { ItemType } from '@graph-drilldown/types'
import { FileOrigin } from '@graph-drilldown/types'
import { useCallback } from 'react'
import styled from 'styled-components'

import { useArqueroAddTable } from '~/arquero'
import { useFileManagement } from '~/hooks/files'

import { parseDSVTable } from '../../api'
import { variants } from '../../styles'
import { FileDrop } from '../FileDrop'

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
	const doAddTable = useArqueroAddTable()
	const { doAddFile, doClearAll, hasData } = useFileManagement()

	const handleFileLoad = useCallback(
		(content: string, type: ItemType, fileName: string) => {
			const table = parseDSVTable(fileName, content)
			doAddTable(table, type)
			doAddFile({
				origin: FileOrigin.Local,
				url: fileName,
				tableType: type,
				table,
				rows: table.numRows(),
				cols: table.numCols(),
			})
		},
		[doAddTable, doAddFile],
	)

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
				{hasData && compact ? (
					<DefaultButton text="Clear all" onClick={doClearAll} />
				) : null}
			</Reset>
		</Container>
	)
}

const Container = styled.div`
	margin: 10px;
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
