/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import styled from 'styled-components'

export const Footer: FC = memo(() => {
	return (
		<FooterEl>
			<Link href={constants.privacyUrl}>Privacy and Cookies</Link>
			{' | '}
			<Link href={constants.termsOfUseUrl}>Terms of Use</Link>
			{' | '}
			<Link href={constants.trademarksUrl}>Trademarks</Link>
			{' | '}
			<Link>{constants.copyright}</Link>
		</FooterEl>
	)
})

const Link: FC<{
	href?: string
	className?: string
	style?: React.CSSProperties
}> = memo(function Link({ className, children, href, style }) {
	return href == null ? (
		<div style={style} className={className}>
			{children}
		</div>
	) : (
		<a
			target="_blank"
			rel="noreferrer"
			href={href}
			style={style}
			className={className}
		>
			{children}
		</a>
	)
})

const FooterEl = styled.footer`
	width: 500px;
	height: 20px;
	font-size: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
	align-content: center;
	justify-content: space-between;	
`

const constants = {
	privacyUrl: 'https://go.microsoft.com/fwlink/?LinkId=521839',
	termsOfUseUrl: 'https://go.microsoft.com/fwlink/?LinkID=206977',
	trademarksUrl: 'https://www.microsoft.com/trademarks',
	copyright: `©️ ${new Date().getFullYear()} Microsoft`,
}
