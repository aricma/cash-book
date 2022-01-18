export enum GlobalStateType {
    DEFAULT = "GLOBAL_STATE_TYPE/DEFAULT",
    LOADING = "GLOBAL_STATE_TYPE/LOADING",
}

export interface GlobalState {
    type: GlobalStateType
}

export const initialState: GlobalState = {
    type: GlobalStateType.DEFAULT,
}
