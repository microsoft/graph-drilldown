/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import { useSelection } from '~/hooks/useSelection'

export function useRowHandling() {
	const {
		onSelectCommunity,
		hoveredCommunity,
		onHoverCommunity,
		onResetSelection,
	} = useSelection()

	const onHover = useCallback(
		(community) => onHoverCommunity(community?.id),
		[onHoverCommunity],
	)

	const onClick = useCallback(
		(community) => {
			onResetSelection()
			onSelectCommunity(community?.id)
		},
		[onSelectCommunity, onResetSelection],
	)

	return {
		hoveredCommunity,
		onHover,
		onClick,
	}
}
