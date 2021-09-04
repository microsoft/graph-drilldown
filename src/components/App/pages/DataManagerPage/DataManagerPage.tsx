/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FileList } from '../../../FileList'
import { LeftSidePanel } from './LeftSidePanel'
import React from 'react'
import styled from 'styled-components'

export const DataManagerPage: React.FC = () => {
	return (
		<Container>
			<React.Suspense fallback={<Placeholder />}>
				<LeftSidePanel />
			</React.Suspense>
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
