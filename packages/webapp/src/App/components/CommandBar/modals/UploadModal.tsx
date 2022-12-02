/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useButtonProps } from '@essex/components'
import { DefaultButton } from '@fluentui/react'
import { FileTable } from '@graph-drilldown/components'
import styled from 'styled-components'

import { QuickDrop } from '~/components/QuickDrop'
import { useFileManagement } from '~/hooks/files'

export const UploadModal: React.FC = () => {
	const { files, doClearAll, hasData } = useFileManagement()
	const buttonProps = useButtonProps({}, 'small')
	return (
		<Container>
			<QuickDrop />
			<Files>
				<FileTable files={files} />
			</Files>
			<Reset>
				{hasData ? (
					<DefaultButton
						text="Clear all"
						onClick={doClearAll}
						{...buttonProps}
					/>
				) : null}
			</Reset>
		</Container>
	)
}

const Container = styled.div``

const Files = styled.div``

const Reset = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 10px;
`
