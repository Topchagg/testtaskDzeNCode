import { useEffect } from "react"

import { useCreateForm,ReactiveForm, InputField
    , fieldSettings
    ,setGlobalObject
    ,useActionOnSubmit
    ,formIsValid 
    ,FileField,
    getFormValues,
    rawSetter,
} from "reactive-fast-form"

import usePost from "../../shared/customHooks/usePost"

import LoadingItem from "../../shared/ui/loadingItem/loadingitem"
import { useDataStore,useJwtStore } from "../../zustand/zustand"

import Signal from "../../shared/ui/signal/signal"
import checkTags from "../../shared/Functions/checkTags"


import './ui/commentForm.css'


const CommentForm = () => {

    const answerTo = useDataStore((state:any) => state.answerTo)
    const username = useDataStore((state:any) => state.username)
    const isAnswer:boolean = useDataStore((state:any) => state.isAnswer)
    const setNullAnswer = useDataStore((state:any) => state.setNullAnswer)

    const setCreatedAnswers = useDataStore((state) => state.setCreatedAnswers)
    const setCreatedMessages = useDataStore((state) => state.setCreatedMessage)

    const jwt = useJwtStore((state:any) => state.jwt)

    const [form,setForm,trigger] = useCreateForm(["text","file"])

    const {isOk,data,loading,error,postData} = usePost("http://127.0.0.1:8000/message/")

    const settings:fieldSettings = {
        invalidClass: "invalid input",
        validClass: "valid input",
        dynamicStyles:true
    }

    

    useActionOnSubmit(() => {
        if(formIsValid(form)){
            postData({
                ...getFormValues(form),
                isAnswer:isAnswer,
                answerTo: Number.parseInt(answerTo)
            },{
                headers:{
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${jwt}`,
            }})
        }
    },trigger)

    useEffect(() => {
        if(isOk){
            if(isAnswer){
                setCreatedAnswers(
                    {...getFormValues(form),
                    isAnswer:isAnswer,
                    answerTo: Number.parseInt(answerTo),
                    id:data.id,
                    owner: {
                        username: data.result.owner.username,
                        email: data.result.owner.email
                    }})
                setNullAnswer()
            }else {
                console.log(answerTo)
                setCreatedMessages(
                    {...getFormValues(form),
                    isAnswer:isAnswer,
                    answerTo: Number.parseInt(answerTo),
                    id:data.id,
                    owner: {
                        username: data.result.owner.username,
                        email: data.result.owner.email
                    }}
                )
                setNullAnswer()
            }
        }
    },[data])

    const handleOnDeleteFile = () => {
        rawSetter(setForm,'file','',true)
    }

    return (
        <div>   
            {loading && <LoadingItem/>}
            {form['file'].value && 
            <Signal isError={false} 
            message={`Вы выбрали: ${form['file'].value?.name}`}
            callBack={handleOnDeleteFile}
            />}
            <ReactiveForm setObject={form} setFunc={setForm} className="comment-form"> 
                <div className="fields-wrapper">
                    <div className="input-field-wrapper">
                    {answerTo && username && <div className="is-answer">Ви відповідаєте {username}  <span onClick={setNullAnswer} className="is-clickable">X</span></div> }
                        <InputField
                        name="text"
                        isTextArea
                        placeholder="Enter text"
                        {...settings}
                        validFunc={checkTags}
                        min={2}
                        max={500}
                        isTrigger
                        resetAfterSubmit
                        backToTrueIn={3000}
                        />
                    </div>
                    <div>
                        <label htmlFor="file">
                            <div className="image-field">
                                <img className="img is-clickable" src="screpka.png" alt="" />
                                <FileField
                                name="file"
                                id="file"
                                updateOnChange
                                allowNull
                                types={[
                                    {typeName:'image/',maxSize:100,typeSize:"mbytes"},
                                    {typeName:'text/plain',maxSize:100,typeSize:"kbytes"}]}
                                />
                            </div>
                        </label>
                    </div>
                </div>
                <div className="default-btn s-margin" onClick={() => setGlobalObject(setForm)}>Leave comment</div>
            </ReactiveForm>
        </div>
    )
}

export default CommentForm