/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IBreadcrumbStyleProps,
	IBreadcrumbStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { useCallback, useEffect, useMemo } from 'react'

import { ROOT_COMMUNITY_ID } from '~/constants'
import { useSelection } from '~/hooks/useSelection'
import { useNavigationState, useSetNavigationState } from '~/state'
import type { Breadcrumb as IBreadcrumb } from '~/types'

import { HierarchyNav } from './HierarchyNav'

const DEFAULT_CRUMBS = {
	key: 'root',
	text: 'Drilldown: Root',
}

export interface BreadcrumbPanelProps {
	styles?: IStyleFunctionOrObject<IBreadcrumbStyleProps, IBreadcrumbStyles>
}

export const BreadcrumbPanel: React.FC<BreadcrumbPanelProps> = ({ styles }) => {
	const { selectedCommunity, onSelectCommunity, onResetSelection } =
		useSelection()
	const setNavState = useSetNavigationState()
	const navState = useNavigationState()
	useEffect(() => {
		setNavState(ids => {
			const index = ids.findIndex(c => c === selectedCommunity)
			if (index >= 0) {
				const sliced = ids.slice(0, index + 1)
				return sliced
			}
			return [...ids, selectedCommunity]
		})
	}, [selectedCommunity, setNavState])

	const crumbs = useMemo((): IBreadcrumb[] => {
		return navState.map(id => {
			if (id === ROOT_COMMUNITY_ID) {
				return DEFAULT_CRUMBS
			}
			return {
				key: id,
				text: id,
			} as IBreadcrumb
		})
	}, [navState])

	const handleBreadcrumbClick = useCallback(
		item => {
			item.key === 'root' ? onResetSelection() : onSelectCommunity(item.key)
		},
		[onSelectCommunity, onResetSelection],
	)

	const items = useMemo(() => {
		return crumbs.map(c => ({
			...c,
			onClick: handleBreadcrumbClick,
		}))
	}, [crumbs, handleBreadcrumbClick])

	return (
		<HierarchyNav items={items} handleBreadcrumbClick={handleBreadcrumbClick} />
	)
}
