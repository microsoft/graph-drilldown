/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphContainer } from '@graspologic/graph'
import { LayoutWorkerManager } from '@graspologic/layout-core'
import { from, table } from 'arquero'
import { ArqueroNode, normalizeXY } from '~/arquero'

function getFa2Worker() {
	//eslint-disable-next-line
	return require('worker-loader!@graspologic/layout-fa2/dist/fa2_worker').default()
}

// this gets the nodes + edges ready for the graspologic layout worker
function prepGraph(edgeTable: table, nodeTable?: table) {
	// edgeTable should just be source + target cols, plus optional weight
	// derive a weight if needed, and then extract individual nodes
	const edges: any = []
	const source = edgeTable.getter('edge.source')
	const target = edgeTable.getter('edge.target')
	const weight = edgeTable.getter('edge.weight')
	edgeTable.scan(row =>
		edges.push({
			source: source(row),
			target: target(row),
			weight: weight(row),
		}),
	)

	const nTable =
		nodeTable ||
		edgeTable
			.fold(['edge.source', 'edge.target'])
			.dedupe('value')
			.select({ value: 'node.id' })

	const nodes: any = []
	const id = nTable.getter('node.id')
	nTable.scan(row =>
		nodes.push({
			id: id(row),
			x: 0,
			y: 0,
		}),
	)

	const graph = GraphContainer.intern({
		nodes,
		edges,
	})
	console.log(edges)

	const count = edges.reduce(
		(acc: any, cur: any) => (acc + cur.weight === 1 ? 1 : 0),
		0,
	)
	console.log('1 weight edge count', count, edges.length, count / edges.length)

	return graph
}

// once we have layout complete, extract it from the graph container and move back to a table
function postProcessLayout(graph: GraphContainer) {
	const nodes: ArqueroNode[] = []
	graph.nodes.scan(n => {
		nodes.push({
			'node.id': n.id!,
			'node.x': n.x,
			'node.y': n.y,
		})
	})

	const table = from(nodes)
	return normalizeXY(table)
}

/**
 * Executes ForceAtlas2 layout on an edge list,
 * returning a table of nodes with x/y columns.
 * @param edges
 * @param nodes - optional, will be derived from edge list if necessary
 * @param options - addl layout worker options
 */
export async function layoutFa2(edges: table, nodes?: table, options?: any) {
	console.time('layout-fa2')

	const graph = prepGraph(edges, nodes)

	const layoutManager = new LayoutWorkerManager(getFa2Worker)

	const opts = {
		scalingRatio: 1000,
		slowDown: 100.8,
		targetIterations: 200,
		edgeWeightInfluence: 1.1,
		...options,
	}
	layoutManager.configure(opts)

	await layoutManager.layout(graph)

	const result = postProcessLayout(graph)

	console.timeEnd('layout-fa2')

	return result
}
