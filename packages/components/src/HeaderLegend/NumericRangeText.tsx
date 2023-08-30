/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { format } from 'd3-format'
import { useMemo } from 'react'
import styled from 'styled-components'

export interface NumericRangeTextProps {
	includeMidpoint?: boolean
	domain?: [number, number]
	precision?: number
}

export const NumericRangeText: React.FC<NumericRangeTextProps> = ({
	includeMidpoint = false,
	domain = [0, 1],
	precision = 3,
}) => {
	const range = useMemo(() => {
		const [min, max] = domain
		const mid = (max - min) / 2
		const fmt = format(`.${precision}f`)
		const values = mid === 0 ? [max] : [min, mid, max]
		return values.map((v) => fmt(v))
	}, [domain, precision])

	return (
		<Container>
			<Left>{range[0]}</Left>
			{includeMidpoint && <Center>{range[1]}</Center>}
			<Right>{range[2]}</Right>
		</Container>
	)
}

const Container = styled.div`
	font-size: 0.7em;
	display: flex;
	justify-content: space-between;
`

const Left = styled.div``
const Center = styled.div`
	text-align: center;
`
const Right = styled.div`
	text-align: right;
`
