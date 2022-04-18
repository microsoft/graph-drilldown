/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import type { ItemType } from '@graph-drilldown/types'

export function useDrop(
	onFileLoad: (content: string, type: ItemType, name: string) => void,
	type: ItemType,
): (files: any) => void {
	const handleDrop = useCallback(
		(files: any) => {
			files.forEach((file: any) => {
				const name = file.name
				const reader = new FileReader()
				reader.onabort = () => console.log('file reading was aborted')
				reader.onerror = () => console.log('file reading has failed')
				reader.onload = () => {
					const text = reader.result ? reader.result.toString() : ''
					onFileLoad && onFileLoad(text, type, name)
				}
				reader.readAsBinaryString(file)
			})
		},
		[onFileLoad, type],
	)
	return handleDrop
}
