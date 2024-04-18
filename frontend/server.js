import express from "express";
import apiRoutes from './public/scripts/api.js'; 

const app = express();

app.use(express.static("public"));

app.use('/api', apiRoutes);

const PORT = 3221;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend Server ready at http://localhost:${PORT}`);
});
