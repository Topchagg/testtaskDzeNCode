

type CommentType = {
    id:string,
    isAnswer:boolean,
    owner:{email:string,username:string,pk:number},
    text:string,
    file?:string,
    answerTo?:number,
    hasAnswers:boolean,
    localUserId:number|false|null
}

export type {CommentType}