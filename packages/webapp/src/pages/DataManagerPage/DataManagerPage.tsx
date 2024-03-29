/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { Suspense } from 'react'
import styled from 'styled-components'

import { LeftSidePanel } from './components/LeftSidePanel'
import { MainPanel } from './components/MainPanel'

export const DataManagerPage: FC = () => {
	return (
		<Container>
			<Suspense fallback={<Placeholder />}>
				<LeftSidePanel />
			</Suspense>
			<Content>
				<MainContainer>
					<MainPanel />
				</MainContainer>
			</Content>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	height: calc(100vh - 80px);
	flex: 1;
`

const Content = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`

const MainContainer = styled.div`
	margin-top: 40px;
	margin-bottom: 20px;
	width: 800px;
`

const Placeholder = styled.div``
