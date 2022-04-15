/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'
import { DataFile } from '~/types'

export function useRowHandling(onClick) {
	const onRowClick = useCallback(
		(file: DataFile) => onClick && onClick(file),
		[onClick],
	)
	const [hovered, setHovered] = useState<DataFile | undefined>()
	const onRowHover = useCallback((file?) => setHovered(file), [setHovered])
	return {
		hovered,
		onRowHover,
		onRowClick,
	}
}
