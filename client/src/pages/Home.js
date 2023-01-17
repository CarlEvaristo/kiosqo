import React from 'react'
import "./Home.css"
import Axios from "axios"
import NewsList from '../components/NewsList'

export default function Home() {
    const [data, setData] = React.useState()


    React.useEffect(()=> {
        Axios.get("http://localhost:3001/")		
            .then(res => setData(res.data))
            .catch(err=> console.log("ERROR: " + err))
    },[])
    

    return (
        <div className='container'>
            {data && <NewsList data={data} />}
        </div>
    )
}
