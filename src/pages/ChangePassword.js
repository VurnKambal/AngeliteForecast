import {useEffect, useState, useRef} from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'
import ChangePassword from '../features/user/ChangePassword'

function ChangePasswordPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Change Password"}))
      }, [])

    return(
        <div className="container mx-auto mt-8">
            <ChangePassword />
        </div>
    )
}

export default ChangePasswordPage