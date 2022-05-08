import {createSlice} from "@reduxjs/toolkit";
import CONSTANTS from 'config/constants';

const initialState = {
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    currentEditItemId: null,
    urlsToMonitor: [],
    hideAllVideoPlayer: false
}

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setAddDialogOpen: (state, action) => {
            const {payload} = action;
            const {addDialogOpen} = payload;
            state.isAddDialogOpen = addDialogOpen;
        },
        setEditDialogOpen: (state, action) => {
            const {payload} = action;
            const {editDialogOpen} = payload;
            state.isEditDialogOpen = editDialogOpen;
        },
        setCurrentEditItemId: (state, action) => {
            const {payload} = action;
            const {editItemId} = payload;
            state.currentEditItemId = editItemId;
        },
        setUrlsToMonitor: (state, action) => {
            const {payload} = action;
            const {urlsToMonitor} = payload;
            state.urlsToMonitor = urlsToMonitor;
        },
        addUrlToMonitor: (state, action) => {
            const {payload} = action;
            const {url} = payload
            state.urlsToMonitor.push(url)
        },
        delUrlToMonitor: (state, action) => {
            const {payload} = action;
            const {itemId} = payload
            state.urlsToMonitor = state.urlsToMonitor.filter(item => item.itemId !== itemId);
        },
        setHideAllVideoPlayer: (state, action) => {
            const {payload} = action;
            const {hideAllVideoPlayer} = payload;
            state.hideAllVideoPlayer = hideAllVideoPlayer;
        }
    }
})

export const {
    setAddDialogOpen,
    setEditDialogOpen,
    setCurrentEditItemId,
    setUrlsToMonitor,
    addUrlToMonitor,
    delUrlToMonitor,
    setHideAllVideoPlayer
} = configSlice.actions;

export default configSlice.reducer;