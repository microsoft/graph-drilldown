/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { HeaderLegend } from '@graph-drilldown/components'

import { useEdgeCount } from '~/arquero'
import { useEdgeColorEncoding } from '~/state'

export const EdgeColorHeaderLegend: React.FC = () => {
	const count = useEdgeCount()
	const encoding = useEdgeColorEncoding()
	return (
		<HeaderLegend
			label={'Edge color'}
			encoding={encoding}
			colorEncoding={encoding}
			isUnset={count === 0}
			isDashes
		/>
	)
}
