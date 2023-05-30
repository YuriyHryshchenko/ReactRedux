import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

// const initialState = {
// 	filters: [],
// 	filtersLoadingStatus: 'idle',
// 	activeFilter: 'all'
// }

const filtersAdapter = createEntityAdapter({
	selectId: (filter) => filter.name
});

const initialState = filtersAdapter.getInitialState({
	filtersLoadingStatus: 'idle',
	activeFilter: 'all'
});
console.log(initialState)

export const filtersFetched = createAsyncThunk(
	'filters/filtersFetched',
	() => {
		const {request} = useHttp();
		return request("http://localhost:3001/filters");
	}
);

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		filtersChanged: (state, action) => {
			state.activeFilter = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(filtersFetched.pending, state => {state.filtersLoadingStatus = 'loading'})
				 .addCase(filtersFetched.fulfilled, (state, action) => {
					state.filtersLoadingStatus = 'idle';
					filtersAdapter.setAll(state, action.payload);
				})
				.addCase(filtersFetched.rejected, state => {state.filtersLoadingStatus = 'error'})
				.addDefaultCase(() => {});
	}
});

const {actions, reducer} = filtersSlice;

export default reducer;

export const {selectAll} = filtersAdapter.getSelectors((state) => state.filters);

export const {
	filtersChanged
} = actions;