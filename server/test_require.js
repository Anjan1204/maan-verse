try {
    console.log("Loading plagiarismController...");
    const controller = require('./controllers/plagiarismController');
    console.log("Loaded controller:", controller);

    console.log("Loading plagiarismRoutes...");
    const routes = require('./routes/plagiarismRoutes');
    console.log("Loaded routes:", routes);
} catch (error) {
    console.error("Error loading modules:", error);
}
