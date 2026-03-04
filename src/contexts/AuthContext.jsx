import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  role: null,
  sessionTimeout: null,
  lastActivity: Date.now()
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.user.role,
        sessionTimeout: action.payload.sessionTimeout,
        lastActivity: Date.now()
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        sessionTimeout: null,
        lastActivity: Date.now()
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        sessionTimeout: null,
        lastActivity: Date.now()
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: Date.now()
      }
    case 'SESSION_EXPIRED':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        sessionTimeout: null,
        lastActivity: Date.now()
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser)

          // Fetch latest hybrid permissions from backend
          try {
            const { data } = await authAPI.getCurrentUser();
            if (data.hybridPermissions && data.hybridPermissions.hasAccess) {
              user.hybrid = true;
              user.hybridPermissions = data.hybridPermissions;
              localStorage.setItem('user', JSON.stringify(user));
            }
          } catch (e) {
            console.error('Failed to fetch hybrid permissions', e);
            if (e.response?.status === 401) {
              throw e; // Let the outer catch handle 401
            }
          }
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user,
              token
            }
          })
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          dispatch({ type: 'LOGIN_FAILURE' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initAuth()

    const handleAuthExpired = () => {
      logout(true)
    }

    window.addEventListener('auth-expired', handleAuthExpired)
    return () => window.removeEventListener('auth-expired', handleAuthExpired)
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const { data } = await authAPI.login(credentials)

      const { user, token } = data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      })
      toast.success('Login successful!')
      return { success: true, user }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      const message = error.response?.data?.message || error.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = (silent = false) => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    if (!silent) {
      toast.success('Logged out successfully', { id: 'logout-toast' })
    }
  }

  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    })
  }

  const value = {
    ...state,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
