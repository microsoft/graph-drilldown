/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'

export interface ToggleHeaderProps {
	title: string
	subtitle?: string
	checked: boolean
	disabled?: boolean
	onChange?: (checked: boolean) => void
}

export const ToggleHeader: React.FC<ToggleHeaderProps> = ({
	title,
	subtitle,
	checked,
	disabled,
	onChange,
}) => {
	const handleChange = useCallback(
		(_, v) => onChange && onChange(v),
		[onChange],
	)
	return (
		<Container>
			<Title>{title}</Title>
			<Subtitle>{subtitle}</Subtitle>
			<ToggleSection>
				<Toggle
					disabled={disabled}
					styles={toggleStyles}
					onText="on"
					offText="off"
					checked={checked}
					onChange={handleChange}
				/>
			</ToggleSection>
		</Container>
	)
}

// create a "micro toggle"
const toggleStyles = {
	root: {
		margin: 0,
	},
	pill: {
		height: 14,
		width: 28,
		padding: 1,
		fontSize: 12,
	},
	thumb: {
		fontSize: 12,
	},
	text: {
		fontSize: '0.8em',
	},
}

const Container = styled.div`
	border: 1px solid ${({ theme }) => theme.application().lowContrast().hex()};
	border-bottom: none;
	background: ${({ theme }) => theme.application().faint().hex(0.8)};
	padding: 4px;
	height: 32px;
	padding-left: 20px;
	font-size: 0.8em;
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const Title = styled.div`
	font-weight: bold;
`

const Subtitle = styled.div`
	color: ${({ theme }) => theme.application().midContrast().hex()};
	font-size: 0.9em;
`

const ToggleSection = styled.div``
