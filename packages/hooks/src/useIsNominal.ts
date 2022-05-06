/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColorEncoding } from '@graph-drilldown/types'
import { isNominal } from '@thematic/color'
import { useMemo } from 'react'

export function useIsNominal(encoding: ColorEncoding) {
	return useMemo(() => isNominal(encoding.scaleName), [encoding])
}
