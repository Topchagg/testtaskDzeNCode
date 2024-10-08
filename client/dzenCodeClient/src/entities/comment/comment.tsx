import { useState, useCallback, useEffect } from 'react';
import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { CommentType } from './api/commentarType';
import { useDataStore, useJwtStore } from '../../zustand/zustand';
import useDelete from '../../shared/customHooks/useDelete';
import { deleteFile } from '../../firebase/firebaseScripts';

import safeAdd from '../../shared/Functions/saveAdd';

import './ui/comment.css';


const Comment: FC<CommentType> = (props) => {
    const [page, setPage] = useState<number>(1); // Страница для подгрузки ответов
    const userID = Number(localStorage.getItem('id')); // Преобразование ID к числу
    const [data, setData] = useState<any>([]); // Храним данные о текущей странице и ссылке next для пагинации
    const [allLoaded, setAllLoaded] = useState<boolean>(false); // Здесь очень много флаг-стейтов, их можно уменьшить, но время у меня закончилось :( 
    const [showAnswers, setShowAnswers] = useState<boolean>(false); // Отвечает за показ комментариев и кнопок открытия-закрытия
    const [isHasAnswers, setIsHasAnswers] = useState<boolean>(false); 
    const [isAbleToLoad, setIsAbleToLoad] = useState<boolean>(false);
    const [amountOfRealAnswers,setAmountOfRealAnswers] = useState<number>(0)
    
    
    const jwt = useJwtStore((state: any) => state.jwt);

    const localDeletedMessages = useDataStore((state:any) => state.localDeletedMessages)
    const setLocalDeletedMessages = useDataStore((state:any) => state.setLocalDeletedMessages)
    const createdAnswers = useDataStore((state: any) => state.createdAnswers);
    const setIsAnswer = useDataStore((state: any) => state.setIsAnswer); // Сохраняем ответ, к кому и к какому комментарию идет ответ
    const setDeletedMessages = useDataStore((state:any) => state.setDeletedMessages)
    const deletedMessages = useDataStore((state) => state.deletedMessages)
    const removeCreatedAnswer = useDataStore((state) => state.removeCreatedAnswer)

    const { deleteItem, loading, error, success } = useDelete('http://127.0.0.1:8000/message/'); // Кастомный хук для удаления

    // Загрузка ответов на комментарии
    const handleOnLoadAnswers = async () => {
        if (!allLoaded) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/answers?page=${page}&messageID=${props.id}`, {
                    method: 'GET',
                });
                
                const result = await response.json();
                
                if (result.next) {
                    setPage((prev) => prev + 1);
                } else {
                    setAllLoaded(true);
                    setIsAbleToLoad(false); 
                }

                const existingIds = new Set([
                    ...data.map(comment => comment.id), 
                    ...(createdAnswers[props.id] || []).map(answer => answer.id)  // Получаю только уникальные айдишник, чтоб не было дубликации
                ]); 

                const uniqueResults = result.results.filter(comment => !existingIds.has(comment.id));

                setData(prevData => [...prevData, ...uniqueResults]);

                setIsHasAnswers(true);
                setShowAnswers(true);
            } catch (error) {
                console.error('Error loading answers:', error);
            }
        }
    };

    useEffect(() => {
        if (createdAnswers[props.id]) {
            setShowAnswers(true);
            setIsHasAnswers(true);
        }
    }, [createdAnswers]);

    useEffect(() => {
        if (props.hasAnswers) {
            setIsAbleToLoad(true);
        }
    }, [props.hasAnswers]);

    useEffect(() => {
        setAmountOfRealAnswers(safeAdd(createdAnswers[props.id]?.length,
            data?.length,
            deletedMessages?.length * (-1),
            localDeletedMessages[props.id]))
    },[data,createdAnswers,deletedMessages,localDeletedMessages])

    useEffect(() => {
        if(success){
            setDeletedMessages(props.id)
            removeCreatedAnswer(Number.parseInt(props.id))
            if(props.isLocal){
                setLocalDeletedMessages(props.answerTo)
            }
            if(props.file){
                deleteFile(props.file)
            } // Удаление файла с облачного хранилища 
        }
    },[success])

    // Обработка нажатия на "Ответить"
    const handleOnMakeAnswer = useCallback(() => {
        const answerTo = props.isAnswer ? props.answerTo : props.id; // Если это ответ на другой ответ, берем родительский комментарий
        setIsAnswer(answerTo, props.owner.username); // Сохраняем данные о том, кому отвечаем
    }, [props.isAnswer, props.answerTo, props.id, props.owner.username, setIsAnswer]);

    const wrapperStyle = props.isAnswer ? 'answer-wrapper' : 'comment-wrapper'; // Определяю стили обертки
    if(deletedMessages.find((item,index) => item === Number.parseInt(props.id))){
        return 
    }else {
        return (
            <div className={wrapperStyle}>
                {/* Удаление доступно только владельцу комментария */}
                {userID === props.owner.pk && (
                    <div className="is-clickable" onClick={() => deleteItem(props.id, jwt)}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </div>
                )}
    
                <div className="user-nav-bar">
                    <div className="avatar-wrapper"></div>
                    <div className="user-data">
                        <div>{props.owner?.username}</div>
                        <div className="xs-margin">{props.owner?.email}</div>
                    </div>
                </div>
    
                <div className="text-section semi-border">
                    <div className="text-wrapper s-margin">{props.text}</div>
                </div>
    
                <div className="comment-btns btn is-clickable">
                    <div className="default-btn semi-border make-answer-btn" onClick={handleOnMakeAnswer}>
                        Відповісти
                    </div>
                    {props.file && <Link to={props.file}><div>Подивитись вложене</div></Link>}
                </div>
    
                
                
                <AnimatePresence>
                    {data && showAnswers && data.map((item: CommentType) => (
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
                        exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                        transition={{ duration: 0.75 }}
                        >
                            <Comment {...item} key={item.id} />
                        </motion.div>
                    ))}
    
                    {createdAnswers[props.id] && showAnswers && createdAnswers[props.id].map((item: CommentType, key: number) => (
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
                        exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                        transition={{ duration: 0.75 }}>
                            <Comment {...item} key={key} />
                        </motion.div>
                    ))}
                </AnimatePresence>
    
                {props.hasAnswers && isAbleToLoad && !(amountOfRealAnswers > props.amountOfAnswers) &&
                <div className='default-btn s-margin' onClick={handleOnLoadAnswers}>
                    Загрузити коментарі
                </div>}
                {Boolean(amountOfRealAnswers) && <>
                    {isHasAnswers && !props.isAnswer && showAnswers && 
                    <div className='default-btn s-margin' onClick={() => setShowAnswers(!showAnswers)}>
                        Закрити коментарі
                    </div>}
                    {!showAnswers && !isAbleToLoad && !props.isAnswer && isHasAnswers &&
                    <div className='default-btn s-margin' onClick={() => setShowAnswers(!showAnswers)}>
                        Відкрити коментарі
                </div>}
                </>}
    
                {error && <div className="error-message">Ошибка при удалении: {error}</div>}
            </div>
        );
    }
};

export default Comment;
