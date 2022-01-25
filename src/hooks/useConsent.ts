/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'

declare const WcpConsent: any

export interface ConsentOptions {
	/**
	 * Default: 'dark'
	 */
	theme?: string
	/**
	 * default: 'cookie-consent'
	 */
	elementId?: string

	onChange?: (c: Consent) => void
}

export interface Consent {
	Required: boolean
	Advertising: boolean
	Analytics: boolean
	SocialMedia: boolean
}
const DEFAULT_CONSENT: Consent = {
	Required: true,
	Advertising: false,
	Analytics: false,
	SocialMedia: false,
}
const NOOP = () => {
	/*nothing */
}
interface ConsentUtil {
	manageConsent: () => void
	getConsent: () => Consent
}

export function useConsent({
	theme = 'dark',
	elementId = 'cookie-banner',
	onChange = NOOP,
}: ConsentOptions = {}): [Consent, () => void] {
	const [consent, setConsent] = useState<Consent>(DEFAULT_CONSENT)
	const [consentUtil, setConsentUtil] = useState<ConsentUtil>({
		getConsent: () => DEFAULT_CONSENT,
		manageConsent: NOOP,
	})

	useEffect(() => {
		try {
			const element = document.getElementById(elementId)
			if (!element) {
				throw new Error(`Could not find element with id ${elementId}`)
			}
			WcpConsent.init(
				navigator.language,
				element,
				function initializeConsentManagement(err, consentUtil) {
					if (err) {
						console.error('error initalizing WcpConsent', err)
					} else {
						setConsentUtil(consentUtil)
					}
				},
				function onConsentChanged(consent: Consent) {
					console.log('change', consent)
					setConsent(consent)
					onChange(consent)
				},
				theme,
			)
		} catch (err) {
			console.error('error initalizing consent', err)
		}
	}, [setConsentUtil])

	const manageConsent = useCallback(
		() => consentUtil.manageConsent(),
		[consentUtil],
	)

	return [consent, manageConsent]
}
