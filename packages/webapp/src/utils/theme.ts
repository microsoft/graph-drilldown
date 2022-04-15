/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * List the theme color options,
 * compatible with the getNamedColor function.
 * Note that we don't really want all the options
 * on the scheme, just a selection of obvious ones.
 */
export function listThematicColors() {
	const nominals = new Array(10).fill('nominal').map((a, i) => `${a}[${i}]`)
	return [
		'faintAnnotation',
		'lowContrastAnnotation',
		'midContrastAnnotation',
		'highContrastAnnotation',
		...nominals,
	]
}
