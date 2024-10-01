import {useState, useRef} from 'react'
import Register from '../features/user/Register'

function InternalPage(){
    useEffect(() => {
        dispatch(setPageTitle({ title : "Registration"}))
      }, [])

    return(
        <div className="container mx-auto mt-8">
            <Register />
        </div>
    )
}

export default InternalPage