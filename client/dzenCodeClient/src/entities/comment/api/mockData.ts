import { CommentType } from "./commentarType";

type CommentMockData = {
    "isAnswers": CommentType[],
    "isComments": CommentType[]
}


const listOfAnswers:CommentType[] = [
    {
        "isAnswer":true,
        "text":"Some new text",
        "username":"Sophia Mednova",
        "file":"smt"
    },
    {
        "isAnswer":true,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":true,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":true,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":true,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":true,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":true,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
]

const listOfComments:CommentType[] = [
    {
        "isAnswer":false,
        "text":"Some new text",
        "username":"Sophia Mednova",
        "file":"smt"
    },
    {
        "isAnswer":false,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":false,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":false,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":false,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":false,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
    {
        "isAnswer":false,
        "text":"Some new text",
        "username":"Sophia Mednova"
    },
]

const CommentsMockData:CommentMockData = {
    isAnswers:listOfAnswers,
    isComments:listOfComments
}


export default CommentsMockData