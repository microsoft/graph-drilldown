/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { HeaderLegend } from '@graph-drilldown/components'

import { useNodeCount } from '~/hooks/graph'
import { useNodeColorEncoding } from '~/state'

export const NodeColorHeaderLegend: React.FC = () => {
	const count = useNodeCount()
	const encoding = useNodeColorEncoding()
	return (
		<HeaderLegend
			label={'Node color'}
			encoding={encoding}
			colorEncoding={encoding}
			isUnset={count === 0}
		/>
	)
}
