let initPromise

export const initFirebase = store => {
  initPromise = Promise.all([
    import('react-redux-firebase'),
    import('redux-firestore'),
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
    import('firebase/functions'),
    window.Cypress && import('firebase/functions')
  ]).then(([reactReduxFirebase, reduxFirestore, firebase]) => {
    firebase.default.initializeApp(__CONF__.firebase)

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

export const callFunction = async (name, args) => {
  const firebase = await getFirebase()
  const fn = firebase.functions().httpsCallable(name)
  return fn(args)
}
