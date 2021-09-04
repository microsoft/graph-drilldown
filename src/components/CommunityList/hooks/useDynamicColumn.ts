/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BAR_HEIGHT } from '../styles'
import { Mark } from '../types'
import { useMemo, useCallback } from 'react'
import { useDataBoundColorScale } from '~/hooks/graph'
import { ColorEncoding } from '~/types'

export function useDynamicColumn(encoding: ColorEncoding, width: number) {
	const colorScale = useDataBoundColorScale(encoding)
	const circleSizeScale = useCallback(() => BAR_HEIGHT / 2, [])
	return useMemo(() => {
		const parts = encoding?.field?.split('.') || []
		return {
			header: parts[0] === 'node' ? '' : `[${parts[1]}]`,
			field: encoding.field,
			mark: parts[0] === 'node' ? Mark.None : Mark.Circle,
			sizeScale: circleSizeScale,
			fillScale: colorScale,
			width: width,
		}
	}, [colorScale, circleSizeScale, encoding, width])
}
