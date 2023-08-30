/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import styled from 'styled-components'

import { useHoveredNode, useSelectedCommunity } from '~/state'
import { useVisibleNodeMap } from '~/state/caches'

export const NodeHoverHeader: React.FC = () => {
	const nodeId = useHoveredNode()
	const cid = useSelectedCommunity()
	const nodeMap = useVisibleNodeMap(cid)
	const render = useMemo(() => {
		const id = nodeId
		if (id === null || !id) {
			return <Unset>&mdash;</Unset>
		}
		const node = nodeMap.get(id)
		const label = node?.get('node.label')
		return <Fixed>{label || nodeId}</Fixed>
	}, [nodeId, nodeMap])
	return (
		<Container>
			<Label>Node details:</Label>
			{render}
		</Container>
	)
}

const Container = styled.div`
	margin: 2px;
	margin-left: 4px;
	font-size: 0.8em;
	display: flex;
	align-items: center;
`

const Label = styled.div`
	margin-right: 4px;
`

const Unset = styled.div`
	color: ${({ theme }) => theme.application().midContrast().hex()};
`

const Fixed = styled.div``
