/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	useIconButtonStyles,
	useModalStyles,
} from '../../../../pages/GraphViewerPage/GraphViewerPage.hooks'
import {
	Modal,
	IDragOptions,
	ContextualMenu,
	IconButton,
	IIconProps,
	Text,
} from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { variants } from '~/styles'

const dragOptions: IDragOptions = {
	moveMenuItemText: 'Move',
	closeMenuItemText: 'Close',
	menu: ContextualMenu,
}
const cancelIcon: IIconProps = { iconName: 'Cancel' }

export interface ModalContainerProps {
	titleId: string
	title: string
	hideModal: () => void
	isModalOpen: boolean
	content: any
}

export const ModalContainer: React.FC<ModalContainerProps> = memo(
	function ModalContainer({
		titleId,
		title,
		hideModal,
		isModalOpen,
		content,
	}: ModalContainerProps) {
		const iconButtonStyles = useIconButtonStyles()
		const modalStyles = useModalStyles()

		return (
			<Container className={'modal-container'}>
				<Modal
					titleAriaId={titleId}
					isOpen={isModalOpen}
					onDismiss={hideModal}
					isModeless={false}
					isBlocking={false}
					dragOptions={dragOptions}
					styles={modalStyles}
					layerProps={{ eventBubblingEnabled: true }}
				>
					<Header>
						<Title>
							<Text variant={variants.xxLarge}>
								<b>{title}</b>
							</Text>
						</Title>
						<IconButton
							styles={iconButtonStyles}
							iconProps={cancelIcon}
							ariaLabel="Close popup modal"
							onClick={hideModal}
						/>
					</Header>
					<ContentContainer>{content}</ContentContainer>
				</Modal>
			</Container>
		)
	},
)

const Container = styled.div``

const Header = styled.div`
	text-align: center;
	align-items: center;
	flex: 1 1 auto;
	display: flex;
	padding: 12px 12px 14px 24px;
`
const ContentContainer = styled.div`
	padding: 12px 12px 14px 24px;
`

const Title = styled.span`
	flex: 2;
`
