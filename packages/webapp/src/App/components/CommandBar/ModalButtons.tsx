/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { useButtonConfig, useModal } from './ModalButtons.hooks'
import { ModalContainer } from './modals/ModalContainer'

/**
 * This is a list of buttons for the CommandBar that each open a modal pane.
 */
export const ModalButtons: React.FC = memo(function ModalButtons() {
	const buttons = useButtonConfig()

	const { onButtonClick, onDismiss, selected } = useModal()

	return (
		<Container>
			{buttons.map((button, i) => (
				<IconButton
					key={`modal-button_${button.key}`}
					iconProps={{
						iconName: button.iconName,
					}}
					title={button.title}
					onClick={() => onButtonClick(button)}
				/>
			))}
			{selected ? (
				<ModalContainer
					isModalOpen={!!selected}
					title={selected.title}
					onDismiss={onDismiss}
					modalType={selected.type}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div``
