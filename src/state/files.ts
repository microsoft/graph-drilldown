/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFile } from '../types'
import { useCallback } from 'react'
import {
	atom,
	useRecoilState,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

const filesState = atom<DataFile[]>({
	key: 'data-files',
	default: [],
	// this is required so that arquero can update indexes under the hood
	dangerouslyAllowMutability: true,
})

export function useFilesList() {
	return useRecoilValue(filesState)
}

export function useAddFile() {
	const [files, setFiles] = useRecoilState(filesState)
	return useCallback(
		(file: DataFile) => {
			setFiles([...files, file])
		},
		[files, setFiles],
	)
}

export function useSetFiles() {
	return useSetRecoilState(filesState)
}

export function useClearFiles() {
	return useResetRecoilState(filesState)
}
