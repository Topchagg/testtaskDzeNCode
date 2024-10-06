import { create } from "zustand";

import { CommentType } from "../entities/comment/api/commentarType";

interface createdAnswers  {
    [x:string]: CommentType[]
}

interface useDataStore {
    createdAnswers:createdAnswers,
    answerTo:number|false,
    createdMessage:CommentType|null,
    username:string|false,
    isAnswer:boolean,
    isUpdated:boolean,
    userID:false|number,
    setIsAnswer: (newAnswerTo:string,newUserName:string) => void,
    setNullAnswer: () => void,
    // setIsUpdated: (state:useDataStore) => void,
    setCreatedAnswers: (newAnswer:CommentType) => void,
    setCreatedMessage: (newAnswer:CommentType) => void,
    setUserID: (userID:string) => void,
}

const useJwtStore =  create((set) => ({
    jwt:null,
    setJwt: (newJwt:string) => set({jwt:newJwt})
}))

const useDataStore = create<useDataStore>((set) => ({
    createdAnswers:{}, // Для ответов 
    createdMessage:null,// Для сообщений. Это можно было бы объеденить, но кол-во спредов увеличивается
    answerTo: false,
    username: false,
    isAnswer:false,
    isUpdated:false,

    userID:false,

    setUserID: (userID) => set({userID:userID}),

    setIsAnswer: (newAnswerTo:string, newUserName?:string) => 
        set({ answerTo: newAnswerTo, username: newUserName,isAnswer:true }),

    setNullAnswer: () => set({answerTo:false,username:false,isAnswer:false}),

    setCreatedAnswers: (newAnswer: CommentType) => 
        set((state) => {
            const objectToSave = { ...state.createdAnswers }; 
            
            if (!objectToSave[newAnswer.answerTo]) {
                objectToSave[newAnswer.answerTo] = [];
            }

            objectToSave[newAnswer.answerTo].push(newAnswer);
            return { createdAnswers: objectToSave }; 
        }),

    setCreatedMessage: (newMessage: CommentType) => set({createdMessage:newMessage})
}));


export {useJwtStore}
export {useDataStore}