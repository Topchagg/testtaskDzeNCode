import CommentariesPage from "./commentariesPage/commentariesPage"
import RegestrationPage from "./regestrationPage/RegestrationPage"


import { useJwtStore } from "../zustand/zustand"
import { useEffect } from "react"

const MainPage = () => {

    const jwt = useJwtStore((state:any) => state.jwt)

    useEffect(() => {
        console.log(jwt)
    },[jwt])
  
    return (
        <>  
            {jwt && <CommentariesPage/> || <RegestrationPage/>}
        </>
    )
}

export default MainPage