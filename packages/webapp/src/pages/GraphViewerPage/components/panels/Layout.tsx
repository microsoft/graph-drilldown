/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useButtonProps, useToggleProps } from '@essex/components'
import { DefaultButton, Spinner, Toggle } from '@fluentui/react'
import { all, not } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { executeLayout, Layout as LayoutType } from '~/layout'
import {
	useBigTable,
	useEdgeTable,
	useFeatures,
	useGraphViewType,
	useSetBigTable,
	useSetGraphViewType,
} from '~/state'
import { smallButtonProps } from '~/styles'
import { ViewType } from '~/types'

import { UmapLayout } from './UmapLayout'

export const Layout: React.FC = memo(function Layout() {
	const nodes = useBigTable()
	const edges = useEdgeTable()
	const setBigTable = useSetBigTable()
	const [features] = useFeatures()
	const graphView = useGraphViewType()
	const setGraphView = useSetGraphViewType()
	const [loading, setLoading] = useState<boolean>(false)
	const performLayout = useCallback(
		(type: LayoutType) => {
			console.log('performing layout', type)
			const finalize = (table: ColumnTable) => {
				console.log('layout complete', type)
				table.print()
				const merged = nodes.join(
					table,
					['node.id', 'node.id'],
					// note that we're overwriting any previous columns with anything new from layout
					// the full pipelines often include community.id and a size...
					[not(table.columnNames()), all()],
				)
				merged.print()
				setBigTable(merged)
				setLoading(false)
			}

			const deduped = nodes
				.orderby('community.nodeCount')
				.select(['node.id', 'node.x', 'node.y'])
				.dedupe('node.id')
				.ungroup()

			executeLayout(type, deduped, edges).then(finalize)
		},
		[nodes, edges, setBigTable],
	)

	const handleGridClick = useCallback(() => {
		setLoading(true)
		performLayout(LayoutType.Grid)
	}, [performLayout])
	const handleUmapClick = useCallback(() => {
		setLoading(true)
		performLayout(LayoutType.UMAP)
	}, [performLayout])
	const handleViewChanged = useCallback(
		(e, v) => setGraphView(v ? ViewType.SmallMultiple : ViewType.SingleGraph),
		[setGraphView],
	)
	const toggleProps = useToggleProps({}, 'small')
	const buttonProps = useButtonProps(smallButtonProps, 'small')
	return (
		<Container>
			{features.enableSmallMultiples ? (
				<Toggle
					inlineLabel
					label="Community isolation"
					checked={graphView === ViewType.SmallMultiple}
					onChange={handleViewChanged}
					{...toggleProps}
				/>
			) : null}
			<Buttons>
				<DefaultButton
					text={'Grid'}
					onClick={handleGridClick}
					{...buttonProps}
				/>
				{edges.numRows() > 0 ? (
					<>
						<UmapLayout onClick={handleUmapClick} />
					</>
				) : null}
			</Buttons>
			<Status>
				{loading ? (
					<Spinner labelPosition={'right'} label={'Computing layout...'} />
				) : null}
			</Status>
		</Container>
	)
})

const Container = styled.div`
	margin: 20px;
	margin-bottom: 10px;
	text-align: center;
	justify-content: center;
`

const Buttons = styled.div`
	margin-top: 10px;
	display: flex;
	justify-content: space-around;
`

const Status = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 42px;
`
