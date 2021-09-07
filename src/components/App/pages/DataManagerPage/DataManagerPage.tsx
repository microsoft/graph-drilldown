/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, Suspense } from 'react'
import { FileList } from '../../../FileList'
import { LeftSidePanel } from './LeftSidePanel'

import styled from 'styled-components'

export const DataManagerPage: FC = () => {
	return (
		<Container>
			<Suspense fallback={<Placeholder />}>
				<LeftSidePanel />
			</Suspense>
			<Content>
				<DropContainer>
					<FileList />
				</DropContainer>
			</Content>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
`

const Content = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`

const DropContainer = styled.div`
	margin-top: 40px;
	width: 600px;
`

const Placeholder = styled.div``
