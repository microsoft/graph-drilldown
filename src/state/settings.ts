/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { parseParams } from '../utils/query'
import { load, Theme, ThemeVariant } from '@thematic/core'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

export interface Settings {
	showPreviewMap: boolean
	showMiniMap: boolean
	miniMapNodeRadius: number
	hideEdgesWhileMoving: boolean
	darkMode: boolean
	subsampleMiniMap: boolean
	maxMiniMapNodes: number
	subsampleEdges: boolean
	maxEdges: number
	subsampleNodes: boolean
	maxNodes: number
}

// TODO: the bundled settings object is convenient, but this will cause all perf stuff to cascade on change
// we can use an atomFamily to separate these into independent dependencies
const DEFAULT_SETTINGS = parseParams({
	showPreviewMap: true,
	showMiniMap: true,
	miniMapNodeRadius: 2,
	hideEdgesWhileMoving: false,
	// TODO: we default this to dark mode, but should try checking user OS setting
	// we need to spruce up the light mode design for this a little bit though
	darkMode: true,
	subsampleMiniMap: true,
	maxMiniMapNodes: 30000,
	subsampleEdges: true,
	maxEdges: 50000,
	subsampleNodes: true,
	maxNodes: 500000,
}) as Settings

const SETTINGS_GROUPS = [
	{
		label: 'Main map',
		keys: ['subsampleNodes', 'maxNodes'],
	},
	{
		label: 'Mini map',
		keys: [
			'showMiniMap',
			'subsampleMiniMap',
			'maxMiniMapNodes',
			'miniMapNodeRadius',
		],
	},
	{
		label: 'Preview map',
		keys: ['showPreviewMap'],
	},
	{
		label: 'Edges',
		keys: ['hideEdgesWhileMoving', 'subsampleEdges', 'maxEdges'],
	},
]

const FIXED_COLUMNS = new Set(['node.label', 'node.x', 'node.y', 'node.d'])

export const settingsState = atom<Settings>({
	key: 'settings',
	default: DEFAULT_SETTINGS,
})

const settingsGroupsState = atom({
	key: 'settings-groups',
	default: SETTINGS_GROUPS,
})

const visibleBrowserColumns = atom({
	key: 'browser-columns',
	default: FIXED_COLUMNS,
})

const visibleBrowserState = selector<Set<string>>({
	key: 'browser-column-state',
	get: ({ get }) => {
		return get(visibleBrowserColumns)
	},
	set: ({ set }, newValue) => {
		// TODO: use selectorFamily and do the merge here with a partial + overlay?
		set(visibleBrowserColumns, newValue)
	},
})

export const themeState = selector<Theme>({
	key: 'theme',
	dangerouslyAllowMutability: true,
	get: ({ get }) => {
		const settings = get(settingsState)
		const theme = load({
			variant: settings.darkMode ? ThemeVariant.Dark : ThemeVariant.Light,
		})
		return theme
	},
})

export function useSettings() {
	return useRecoilState(settingsState)
}

export function useSettingsGroups() {
	return useRecoilValue(settingsGroupsState)
}

export function useBrowserColumns() {
	return useRecoilState(visibleBrowserState)
}

export function useTheme() {
	return useRecoilValue(themeState)
}
