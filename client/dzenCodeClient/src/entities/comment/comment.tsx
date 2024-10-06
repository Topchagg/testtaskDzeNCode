    import { useEffect, useState, useCallback } from 'react'
    import { FC } from 'react'
    import { AnimatePresence,motion } from 'framer-motion'


    import { CommentType } from './api/commentarType'

    import { useDataStore } from '../../zustand/zustand'

    import LoadingItem from '../../shared/ui/loadingItem/loadingitem'

    import './ui/comment.css'


    const Comment: FC<CommentType> = (props) => {

        const [answers, setAnswers] = useState<CommentType[] | null>(null)
        const [loadedAnswers, setLoadedAnswers] = useState<CommentType[]>([])
        const [page, setPage] = useState<number>(1)
        const [isLoading, setIsLoading] = useState(false)
        const [allLoaded, setAllLoaded] = useState(false)
        const [showAnswers, setShowAnswers] = useState(false)
        const [createdLocalAnswer,setCreatedLocalAnswer] = useState<boolean>(false)
        
        const setIsAnswer = useDataStore((state: any) => state.setIsAnswer)
        const createdAnswers = useDataStore((state: any) => state.createdAnswers)


        const handleOnMakeAnswer = useCallback(() => {
            const answerTo = props.isAnswer ? props.answerTo : props.id
            setIsAnswer(answerTo, props.owner.username)
        }, [props.isAnswer, props.answerTo, props.id, props.owner.username, setIsAnswer])

        const handleLoadAnswers = useCallback(async () => {
            if (allLoaded) {
                setShowAnswers((prev) => !prev)
                return
            }

            if (createdLocalAnswer && !props.hasAnswers){
                setAllLoaded(true)
                setShowAnswers(false)
                return
            }

            setIsLoading(true)
            const response = await fetch(`http://127.0.0.1:8000/answers?page=${page}&messageID=${props.id}`)
            const data = await response.json()

            setLoadedAnswers((prevAnswers) => [...prevAnswers, ...data.results])

            if (data.next) {
                setPage((prevPage) => prevPage + 1)
            } else {
                setAllLoaded(true)
            }

            setShowAnswers(true)
            setIsLoading(false)
        }, [allLoaded, page, props.id])

        const wrapperStyle = props.isAnswer ? "answer-wrapper" : "comment-wrapper"

        useEffect(() => {
            if (createdAnswers[props.id]) {
                setAnswers(createdAnswers[props.id])
                if(!props.hasAnswers){
                    setCreatedLocalAnswer(true)
                }
                setShowAnswers(true)
            }
        }, [createdAnswers, props.id])

        return (
            <div className={wrapperStyle}>
                {props.localUserId === Number.parseInt(props.owner.pk) && <div className='is-clickable'>Delete</div> }
                {isLoading && <LoadingItem />}
                <div className="user-nav-bar">
                    <div className="avatar-wrapper"></div>
                    <div className="user-data">
                        <div>{props.owner?.username}</div>
                        <div className='xs-margin'>{props.owner?.email}</div>
                    </div>
                    
                </div>
                <div className="text-section semi-border">
                    <div className="text-wrapper s-margin">
                        {props.text}
                    </div>
                </div>
                <div className="comment-btns btn is-clickable">
                    <div className='default-btn semi-border make-answer-btn' onClick={handleOnMakeAnswer}>Відповісти</div>
                    {props.file && <>Подивитись вложене</>}
                    
                </div>



                {/* Загруженные ответы с сервера */}
                <AnimatePresence>
                    {showAnswers && loadedAnswers.map((item: CommentType) => (
                        <motion.div
                        initial={{opacity:0,height:0}}
                        animate={{opacity:1,height:"auto",overflow:"hidden"}}
                        exit={{height:0,overflow:"hidden",filter:'blur(5px)'}}
                        transition={{duration:0.75}}
                        ><Comment key={item.id} {...item} /></motion.div>
                    ))}
                </AnimatePresence>
                {/* Локальные ответы */}
                <AnimatePresence>
                    {showAnswers && answers?.map((item) => (
                        <motion.div
                        initial={{opacity:0,height:0}}
                        animate={{opacity:1,height:"auto",overflow:"hidden"}}
                        exit={{height:0,opacity:0,overflow:"hidden"}}
                        transition={{duration:0.75}}
                        ><Comment key={item.id} {...item} /></motion.div>
                    ))}
                </AnimatePresence>

                {(!props.isAnswer || createdAnswers) && (
                    <div className="show-asnwers-btn-wrapper s-margin">
                        {!allLoaded && props.hasAnswers && !isLoading && (
                            <div className="default-btn s-margin" onClick={handleLoadAnswers}>
                                Загрузити відповіді
                            </div>
                        )}

                        {showAnswers && (
                            <div className="default-btn s-margin" onClick={() => setShowAnswers(false)}>
                                Закрити коментарі
                            </div>
                        )}

                        {!showAnswers && (allLoaded || createdLocalAnswer) && (
                            <div className="default-btn s-margin" onClick={() => setShowAnswers(true)}>
                                Показати коментарі
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    export default Comment
