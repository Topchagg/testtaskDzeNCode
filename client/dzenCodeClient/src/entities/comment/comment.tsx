import { useState } from 'react'
import { FC } from 'react'

import './ui/comment.css'


const Comment:FC<{isAnswer?:boolean}> = (props) => {

    const [isShowAnswers,setIsShowAnswers] = useState(false)

    const wrapperStyle = props.isAnswer ? "answer-wrapper": "comment-wrapper"

    return (
        <div className={wrapperStyle}>
            <div className="user-nav-bar">
                <div className="avatar-wrapper"></div>
                <div className="name-wrapper">Zack Mednov</div>
            </div>
            <div className="text-section">
                <div className="text-wrapper s-margin">
                Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum
                Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum
                </div>
            </div>
            <div className="make-answer-btn xs-margin btn">
                Відповісти
            </div>
            {isShowAnswers && <div><Comment isAnswer/><Comment isAnswer/><Comment isAnswer/><Comment isAnswer/><Comment isAnswer/><Comment isAnswer/></div> }
            {!props.isAnswer && 
            <div className="show-asnwers-btn-wrapper s-margin" onClick={() => setIsShowAnswers(!isShowAnswers)}>
                Показати відповіді (6 шт)
            </div>}
        </div>
    )
}

export default Comment