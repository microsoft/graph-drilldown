/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/webpack-config')
require('dotenv').config()

const base = configure({
	pnp: true,
	environment: () => ({ AUTOLAYOUT_URL: process.env.AUTOLAYOUT_URL || '' }),
})

// add mjs for arrow
base.module.rules = [
	...base.module.rules,
	{
		test: /\.m?js/,
		resolve: {
			fullySpecified: false,
		},
	},
]

const aliasFields = base.resolve.aliasFields || []
base.resolve = {
	...base.resolve,
	//.mjs required for apache-arrow
	extensions: ['.ts', '.mjs', '.js', '.tsx'],
	// mjolnir.js relies on this functionality
	// it has a "browser" package.json property that it uses to define which
	// scripts to load
	aliasFields: [...aliasFields, 'browser'],
	fallback: {
		stream: false,
	},
}

module.exports = base
