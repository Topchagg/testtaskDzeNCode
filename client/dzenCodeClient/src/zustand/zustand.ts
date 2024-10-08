import { create } from "zustand";

import { CommentType } from "../entities/comment/api/commentarType";

interface createdAnswers  {
    id:number[],
    [x:string]: {}
}

interface useDataStore {
    createdAnswers:createdAnswers,
    answerTo:number|false,
    username:string|false,
    isLocalDeleted:boolean,
    isAnswer:boolean,
    isChanged:boolean,
    localDeletedMessages:any,
    deletedMessages: number[],
    setIsAnswer: (newAnswerTo:string,newUserName:string) => void,
    setNullAnswer: () => void,
    setIsChanged: () => void,
    setCreatedAnswers: (commet:CommentType) => void,
    setDeletedMessages: (id:number) => void,
    removeCreatedAnswer: (id:number) => void,
    setLocalDeletedMessages: (deletedAnswer:CommentType) => void,
}

const useJwtStore =  create((set) => ({
    jwt:null,
    setJwt: (newJwt:string) => set({jwt:newJwt})
}))

const useDataStore = create<useDataStore>((set) => ({
    createdAnswers: { id: [] }, // Для ответов 
    deletedMessages: [], // Для сообщений. Это можно было бы объединить, но количество спредов увеличивается,
    answerTo: false,
    username: false,
    isAnswer: false,
    isLocalDeleted:false,
    isChanged: false,
    localDeletedMessages: {},

    setLocalDeletedMessages: (answerTo:number) => set((state) => {
        const objectToSave = {...state.localDeletedMessages}

        if(!objectToSave[answerTo]){
            objectToSave[answerTo] = 1;
        }else {
            objectToSave[answerTo] = objectToSave[answerTo] + 1
        }

        return {localDeletedMessages:objectToSave}
        
    }),
    setIsLocalDeleted: () => set((state) => ({isLocalDeleted:!state.isLocalDeleted})),
    setDeletedMessages: (id) => set((state) => ({ deletedMessages: [...state.deletedMessages, id] })),
    setIsChanged: () => set((state) => ({ isChanged: !state.isChanged })),
    setIsAnswer: (newAnswerTo: string, newUserName?: string) => 
        set({ answerTo: newAnswerTo, username: newUserName, isAnswer: true }),

    setNullAnswer: () => set({ answerTo: false, username: false, isAnswer: false }),

    setCreatedAnswers: (newAnswer: CommentType | null) => 
        set((state) => {
            const objectToSave = { ...state.createdAnswers }; 
            
            if (!objectToSave[newAnswer.answerTo]) {
                objectToSave[newAnswer.answerTo] = [];
            }

            objectToSave[newAnswer.answerTo].push(newAnswer);
            objectToSave.id.push(newAnswer.id);

            return { createdAnswers: objectToSave }; 
        }),

    // Новая функция для удаления комментария по ID
    removeCreatedAnswer: (id: number) => 
        set((state) => {
            const updatedCreatedAnswers = { ...state.createdAnswers }; // Копируем текущие ответы

            // Проходим по всем ключам (answerTo) объекта createdAnswers
            Object.keys(updatedCreatedAnswers).forEach((answerTo) => {
                // Фильтруем комментарии, исключая те, у которых совпадает id
                updatedCreatedAnswers[answerTo] = updatedCreatedAnswers[answerTo].filter(
                    (comment: CommentType) => comment.id !== id
                );
            });

            // Также удаляем ID из массива id
            const updatedIds = state.createdAnswers.id.filter((existingId) => existingId !== id);

            // Возвращаем обновленное состояние
            return { createdAnswers: { ...updatedCreatedAnswers, id: updatedIds } };
        }),
}));

export {useJwtStore}
export {useDataStore}