import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// create new instance of openAI
const openai = new OpenAIApi(configuration);

// initialize express application
const app = express();

// make cross origin requests
app.use(cors())
// allows passing JSON from the frontend to the backend
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({  
    message:'Hello from Botki.'
  })
});

app.post('/', async(req, res) =>{
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // risks
      max_tokens: 3000, // maximum number of tokens to generate in a completion
      top_p: 1, //??
      frequency_penalty: 0.5, // 0 means not going to repeat sentences often
      presence_penalty: 0, // ai leaves
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    })
  } catch (error) {
    console.log(error);
    res.status(500).send(error || 'Something went wrong.');    
  }
})


// make sure that the server always listens for new requests
app.listen(5000, () => console.log('Server is running on https://botki.onrender.com'));