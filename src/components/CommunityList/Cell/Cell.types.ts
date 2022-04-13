/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Column } from '../CommunityList.types'
import { Community } from '~/types'

export interface CellComponentProps {
	community: Community
	column: Column
	hovered?: boolean
	style?: React.CSSProperties
}
