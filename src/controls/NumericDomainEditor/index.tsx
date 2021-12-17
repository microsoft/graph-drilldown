/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Encoding } from '../../types'
import { DomainBrush } from '../DomainBrush'
import { Label } from '@fluentui/react'
import { ScaleType } from '@thematic/core'
import { ScaleTypeChoiceGroup } from '@thematic/fluent'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { format } from 'd3-format'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useColumnHistogram, useColumnStats } from '~/arquero'

export interface NumericDomainEditorProps {
	/**
	 * table the encoding will be binding to, so we can lookup stats
	 * or column names as needed
	 */
	table: ColumnTable
	encoding: Encoding
	onChange: (encoding: Partial<Encoding>) => void
}

export const NumericDomainEditor: React.FC<NumericDomainEditorProps> = ({
	table,
	encoding,
	onChange,
}) => {
	const parameters = useColumnStats(table, encoding.field)
	const domain = parameters?.domain || [0, 1]
	const precision = parameters?.precision || 0
	const fmt = useMemo(() => format(`.${precision}f`), [precision])

	const handleTypeChange = useCallback(
		scaleType =>
			onChange &&
			onChange({
				scaleType,
			}),
		[onChange],
	)

	const handleDomainChange = useCallback(
		domain =>
			onChange &&
			onChange({
				domain,
			}),
		[onChange],
	)

	const histogram = useColumnHistogram(table, encoding.field)

	return (
		<Container>
			<Label>{`Input domain (data extent: ${fmt(domain[0])} - ${fmt(
				domain[1],
			)})`}</Label>
			<DomainBrush
				histogram={histogram}
				min={domain[0]}
				max={domain[1]}
				precision={precision}
				currentDomain={encoding.domain}
				onChange={handleDomainChange}
				showTextInputs
			/>
			<ScaleTypeChoiceGroup
				selectedType={encoding.scaleType || ScaleType.Linear}
				onChange={handleTypeChange}
				suppressQuantile
			/>
		</Container>
	)
}

const Container = styled.div``
