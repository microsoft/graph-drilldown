/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { HeaderLegend } from '@graph-drilldown/components'

import { useNodeCount } from '~/arquero'
import { useNodeSizeEncoding } from '~/state'

export const NodeSizeHeaderLegend: React.FC = () => {
	const count = useNodeCount()
	const encoding = useNodeSizeEncoding()
	return (
		<HeaderLegend
			label={'Node size'}
			encoding={encoding}
			sizeEncoding={encoding}
			isUnset={count === 0}
		/>
	)
}
