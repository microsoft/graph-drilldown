/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { memo, useCallback } from 'react'

export interface ButtonOptions {
	iconName: string
	text: string
	content?: any
}

export interface ModalButtonProps extends ButtonOptions {
	onClick: (title: string) => void
}

export const ModalButton = memo(function ModalButton({
	iconName,
	text,
	onClick,
}: ModalButtonProps) {
	const handleIconClick = useCallback(() => onClick(text), [onClick, text])
	return (
		<IconButton
			iconProps={{ iconName }}
			title={text}
			onClick={handleIconClick}
		/>
	)
})
