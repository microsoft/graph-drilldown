/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useIsNominal } from '../HeaderLegend/HeaderLegend.hooks'
import { NominalLegend } from '../NominalLegend'
import { NumericDomainEditor } from '../NumericDomainEditor'
import { ColorSelectorProps } from './ColorSelector.types'
import { Dropdown } from '@fluentui/react'
import { ScaleDropdown } from '@thematic/fluent'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

export const ScaledPicker: React.FC<ColorSelectorProps> = ({
	table,
	encoding,
	onChange,
}) => {
	const fieldOptions = useFieldDropdownOptions(table)

	const isNominal = useIsNominal(encoding)

	const handleFieldChange = useCallback(
		(_, option) => {
			onChange({
				field: option.key,
			})
		},
		[onChange],
	)

	const handleScaleChange = useCallback(
		(_, option) => {
			onChange({
				scaleName: option.key,
			})
		},
		[onChange],
	)

	return (
		<Container>
			<Group>
				<Dropdown
					label={'Column'}
					options={fieldOptions}
					selectedKey={encoding.field}
					onChange={handleFieldChange}
					placeholder={'Select data column'}
				/>
			</Group>
			<Group>
				<ScaleDropdown
					label={'Scale'}
					selectedKey={encoding.scaleName}
					onChange={handleScaleChange}
				/>
			</Group>
			<Group>
				{isNominal ? (
					<NominalLegend encoding={encoding} />
				) : (
					<NumericDomainEditor
						table={table}
						encoding={encoding}
						onChange={onChange}
					/>
				)}
			</Group>
		</Container>
	)
}

function useFieldDropdownOptions(table: ColumnTable) {
	return useMemo(() => {
		return table.columnNames().map(key => ({
			key,
			text: key,
		}))
	}, [table])
}

const Container = styled.div``

const Group = styled.div`
	margin-top: 20px;
`
