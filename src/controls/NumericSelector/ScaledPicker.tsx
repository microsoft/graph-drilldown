/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { NumericDomainEditor } from '../NumericDomainEditor'
import { NumericRangeEditor } from '../NumericRangeEditor'
import { NumericSelectorProps } from './types'
import { Dropdown } from '@fluentui/react'
import { table } from 'arquero'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { columnTypes } from '~/arquero'

export const ScaledPicker: React.FC<NumericSelectorProps> = ({
	table,
	encoding,
	onChange,
	min,
	max,
	step,
}) => {
	const fieldOptions = useFieldDropdownOptions(table)

	const handleFieldChange = useCallback(
		(_, option) => {
			onChange({
				field: option.key,
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
				<NumericDomainEditor
					table={table}
					encoding={encoding}
					onChange={onChange}
				/>
			</Group>
			<Group>
				<NumericRangeEditor
					encoding={encoding}
					onChange={onChange}
					min={min}
					max={max}
					// TODO: should this use step or precision for consistency?
					precision={Math.ceil(step || 1)}
				/>
			</Group>
		</Container>
	)
}

// for opacity, we can only allow numeric bindings
function useFieldDropdownOptions(table: table) {
	return useMemo(() => {
		const types = columnTypes(table)
		return types
			.filter(t => t.type === 'number')
			.map(({ name }) => ({
				key: name,
				text: name,
			}))
	}, [table])
}

const Container = styled.div``

const Group = styled.div`
	margin-top: 20px;
`
