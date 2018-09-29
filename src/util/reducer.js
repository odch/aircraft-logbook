export const createReducer = (initialState, actionHandlers) => {
  return (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    if (handler) {
      return handler(state, action)
    }
    return state
  }
}
