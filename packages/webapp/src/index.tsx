/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import './index.css'

import { initializeIcons } from '@fluentui/react'
import { ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { ThemeProvider } from 'styled-components'

import { App } from './App'
import { useTheme } from './state'

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

function mount(): void {
	ReactDOM.render(<ConfiguredApp />, document.getElementById('root'))
}

function bootstrap(): void {
	initializeIcons(undefined, { disableWarnings: true })
	try {
		mount()
	} catch (err) {
		console.error('error initializing application', err)
	}
}

bootstrap()
