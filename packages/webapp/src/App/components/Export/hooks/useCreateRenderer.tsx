/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphRenderer } from '@graspologic/renderer'
import { ThematicProvider, useThematic } from '@thematic/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil'

import { GraphViewer } from '~/components/GraphViewer'
import { useDynamicCameraBounds } from '~/hooks/graph'
import { useInternedGraph } from '~/state/caches'

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

	const domNode = useMemo(() => document.createElement('div'), [])
	const root = useMemo(() => createRoot(domNode), [domNode])

	useEffect(() => {
		if (create) {
			root.render(
				<RecoilBridge>
					<ThematicProvider theme={theme}>
						<GraphViewer
							data={data}
							cameraBounds={cameraBounds}
							onRendererInitialized={setRenderer}
						/>
					</ThematicProvider>
				</RecoilBridge>,
			)
		}
		return () => {
			// trash the node on unmount to prevent memory leaks
			root.unmount()
			domNode.parentNode?.removeChild(domNode)
		}
	}, [
		create,
		theme,
		data,
		cameraBounds,
		setRenderer,
		RecoilBridge,
		domNode,
		root,
	])

	return {
		renderer,
		doCreate,
	}
}
