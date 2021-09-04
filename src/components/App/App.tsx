/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LazyCachingSwitch } from './LazyCachingSwitch'
import { CommandBar } from './commands'
import { usePresetData, useTestFiles, useUrlFiles } from './hooks'
import { GraphViewerPage, DataManagerPage } from './pages'
import React, { useMemo } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import styled from 'styled-components'

export const App: React.FC = () => {
	useData()
	return (
		<HashRouter>
			<Container>
				<CommandBar />
				<Main>
					<LazyCachingSwitch>
						<Route path="/" component={GraphViewerPage} />
						<Route path="/files" component={DataManagerPage} />
					</LazyCachingSwitch>
				</Main>
			</Container>
		</HashRouter>
	)
}

function useData() {
	const presets = usePresetData()
	const params = useUrlFiles()
	const merged = useMemo(() => {
		// files on the url override preset baked-in,
		// allowing on-the-fly customization
		return {
			...presets,
			...params,
		}
	}, [presets, params])
	useTestFiles(merged)
}

const Container = styled.div``

const Main = styled.div``
