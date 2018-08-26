const title = (state = 'default title', action) => {
  switch (action.type) {
    case 'SET_TITLE':
      return action.payload.text
    default:
      return state
  }
}

export default title
