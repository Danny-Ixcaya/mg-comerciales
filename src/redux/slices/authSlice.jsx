import { createSlice } from '@reduxjs/toolkit'

const userAuthFromLocalStorage = () => {
  const isAuth = localStorage.getItem('isAuth')
  // const userRole = localStorage.getItem('userRole'); // Obtén userRole del almacenamiento local

  if (isAuth && JSON.parse(isAuth) === true) {
    return true
    // return{
    //   isAuth: true,
    //   userRole: userRole || 'admin' // Establece un valor predeterminado en caso de que no haya userRole
    // }
  }

  return false
  // return {
  //   isAuth: false,
  //   userRole: 'user', // Valor predeterminado para usuarios no autenticados
  // };
}

const initialState = {
  isAuth: userAuthFromLocalStorage(),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state) => {
      state.isAuth = true
    },
    unauthenticateUser: (state) => {
      state.isAuth = false
    },
  },
})

export const { authenticateUser, unauthenticateUser } = authSlice.actions

export default authSlice.reducer