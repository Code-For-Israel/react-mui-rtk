import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequests } from '../api'
import { User } from '../api/dtos'
import { RequestStatus } from '../common/types'
import { config } from '../config'
import { storageUtil } from '../utils'
import { loginAsync } from './auth-slice'
import { RootState } from './store'

export interface UserState {
  user?: User
  error?: string
  registerError?: string
  status: RequestStatus
}

const initialState: UserState = {
  user: (storageUtil.get<User>(config.storage.USER_KEY) as User) ?? undefined,
  status: RequestStatus.Idle,
}

export const getUserAsync = createAsyncThunk('user/getUser', async (): Promise<User> => {
  // The value we return becomes the `fulfilled` action payload
  const response = await apiRequests.getMyUser()
  storageUtil.set(config.storage.USER_KEY, response)
  return response
})

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (
    {
      email,
      name,
      password,
      verifyPassword,
    }: {
      email: string
      name: string
      password: string
      verifyPassword: string
    },
    { dispatch, rejectWithValue },
  ) => {
    const response = await apiRequests.register({ email, name, password, verifyPassword })
    if (response) {
      dispatch(loginAsync({ email: email, password: password }))
    }
  },
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // getUserAsync
      .addCase(getUserAsync.pending, state => {
        state.status = RequestStatus.Loading
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.status = RequestStatus.Idle
        state.user = action.payload
      })
      .addCase(getUserAsync.rejected, (state, action) => {
        state.error = action.error.message
        state.status = RequestStatus.Failed
      })
      .addCase(registerAsync.pending, (state, action) => {
        state.status = RequestStatus.Loading
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.registerError = action.error.message
        state.status = RequestStatus.Failed
      })
  },
})

export const selectUserState = (state: RootState) => state.user
export const userReducer = userSlice.reducer
