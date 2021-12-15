/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchBox, IconButton, Spinner, SpinnerSize } from '@fluentui/react'
import { useCallback } from 'react'
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
	isSearching: boolean
}
export const SearchPanelHeader = ({
	disabled,
	onChange,
	onSearch,
	onClear,
	onFocusChange,
	isSearching,
}: SearchPanelHeaderProps) => {
	const focusCallback = useCallback(() => onFocusChange(true), [onFocusChange])
	const blurCallback = useCallback(() => onFocusChange(false), [onFocusChange])

	return (
		<Label>
			<SearchBox
				placeholder="Search graph"
				styles={searchBoxStyle}
				disabled={disabled}
				onChange={onChange}
				onClear={onClear}
				onSearch={onSearch}
				onFocus={focusCallback}
				onBlur={blurCallback}
			/>
			<IconButton
				iconProps={!isSearching ? searchIcon : {}}
				styles={searchButtonStyle}
				title="Search"
				ariaLabel={'Search'}
				disabled={disabled}
				onClick={onSearch}
			>
				{isSearching && <Spinner size={SpinnerSize.xSmall} />}
			</IconButton>
		</Label>
	)
}

const Label = styled.div`
	margin-right: 4px;
	display: inline-flex;
	width: 100%;
`
