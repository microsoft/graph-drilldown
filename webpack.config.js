/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/webpack-config')
require('dotenv').config()

const base = configure({
	pnp: true,
	environment: env => {
		return {
			AUTOLAYOUT_URL: process.env.AUTOLAYOUT_URL,
		}
	},
})

const lineupRules = [
	{
		test: /\.svg(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		loader: 'url-loader',
		options: {
			limit: 10000, //inline <= 10kb
			mimetype: 'image/svg+xml',
		},
	},
	{
		test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		loader: 'file-loader',
	},
]

base.module.rules = [...base.module.rules, ...lineupRules]

const aliasFields = base.resolve.aliasFields || []
base.resolve = {
	...base.resolve,

	// mjolnir.js relies on this functionality
	// it has a "browser" package.json property that it uses to define which
	// scripts to load
	aliasFields: [...aliasFields, 'browser'],
	fallback: {
		stream: false,
	},
}

module.exports = base
