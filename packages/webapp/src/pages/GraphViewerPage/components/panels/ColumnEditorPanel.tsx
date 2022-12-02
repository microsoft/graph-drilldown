/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useButtonProps } from '@essex/components'
import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'

import { useFileManagement } from '~/hooks/files'

import { ColumnEditor } from '../ColumnEditor'
export const ColumnEditorPanel = () => {
	const { doClearAll, hasData } = useFileManagement()
	const buttonProps = useButtonProps({}, 'small')
	return (
		<Content>
			<ColumnEditor />
			<Reset>
				{hasData ? (
					<DefaultButton
						text="Clear all"
						onClick={doClearAll}
						{...buttonProps}
					/>
				) : null}
			</Reset>
		</Content>
	)
}

const Content = styled.div`
	margin: 20px;
	margin-bottom: 10px;
	text-align: center;
	justify-content: center;
`

const Reset = styled.div`
	margin-top: 10px;
`
