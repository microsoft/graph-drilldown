/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Navigation } from './Navigation'
import { ModalButtons } from './modals/ModalButtons'

import styled from 'styled-components'
import { COMMANDBAR_HEIGHT, COMMANDBAR_MARGIN, PANEL_WIDTH } from '~/styles'

/**
 * This is a universal command bar for navigating and opening modals.
 * Note the navigation and modals are split into two bordered groups for clarity
 */
export const CommandBar = () => {
	return (
		<Container>
			<FlexContainer>
				<ButtonGroup>
					<Navigation />
				</ButtonGroup>
				<ButtonGroup>
					<ModalButtons />
				</ButtonGroup>
			</FlexContainer>
		</Container>
	)
}

const Container = styled.div`
	width: ${PANEL_WIDTH - COMMANDBAR_MARGIN * 2}px;
	margin: ${COMMANDBAR_MARGIN}px;
	height: ${COMMANDBAR_HEIGHT}px;
`

const FlexContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

const ButtonGroup = styled.div`
	display: flex;
	align-items: center;
	border-radius: 2px;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`
