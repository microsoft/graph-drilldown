/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CollapsiblePanel } from '~/react-patch/themed-components'
import { useCallback } from 'react'
import styled from 'styled-components'

import { useBigTable } from '~/state'

import {
	useInteraction,
	useSearch,
	useSearchableTable,
	useSelection,
} from './CollapsibleSearchPanel.hooks'
import { SearchPanelHeader } from './SearchPanelHeader'
import { SearchResults } from './SearchResults'

export const CollapsibleSearchPanel: React.FC = () => {
	const bigTable = useBigTable()
	const searchTable = useSearchableTable(bigTable)

	const {
		isExpanded,
		errorMessage,
		onFocusChange,
		onPanelClick,
		onReset,
		onError,
		doSearchExpand,
	} = useInteraction()

	const { onResetSelection } = useSelection()

	const onClear = useCallback(() => {
		onResetSelection()
		onReset()
	}, [onResetSelection, onReset])

	const { canSearch, isSearching, nodeResults, communityResults, doSearch } =
		useSearch(searchTable, doSearchExpand, onError, onClear)

	const onRenderSearchHeader = useCallback(
		() => (
			<SearchPanelHeader
				disabled={!canSearch}
				onSearch={doSearch}
				onClear={onClear}
				onFocusChange={onFocusChange}
				isSearching={isSearching}
			/>
		),
		[canSearch, onClear, doSearch, onFocusChange, isSearching],
	)

	return (
		<CollapsiblePanel
			onRenderHeader={onRenderSearchHeader}
			defaultExpanded={false}
			onHeaderClick={onPanelClick}
			expandedState={isExpanded}
		>
			<Content>
				{communityResults && nodeResults && (
					<SearchResults
						nodes={nodeResults}
						communities={communityResults}
						errorMessage={errorMessage}
					/>
				)}
			</Content>
		</CollapsiblePanel>
	)
}

const Content = styled.div``
