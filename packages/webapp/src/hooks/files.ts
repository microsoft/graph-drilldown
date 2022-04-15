/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import { useClearAllTables } from '~/arquero'
import {
	useAddFile,
	useClearFiles,
	useFilesList,
	useSelectedFile,
} from '~/state'
import type { DataFile } from '~/types'

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
} {
	const resetTables = useClearAllTables()

	const files = useFilesList()
	const doAddFile = useAddFile()
	const resetFiles = useClearFiles()
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
	}
}
