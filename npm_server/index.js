import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
// import axios from "axios";

const app = express();
const port = 8001;

app.use(express.json())

app.set('view engine', 'pug')
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/list");
        const resultJSON = await response.json();
        const coins = resultJSON.map((pos) => {
            return {
                name: pos.name,
                id: pos.id,
            }
        });
        res.render("index", {
            coins: coins,
        });
    } catch {
        res.send("Cannot fetch data right now, please wait a minute!")
    }
})

app.get("/coin/:coinId", async (req, res) => {
    const coinId64 = req.params.coinId;
    const coinId = Buffer.from(coinId64, "base64").toString("ascii");
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
        );
        const resultJSON = await response.json()
        const coin_info = {
                image: resultJSON.image.small,
                name: resultJSON.name,
                id: resultJSON.id,
                eth_er: resultJSON.market_data.current_price.eth,
                usd_er: resultJSON.market_data.current_price.usd,
                pln_er: resultJSON.market_data.current_price.pln,
                last_updated: resultJSON.last_updated,
            };
            res.render("coin", {
                coin_info: coin_info,
            })
        } catch(e) {
           console.log(e); 
            res.send("Cannot fetch data right now, please wait a minute!")
    }
})
    
app.listen(port, () => {
    console.log("Damn! It works!!");
})