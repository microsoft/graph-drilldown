/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { HeaderLegend } from '../../controls/HeaderLegend'

import { useNodeCount } from '~/arquero'
import { useNodeOpacityEncoding } from '~/state'

export const NodeOpacityHeaderLegend: React.FC = () => {
	const count = useNodeCount()
	const encoding = useNodeOpacityEncoding()
	return (
		<HeaderLegend
			label={'Node opacity'}
			encoding={encoding}
			opacityEncoding={encoding}
			isUnset={count === 0}
		/>
	)
}
