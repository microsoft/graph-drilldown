/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataBinding } from '../../types'
import React, { useMemo } from 'react'
import styled from 'styled-components'

export interface LegendLabelProps {
	label: string
	binding: DataBinding
	field?: string
	fixedValue?: string
	paletteValue?: string
	unset?: boolean
}

export const LegendLabel: React.FC<LegendLabelProps> = ({
	label,
	binding,
	field = '',
	fixedValue = '',
	paletteValue = '',
	unset,
}) => {
	const render = useMemo(() => {
		if (unset) {
			return <Unset>&mdash;</Unset>
		}
		switch (binding) {
			case DataBinding.Fixed:
				return <Fixed>{fixedValue}</Fixed>
			case DataBinding.Scaled:
				return <Field>{field}</Field>
			case DataBinding.Palette:
				return <Palette>{paletteValue}</Palette>
		}
	}, [binding, field, fixedValue, paletteValue, unset])
	return (
		<Container>
			<Label>{label}:</Label>
			{render}
		</Container>
	)
}

const Container = styled.div`
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

// provide a subtle indication that these are dynamic
const Field = styled.div`
	&:before {
		content: '[';
		margin-right: 3px;
		color: ${({ theme }) => theme.application().midContrast().hex()};
	}
	&:after {
		content: '] column';
		margin-left: 3px;
		color: ${({ theme }) => theme.application().midContrast().hex()};
	}
`

const Palette = styled.div``
