import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)

const translations = {
  en: {
    operations: 'Procurement operations',
    online: 'Online',
    offline: 'Low connectivity',
    retry: 'Retry connection',
    language: 'हिंदी',
    issueToken: '+ Issue Token',
    command: 'Command Center',
    register: 'Register',
    book: 'Book a Slot',
    queue: 'Token Queue',
    status: 'Payment Status',
  },

  hi: {
    operations: 'खरीद संचालन',
    online: 'ऑनलाइन',
    offline: 'कम कनेक्टिविटी',
    retry: 'कनेक्शन फिर से प्रयास करें',
    language: 'English',
    issueToken: '+ टोकन जारी करें',
    command: 'कमांड सेंटर',
    register: 'पंजीकरण',
    book: 'स्लॉट बुक करें',
    queue: 'टोकन कतार',
    status: 'भुगतान स्थिति',
  },
}

const defaultFarmer = {
  name: 'Ravi Kumar',
  phone: '9876543210',
  village: 'Sanganer',
  district: 'Jaipur',
  landSize: '12',
  crop: 'Wheat',
  quantity: '45',
  pin: '1234',
}

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('agriflow-language') || 'en'
  )

  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  const [user, setUser] = useState(() =>
    JSON.parse(
      localStorage.getItem('agriflow-user') ||
        localStorage.getItem('agriflow-farmer') ||
        'null'
    )
  )

  const [activeSlot, setActiveSlot] = useState(() =>
    JSON.parse(
      localStorage.getItem('agriflow-active-slot') ||
        localStorage.getItem('agriflow-booking') ||
        'null'
    )
  )

  const [activeToken, setActiveToken] = useState(() =>
    JSON.parse(localStorage.getItem('agriflow-active-token') || 'null')
  )

  const [produce, setProduce] = useState(() =>
    JSON.parse(localStorage.getItem('agriflow-produce') || 'null')
  )

  const [currentStep, setCurrentStep] = useState(() =>
    Number(localStorage.getItem('agriflow-current-step') || '2')
  )

  const [lastSync, setLastSync] = useState(new Date())

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true)
      setLastSync(new Date())
    }

    const goOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  const value = useMemo(
    () => ({
      language,

      setLanguage: (next) => {
        localStorage.setItem('agriflow-language', next)
        setLanguage(next)
      },

      t: (key) => translations[language][key] || translations.en[key] || key,

      isOnline,

      retryConnection: () => {
        setIsOnline(navigator.onLine)
        setLastSync(new Date())
      },

      lastSync,

      user,

      isAuthenticated: Boolean(user),

      activeSlot,

      activeToken,

      currentStep,

      farmer: user,

      booking: activeSlot,

      registerFarmer: (profile) => {
        localStorage.setItem('agriflow-user', JSON.stringify(profile))
        localStorage.setItem('agriflow-farmer', JSON.stringify(profile))

        localStorage.removeItem('agriflow-booking')
        localStorage.removeItem('agriflow-active-slot')
        localStorage.removeItem('agriflow-active-token')
        localStorage.removeItem('agriflow-produce')
        localStorage.removeItem('agriflow-payment-unlocked')

        setUser(profile)
        setActiveSlot(null)
        setActiveToken(null)
        setProduce(null)
      },

      signInFarmer: (profile) => {
        localStorage.setItem('agriflow-user', JSON.stringify(profile))
        localStorage.setItem('agriflow-farmer', JSON.stringify(profile))
        setUser(profile)
      },

      produce,

      saveProduce: (next) => {
        localStorage.setItem('agriflow-produce', JSON.stringify(next))
        setProduce(next)
      },

      saveBooking: (next) => {
        // Save booking for the farmer
        localStorage.setItem(
          'agriflow-booking',
          JSON.stringify(next)
        )

        localStorage.setItem(
          'agriflow-active-slot',
          JSON.stringify(next)
        )

        // Save the farmer's active token
        const token = {
          tokenNumber: next.tokenNumber,
          slot: next.timeSlot,
          createdAt: next.createdAt,
        }

        /*
         * Convert the farmer booking into the format
         * used by the admin Mandi scanner.
         */
        const mandiToken = {
          id: `#${next.tokenNumber}`,

          farmer: next.farmerName || user?.name || 'Farmer',

          phone: user?.phone || '',

          village: user?.village || '',

          crop: next.crop || 'Unknown Crop',

          cropCategory: next.crop || 'Other',

          quantity: `${next.quantity || 0} Qtl`,

          rawQuintals: Number(next.quantity) || 0,

          slot: next.timeSlot || '--',

          hourSlot: next.timeSlot || '--',

          status: 'Waiting',

          moisture: '--',

          grade: 'Pending Gate Entry',

          price: '--',

          txHash: '--',

          vehicle: next.vehicle || 'Not provided',

          createdAt: next.createdAt,
        }

        // Read existing admin tokens
        let existingTokens = []

        try {
          existingTokens = JSON.parse(
            localStorage.getItem('agriflow_mandi_tokens') || '[]'
          )
        } catch {
          existingTokens = []
        }

        // Add the new token without creating duplicates
        const updatedTokens = [
          mandiToken,
          ...existingTokens.filter(
            (item) => item.id !== mandiToken.id
          ),
        ]

        // Save the updated list for the admin scanner
        localStorage.setItem(
          'agriflow_mandi_tokens',
          JSON.stringify(updatedTokens)
        )

        // Finish saving the farmer booking
        localStorage.setItem(
          'agriflow-active-token',
          JSON.stringify(token)
        )

        setActiveSlot(next)
        setActiveToken(token)

        localStorage.setItem('agriflow-current-step', '3')
        setCurrentStep(3)
      },

      resetActiveBatch: () => {
        localStorage.removeItem('agriflow-booking')
        localStorage.removeItem('agriflow-active-slot')
        localStorage.removeItem('agriflow-active-token')
        localStorage.removeItem('agriflow-produce')
        localStorage.removeItem('agriflow-payment-unlocked')

        localStorage.setItem('agriflow-current-step', '2')

        setActiveSlot(null)
        setActiveToken(null)
        setProduce(null)
        setCurrentStep(2)
      },

      paymentUnlocked: Boolean(activeToken),

      unlockPayment: () => {},

      demoFarmer: defaultFarmer,
    }),
    [
      activeSlot,
      activeToken,
      currentStep,
      isOnline,
      language,
      lastSync,
      produce,
      user,
    ]
  )

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// The hook is colocated with the provider so local-first state stays in one module.

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext)
}