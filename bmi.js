const userImageUrls = {
    male: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80",  // Royalty-free from Unsplash
    female: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&q=80",
    child: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=400&q=80"
};

// Selectors
const genderSel = document.getElementById('gender');
const userImgCtr = document.getElementById('user-image-container');
const form = document.getElementById('bmi-form');
const output = document.getElementById('bmi-output');

// Dynamic image by gender/age
genderSel.addEventListener('change', function() {
    let genderVal = genderSel.value;
    if (userImageUrls[genderVal]) {
        userImgCtr.innerHTML = `<img src="${userImageUrls[genderVal]}" class="bmi-img shadow-sm"/>`;
    } else {
        userImgCtr.innerHTML = "";
    }
});

// BMI calculation and color-chart render
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const dob = document.getElementById('dob').value;
    const gender = genderSel.value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (!dob || !gender || !height || !weight) {
        output.innerHTML = '<span class="text-danger">Please fill all fields.</span>';
        return;
    }
    let today = new Date();
    let birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today < new Date(birthDate.setFullYear(today.getFullYear()))) age--;

    // Standard BMI formula
    let bmi = weight / ((height/100) * (height/100));
    let bmiType, bmiColor;
    if (gender === 'child') {
        // For demo: let's use this scale, but in reality BMI for children is percentile-based.
        if (bmi < 14) {
            bmiType = 'Underweight';
            bmiColor = '#f25454';
        } else if (bmi < 18) {
            bmiType = 'Normal';
            bmiColor = '#38d39f';
        } else {
            bmiType = 'Overweight';
            bmiColor = '#f7b731';
        }
    } else {
        if (bmi < 18.5) {
            bmiType = 'Underweight';
            bmiColor = '#f25454';
        } else if (bmi < 25) {
            bmiType = 'Normal';
            bmiColor = '#38d39f';
        } else if (bmi < 30) {
            bmiType = 'Overweight';
            bmiColor = '#f7b731';
        } else {
            bmiType = 'Obese';
            bmiColor = '#ee5253';
        }
    }

    const chartHtml = `
      <div class="bmi-result">${bmiType} <span style="color:${bmiColor}">${bmi.toFixed(1)}</span></div>
      <div class="d-flex align-items-center justify-content-center">
        <div class="progress w-100 bmi-chart" style="background:#efecec;">
          <div class="progress-bar" role="progressbar" 
               style="background:${bmiColor};width:${Math.min(bmi,40)*2.5}%">
          </div>
        </div>
      </div>
      <div class="mt-2 small"><i class="fa-solid fa-clock"></i> Age: ${age} | Gender: ${gender.charAt(0).toUpperCase()+gender.slice(1)}</div>
      `;

    output.innerHTML = chartHtml;
});
