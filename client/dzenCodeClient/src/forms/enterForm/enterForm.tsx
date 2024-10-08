import { useEffect } from "react"
import { 
    useCreateForm, 
    ReactiveForm, 
    InputField, 
    fieldSettings, 
    setGlobalObject, 
    useActionOnSubmit, 
    formIsValid, 
    getFormValues 
} from "reactive-fast-form" // Это моя библиотека - больше описаний в файле forms/CommentForm/CommentForm.ts

import usePost from "../../shared/customHooks/usePost"
import { useJwtStore, useDataStore } from "../../zustand/zustand"
import LoadingItem from "../../shared/ui/loadingItem/loadingitem"

const EnterForm = () => {
    const setJwt = useJwtStore((state: any) => state.setJwt)

    const [form, setForm, trigger] = useCreateForm(["username", "password"])

    const settings: fieldSettings = {
        validClass: "input valid",
        invalidClass: "input invalid",
        dynamicStyles: true
    }

    const { isOk, data, loading, error, postData } = usePost('http://127.0.0.1:8000/api/token/')

    const handleSubmit = (body: object) => {
        postData(body)
    }

    useActionOnSubmit(() => {
        if (formIsValid(form)) {
            handleSubmit(getFormValues(form)) 
        }
    }, trigger)

    useEffect(() => {
        if (isOk && data) {
            setJwt(data?.['access']) 
            localStorage.setItem("jwt",data?.['access'])
            localStorage.setItem("id",data?.['userId'])
        }
    }, [isOk, data, setJwt])

    return (
        <>  
            {loading && <LoadingItem />}  
            <ReactiveForm setFunc={setForm} setObject={form}>
                <div className="input-wrapper">
                    {!form.username.isValid && <div className="error-text"><strong>Логин некорректен</strong></div> }
                    <InputField 
                        name="username"
                        isTrigger
                        {...settings}
                        placeholder="Username"
                    />
                </div>
                <div className="input-wrapper xs-margin">
                    {!form.password.isValid && <div className="error-text"><strong>Пароль некорректен</strong></div> }
                    <InputField
                        name="password"
                        placeholder="Password"
                        {...settings}
                    />
                </div>
                <div className="default-btn s-margin" onClick={() => setGlobalObject(setForm)}>
                    Enter
                </div>
            </ReactiveForm>
        </>
    )
}

export default EnterForm
