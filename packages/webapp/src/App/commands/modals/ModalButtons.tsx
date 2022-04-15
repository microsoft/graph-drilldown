/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Export } from '../../components/Export'
import { Help } from '../../components/Help'
import type { ButtonOptions } from './ModalButton'
import { ModalButton } from './ModalButton'
import { ModalContainer } from './ModalContainer'
import { FileDropPanel } from './panels/FileDropPanel'
import { SettingsContainer } from './panels/SettingsContainer'

const buttonMap: ButtonOptions[] = [
	{
		iconName: 'BulkUpload',
		text: 'Quick import data',
		content: <FileDropPanel />,
	},
	{ iconName: 'PictureLibrary', text: 'Save image', content: <Export /> },
	{ iconName: 'Settings', text: 'Settings', content: <SettingsContainer /> },
	{ iconName: 'Help', text: 'Help', content: <Help /> },
]

export const ModalButtons: React.FC = memo(function ModalButtons() {
	const [isModalOpen, setModalState] = useState<boolean>(false)
	const [selected, setSelected] = useState<string | undefined>(undefined)

	const handleIconClick = useCallback(
		(title: string) => {
			setSelected(title)
			setModalState(!isModalOpen)
		},
		[setModalState, isModalOpen],
	)

	const hideModal = useCallback(() => {
		setSelected(undefined)
		setModalState(false)
	}, [setModalState])

	const selectedButton = useMemo(
		() => buttonMap.find(item => item.text === selected),
		[selected],
	)

	return (
		<Container>
			{buttonMap.map((item, i) => (
				<ModalButton
					key={`modal-button${i}`}
					iconName={item.iconName}
					text={item.text}
					onClick={handleIconClick}
				/>
			))}
			{selectedButton && selected ? (
				<ModalContainer
					titleId={selectedButton.text}
					isModalOpen={isModalOpen}
					title={selectedButton.text}
					hideModal={hideModal}
					content={selectedButton.content}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div``
