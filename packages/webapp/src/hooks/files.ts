/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	initializeEdgeTable,
	initializeNodeTable,
	joinDataTables,
	joinNodeCommunityTables,
} from '@graph-drilldown/arquero'
import type { DataFile } from '@graph-drilldown/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import {
	useAddFile,
	useBigTable,
	useEdgeTable,
	useFilesList,
	useResetBigTable,
	useResetEdgeTable,
	useResetFiles,
	useResetNavigationState,
	useResetSelectedCommunity,
	useSelectedFile,
	useSetBigTable,
	useSetEdgeTable,
} from '~/state'

/**
 * Manage the list of files and tables in the app.
 * Provides a function to clear everything as well.
 */
export function useFileManagement(): {
	files: DataFile[]

	doAddFile: (file: DataFile) => void
	doClearAll: () => void
	selectedFile: DataFile | undefined
	onFileSelected: (file: DataFile | undefined) => void
	hasData: boolean
} {
	const bigTable = useBigTable()
	const edgeTable = useEdgeTable()
	const addTable = useAddTable()
	const resetTables = useClearAllTables()

	const files = useFilesList()
	const addFile = useAddFile()
	const resetFiles = useResetFiles()
	const [selectedFile, setSelectedFile] = useSelectedFile()

	const onFileSelected = useCallback(
		(file: DataFile | undefined) => setSelectedFile(file),
		[setSelectedFile],
	)

	const doAddFile = useCallback(
		(dataFile: DataFile) => {
			if (dataFile.table != null && dataFile.tableType != null) {
				addFile(dataFile)
				addTable(dataFile.table, dataFile.tableType)
			}
		},
		[addTable, addFile],
	)

	const doClearAll = useCallback(() => {
		resetTables()
		resetFiles()
		setSelectedFile(undefined)
	}, [resetTables, resetFiles, setSelectedFile])

	return {
		files,
		doAddFile,
		doClearAll,
		selectedFile,
		onFileSelected,
		hasData:
			bigTable.numRows() > 0 || edgeTable.numRows() > 0 || files.length > 0,
	}
}

function useClearAllTables() {
	const resetBigTable = useResetBigTable()
	const resetEdgeTable = useResetEdgeTable()
	const resetNav = useResetNavigationState()
	const resetSelectedCommunity = useResetSelectedCommunity()
	return useCallback(() => {
		resetBigTable()
		resetEdgeTable()
		resetNav()
		resetSelectedCommunity()
	}, [resetBigTable, resetEdgeTable, resetNav, resetSelectedCommunity])
}

function useAddTable() {
	const bigTable = useBigTable()
	const setBigTable = useSetBigTable()
	const setEdgeTable = useSetEdgeTable()
	return useCallback(
		(newTable: ColumnTable, type: string) => {
			console.log('adding table/columns', type)
			newTable.print()
			let updated = bigTable
			if (type === 'edge') {
				if (bigTable.numRows() === 0) {
					updated = initializeNodeTable(newTable, true)
				}
				const edges = initializeEdgeTable(newTable)
				setEdgeTable(edges)
			} else {
				if (bigTable.numCols() > 0) {
					if (type === 'join') {
						updated = joinNodeCommunityTables(bigTable, newTable)
					} else {
						updated = joinDataTables(bigTable, newTable, type)
					}
				} else {
					// it's a fresh start
					updated = initializeNodeTable(newTable)
				}
			}
			updated.print()
			setBigTable(updated)
		},
		[bigTable, setBigTable, setEdgeTable],
	)
}
