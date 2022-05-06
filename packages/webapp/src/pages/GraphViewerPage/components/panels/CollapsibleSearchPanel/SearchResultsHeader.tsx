/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBar, MessageBarType, Text } from '@fluentui/react'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

export interface ItemHeaderProps {
	numberOfResults: number
	searchText?: string
	errorMessage?: string
}

export const SearchResultsHeader: React.FC<ItemHeaderProps> = ({
	numberOfResults,
	searchText,
	errorMessage,
}: ItemHeaderProps) => {
	const [infoMsgVisible, setInfoMsgVisible] = useState<boolean>(true)
	const msg = useMemo(() => {
		setInfoMsgVisible(true)
		if (errorMessage) {
			return (
				<MessageBar messageBarType={MessageBarType.error} className={'error'}>
					<Text variant={'tiny'}>{errorMessage}</Text>
				</MessageBar>
			)
		} else if (searchText && numberOfResults > 0) {
			const closeInfo = () => setInfoMsgVisible(false)
			return (
				<MessageBar
					messageBarType={MessageBarType.success}
					onDismiss={closeInfo}
					dismissButtonAriaLabel={'Close'}
					className={'success'}
				>
					<Text variant={'tiny'}>{searchText}</Text>
				</MessageBar>
			)
		}
		return null
	}, [errorMessage, searchText, numberOfResults])

	return (
		<div>
			<MsgContainer show={infoMsgVisible}>{msg}</MsgContainer>
		</div>
	)
}

interface MsgContainerStyles {
	show?: boolean
}

const MsgContainer = styled.div<MsgContainerStyles>`
	visibility: ${({ show }) => `${show ? 'visible' : 'hidden'};`};
	height: ${({ show }) => `${show ? 'auto' : '10px'};`};
`
