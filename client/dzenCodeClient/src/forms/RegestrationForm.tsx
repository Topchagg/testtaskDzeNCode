import { useCreateForm,ReactiveForm,InputField,fieldSettings, setGlobalObject,useActionOnSubmit,formIsValid } from "reactive-fast-form";

import {isEmail} from "validator"

import './ui/regestrationForm.css'

const RegestrationForm = () => {

    const [form,setForm,trigger] = useCreateForm(["email","login","password"])

    const settings:fieldSettings = {
        validClass:"input valid",
        invalidClass:"input invalid",
        dynamicStyles:true
    }

    useActionOnSubmit(() => {
        if(formIsValid(form)){
            alert("smt")
        }
    },trigger)

    return (
        <>
            <ReactiveForm setFunc={setForm} setObject={form}>
                <div className="input-wrapper">
                    {!form.login.isValid && <div className="error-text"><strong>Логин некорректен</strong></div> }
                    <InputField 
                    name="login"
                    isTrigger
                    {...settings}
                    placeholder="Login"
                    />
                </div>
                <div className="input-wrapper xs-margin">
                    {!form.login.isValid && <div className="error-text"><strong>Почта некорректна</strong></div> }
                <InputField
                    name={"email"}
                    validFunc={isEmail}
                    {...settings}
                    placeholder="Email"
                    />
                </div>
                <div className="input-wrapper xs-margin">
                    {!form.password.isValid && <div className="error-text"><strong>Пароль некорректен</strong></div> }
                    <InputField
                    name="password"
                    placeholder="password"
                    {...settings}
                    />
                </div>
                <div className="default-btn s-margin" onClick={() => setGlobalObject(setForm)}>Regestration</div>
                <div className="default-btn s-margin" onClick={() => setGlobalObject(setForm)}>Enter</div>
            </ReactiveForm>
        </> 
    )
}

export default RegestrationForm