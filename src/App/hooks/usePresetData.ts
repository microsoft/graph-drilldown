/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FileBundle } from './useTestFiles'
import { useMemo } from 'react'
import { useDataset, useFormat } from '~/state'
import { FileOrigin } from '~/types'

/**
 * This hooks loads pre-baked complete datsets
 * accessible via the dataset param (in deployed public/data folder).
 * Note that to be included here they must
 * have a nodes and join file pair at minimum.
 */
export function usePresetData(): FileBundle {
	const dataset = useDataset()
	const format = useFormat()
	return useMemo(() => {
		return dataset
			? {
					nodes: {
						origin: FileOrigin.Preset,
						url: `data/${dataset}/nodes.${format}`,
						tableType: 'node',
					},
					join: {
						origin: FileOrigin.Preset,
						url: `data/${dataset}/join.${format}`,
						tableType: 'join',
					},
			  }
			: {}
	}, [dataset, format])
}
