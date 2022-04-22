/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { HeaderLegend } from '@graph-drilldown/components'

import { useEdgeCount } from '~/hooks/graph'
import { useEdgeOpacityEncoding } from '~/state'

export const EdgeOpacityHeaderLegend: React.FC = () => {
	const count = useEdgeCount()
	const encoding = useEdgeOpacityEncoding()
	return (
		<HeaderLegend
			label={'Edge opacity'}
			encoding={encoding}
			opacityEncoding={encoding}
			isUnset={count === 0}
			isDashes
		/>
	)
}
