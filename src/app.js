const path = require("path")
const express = require("express")
const hbs = require("hbs")

const forecast = require("./utils/forecast")
const geocode = require("./utils/geocode")
const app = express()

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname,"../templates/partials")

//Set up handle bars engine and views location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)


//Set up static directory to serve
app.use(express.static(publicDirectoryPath))


app.get("/", (req, res) => {
    res.render('index', {
        title: "Weather App",
        name: "Bhargava Golla"
    })
})

app.get("/about", (req, res) => {
    res.render('about', {
        title: "About this Page",
        name: "Bhargava Golla"
    })
})


app.get("/help", (req, res) =>{
    res.render("help", {
        helpText: "This is some help text",
        title: "Help",
        name: "Bhargava Golla"

    })
})

app.get("/weather", (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: "You must provide an address"
        })
    }

    geocode(req.query.address,(error,{latitude, longitude, location}) => {
        if (error) {
            return res.send({error})

        }

        forecast (latitude, longitude, (error, forecastData) =>{
            if (error) {
                return res.send({error})
            }
        })
        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
        })
    })


//     res.send({
//         location: "Vizag",
//         forecast: "50 Degrees",   
//         address: res.query.address
//     })  
 })

app.get("/products", (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }
    console.log(req.query.search);
    res.send({
        products: []
    })
})


app.get("/help/*", (req, res) => {
    
    res.render("error" , {
        error: "Oops 404 Error",
        notFound: "No such help article"
    })
})

app.get("*", (req, res) => {

    res.render("error" , {
        error: "Oops 404 Error",
        notFound: "Sorry no such page exists"
    })
})

app.listen(3000, () => {    
    console.log("Server Started at port 3000")
})    


