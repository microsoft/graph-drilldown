/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { atom, useRecoilValue } from 'recoil'

import {
	getCommunitiesFile,
	getDataset,
	getEdgesFile,
	getFormat,
	getJoinFile,
	getNodesFile,
} from '../utils/query'

// TODO: we may want this to be an env variable for dedicated deployments
const datasetState = atom<string | undefined>({
	key: 'dataset',
	default: getDataset(),
})

const formatState = atom<string | undefined>({
	key: 'format',
	default: getFormat(),
})

// these files allow loading of pre-baked files from the url
// note that only one per type is allowed, to form a "complete"
// preset dataset. TODO: no reason we couldn't support multiples
// and join the resulting tables of each type
// if we did that, we may want to unify this with the filesState
const nodesFileState = atom<string | undefined>({
	key: 'nodes-file',
	default: getNodesFile(),
})

const edgesFileState = atom<string | undefined>({
	key: 'edges-file',
	default: getEdgesFile(),
})

const joinFileState = atom<string | undefined>({
	key: 'join-file',
	default: getJoinFile(),
})

const communitiesFileState = atom<string | undefined>({
	key: 'communities-file',
	default: getCommunitiesFile(),
})

export function useDataset() {
	return useRecoilValue(datasetState)
}

export function useFormat() {
	return useRecoilValue(formatState)
}

export function useNodesFile() {
	return useRecoilValue(nodesFileState)
}

export function useEdgesFile() {
	return useRecoilValue(edgesFileState)
}

export function useJoinFile() {
	return useRecoilValue(joinFileState)
}

export function useCommunitiesFile() {
	return useRecoilValue(communitiesFileState)
}
