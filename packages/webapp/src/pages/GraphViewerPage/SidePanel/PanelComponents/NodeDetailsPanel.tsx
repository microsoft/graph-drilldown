/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useHoveredNode, useSelectedCommunity } from '~/state'
import { useVisibleNodeMap } from '~/state/caches'

const ROW_HEIGHT = 14
const DEFAULT_HEIGHT = ROW_HEIGHT * 9

interface Details {
	[key: string]: any
}

export const NodeDetailsPanel = () => {
	const cid = useSelectedCommunity()
	const nodeMap = useVisibleNodeMap(cid)
	const nodeId = useHoveredNode()
	const details: Details | undefined = useMemo(() => {
		if (nodeId) {
			const node = nodeMap.get(nodeId)
			return node?.columns.reduce((acc, cur) => {
				acc[cur] = node?.get(cur)
				return acc
			}, {})
		}
	}, [nodeMap, nodeId])
	const [height, setHeight] = useState<number>(DEFAULT_HEIGHT)
	useEffect(() => {
		if (details) {
			setHeight(Object.keys(details).length * ROW_HEIGHT)
		}
	}, [details])
	return (
		<Content height={height}>
			{details ? (
				Object.entries(details).map(entry => (
					<Field key={`node-details-${entry[0]}`}>
						<Name>{entry[0]}</Name>
						<Value>{entry[1]}</Value>
					</Field>
				))
			) : (
				<Empty>(hover a node for details)</Empty>
			)}
		</Content>
	)
}

const Content = styled.div<{ height: number }>`
	height: ${({ height }) => height}px;
	margin: 4px;
	font-size: 0.7em;
`

const Empty = styled.div`
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
`

const Field = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 1px;
`

const Name = styled.div`
	flex: 1;
	text-align: right;
	margin-right: 4px;
	font-weight: bold;
	color: ${({ theme }) => theme.application().midContrast().hex()};
`

const Value = styled.div`
	flex: 1;
`
