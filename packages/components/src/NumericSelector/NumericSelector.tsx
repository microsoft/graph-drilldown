/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { usePivotProps } from '@essex/components'
import { Pivot, PivotItem } from '@fluentui/react'
import { DataBinding } from '@graph-drilldown/types'
import { useCallback } from 'react'
import styled from 'styled-components'

import { pivotBaseProps } from '../styles.js'
import { FixedPicker } from './FixedPicker.js'
import type { NumericSelectorProps } from './NumericSelector.types.js'
import { ScaledPicker } from './ScaledPicker.js'
/**
 * Represents a complex color selector for a dataset.
 * Provides the options for each FieldBinding enum value:
 * - Fixed: manually chosen hex color
 * - Palette: a thematic-bound named color (so it auto-updates with theme changes)
 * - Scale: field-bound to a thematic scale with domain, range, etc.
 */
export const NumericSelector: React.FC<NumericSelectorProps> = props => {
	const { encoding, onChange } = props
	const handlePivotLinkClick = useCallback(
		item => {
			onChange({
				binding: item.props.itemKey,
			})
		},
		[onChange],
	)
	const pivotProps = usePivotProps(pivotBaseProps, 'small')
	return (
		<Container>
			<Pivot
				{...pivotProps}
				onLinkClick={handlePivotLinkClick}
				selectedKey={encoding.binding}
			>
				<PivotItem headerText={'Scaled'} itemKey={DataBinding.Scaled}>
					<ScaledPicker {...props} />
				</PivotItem>
				<PivotItem headerText={'Fixed'} itemKey={DataBinding.Fixed}>
					<FixedPicker {...props} />
				</PivotItem>
			</Pivot>
		</Container>
	)
}

const Container = styled.div``
