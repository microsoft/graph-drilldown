/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDropdownProps } from '@essex/components'
import { Dropdown } from '@fluentui/react'
import { useIsNominal } from '@graph-drilldown/hooks'
import { ScaleDropdown } from '@thematic/fluent'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { NumericDomainEditor } from '../NumericDomainEditor/index.js'
import type { ColorSelectorProps } from './ColorSelector.types.js'

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

	const dropdownProps = useDropdownProps({}, 'small')
	return (
		<Container>
			<Group>
				<Dropdown
					label={'Column'}
					options={fieldOptions}
					selectedKey={encoding.field}
					onChange={handleFieldChange}
					placeholder={'Select data column'}
					{...dropdownProps}
				/>
			</Group>
			<Group>
				<ScaleDropdown
					label={'Scale'}
					size={'small'}
					selectedKey={encoding.scaleName}
					onChange={handleScaleChange}
				/>
			</Group>
			<Group>
				{!isNominal ? (
					<NumericDomainEditor
						table={table}
						encoding={encoding}
						onChange={onChange}
					/>
				) : null}
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
