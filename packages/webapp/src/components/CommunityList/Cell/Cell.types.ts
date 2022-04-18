/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Community } from '@graph-drilldown/types'

import type { Column } from '../CommunityList.types'

export interface CellComponentProps {
	community: Community
	column: Column
	hovered?: boolean
	style?: React.CSSProperties
}
