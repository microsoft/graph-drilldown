/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CellComponentProps } from './Cell.types'
import { empty } from './Cell.util'

export const Text: React.FC<CellComponentProps> = ({ community, column }) => {
	const { accessor = empty } = column
	const value = accessor(community)
	return <>{value}</>
}
