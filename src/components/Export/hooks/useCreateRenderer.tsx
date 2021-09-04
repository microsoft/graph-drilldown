/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphViewer } from '../../GraphViewer'
import { GraphRenderer } from '@graspologic/renderer'
import { ThematicProvider, useThematic } from '@thematic/react'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil'
import { useDynamicCameraBounds } from '~/hooks/graph'
import { useInternedGraph } from '~/state/caches'

/**
 * Creates a detached renderer when instructed, which we can use to generate images.
 * @param create Indicates if the renderer should be created/recreated.
 * This is a UI-blocking process, so best to wait until user has requested export.
 * @param onRenderer Callback that fires with the renderer instance when ready.
 */
export function useCreateRenderer(
	create: boolean,
	onRendererReady: (renderer: GraphRenderer) => void,
) {
	const theme = useThematic()
	const data = useInternedGraph()
	const cameraBounds = useDynamicCameraBounds()

	const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()

	useEffect(() => {
		const domNode = document.createElement('div')
		if (create) {
			ReactDOM.render(
				<RecoilBridge>
					<ThematicProvider theme={theme}>
						<GraphViewer
							data={data}
							cameraBounds={cameraBounds}
							onRendererInitialized={onRendererReady}
						/>
					</ThematicProvider>
				</RecoilBridge>,
				domNode,
			)
		}
		return () => {
			// trash the node on unmount to prevent memory leaks
			ReactDOM.unmountComponentAtNode(domNode)
			domNode.parentNode?.removeChild(domNode)
		}
	}, [create, theme, data, cameraBounds, onRendererReady, RecoilBridge])
}
