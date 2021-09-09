/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { App } from './components/App'
import { useTheme } from './state'
import { ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'

import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import styled, { ThemeProvider } from 'styled-components'
import './index.css'

const ThemedApp = () => {
	const theme = useTheme()
	return (
		<ThematicFluentProvider theme={theme}>
			<ThemeProvider theme={theme}>
				<ApplicationStyles />
				<App />
			</ThemeProvider>
		</ThematicFluentProvider>
	)
}

const ConfiguredApp = () => (
	<RecoilRoot>
		<ThemedApp />
	</RecoilRoot>
)
const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<ConfiguredApp />, root)
