// 'use client'
// import { TiptapCollabProvider } from '@hocuspocus/provider'
// // import 'iframe-resizer/js/iframeResizer.contentWindow'
// import { useSearchParams } from 'next/navigation'
// import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
// import { Doc as YDoc } from 'yjs'

// import { BlockEditor } from '@/components/workspace/editor/BlockEditor'
// import { createPortal } from 'react-dom'
// import { Surface } from '@/components/workspace/editor/ui/Surface'
// import { Toolbar } from '@/components/workspace/editor/ui/Toolbar'
// import { Icon } from '@/components/workspace/editor/ui/Icon'

// const useDarkmode = () => {
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(
//     typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
//   )

//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
//     const handleChange = () => setIsDarkMode(mediaQuery.matches)
//     mediaQuery.addEventListener('change', handleChange)
//     return () => mediaQuery.removeEventListener('change', handleChange)
//   }, [])

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', isDarkMode)
//   }, [isDarkMode])

//   const toggleDarkMode = useCallback(() => setIsDarkMode(isDark => !isDark), [])
//   const lightMode = useCallback(() => setIsDarkMode(false), [])
//   const darkMode = useCallback(() => setIsDarkMode(true), [])

//   return {
//     isDarkMode,
//     toggleDarkMode,
//     lightMode,
//     darkMode,
//   }
// }

// export default function Document({ params }: { params: { room: string } }) {
//   const { isDarkMode, darkMode, lightMode } = useDarkmode()
//   const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
//   const [collabToken, setCollabToken] = useState<string | null | undefined>()
//   const searchParams = useSearchParams()

//   const hasCollab = parseInt(searchParams?.get('noCollab') as string) !== 1 && collabToken !== null

//   const { room } = params

//   useEffect(() => {
//     // fetch data
//     const dataFetch = async () => {
//       try {
//         const response = await fetch('/api/collaboration', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })

//         if (!response.ok) {
//           throw new Error('No collaboration token provided, please set TIPTAP_COLLAB_SECRET in your environment')
//         }
//         const data = await response.json()
//         console.log(data)

//         const { token } = data
//         setCollabToken(token)
//       } catch (e) {
//         if (e instanceof Error) {
//           console.error(e.message)
//         }
//         setCollabToken(null)
//         return
//       }
//     }

//     dataFetch()
//   }, [])

//   const ydoc = useMemo(() => new YDoc(), [])

//   useLayoutEffect(() => {
//     if (hasCollab && collabToken) {
//       setProvider(
//         new TiptapCollabProvider({
//           name: `${process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX}${room}`,
//           appId: process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID ?? '',
//           token: collabToken,
//           document: ydoc,
//         }),
//       )
//     }
//   }, [setProvider, collabToken, ydoc, room, hasCollab])

//   if ((hasCollab && !provider) || collabToken === undefined) return

//   const DarkModeSwitcher = createPortal(
//     <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
//       <Toolbar.Button onClick={lightMode} active={!isDarkMode}>
//         <Icon name="Sun" />
//       </Toolbar.Button>
//       <Toolbar.Button onClick={darkMode} active={isDarkMode}>
//         <Icon name="Moon" />
//       </Toolbar.Button>
//     </Surface>,
//     document.body,
//   )

//   return (
//     <>
//       {DarkModeSwitcher}
//       <BlockEditor hasCollab={hasCollab} ydoc={ydoc} provider={provider} />
//     </>
//   )
// }
