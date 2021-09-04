/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text, MessageBar, MessageBarType } from '@fluentui/react'
import React, { useState, useMemo } from 'react'
import styled from 'styled-components'

interface ItemHeaderProps {
	numberOfResults: number
	searchText?: string
	errorMsg?: string
}
export const SearchItemHeader: React.FC<ItemHeaderProps> = ({
	numberOfResults,
	searchText,
	errorMsg,
}: ItemHeaderProps) => {
	const [infoMsgVisible, setInfoMsgVisible] = useState<boolean>(true)
	const msg = useMemo(() => {
		setInfoMsgVisible(true)
		if (errorMsg) {
			return (
				<MessageBar messageBarType={MessageBarType.error} className={'error'}>
					<Text variant={'tiny'}>{errorMsg}</Text>
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
	}, [errorMsg, searchText, numberOfResults])

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
