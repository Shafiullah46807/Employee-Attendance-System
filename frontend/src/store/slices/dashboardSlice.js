import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api/dashboard'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

const initialState = {
  employeeData: null,
  managerData: null,
  loading: false,
  error: null,
}

export const getEmployeeDashboard = createAsyncThunk(
  'dashboard/getEmployeeDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/employee`, getAuthHeaders())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load dashboard')
    }
  }
)

export const getManagerDashboard = createAsyncThunk(
  'dashboard/getManagerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/manager`, getAuthHeaders())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load dashboard')
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeDashboard.pending, (state) => {
        state.loading = true
      })
      .addCase(getEmployeeDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.employeeData = action.payload
      })
      .addCase(getEmployeeDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getManagerDashboard.pending, (state) => {
        state.loading = true
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.managerData = action.payload
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer

