import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../common/headerSlice"
import GettingStartedNav from "./components/GettingStartedNav"
import GettingStartedContent from "./components/GettingStartedContent"

function GettingStarted(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Getting Started"}))
    }, [dispatch])

    return(
        <div className="flex bg-base-100 overflow-hidden">
            <div className="w-64 fixed h-full overflow-y-auto bg-base-200 p-4">
                <GettingStartedNav activeIndex={1}/>
            </div>
            <div className="flex-1 ml-64 p-8">
                <GettingStartedContent />
            </div>
        </div>
    )
}

export default GettingStarted