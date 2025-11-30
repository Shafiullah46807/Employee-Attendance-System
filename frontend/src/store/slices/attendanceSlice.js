import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api/attendance'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

const initialState = {
  todayStatus: null,
  history: [],
  summary: null,
  allAttendance: [],
  loading: false,
  error: null,
}

// Async thunks
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/checkin`, {}, getAuthHeaders())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed')
    }
  }
)

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/checkout`, {}, getAuthHeaders())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-out failed')
    }
  }
)

export const getTodayStatus = createAsyncThunk(
  'attendance/getTodayStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/today`, getAuthHeaders())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get today status')
    }
  }
)

export const getMyHistory = createAsyncThunk(
  'attendance/getMyHistory',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const params = month && year ? { month, year } : {}
      const response = await axios.get(`${API_URL}/my-history`, {
        ...getAuthHeaders(),
        params
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get history')
    }
  }
)

export const getMySummary = createAsyncThunk(
  'attendance/getMySummary',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const params = month && year ? { month, year } : {}
      const response = await axios.get(`${API_URL}/my-summary`, {
        ...getAuthHeaders(),
        params
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get summary')
    }
  }
)

export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/all`, {
        ...getAuthHeaders(),
        params: filters
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get attendance')
    }
  }
)

export const getTodayStatusAll = createAsyncThunk(
  'attendance/getTodayStatusAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/today-status`, getAuthHeaders())
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get today status')
    }
  }
)

export const exportAttendance = createAsyncThunk(
  'attendance/exportAttendance',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/export`, {
        ...getAuthHeaders(),
        params: filters,
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `attendance-${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      return { message: 'Export successful' }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Export failed')
    }
  }
)

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.loading = true
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false
        state.todayStatus = action.payload.attendance
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(checkOut.pending, (state) => {
        state.loading = true
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false
        state.todayStatus = action.payload.attendance
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.history = action.payload
      })
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.summary = action.payload
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.allAttendance = action.payload
      })
      .addCase(getTodayStatusAll.fulfilled, (state, action) => {
        state.todayStatus = action.payload
      })
  },
})

export const { clearError } = attendanceSlice.actions
export default attendanceSlice.reducer

