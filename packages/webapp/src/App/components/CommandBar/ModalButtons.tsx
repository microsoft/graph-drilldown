/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ModalContainer } from './modals/ModalContainer'
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

/**
 * This is a list of buttons for the CommandBar that each open a modal pane.
 */
export const ModalButtons: React.FC = memo(function ModalButtons() {
	const [isModalOpen, setModalState] = useState<boolean>(false)
	const [selected, setSelected] = useState<string | undefined>(undefined)

	const handleIconClick = useCallback(
		(key: string) => {
			setSelected(key)
			setModalState(!isModalOpen)
		},
		[setModalState, isModalOpen],
	)

	const hideModal = useCallback(() => {
		setSelected(undefined)
		setModalState(false)
	}, [setModalState])

	const selectedButton = useMemo(
		() => buttonMap.find(item => item.key === selected),
		[selected],
	)

	return (
		<Container>
			{buttonMap.map((item, i) => (
				<IconButton
					key={`modal-button_${item.key}`}
					iconProps={{
						iconName: item.iconName,
					}}
					title={item.title}
					onClick={() => handleIconClick(item.key)}
				/>
			))}
			{selectedButton && selected ? (
				<ModalContainer
					isModalOpen={isModalOpen}
					title={selectedButton.title}
					hideModal={hideModal}
					modalType={selectedButton.type}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div``
