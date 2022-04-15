/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useNodeCount } from '~/arquero'
import { useNodeColorEncoding } from '~/state'

import { HeaderLegend } from '../../controls/HeaderLegend'

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
