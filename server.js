const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());


app.post("/calculate-risk", (req, res) => {
    const { height, weight, systolic, diastolic, age, familyHistory } = req.body;

    // Calculate BMI
    const bmi = weight / ((height / 100) ** 2);
    let bmiCategory, bmiPoints; highRisk=false;
    if (bmi < 18.5) { bmiCategory = "Underweight"; bmiPoints = 10; }
    else if (bmi < 25) { bmiCategory = "Normal"; bmiPoints = 0; }
    else if (bmi < 30) { bmiCategory = "Overweight"; bmiPoints = 30; }
    else { bmiCategory = "Obese"; bmiPoints = 75; highRisk=true; }

    // Calculate Blood Pressure Category
    let bpCategory, bpPoints;
    if (systolic < 120 && diastolic < 80) { bpCategory = "Normal"; bpPoints = 0; }
    else if (systolic < 130 && diastolic < 80) { bpCategory = "Elevated"; bpPoints = 15; }
    else if (systolic < 140 || diastolic < 90) { bpCategory = "Hypertension Stage 1"; bpPoints = 30; }
    else if (systolic < 180 || diastolic < 120) { bpCategory = "Hypertension Stage 2"; bpPoints = 75; }
    else { bpCategory = "Hypertensive Crisis"; bpPoints = 100; highRisk=true;}

    // Age Points
    let agePoints = age < 30 ? 0 : age < 45 ? 10 : age < 60 ? 20 : 30;

    // Family History Points
    let familyPoints = 0;
    if (familyHistory.includes("diabetes")) familyPoints += 10;
    if (familyHistory.includes("cancer")) familyPoints += 10;
    if (familyHistory.includes("alzheimers")) familyPoints += 10;

    // Total Risk Score
    const totalScore = bmiPoints + bpPoints + agePoints + familyPoints;

    // Determine Risk Level
    let riskLevel;
    if (totalScore <= 20) riskLevel = "Low";
    else if (totalScore <= 50) riskLevel = "Moderate";
    else if (totalScore <= 75) riskLevel = "High";
    else riskLevel = "Uninsurable";

    res.json({ bmi, bmiCategory, bpCategory, totalScore, riskLevel, highRisk});
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
