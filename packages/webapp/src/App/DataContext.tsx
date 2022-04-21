/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo, ReactNode } from 'react'

import { usePresetData, useTestFiles, useUrlFiles } from './App.hooks'
export const DataContext: React.FC<{
	children?: ReactNode
}> = memo(function DataContext({ children }) {
	useData()
	return <>{children}</>
})

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
