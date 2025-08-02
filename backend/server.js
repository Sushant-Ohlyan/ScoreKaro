const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const teamRoutes = require('./routes/teamRoutes');
const matchSetupRoutes = require('./routes/matchSetupRoutes');
const teamManageRoutes = require('./routes/teamManageRoutes');
const teamSaveRoutes = require('./routes/teamSaveRoute');
const onGoingInningRoute= require('./routes/MatchDetailRoutes');
const contactDetailRoutes = require('./routes/contactDetailRoute');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo Error", err));

app.use('/api/team-setup', teamRoutes);
app.use('/api/match-setup', matchSetupRoutes);
app.use('/api/team-manage', teamManageRoutes);
app.use('/api/team-save', teamSaveRoutes);
app.use('/api/on-going-inning', onGoingInningRoute);
app.use('/api/contact-detail', contactDetailRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// http://localhost:5000/api/teams-manage/