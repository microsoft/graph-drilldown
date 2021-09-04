/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { useMemo } from 'react'

export function usePlotTheme(
	width: number,
	height: number,
): React.CSSProperties {
	const theme = useThematic()
	return useMemo(
		() => ({
			width,
			height,
			border: `1px solid ${theme.plotArea().stroke().hex()}`,
		}),
		[theme, width, height],
	)
}
