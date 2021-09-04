/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchBox, IconButton } from '@fluentui/react'
import { useDebounceFn } from 'ahooks'
import React, { useCallback } from 'react'
import styled from 'styled-components'

const searchBoxStyle = {
	iconContainer: { display: 'none' },
	field: { fontSize: '12px' },
	root: { width: '100%' },
}

const searchButtonStyle = {
	root: { marginLeft: '5px' },
}

const searchIcon = { iconName: 'Search' }

interface SearchPanelHeaderProps {
	disabled: boolean
	onChange: (
		event?: React.ChangeEvent<HTMLInputElement>,
		newValue?: string,
	) => any
	onClear: () => void
	onSearch: () => void
	onFocusChange: (state: boolean) => void
}
export const SearchPanelHeader = ({
	disabled,
	onChange,
	onSearch,
	onClear,
	onFocusChange,
}: SearchPanelHeaderProps) => {
	const focusCallback = useCallback(() => onFocusChange(true), [onFocusChange])
	const blurCallback = useCallback(() => onFocusChange(false), [onFocusChange])

	const useDebounce = useDebounceFn(
		(event, newValue) => {
			onChange(event, newValue)
		},
		{
			wait: 500,
		},
	)

	return (
		<Label>
			<SearchBox
				placeholder="Search graph"
				styles={searchBoxStyle}
				disabled={disabled}
				onChange={(
					event?: React.ChangeEvent<HTMLInputElement>,
					newValue?: string,
				) => useDebounce.run(event, newValue)}
				onClear={onClear}
				onSearch={onSearch}
				onFocus={focusCallback}
				onBlur={blurCallback}
			/>

			<IconButton
				iconProps={searchIcon}
				styles={searchButtonStyle}
				title="Search"
				ariaLabel={'Search'}
				disabled={disabled}
				onClick={onSearch}
			/>
		</Label>
	)
}

const Label = styled.div`
	margin-right: 4px;
	display: inline-flex;
	width: 100%;
`
