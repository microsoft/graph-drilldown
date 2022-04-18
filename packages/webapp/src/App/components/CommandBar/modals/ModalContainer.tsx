/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IButtonStyles,
	IDragOptions,
	IIconProps,
	IModalStyleProps,
	IModalStyles,
} from '@fluentui/react'
import { ContextualMenu, IconButton, Modal, Text } from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'
import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'
import { Case, Switch } from 'react-if'
import styled from 'styled-components'

import { variants } from '~/styles'

import { Export } from '../../Export'
import { Help } from '../../Help'
import { ModalPageType } from './ModalContainer.types'
import { SettingsModal } from './SettingsModal'
import { UploadModal } from './UploadModal'

const dragOptions: IDragOptions = {
	moveMenuItemText: 'Move',
	closeMenuItemText: 'Close',
	menu: ContextualMenu,
}
const cancelIcon: IIconProps = { iconName: 'Cancel' }

export interface ModalContainerProps {
	title: string
	hideModal: () => void
	isModalOpen: boolean
	modalType: ModalPageType
}

export const ModalContainer: React.FC<ModalContainerProps> = memo(
	function ModalContainer({
		title,
		hideModal,
		isModalOpen,
		modalType,
	}: ModalContainerProps) {
		const iconButtonStyles = useIconButtonStyles()
		const modalStyles = useModalStyles()
		return (
			<Container className={'modal-container'}>
				<Modal
					titleAriaId={title}
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
					<ContentContainer>
						<Switch>
							<Case condition={modalType === ModalPageType.Upload}>
								<UploadModal />
							</Case>
							<Case condition={modalType === ModalPageType.Export}>
								<Export />
							</Case>
							<Case condition={modalType === ModalPageType.Settings}>
								<SettingsModal />
							</Case>
							<Case condition={modalType === ModalPageType.Help}>
								<Help />
							</Case>
						</Switch>
					</ContentContainer>
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
	padding: 12px 20px 14px 20px;
`

const Title = styled.span`
	flex: 2;
`

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

function useModalStyles(): IStyleFunctionOrObject<
	IModalStyleProps,
	IModalStyles
> {
	const theme = useThematic()
	return useMemo(
		() => ({ main: { background: theme.application().faint().hex() } }),
		[theme],
	)
}
