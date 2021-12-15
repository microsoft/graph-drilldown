/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import { useEffect } from 'react'
import { fetchUrl } from '~/api'
import { useSetArqueroBigTable, useSetArqueroEdgeTable } from '~/arquero'
import {
	initializeEdgeTable,
	initializeJoinTable,
	initializeNodeTable,
	joinDataTables,
	joinNodeCommunityTables,
} from '~/arquero/table'
import { useSetFiles } from '~/state'
import { DataFile } from '~/types'

export interface FileBundle {
	nodes?: DataFile | undefined
	join?: DataFile | undefined
	communities?: DataFile | undefined
	edges?: DataFile | undefined
}

/**
 * Loads a set of pre-defined test files, either specified on the URL
 * or as a preset bundle.
 */
export function useTestFiles(bundle: FileBundle) {
	const setNodes = useSetArqueroBigTable()
	const setEdges = useSetArqueroEdgeTable()
	const setFiles = useSetFiles()

	useEffect(() => {
		const f = async () => {
			console.time('load')
			const nodesFile = bundle.nodes
			const joinFile = bundle.join
			const communitiesFile = bundle.communities
			const edgesFile = bundle.edges

			const files: FileBundle = {}

			let [nodesTable, joinTable, communitiesTable, edgesTable] =
				await Promise.all([
					nodesFile?.url && fetchUrl(nodesFile.url),
					joinFile?.url && fetchUrl(joinFile.url),
					communitiesFile?.url && fetchUrl(communitiesFile.url),
					edgesFile?.url && fetchUrl(edgesFile.url),
				])

			let nodes
			let edges

			// TODO: this is basically just recreating the logic in useArqueroAddTable hook
			// however, we have to do all the joins and set the tables at once because we won't get another render loop
			// note that the order of nodes -> join -> communities -> edges is *required* to layer properly
			if (nodesTable && nodesFile) {
				console.log('loading nodes file from url', nodesFile.url)
				console.time('nodes')
				nodes = initializeNodeTable(nodesTable)
				files.nodes = {
					...nodesFile,
					table: nodesTable,
					rows: nodesTable.numRows(),
				}
				console.timeEnd('nodes')
			}
			if (joinFile && joinTable) {
				console.log('loading join file from url', joinFile.url)
				console.time('join')
				const join = initializeJoinTable(joinTable)
				files.join = {
					...joinFile,
					table: joinTable,
					rows: join.numRows(),
				}
				if (nodesFile) {
					nodes = joinNodeCommunityTables(nodes, join)
				}
				console.timeEnd('join')
			}
			if (communitiesFile && communitiesTable) {
				console.log('loading communities file from url', communitiesFile.url)
				console.time('communities')
				files.communities = {
					...communitiesFile,
					table: communitiesTable,
					rows: communitiesTable.numRows(),
				}
				if (nodesFile && joinFile) {
					nodes = joinDataTables(nodes, communitiesTable, 'community')
				}
				console.timeEnd('communities')
			}
			if (edgesFile && edgesTable) {
				console.log('loading edges file from url', edgesFile.url)
				console.time('edges')
				edges = initializeEdgeTable(edgesTable)
				files.edges = {
					...edgesFile,
					table: edgesTable,
					rows: edgesTable.numRows(),
				}

				if (!nodesFile) {
					nodes = initializeNodeTable(edgesTable, true)
				}
				console.timeEnd('edges')
			}

			if (nodes) {
				console.log('nodes bigtable')
				nodes.print()
				setNodes(nodes)
			}
			if (edges) {
				console.log('edges')
				edges.print()
				setEdges(edges)
			}
			console.timeEnd('load')
			setFiles(Object.values(files))
		}
		f()
	}, [bundle, setNodes, setEdges, setFiles])
}
