/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { memo, useCallback } from 'react'
export interface ModalButtonProp extends ButtonOptions {
	onClick: (title: string) => void
}
export interface ButtonOptions {
	iconName: string
	text: string
	content?: any
}
export const ModalButton = memo(function ModalButton({
	iconName,
	text,
	onClick,
}: ModalButtonProp) {
	const handleIconClick = useCallback(
		(props: any) => onClick(text),
		[onClick, text],
	)
	return (
		<>
			<IconButton
				iconProps={{ iconName }}
				title={text}
				onClick={handleIconClick}
			/>
		</>
	)
})
