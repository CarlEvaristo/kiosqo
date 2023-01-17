import React from 'react'
import "./NewsList.css"
import { nanoid } from 'nanoid'

export default function NewsList({data}) {
    console.log(data)

    let newsElements = data.map(newsItem => {
        return (
        <li key={nanoid()} className='newsCard'>  
            <h1>{newsItem.title}</h1>
            <p>{newsItem.url}</p>
            <p>{newsItem.content}</p>
        </li>
    )})
    return (
        <ul className='newsList'>
            {newsElements}
        </ul>
    )
}
