/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { createRoot } from 'react-dom/client'

import { App } from './App'

function mount(): void {
	try {
		const container = document.getElementById('root')
		initializeIcons(undefined, { disableWarnings: true })
		if (container == null) {
			throw new Error('could not find root container')
		}
		const root = createRoot(container)
		root.render(<App />)
	} catch (err) {
		console.error('error rendering application', err)
	}
}
mount()
