'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function StoreProvider({ children }) {
    const storeRef = useRef(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <Provider store={storeRef.current.store}>
            <PersistGate loading={null} persistor={storeRef.current.persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}