import { useJwtStore } from '../../zustand/zustand'

import './header.css'


const Header = () => {

    const setJwt = useJwtStore((state:any) => state.setJwt)

    return (
        <header className="header">
            <div className="title content-wrapper is-clickable" onClick={() => setJwt('')}>
                Logout
            </div>
        </header>
    )
}

export default Header