/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

declare var WcpConsent: any

export interface ConsentOptions {
	/**
	 * Default: 'dark'
	 */
	theme?: string
	/**
	 * default: 'cookie-consent'
	 */
	elementId?: string
	onConsent?: (consent: Consent) => void
}

export interface Consent {
	Required: boolean
	Advertising: boolean
	Analytics: boolean
	SocialMedia: boolean
}

let currentConsent: Consent = {
	Required: true,
	Advertising: false,
	Analytics: false,
	SocialMedia: false,
}
const NOOP = () => {
	/*nothing*/
}

export function showCookieConsent({
	theme = 'dark',
	elementId = 'consent-banner',
	onConsent = NOOP,
}: ConsentOptions = {}): void {
	const element = document.getElementById(elementId)
	if (!element) {
		throw new Error(`Could not find element with id ${elementId}`)
	}
	WcpConsent.init(
		navigator.language,
		element,
		function init(err, consent) {
			if (err) {
				console.error('error initalizing WcpConsent', err)
			} else {
				currentConsent = consent
				onConsent(consent)
			}
		},
		function onChange(consent) {
			currentConsent = consent
			onConsent(consent)
		},
		theme,
	)
}

export function getConsent(): Consent {
	return currentConsent
}
