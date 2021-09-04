/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Color } from '@thematic/color'
import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { useMemo, useCallback } from 'react'

export function useBarFillScale(): () => Color {
	const theme = useThematic()
	return useCallback(
		() => theme.rect({ selectionState: SelectionState.Selected }).fill(),
		[theme],
	)
}

export function useBarTextForegroundColor(): string {
	const theme = useThematic()
	return useMemo(() => theme.text().fill().hex(), [theme])
}

export function useHoveredColor(): string {
	const theme = useThematic()
	return useMemo(() => theme.application().error().hex(), [theme])
}
