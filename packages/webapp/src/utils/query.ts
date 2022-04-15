/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { parse } from 'query-string'

export function getQuery() {
	// TODO: react-router hash router messes up the standard location.search
	// this just hacks a quick extracton in
	const search = window.location.href.split('?')[1]
	return parse(search, {
		parseBooleans: true,
		parseNumbers: true,
	})
}

export function getString(name, defaultValue = ''): string {
	const query = getQuery()
	return (query[name] as string) || defaultValue
}

export function getBoolean(name, defaultValue = false): boolean {
	const query = getQuery()
	return (query[name] as boolean) || defaultValue
}

export function getNumber(name, defaultValue = 0): number {
	const query = getQuery()
	return (query[name] as number) || defaultValue
}

export function getDataset(): string {
	return getString('dataset')
}

export function getFormat() {
	return getString('format', 'csv')
}

export function getNodesFile() {
	console.log('nodes file', getString('nodes'))
	console.log(getQuery())
	return getString('nodes')
}

export function getEdgesFile() {
	return getString('edges')
}

export function getJoinFile() {
	return getString('join')
}

export function getCommunitiesFile() {
	return getString('communities')
}

/**
 * Takes an input object with keys and values,
 * where the key is the param and the value is the default.
 * Look for all of these properties on the query, returning the
 * default for each if not specified.
 * @param input
 */
export function parseParams(input): any {
	const query = getQuery()
	return Object.entries(input).reduce((acc, cur) => {
		const [key, value] = cur
		const param = query[key]
		// explicit undefined check, for falsey stuff
		if (param === undefined) {
			acc[key] = value
		} else {
			acc[key] = param
		}
		return acc
	}, {} as any)
}
