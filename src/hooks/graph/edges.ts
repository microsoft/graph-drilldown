/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useColorizer, useRange, useWeighter } from './graspologic'
import { EdgeColorizer, EdgeWeighter } from '@graspologic/graph'
import { useMemo } from 'react'
import { useArqueroVisibleEdges } from '~/arquero'
import {
	useEdgeColorEncoding,
	useEdgeOpacityEncoding,
	useEdgeSizeEncoding,
} from '~/state'

function useVisibleEdgeMap() {
	const edges = useArqueroVisibleEdges()
	return useMemo(() => edges.toMap(), [edges])
}

/**
 * Combines the color and opacity scales to derive a single brga int
 * @param colorEncoding
 * @param opacityEncoding
 */
export function useEdgeColorizer(): EdgeColorizer {
	const colorEncoding = useEdgeColorEncoding()
	const opacityEncoding = useEdgeOpacityEncoding()
	const map = useVisibleEdgeMap()
	return useColorizer(colorEncoding, opacityEncoding, map) as EdgeColorizer
}

export function useEdgeWeighter(): EdgeWeighter {
	const encoding = useEdgeSizeEncoding()
	const map = useVisibleEdgeMap()
	return useWeighter(encoding, map) as EdgeWeighter
}

/**
 * Weights are bound to a min/max width rather than
 * completely scale-driven like color.
 * This toggles between the fixed min/max and scaled.
 */
export function useEdgeSizeRange(): [number, number] {
	const encoding = useEdgeSizeEncoding()
	return useRange(encoding)
}
