/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useInternedGraph, useInternedMinimapGraph } from '~/state/caches'

export function useInputGraph() {
	return useInternedGraph()
}

// creates an input graph with fixed sizing
// this saves on range compute for the minimap
export function useStaticInputGraph() {
	return useInternedMinimapGraph()
}
