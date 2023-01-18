import express from "express" 
import cors from "cors"
import Axios from "axios"
import puppeteer from "puppeteer"
import { Configuration, OpenAIApi } from "openai"
import mysql from "mysql2"
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())

// DATABASE CONFIG
const db = mysql.createConnection({     // connect todb
  user: "root",                       //this is default username (unless you changed username)
  host: "localhost",  
  port: 3306,                         // SET PORT 3306 HERE , FIND PORT WITH QUERY IN WORKBENCH: SHOW GLOBAL VARIABLES LIKE 'PORT' (3306 is default mysql port)
  password: "Harderwijker-78",               // this is "" or "password" NO!!!! THIS SEEMS TO BE Harderwijker-78  (LET OP STAP3 OVERSLAAN:RUN QUERY IN SQL WORKBENCH:  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';)
  database: "employeeSystem"          //mind upper/lowercase
})

db.connect()


// NEWSAPI CONFIG
const newsApiUrl = "https://newsapi.org/v2/top-headlines?country=us&pageSize=5"
const newsApiToken = 'f390ce69bfaf4453821796ae7fa44bef'

// OPENAI CONFIG
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
})


async function getCompletion(myPrompt) {
    const openai = new OpenAIApi(configuration);
    let response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: myPrompt,
      max_tokens: 256,
      temperature: 0,
    })
    console.log(response.data)
    return response.data.choices[0].text
  }


const getText = async (articleUrl) => {
    const url = "https://txtify.it/" + articleUrl

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' })
    // const html = await page.content(); 
    const html = await page.evaluate(() => {
        return document.querySelector("body > pre").innerHTML
      });
    await browser.close(); 
    return html.slice(0,2000);
} 
 
app.get("/load", (req, res) => {
  // if (req.headers.bekey === "vnrejfvfoj430hfih4f4hui43hfui43hfuh4pqkdowqdjkwq") {

    // GET ARTICLES: NEWSAPI
    Axios.get(newsApiUrl, { headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${newsApiToken}`}
    })
        // GET SUMMARIES: OPENAI
        .then(async (response) => {
          const articles = await response.data.articles
          const promises = articles.map(async (article) => {
              let text = await getText(article.url)
              if (text.length > 50) {
                let myPrompt = `Summarize the following text. But don't complete the last sentence. ${text}.`
                return {"title": article.title, "summary": await getCompletion(myPrompt), "url": article.url}
              } else { 
                return {"title": article.title, "summary": "TEXT NOT AVAILABLE", "url": article.url} 
              } 
          })
          res.send(await Promise.all(promises))
        })
        .catch(err=> res.send("Newsapi error: ", err))
  // } else {
  //   res.send("You're not authenticated")
  // }
})


app.get("/", (req, res) => {
  
})

app.listen(process.env.PORT || 3001, ()=>console.log("server running on port 3001")) 




//////////////////////////////////////
//  USING PUPPETEER LIBRARY TO SCRAPE WEBSITES
//  => ISSUE = NOT ABLE TO SCRAPE SITES WITH COOKIE POPUP
//  => FOR NOW SWITCHED TO TXTIFY.IT

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