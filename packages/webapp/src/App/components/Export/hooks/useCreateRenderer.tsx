/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphRenderer } from '@graspologic/renderer'
import { ThematicProvider, useThematic } from '@thematic/react'
import { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil'

import { useDynamicCameraBounds } from '~/hooks/graph'
import { useInternedGraph } from '~/state/caches'

import { GraphViewer } from '../../../../components/GraphViewer'

/**
 * Creates a detached renderer when instructed, which we can use to generate images.
 * @param create Indicates if the renderer should be created/recreated.
 * This is a UI-blocking process, so best to wait until user has requested export.
 * @param onRenderer Callback that fires with the renderer instance when ready.
 */
export function useCreateRenderer() {
	const [renderer, setRenderer] = useState<GraphRenderer>()
	const [create, setCreate] = useState<boolean>(false)
	const theme = useThematic()
	const data = useInternedGraph()
	const cameraBounds = useDynamicCameraBounds()

	const doCreate = useCallback(() => setCreate(true), [setCreate])

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
							onRendererInitialized={setRenderer}
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
	}, [create, theme, data, cameraBounds, setRenderer, RecoilBridge])

	return {
		renderer,
		doCreate,
	}
}
