/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList } from '@essex/arquero-react'
import { memo } from 'react'
import styled from 'styled-components'

import { useVisibleCommunities } from '~/hooks/communities'

import {
	useColumnConfig,
	useDefaultSortedTable,
} from './CommunitiesTable.hooks'
import type { CommunitiesTableProps } from './CommunitiesTable.types'

/* Displays current Community children based on current user community selection in Navigation Panel
 */
export const CommunitiesTable: React.FC<CommunitiesTableProps> = memo(
	function CommunitiesTable({ width, height }: CommunitiesTableProps) {
		const communities = useVisibleCommunities()
		const columns = useColumnConfig(communities, width)
		const table = useDefaultSortedTable(communities)
		return (
			<Container width={width} height={height}>
				<ArqueroDetailsList
					table={table}
					columns={columns}
					features={{
						smartHeaders: true,
						smartCells: true,
					}}
					compact
					isSortable
					isHeadersFixed
					includeAllColumns={false}
				/>
			</Container>
		)
	},
)

const Container = styled.div<{ width: number; height: number }>`
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
`
