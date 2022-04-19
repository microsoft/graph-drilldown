/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import { memo } from 'react'
import { ThemeProvider } from 'styled-components'

import { useTheme } from '../state'

export const StyleContext: React.FC<{
	children: JSX.Element | JSX.Element[]
}> = memo(function StyleContext({ children }) {
	const theme = useTheme()
	return (
		<ThematicFluentProvider theme={theme}>
			<ThemeProvider theme={theme}>
				<ApplicationStyles />
				{children}
			</ThemeProvider>
		</ThematicFluentProvider>
	)
})
