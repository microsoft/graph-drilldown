/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import {
	useHoveredCommunity,
	useSelectedCommunity,
	useSetHoveredCommunity,
	useSetSelectedCommunity,
} from '~/state'

export function useRowHandling() {
	const hovered = useHoveredCommunity()
	const setHoveredCommunity = useSetHoveredCommunity()
	const onHover = useCallback(
		community => setHoveredCommunity(community?.id),
		[setHoveredCommunity],
	)

	const selected = useSelectedCommunity()
	const setSelectedCommunity = useSetSelectedCommunity()

	const onClick = useCallback(
		community => {
			setSelectedCommunity(community?.id)
			setHoveredCommunity(undefined)
		},
		[setSelectedCommunity, setHoveredCommunity],
	)

	return {
		hovered,
		onHover,
		selected,
		onClick,
	}
}
