/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { loadFluentTheme, ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import type { ReactNode } from 'react'
import { memo, useMemo } from 'react'
import { createGlobalStyle } from 'styled-components'

import { ThemeProvider } from '~/react-patch/styled-components'
import { useTheme } from '~/state'

export const StyleContext: React.FC<{
	children?: ReactNode
}> = memo(function StyleContext({ children }) {
	const theme = useTheme()
	const fluentTheme = useMemo(() => loadFluentTheme(theme), [theme])
	return (
		<ThematicFluentProvider theme={theme}>
			<ThemeProvider theme={fluentTheme}>
				<ApplicationStyles />
				<GlobalStyle />
				{children}
			</ThemeProvider>
		</ThematicFluentProvider>
	)
})

const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
	}
	html, body, .fluent-theme-provider {
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
	}
` as any
