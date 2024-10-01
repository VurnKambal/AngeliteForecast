import {useEffect, useState, useRef} from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'
import Register from '../features/user/Register'

function InternalPage(){
    const dispatch = useDispatch()

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