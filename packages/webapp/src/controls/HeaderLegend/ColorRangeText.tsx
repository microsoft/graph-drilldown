/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { format } from 'd3-format'
import { useMemo } from 'react'
import styled from 'styled-components'

import { getPrecision } from '~/arquero'

import type { ColorEncoding } from '../../types'
import { useIsNominal } from './HeaderLegend.hooks'

export interface RangeTextProps {
	encoding: ColorEncoding
	includeMidpoint?: boolean
}

export const ColorRangeText: React.FC<RangeTextProps> = ({
	encoding,
	includeMidpoint = false,
}) => {
	const isNominal = useIsNominal(encoding)
	const range = useMemo(() => {
		if (isNominal) {
			const { uniques = [] } = encoding
			const length = uniques.length
			return [`${length} unique value${length !== 1 ? 's' : ''}`, '', '']
		} else {
			const precision = getPrecision(encoding.domain)
			const [min, max] = encoding.domain || [0, 1]
			const mid = (max - min) / 2
			const fmt = format(`.${precision}f`)
			return [fmt(min), fmt(mid), fmt(max)]
		}
	}, [isNominal, encoding])
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
