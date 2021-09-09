/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LazyCachingSwitch } from './LazyCachingSwitch'
import { CommandBar } from './commands'
import { usePresetData, useTestFiles, useUrlFiles } from './hooks'
import { GraphViewerPage, DataManagerPage } from './pages'
import { useMemo } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import CookieBanner from 'react-cookie-banner'
import styled from 'styled-components'

export const App: React.FC = () => {
	useData()
	return (
		<HashRouter>
			<Container>
				<CommandBar />
				<Main>
					<LazyCachingSwitch>
						<Route path="/" component={GraphViewerPage} />
						<Route path="/files" component={DataManagerPage} />
					</LazyCachingSwitch>
					<GdprBanner />
					<Footer />
				</Main>
			</Container>
		</HashRouter>
	)
}

const GdprBanner: React.FC = () => (
	<Container>
		<CookieBanner
			message="GitHub uses cookies for authentication and marketing purposes. This application does not drop additional cookies."
			cookie="user-has-accepted-cookies"
			dismissOnScroll={false}
			dismissOnClick={true}
			styles={{
				banner: { backgroundColor: 'rgba(60, 60, 60, 0.8)', zIndex: 3 },
				message: { fontWeight: 400 },
			}}
		/>
	</Container>
)

function useData() {
	const presets = usePresetData()
	const params = useUrlFiles()
	const merged = useMemo(() => {
		// files on the url override preset baked-in,
		// allowing on-the-fly customization
		return {
			...presets,
			...params,
		}
	}, [presets, params])
	useTestFiles(merged)
}

const Container = styled.div``

const Main = styled.div``

const Footer = () => {
	return (
		<FooterEl>
			<a href="https://go.microsoft.com/fwlink/?LinkId=521839">
				Privacy &amp; Cookies
			</a>
		</FooterEl>
	)
}

const FooterEl = styled.footer`
	height: 20px;
	font-size: 12px;
	display: flex;
	flex-direction: row;
	justify-content: center;
`
