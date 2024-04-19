import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../slices/todoslices"
export const store =configureStore({
    reducer: todoReducer
})