/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEdgeCount } from '~/arquero'
import { useEdgeSizeEncoding } from '~/state/vis'

import { HeaderLegend } from '../../controls/HeaderLegend'

export const EdgeSizeHeaderLegend: React.FC = () => {
	const count = useEdgeCount()
	const encoding = useEdgeSizeEncoding()
	return (
		<HeaderLegend
			label={'Edge size'}
			encoding={encoding}
			sizeEncoding={encoding}
			isUnset={count === 0}
			isDashes
		/>
	)
}
