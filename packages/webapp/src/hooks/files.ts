/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFile } from '@graph-drilldown/types'
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
	const resetTables = useClearAllTables()

	const files = useFilesList()
	const doAddFile = useAddFile()
	const resetFiles = useResetFiles()
	const [selectedFile, setSelectedFile] = useSelectedFile()

	const onFileSelected = useCallback(
		(file: DataFile | undefined) => setSelectedFile(file),
		[setSelectedFile],
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
