/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, SearchBox, Spinner, SpinnerSize } from '@fluentui/react'
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

export interface SearchPanelHeaderProps {
	disabled: boolean
	onClear: () => void
	onSearch: (searchValue?: string) => void
	onFocusChange: (state: boolean) => void
	isSearching: boolean
}
export const SearchPanelHeader = ({
	disabled,
	onSearch,
	onClear,
	onFocusChange,
	isSearching,
}: SearchPanelHeaderProps) => {
	const focusCallback = useCallback(() => onFocusChange(true), [onFocusChange])
	const blurCallback = useCallback(() => onFocusChange(false), [onFocusChange])
	return (
		<Container>
			<SearchBox
				placeholder='Search graph'
				styles={searchBoxStyle}
				disabled={disabled}
				onClear={onClear}
				onSearch={(value: string) => onSearch(value)}
				onFocus={focusCallback}
				onBlur={blurCallback}
			/>
			<IconButton
				iconProps={!isSearching ? searchIcon : {}}
				styles={searchButtonStyle}
				title='Search'
				ariaLabel={'Search'}
				disabled={disabled}
				onClick={() => onSearch()}
			>
				{isSearching && <Spinner size={SpinnerSize.xSmall} />}
			</IconButton>
		</Container>
	)
}

const Container = styled.div`
	padding: 4px 0 4px 0;
	margin-right: 4px;
	display: inline-flex;
	width: 100%;
`
