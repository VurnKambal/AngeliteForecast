import {useState, useRef} from 'react'
import Register from '../features/user/Register'

function ExternalPage(){
    return(
        <div className="container mx-auto mt-8">
            <Register />
        </div>
    )
}

export default ExternalPage