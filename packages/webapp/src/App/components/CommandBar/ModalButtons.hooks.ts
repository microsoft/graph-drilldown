/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'

import type { ButtonOptions } from './modals/ModalContainer.types'
import { ModalPageType } from './modals/ModalContainer.types'

const buttonMap: ButtonOptions[] = [
	{
		key: 'upload',
		iconName: 'BulkUpload',
		title: 'Quick import data',
		type: ModalPageType.Upload,
	},
	{
		key: 'export',
		iconName: 'PictureLibrary',
		title: 'Save image',
		type: ModalPageType.Export,
	},
	{
		key: 'settings',
		iconName: 'Settings',
		title: 'Settings',
		type: ModalPageType.Settings,
	},
	{ key: 'help', iconName: 'Help', title: 'Help', type: ModalPageType.Help },
]

export function useButtonConfig() {
	return buttonMap
}

export function useModal() {
	const [selected, setSelected] = useState<ButtonOptions | undefined>(undefined)

	const onButtonClick = useCallback(
		(button: ButtonOptions) => {
			setSelected(button)
		},
		[setSelected],
	)

	const onDismiss = useCallback(() => setSelected(undefined), [setSelected])

	return {
		selected,
		onButtonClick,
		onDismiss,
	}
}
