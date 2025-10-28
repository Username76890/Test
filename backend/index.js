const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// IMPORTANT: You need to create a 'serviceAccountKey.json' file in the backend directory.
// This file is generated from your Firebase project settings.
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const ordersCollection = db.collection('orders');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

app.use(express.json());
app.use(express.raw({ type: 'audio/webm', limit: '50mb' }));

app.post('/transcribe', async (req, res) => {
  const audioBytes = req.body.toString('base64');
  const languageCode = req.headers['x-language-code'] || 'en-US';

  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'WEBM_OPUS',
    sampleRateHertz: 48000,
    languageCode: languageCode,
  };
  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    res.json({ transcript: transcription });
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).send('Error transcribing audio');
  }
});

app.get('/orders', async (req, res) => {
  try {
    const snapshot = await ordersCollection.get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).send('Error fetching orders');
  }
});

app.post('/orders', async (req, res) => {
  try {
    const newOrder = { ...req.body, status: 'New' };
    const docRef = await ordersCollection.add(newOrder);
    const createdOrder = { id: docRef.id, ...newOrder };
    io.emit('new_order', createdOrder);
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).send('Error creating order');
  }
});

app.put('/orders/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const orderRef = ordersCollection.doc(req.params.id);
        await orderRef.update({ status });
        const updatedDoc = await orderRef.get();
        const updatedOrder = { id: updatedDoc.id, ...updatedDoc.data() };
        io.emit('order_status_update', updatedOrder);
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(404).send('Order not found');
    }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
