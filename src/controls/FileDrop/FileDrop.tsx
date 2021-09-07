/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { subHeaderLabel } from '../../styles'
import { ItemType } from '../../types'
import { useDrop } from './hooks'
import { Text } from '@fluentui/react'

import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

export interface FileDropProps {
	type: ItemType
	width: number
	height: number
	compact?: boolean
	onFileLoad: (content: string, type: ItemType, name: string) => void
}

export const FileDrop: React.FC<FileDropProps> = ({
	type,
	width,
	height,
	compact,
	onFileLoad,
}) => {
	const handleDrop = useDrop(onFileLoad, type)
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleDrop,
	})
	return (
		<Container
			width={width}
			height={height}
			isDragging={isDragActive}
			{...getRootProps()}
		>
			<input {...getInputProps()} />
			<TextContainer>
				{!compact && <Text variant={subHeaderLabel}>Drop</Text>}
				<Type>
					<Text variant={subHeaderLabel}>
						{compact ? type.substr(0, 4) : type}
					</Text>
				</Type>
				{!compact && <Text variant={subHeaderLabel}>data file here</Text>}
			</TextContainer>
		</Container>
	)
}

const Container = styled.div<{
	width: number
	height: number
	isDragging: boolean
}>`
	display: flex;
	justify-content: center;
	align-ttems: center;
	text-align: center;
	padding: 8px;
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
	font-size: 11px;
	border-radius: 4px;
	margin: 4px;
	border: 1px dashed
		${({ theme, isDragging }) =>
			isDragging
				? theme.application().accent().hex()
				: theme.application().border().hex()};
`

const TextContainer = styled.div`
	font-size: 14px;
`

const Type = styled.div`
	font-weight: bold;
	color: ${({ theme }) => theme.application().accent().hex()};
`
