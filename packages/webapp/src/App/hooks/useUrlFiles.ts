/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FileOrigin } from '@graph-drilldown/types'
import { useMemo } from 'react'

import {
	useCommunitiesFile,
	useEdgesFile,
	useJoinFile,
	useNodesFile,
} from '~/state'

import type { FileBundle } from './useTestFiles'

/**
 * This loads test data files as specified on the url.
 * This is very ad-hoc - it is supposed to be akin to
 * dropping the named files on the corresponding FileDrop wells.
 * It's possible this would work with data hosted elsewhere if CORS
 * is setup properly, but otherwise they are expected to be available under
 * the public folder.
 */
export function useUrlFiles(): FileBundle {
	const nodesFile = useNodesFile()
	const joinFile = useJoinFile()
	const communitiesFile = useCommunitiesFile()
	const edgesFile = useEdgesFile()
	return useMemo(() => {
		const bundle: FileBundle = {}
		if (nodesFile) {
			bundle.nodes = {
				origin: FileOrigin.Remote,
				url: nodesFile,
				tableType: 'node',
			}
		}
		if (joinFile) {
			bundle.join = {
				origin: FileOrigin.Remote,
				url: joinFile,
				tableType: 'join',
			}
		}
		if (communitiesFile) {
			bundle.communities = {
				origin: FileOrigin.Remote,
				url: communitiesFile,
				tableType: 'community',
			}
		}
		if (edgesFile) {
			bundle.edges = {
				origin: FileOrigin.Remote,
				url: edgesFile,
				tableType: 'edge',
			}
		}
		return bundle
	}, [nodesFile, joinFile, communitiesFile, edgesFile])
}
