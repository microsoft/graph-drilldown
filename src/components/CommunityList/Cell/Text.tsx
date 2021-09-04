/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { empty } from './common/defaultParams'
import { CellComponentProps } from './common/types'
import React from 'react'

export const Text: React.FC<CellComponentProps> = ({ community, column }) => {
	const { accessor = empty } = column
	const value = accessor(community)
	return <>{value}</>
}
