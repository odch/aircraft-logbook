let initPromise

export const initFirebase = store => {
  initPromise = Promise.all([
    import('react-redux-firebase'),
    import('redux-firestore'),
    import('@firebase/app'),
    import('@firebase/auth'),
    import('@firebase/firestore'),
    window.Cypress && import('@firebase/functions')
  ]).then(([reactReduxFirebase, reduxFirestore, firebase]) => {
    firebase.default.initializeApp(__CONF__)

    firebase.default.firestore().settings({ timestampsInSnapshots: true })

    const reactReduxFirebaseConfig = {
      userProfile: 'users',
      useFirestoreForProfile: true
    }

    store.injectEnhancer(
      reactReduxFirebase.reactReduxFirebase(
        firebase.default,
        reactReduxFirebaseConfig
      )
    )
    store.injectEnhancer(reduxFirestore.reduxFirestore(firebase.default))

    store.injectReducer('firebase', reactReduxFirebase.firebaseReducer)
    store.injectReducer('firestore', reduxFirestore.firestoreReducer)

    if (window.Cypress) {
      window.firebase = firebase.default
    }

    return store
  })
  return initPromise
}

export const getFirebase = () => initPromise.then(store => store.firebase)

export const getFirestore = () => initPromise.then(store => store.firestore)
