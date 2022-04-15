/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IButtonStyles,
	IModalStyleProps,
	IModalStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

import { HEADER_HEIGHT } from '~/styles'

export function useHeaderStyle() {
	const theme = useThematic()
	return useMemo(
		() => ({
			width: '100%',
			height: HEADER_HEIGHT,
			alignItems: 'center',
			color: theme.application().highContrast().hex(),
			background: theme.application().faint().hex(),
			borderBottom: `1px solid ${theme.application().lowContrast().hex()}`,
		}),
		[theme],
	)
}

export function useIconButtonStyles(): IButtonStyles {
	const theme = useThematic()
	return useMemo(
		() => ({
			root: {
				color: theme.application().highContrast().hex(),
				marginLeft: 'auto',
				marginTop: '4px',
				marginRight: '2px',
			},
			rootHovered: {
				color: theme.application().accent().hex(),
			},
		}),
		[theme],
	)
}

export function useModalStyles(): IStyleFunctionOrObject<
	IModalStyleProps,
	IModalStyles
> {
	const theme = useThematic()
	return useMemo(
		() => ({ main: { background: theme.application().faint().hex() } }),
		[theme],
	)
}
