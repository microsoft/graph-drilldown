/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMicrosoftConsentBanner } from '@essex/hooks'
import type { FC, ReactNode } from 'react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { useTheme } from '~/state'

export const Footer: FC<{
	children?: ReactNode
}> = memo(function Footer() {
	const theme = useTheme()
	const CONSENT_CONF = {
		theme: theme.variant,
		elementId: 'cookie-banner',
		onChange: (c: any) => console.log('CHANGED', c),
	}

	const [, manageConsent] = useMicrosoftConsentBanner(CONSENT_CONF)
	const style = useMemo(
		() => ({
			color: theme.application().midContrast().hex(),
			cursor: 'pointer',
			textDecoration: 'none !important',
		}),
		[theme],
	)
	return (
		<FooterEl>
			<Container>
				<Link href={constants.privacyUrl} style={style}>
					Privacy
				</Link>
				{' | '}
				<Link href={constants.consumerHealthUrl} style={style}>
					Consumer Health Privacy
				</Link>
				{' | '}
				<Link id={'managecookies'} onClick={manageConsent} style={style}>
					Cookies
				</Link>
				{' | '}
				<Link href={constants.termsOfUseUrl} style={style}>
					Terms of Use
				</Link>
				{' | '}
				<Link href={constants.trademarksUrl} style={style}>
					Trademarks
				</Link>
				{' | '}
				<Link href={constants.microsoft} style={style}>
					{constants.copyright}
				</Link>
				{' | '}
				<Link href={constants.github} style={style}>
					GitHub
				</Link>
			</Container>
		</FooterEl>
	)
})

const Link: FC<{
	href?: string
	id?: string
	className?: string
	style?: React.CSSProperties
	onClick?: () => void
	children?: ReactNode
}> = memo(function Link({ id, className, children, href, style, onClick }) {
	return href == null ? (
		<LinkDiv style={style} className={className} id={id} onClick={onClick}>
			{children}
		</LinkDiv>
	) : (
		<LinkA
			target='_blank'
			rel='noreferrer'
			href={href}
			style={style}
			className={className}
			id={id}
		>
			{children}
		</LinkA>
	)
})

const FooterEl = styled.footer`
	width: 100%;
`

const Container = styled.div`
	width: 600px;
	height: 20px;
	font-size: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
	align-content: center;
	justify-content: space-between;
	margin: auto;
`

export const constants = {
	privacyUrl: 'https://go.microsoft.com/fwlink/?LinkId=521839',
	consumerHealthUrl: 'https://go.microsoft.com/fwlink/?LinkId=2259814',
	termsOfUseUrl: 'https://go.microsoft.com/fwlink/?LinkID=206977',
	trademarksUrl: 'https://www.microsoft.com/trademarks',
	microsoft: 'https://www.microsoft.com',
	copyright: `©️ ${new Date().getFullYear()} Microsoft`,
	github: 'https://github.com/microsoft/graph-drilldown',
}

const LinkDiv = styled.div`
	cursor: pointer;
`
const LinkA = styled.a`
	cursor: pointer;
	text-decoration: none !important;
`
