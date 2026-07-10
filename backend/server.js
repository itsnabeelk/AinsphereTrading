require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://ainspheretrading.com',
        'https://www.ainspheretrading.com'
    ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const generalHomeRoutes = require('./routes/generalHome.routes');
const generalServicesRoutes = require('./routes/generalServices.routes');
const generalServiceDetailRoutes = require('./routes/generalServiceDetail.routes');
const fmcgHomeRoutes = require('./routes/fmcgHome.routes');
const contactRoutes = require('./routes/contact.routes');

app.use('/general/home', generalHomeRoutes);
app.use('/general/home', require('./routes/generalClient.routes'));
app.use('/general/home', require('./routes/generalAbout.routes'));
app.use('/general/home', require('./routes/generalWorking.routes'));
app.use('/general/home', require('./routes/generalTeam.routes'));
app.use('/general-services', generalServicesRoutes);
app.use('/general-service-detail', generalServiceDetailRoutes);

/* -------- FMCG -------- */
app.use('/fmcg/home', require('./routes/fmcgHome.routes'));
app.use('/fmcg-services', require('./routes/fmcgServices.routes'));
app.use('/fmcg-service-detail', require('./routes/fmcgServiceDetail.routes'));

/* -------- MEP -------- */
app.use('/mep/home', require('./routes/mepHome.routes'));
app.use('/mep-services', require('./routes/mepServices.routes'));
app.use('/mep-service-detail', require('./routes/mepServiceDetail.routes'));


/* -------- UNIFORM -------- */
app.use('/uniform/home', require('./routes/uniformHome.routes'));
app.use('/uniform-services', require('./routes/uniformServices.routes'));
app.use('/uniform-service-detail', require('./routes/uniformServiceDetail.routes'));


app.use('/contact', contactRoutes);
app.use('/careers', require('./routes/career.routes'));
// HEALTH
app.get('/health', (req, res) => {
    res.json({ status: 'API Running' });
});

// STATIC
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 (MUST BE LAST)
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ message: err.message });
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
