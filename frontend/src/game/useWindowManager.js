import { useMemo, useReducer } from 'react'
import {
  getActiveAppId,
  initialWindowsState,
  windowsReducer,
} from './windowsReducer.js'

export function useWindowManager() {
  const [state, dispatch] = useReducer(windowsReducer, initialWindowsState)

  const activeAppId = useMemo(() => getActiveAppId(state.windows), [state.windows])

  const actions = useMemo(
    () => ({
      openApp: (appId) => dispatch({ type: 'OPEN', appId }),
      closeApp: (appId) => dispatch({ type: 'CLOSE', appId }),
      minimizeApp: (appId) => dispatch({ type: 'MINIMIZE', appId }),
      focusApp: (appId) => dispatch({ type: 'FOCUS', appId }),
      toggleFromTaskbar: (appId) => dispatch({ type: 'TOGGLE_FROM_TASKBAR', appId }),
      showDesktop: () => dispatch({ type: 'MINIMIZE_ALL' }),
    }),
    [],
  )

  return { windows: state.windows, activeAppId, ...actions }
}
