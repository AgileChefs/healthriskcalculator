document.getElementById("health-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const systolic = parseInt(document.getElementById("systolic").value);
    const diastolic = parseInt(document.getElementById("diastolic").value);
    const age = parseInt(document.getElementById("age").value);
    
    const familyHistory = Array.from(document.getElementById("family-history").selectedOptions).map(option => option.value);

    const response = await fetch("https://health-risk-calculator.azurewebsites.net/calculate-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height, weight, systolic, diastolic, age, familyHistory })
    });
    const result = await response.json();
    if (!response.ok) {
        document.getElementById("errorMessage").textContent = `Error: ${result.error}`;
        document.getElementById("result").textContent = "";
        return;
    }
    else{
        document.getElementById("result").innerHTML = `
        <p><strong>BMI:</strong> ${result.bmi.toFixed(2)} (${result.bmiCategory})</p>
        <p><strong>Blood Pressure:</strong> ${result.bpCategory}</p>
        <p><strong>Age:</strong> ${result.age}</p>
        <p><strong>Family Diseases:</strong> ${result.familyHistory}</p>
        <p><strong>Total Risk Score:</strong> ${result.totalScore}</p>
        <p><strong>Risk Level:</strong> ${result.riskLevel}</p>`;
        document.getElementById("errorMessage").textContent = "";
    }
    const submitBtn = document.getElementById("submit-btn");
    if (result.highRisk) {
        submitBtn.style.backgroundColor = "red";  // High risk → Red button
    } else {
        submitBtn.style.backgroundColor = "green"; // Low risk → Green button
    }

});
