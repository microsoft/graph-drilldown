/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { useEffect, useMemo, useState } from 'react'
import { withRouter } from 'react-router-dom'

/**
 * Essentially replicates a react-router Switch,
 * but uses a state cache to lazily render components,
 * and hide them if they aren't matched.
 * This allows us to avoid the heavy cost of remounting
 * expensive components as the user navigates the app.
 * Warnings:
 *  1. This will probably result in heavier memory usage
 *  2. It only supports Route, not Redirect, and must use Route.component prop
 *  3. It only supports exact matches
 */
export const LazyCachingSwitch = withRouter(({ location, children }) => {
	const [cache, setCache] = useState<any>({})

	// first iteration ensures we've rendered the matched component, and updates the cache as necessary
	useEffect(() => {
		const updated = { ...cache }
		let isDirty = false
		// first route match wins, mimicking behavior from Switch
		let foundFirst = false
		React.Children.forEach(children, child => {
			if (!foundFirst && React.isValidElement(child)) {
				const { path } = child.props
				const matched = location.pathname.match(`^${path}$`)
				if (matched) {
					foundFirst = true
					let instance = updated[path]
					if (!instance) {
						instance = <child.props.component />
						updated[path] = instance
						isDirty = true
					}
				}
			}
		})
		if (isDirty) {
			setCache(updated)
		}
	}, [cache, setCache, location, children])

	// second iteration creates a set of rendered components from the cache, hidden if not matched
	const rendered = useMemo(() => {
		return React.Children.map(children, child => {
			if (React.isValidElement(child)) {
				const { path } = child.props
				const matched = location.pathname.match(`^${path}$`)
				const style: React.CSSProperties = {}
				if (!matched) {
					style.display = 'none'
				}
				const instance = cache[path]
				return (
					<div style={style} key={path}>
						{instance}
					</div>
				)
			}
			return null
		})
	}, [cache, location, children])

	return <>{rendered}</>
})
