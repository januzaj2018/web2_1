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

    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.status(400).json({ error: 'Please enter positive numbers for weight and height.' });
    }

    const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
    let customIndex = null;
    if (fatness && muscle && fatness > 0 && muscle > 0) {
        customIndex = (fatness * muscle / 100).toFixed(2);
    }
    let category;
    let recommendations;

    if (bmi < 18.5) {
        category = 'Underweight';
        recommendations = [
            'Consult a healthcare provider for a personalized plan.',
            'Focus on nutrient-dense foods.',
            'Incorporate strength training to build muscle mass.'
        ];
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight';
        recommendations = [
            'Maintain a balanced diet and regular physical activity.',
            'Continue with healthy lifestyle habits.',
            'Monitor your health and wellness regularly.'
        ];
    } else if (bmi >= 25 && bmi < 29.9) {
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
        recommendations,
        theme
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
