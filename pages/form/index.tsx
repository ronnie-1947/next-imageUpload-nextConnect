import React, {useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'

const form = () => {

    const router = useRouter()

    const [file, setFile] = useState<any>(null)
    const [progress, setProgress] = useState(0)

    const config = {
        headers: {'content-type': 'multipart/form-data'},

        onUploadProgress: (event:{loaded:number, total:number})=>{
            setProgress(Math.round((event.loaded * 100) / event.total))
        }
    }

    const onSubmit = async(event:any) => {

        event.preventDefault()
        
        try {
            const formData = new FormData()
            formData.append('file', file)
    
            await axios.post('/api/upload', formData, config)

            setFile(null)
            router.push('/')

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="file" onChange={e=>setFile(e.target.files && e.target.files[0])}/>
                <button>Submit</button>
            </form>
            <div>
                <h1>{progress}</h1>
                
            </div>
        </>
    )
}

export default form
