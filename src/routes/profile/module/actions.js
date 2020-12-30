export const UPDATE_LOCALE = 'profile/UPDATE_LOCALE'

export const updateLocale = locale => ({
  type: UPDATE_LOCALE,
  payload: {
    locale
  }
})
