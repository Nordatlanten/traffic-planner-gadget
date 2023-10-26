import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type InitialState = {
  value: TestState
}

type TestState = {
  test: string
}

const initialState = {
  value: {
    test: ""
  } as TestState
} as InitialState

export const test = createSlice({
  name: 'test',
  initialState,
  reducers: {
    writeTest: (_state, action: PayloadAction<string>) => {
      return {
        value: {
          test: action.payload
        }
      }
    }
  }
})

export const { writeTest } = test.actions
export default test.reducer
