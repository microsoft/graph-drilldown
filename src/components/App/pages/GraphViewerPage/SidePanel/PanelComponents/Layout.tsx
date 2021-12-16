/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { UmapLayout } from './UmapLayout'
import { DefaultButton, Spinner, Toggle } from '@fluentui/react'
import { all, not } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import {
	useArqueroBigTable,
	useArqueroEdgeTable,
	useSetArqueroBigTable,
} from '~/arquero'
import { executeLayout, Layout as LayoutType } from '~/layout'
import { useFeatures, useGraphViewType, useSetGraphViewType } from '~/state'
import { ViewType } from '~/types'

export const Layout: React.FC = memo(function Layout() {
	const nodes = useArqueroBigTable()
	const edges = useArqueroEdgeTable()
	const setBigTable = useSetArqueroBigTable()
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
	// const handleFA2Click = useCallback(() => {
	// 	setLoading(true)
	// 	performLayout(LayoutType.FA2)
	// }, [performLayout])
	const handleUmapClick = useCallback(() => {
		setLoading(true)
		performLayout(LayoutType.UMAP)
	}, [performLayout])
	const handleViewChanged = useCallback(
		(e, v) => setGraphView(v ? ViewType.SmallMultiple : ViewType.SingleGraph),
		[setGraphView],
	)
	return (
		<Container>
			{features.enableSmallMultiples ? (
				<Toggle
					inlineLabel
					label="Community isolation"
					checked={graphView === ViewType.SmallMultiple}
					onChange={handleViewChanged}
				/>
			) : null}
			<Buttons>
				<DefaultButton text={'Grid'} onClick={handleGridClick} />
				{edges.numRows() > 0 ? (
					<>
						{/* <DefaultButton text={'FA2'} onClick={handleFA2Click} /> */}
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
