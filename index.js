import express from "express" 
import cors from "cors"
import Axios from "axios"
import puppeteer from "puppeteer"
import { Configuration, OpenAIApi } from "openai"
import { convert } from 'html-to-text'

const app = express()
app.use(cors())

// newsapi config files
const newsApiUrl = "https://newsapi.org/v2/top-headlines?country=us&pageSize=1"
const newsApiToken = 'f390ce69bfaf4453821796ae7fa44bef'
 
//openai config files
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
})


//////////////////////////////////////

// async function run() {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.nbcnews.com/politics/white-house/democratic-allies-grow-frustrated-white-house-response-bidens-classifi-rcna65616');
//     const text = await page.evaluate(() => Array.from(document.querySelectorAll("p, h2")).map(ele => ele.innerHTML )) 

//     let plainTxt = ""

//     text.forEach(item => {
//         const text = convert(item, {
//             wordwrap: 130
//         });
//         plainTxt += `\n${text}\n`  
//     })
//     console.log(plainTxt.slice(0,2000)) 
//     await browser.close()
// }



//////////////////////////////////////


async function getCompletion(myPrompt) {
    const openai = new OpenAIApi(configuration);
    let response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: myPrompt,
      max_tokens: 256,
      temperature: 0,
    })
    return response.data.choices[0].text
  }


const getText = async (articleUrl) => {
    const url = "https://txtify.it/" + articleUrl

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' })
    // const html = await page.content(); 
    const html = await page.evaluate(() => {
        return document.querySelector("body").innerHTML
      });
    await browser.close(); 
    return html.slice(0,2000);
} 
 
app.get("/", (req, res) => {
    Axios.get(newsApiUrl, { headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${newsApiToken}`}
        })
        .then(async response => {
            res.send(await response.data.articles.map(async article => {
                let myPrompt = `write me a news article summary in 200 words in json format: {"title": ${article.title}, "summary": summary, "url": ${article.url}} of the news article text from this scraped website ui textcontent: ${await getText(article.url)}`
                return await getCompletion(myPrompt)
            }))
        })
        .catch(err => res.send(err))    
})

// app.get("/", (req, res) => {
//     const url = "https://newsapi.org/v2/top-headlines?country=us"
//     const tokenStr = 'f390ce69bfaf4453821796ae7fa44bef'

//     Axios.get(url, { headers: {
//         "Content-Type": "application/json",
//         "Authorization" : `Bearer ${tokenStr}`}
//     })
//         .then(response => res.send(response.data.articles))
//         .catch(err=> res.send(err))
        
// })


app.listen(process.env.PORT || 3001, ()=>console.log("server running on port 3001")) 

