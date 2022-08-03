//actions
export enum actionTypes{
    UPDATE_JSON,SET_ERROR,UPDATE_HIDE_OBJECT_INDEX,CHANGE_INPUT_FORMAT
}

export interface stateInterface{
    json:object;
    error:string;
    hideObjectIndex:number[];
    inputFormat:string
}
export interface updateJson{
    type:actionTypes.UPDATE_JSON;
    payload:object;
}
export interface updateError{
    type:actionTypes.SET_ERROR;
    payload:string;
}
export interface updateHideObjectIndex{
    type:actionTypes.UPDATE_HIDE_OBJECT_INDEX;
    payload:number[];
}
export interface changeInputFormat{
    type:actionTypes.CHANGE_INPUT_FORMAT,
    payload:string
}


//initial state
export const initialState:stateInterface={
    json:{},
    error:"",
    hideObjectIndex:[],
    inputFormat:"json"
}

//action generator
export const handleUpdateJson=(json:object):updateJson=>({
    type:actionTypes.UPDATE_JSON,
    payload:json
})
export const handleError=(error:string):updateError=>({
    type:actionTypes.SET_ERROR,
    payload:error
})
export const handleHideObjectIndex=(index:number[]):updateHideObjectIndex=>({
    type:actionTypes.UPDATE_HIDE_OBJECT_INDEX,
    payload:index
})
export const changeInputFormat=(inputFormat:string):changeInputFormat=>({type:actionTypes.CHANGE_INPUT_FORMAT,payload:inputFormat})

//reducer function
export const updateJsonReducer=(state:stateInterface=initialState,action:updateError|updateJson|updateHideObjectIndex|changeInputFormat)=>{
    if(action.type===actionTypes.UPDATE_JSON){
        return {...state,json:action.payload}
    }else if(action.type===actionTypes.SET_ERROR){
        return{...state,error:action.payload}
    }else if(action.type===actionTypes.UPDATE_HIDE_OBJECT_INDEX){
        return {...state,hideObjectIndex:[...action.payload]}
    }else if(action.type===actionTypes.CHANGE_INPUT_FORMAT){
        return{...state,inputFormat:action.payload}
    }
}