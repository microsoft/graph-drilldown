/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CollapsiblePanel } from '@essex-js-toolkit/themed-components'
import { useCallback } from 'react'
import styled from 'styled-components'

import { useBigTable, useCommunitiesTable } from '~/state'

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
	const communities = useCommunitiesTable()

	const {
		isExpanded,
		onFocusChange,
		onPanelClick,
		onReset,
		doResultsExpand,
	} = useInteraction()

	const { onResetSelection } = useSelection()

	const onClear = useCallback(() => {
		onResetSelection()
		onReset()
	}, [onResetSelection, onReset])

	const onStart = useCallback(() => {
		onClear()
		doResultsExpand()
	}, [onClear, doResultsExpand])
	
	const {
		canSearch,
		isSearching,
		nodeResults,
		communityResults,
		errorMessage,
		doSearch,
	} = useSearch(searchTable, communities, onStart)

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
