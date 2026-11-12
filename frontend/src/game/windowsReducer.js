/**
 * Lógica pura del sistema de ventanas (sin React ni DOM).
 * Cada ventana: { appId, minimized, z, slot }
 *  - z: orden de apilamiento (la visible con mayor z es la activa)
 *  - slot: posición en cascada, para que no se tapen del todo entre sí
 */

export const initialWindowsState = { windows: [], nextZ: 1 }

export function getActiveAppId(windows) {
  const visible = windows.filter((w) => !w.minimized)
  if (visible.length === 0) return null
  return visible.reduce((top, w) => (w.z > top.z ? w : top)).appId
}

function firstFreeSlot(windows) {
  const used = new Set(windows.map((w) => w.slot))
  let slot = 0
  while (used.has(slot)) slot += 1
  return slot
}

function bringToFront(state, appId) {
  if (!state.windows.some((w) => w.appId === appId)) return state
  if (getActiveAppId(state.windows) === appId) return state
  return {
    windows: state.windows.map((w) =>
      w.appId === appId ? { ...w, minimized: false, z: state.nextZ } : w,
    ),
    nextZ: state.nextZ + 1,
  }
}

export function windowsReducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      if (state.windows.some((w) => w.appId === action.appId)) {
        return bringToFront(state, action.appId)
      }
      return {
        windows: [
          ...state.windows,
          {
            appId: action.appId,
            minimized: false,
            z: state.nextZ,
            slot: firstFreeSlot(state.windows),
          },
        ],
        nextZ: state.nextZ + 1,
      }
    }

    case 'CLOSE':
      return {
        ...state,
        windows: state.windows.filter((w) => w.appId !== action.appId),
      }

    case 'MINIMIZE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.appId === action.appId ? { ...w, minimized: true } : w,
        ),
      }

    case 'MINIMIZE_ALL':
      return {
        ...state,
        windows: state.windows.map((w) => ({ ...w, minimized: true })),
      }

    case 'FOCUS':
      return bringToFront(state, action.appId)

    // Botón de la barra de tareas: minimizada -> restaura; activa -> minimiza;
    // visible pero tapada -> la trae al frente.
    case 'TOGGLE_FROM_TASKBAR': {
      const target = state.windows.find((w) => w.appId === action.appId)
      if (!target) return state
      if (getActiveAppId(state.windows) === action.appId) {
        return windowsReducer(state, { type: 'MINIMIZE', appId: action.appId })
      }
      return bringToFront(state, action.appId)
    }

    default:
      return state
  }
}
