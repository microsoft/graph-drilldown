/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { scaleLinear } from 'd3-scale'
import { useMemo } from 'react'

export function useBarScale(domain: [number, number], range: [number, number]) {
	// slightly modify standard bar scale to account for the case where all are the same size
	// this typically happens when we reach a leaf community with no children
	// if we don't do this mod, the bars fill half the available space, which is weird.
	const r = useMemo(
		() => (domain[0] === domain[1] ? [0, 0] : range),
		[domain, range],
	)
	return useMemo(() => scaleLinear().domain(domain).range(r), [domain, r])
}
