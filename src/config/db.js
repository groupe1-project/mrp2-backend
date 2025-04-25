mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur MongoDB:", err));