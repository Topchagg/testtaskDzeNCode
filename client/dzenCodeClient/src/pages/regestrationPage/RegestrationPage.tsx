import RegestrationForm from '../../forms/RegestrationForm'

import './ui/regestrationPage.css'


const RegestrationPage = () => {
    return (
        <div className='content-wrapper'>
            <div className="title-wrapper">
                <div className="title l-margin">Reg/Enter</div>
            </div>
            <div className="l-margin reg-form-wrapper el-center">
                <RegestrationForm/>
            </div>
        </div>
    )
}

export default RegestrationPage