/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFile } from '@graph-drilldown/types'
import { useCallback, useState } from 'react'

export function useRowHandling(onClick) {
	const onRowClick = useCallback((file: DataFile) => onClick?.(file), [onClick])
	const [hovered, setHovered] = useState<DataFile | undefined>()
	const onRowHover = useCallback((file?) => setHovered(file), [setHovered])
	return {
		hovered,
		onRowHover,
		onRowClick,
	}
}
