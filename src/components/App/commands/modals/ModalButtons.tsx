/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Export } from '../../../Export'
import { Help } from '../../../Help'
import { ModalButton, ButtonOptions } from './ModalButton'
import { ModalContainer } from './ModalContainer'
import { FileDropPanel } from './panels/FileDropPanel'
import { SettingsContainer } from './panels/SettingsContainer'
import React, { memo, useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'

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

	const modal = useMemo(() => {
		const selectedButton = buttonMap.find(item => item.text === selected)
		if (selectedButton && selected) {
			return (
				<ModalContainer
					titleId={selectedButton.text}
					isModalOpen={isModalOpen}
					title={selectedButton.text}
					hideModal={hideModal}
					content={selectedButton.content}
				/>
			)
		}
		return (
			<ModalContainer
				titleId={''}
				isModalOpen={isModalOpen}
				title={''}
				hideModal={hideModal}
				content={<></>}
			/>
		)
	}, [isModalOpen, hideModal, selected])

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
			{modal}
		</Container>
	)
})

const Container = styled.div``
