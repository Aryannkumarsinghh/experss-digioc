import logger from './logger.js';
import morgan from 'morgan';
import ('dotenv/config');
// require('dotenv').config();
import express from 'express';

const app = express();
app.use(express.json()); 
const PORT = process.env.PORT || 4000;

const morganFormat = ":method :url :status :response-time ms";


// app.get("/", (req , res) => {
//     res.end(`Hello from one sided lover Aryan Singh`);
//     });
// app.get("/love", (req , res) => {
//     res.end(`Dreams come true`);
//     });
// app.get("/failure", (req , res) => {
//     res.end(`Failure is the key of success`);
//     });

   

let teaData = [];
let nxtId = 1;

// Add a new tea
app.post("/teas", (req, res) => {
    console.log('POST');
    const {name , price} = req.body;
    const newTea = {
        id: nxtId++,
        name ,
        price,
    };
    teaData.push(newTea);
    res.status(201).send(newTea);
});

// Get all tea
app.get('/teas', (req, res) => {
    res.status(200).send(teaData);
});

// Get a tea with id
app.get('/teas/:id', (req ,res) => {
   const tea = teaData.find(t => t.id === parseInt(req.params.id));

   if(!tea) {
    return res.status(404).send('Tea not found');
   }
   res.status(200).send(tea);
});

// Update tea

app.put('/teas/:id', (req ,res) => {
  logger.warn("A post request is made to add new tea");  
    const tea = teaData.find(t => t.id === parseInt(req.params.id));

   if(!tea) {
    return res.status(404).send('Tea not found');
   }
   const {name , price} = req.body;
   tea.name = name;
   tea.price = price;
   res.status(200).send(tea);
});

// Delete tea

app.delete('/teas/:id', (req ,res) => {
    console.log("DELETE");
    const index = teaData.findIndex( t => t.id === parseInt(req.params.id));
    if(index === -1) {
         return res.status(404).send('Tea not found');
    }
     teaData.splice(index, 1);
     return res.status(204).send('deleted')   
})

app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

app.listen(PORT , () => {
    console.log(`The server is listening at port: ${PORT}`);
});