const express = require('express');
const app = express();

const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/calculate-bmi', (req, res) => {
    const { weight, height, fatness, muscle, theme } = req.body;

    const w = Number(weight);
    const h = Number(height);

    if (!w || !h || w <= 0 || h <= 0 || isNaN(w) || isNaN(h)) {
        return res.status(400).json({ error: 'Please enter positive numbers for weight and height.' });
    }

    // Calculate BMI as number and string
    const bmiNum = w / ((h / 100) * (h / 100));
    const bmi = bmiNum.toFixed(2);

    // Compute custom index if fatness and muscle are provided
    let customIndex = null;
    let customCategory = null;
    let customRecommendations = [];

    const f = Number(fatness);
    const m = Number(muscle);
    if (!isNaN(f) && !isNaN(m) && f > 0 && m > 0) {
        customIndex = Number(((f * m) / 100).toFixed(2));

        // Map customIndex to categories based on example table
        // Assumptions for ranges (inferred from example values):
        // Lean Athlete: customIndex <= 5
        // Bodybuilder: 5 < customIndex <= 6.8
        // Average/Fit: 6.8 < customIndex <= 8
        // Sedentary/Obese: customIndex > 8
        if (customIndex <= 5) {
            customCategory = 'Lean Athlete';
            customRecommendations = [
                'Maintain high-protein diet and tailored strength training.',
                'Monitor body fat and muscle gains regularly.',
                'Ensure adequate recovery and sleep.'
            ];
        } else if (customIndex > 5 && customIndex <= 6.8) {
            customCategory = 'Bodybuilder';
            customRecommendations = [
                'Focus on hypertrophy training cycles.',
                'Use progressive overload and track macronutrients.',
                'Periodize training to avoid overtraining.'
            ];
        } else if (customIndex > 6.8 && customIndex <= 8) {
            customCategory = 'Average/Fit';
            customRecommendations = [
                'Keep a balanced routine of cardio and strength training.',
                'Aim for a nutrient-dense diet to maintain fitness.',
                'Track activity levels and set measurable goals.'
            ];
        } else {
            customCategory = 'Sedentary/Obese';
            customRecommendations = [
                'Start with low-impact aerobic activity and gradual increases.',
                'Consult a healthcare professional before starting intense programs.',
                'Prioritize dietary changes and behavior-focused strategies.'
            ];
        }
    }

    let category;
    let recommendations;

    if (bmiNum < 18.5) {
        category = 'Underweight';
        recommendations = [
            'Consult a healthcare provider for a personalized plan.',
            'Focus on nutrient-dense foods.',
            'Incorporate strength training to build muscle mass.'
        ];
    } else if (bmiNum >= 18.5 && bmiNum < 24.9) {
        category = 'Normal weight';
        recommendations = [
            'Maintain a balanced diet and regular physical activity.',
            'Continue with healthy lifestyle habits.',
            'Monitor your health and wellness regularly.'
        ];
    } else if (bmiNum >= 25 && bmiNum < 29.9) {
        category = 'Overweight';
        recommendations = [
            'Adopt a healthier eating pattern.',
            'Increase physical activity, aiming for at least 150 minutes per week.',
            'Consult a healthcare provider for guidance.'
        ];
    } else {
        category = 'Obese';
        recommendations = [
            'Seek guidance from a healthcare professional or registered dietitian.',
            'Focus on a structured weight management plan.',
            'Incorporate both aerobic and strength training exercises.'
        ];
    }

    res.json({
        bmi,
        category,
        customIndex,
        customCategory,
        recommendations,
        customRecommendations,
        theme
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
