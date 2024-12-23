/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

import { LazyCachingSwitch } from '~/components/LazyCachingSwitch'
import { DataManagerPage, GraphViewerPage } from '~/pages'
import { HashRouter, Route } from '~/react-patch/react-router-dom'

import { DataContext } from './DataContext'
import { StateContext } from './StateContext'
import { StyleContext } from './StyleContext'
import { CommandBar } from './components/CommandBar'
import { Footer } from './components/Footer'

export const App: React.FC = () => {
	return (
		<StateContext>
			<DataContext>
				<StyleContext>
					<HashRouter>
						<Container>
							<CommandBar />
							<Main>
								<LazyCachingSwitch>
									<Route path='/' component={GraphViewerPage} />
									<Route path='/files' component={DataManagerPage} />
								</LazyCachingSwitch>
								<Footer />
							</Main>
						</Container>
					</HashRouter>
				</StyleContext>
			</DataContext>
		</StateContext>
	)
}

const Container = styled.div``

const Main = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	flex-direction: column;
`
