import { useEffect, useState } from 'react'

import { useSearchParams,Link } from 'react-router-dom'

import { useDataStore } from '../../zustand/zustand'

import CommentForm from '../../forms/commentForm/commentForm'
import Comment from '../../entities/comment/comment'
import useFetch from '../../shared/customHooks/useFetch'


import LoadingItem from '../../shared/ui/loadingItem/loadingitem'
import { CommentType } from '../../entities/comment/api/commentarType'

import './ui/commentariesPage.css'


const CommentariesPage = () => {

    const [params] = useSearchParams()

    const [isLoaded, setIsLoaded] = useState<boolean>(false)    

    const [page,setPage] = useState<string|null>(params.get("page"))
    const [data,setData] = useState<any|[]>()
    const [amountOfAddedMessages,setAmountOfAddedMessages] = useState<number>(0)

    const createdMessage = useDataStore((state) => state.createdMessage)

    const userID = useDataStore((state) => state.userID)

    const comments = useFetch("http://127.0.0.1:8000/message/?page=" + page)

    useEffect(() => {
        setData(JSON.parse(comments?.data))
        if (comments.data){
            setIsLoaded(true)
        }
    },[comments])

    useEffect(() => { // Локальное обновление данных без использования WS (Очевидно что работает только на созданные элементы клиентским юзером а не внешним)
        // Основная суть в том, что ну думаю нет комментариев которые были бы сделаны при помощи WS (За исключением комментов ТГ, но это именно мессенджер а не комменты)
        // Но во всех комментариев есть активное локальное удаление - добавление, я возвращаю абсолютно работающий элемент
        // добавляю его в первое место активного списка и удаляю последний список, при переходе на страницу сдвиг будет работать 
        // правильно в любом случае
        if(data){
            const newData = {...data}
            const results = data.results

            if (results.length + amountOfAddedMessages >= 25){ // Строго придерживаюсь ограничения на 25 объектов на страницу 
                results.pop() // Хотя мне кажется, что так строго этому не стоит придерживаться???
            }
            results.unshift(createdMessage)
            setAmountOfAddedMessages(amountOfAddedMessages + 1)
    
            newData.results = results
            setData(newData)
        }
    },[createdMessage])


    const IncrementPage = () => {
        if (page && data.next){
            const incrementedPage = Number.parseInt(page) + 1
            setPage(JSON.stringify(incrementedPage))
        }
    }

    const DecrimentPage = () => {
        if (page && data.previous){
            const intPage = Number.parseInt(page)
            if(intPage >= 0){
                setPage(JSON.stringify(intPage-1))
            }
        }
    }

    if(isLoaded && !comments.loading){
        return (
            <div className="content-wrapper">
                <div className="title s-margin">Commentaries</div>
                <div className="commentaries-wrapper s-margin">
                    {data?.results.map((item:CommentType,key:number) => (
                        <Comment {...item} key={key} localUserId={userID}/>
                    ))}
                    <div className="pagination-btns">
                        <Link to={"/main?page="+page}><span onClick={DecrimentPage} className='is-clickable'>{"<"}</span></Link>
                        <Link to={"/main?page="+page}><span onClick={IncrementPage} className='is-clickable'>{">"}</span></Link>
                    </div>
                </div>
                <div className="form-comment-wrapper s-margin">
                    <CommentForm/>
                </div>
            </div>
        )
    }else {
        <LoadingItem/>
    }
}

export default CommentariesPage