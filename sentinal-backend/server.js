const express = require('express');
const cors = require('cors');
const {exec} = require('child_process');
const fs = require('fs');
const upload = require('./uploadMiddleware');

const app = express();
app.use(cors());
app.use(express.json());


app.post('/upload-and-scan', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({error: "No file uploaded"});

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    console.log(`--- [SENTINEL-SAST] Scanning: ${originalName} ---`);

   
    exec(`java -cp . SentinelCore "${filePath}"`, (error, stdout, stderr) => {

       
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (error) {
            console.error(`Execution Error: ${stderr}`);
            return res.status(500).json({error: "Java Engine Crash", details: stderr});
        }

     
        const parsedResults = stdout.split('\n')
            .map((line, index) => {
                        const match = line.match(/\[CRITICAL\]\s+(.*?)\s+(?:found\s+)?at\s+Line\s+(\d+)/i);

                if (match) {
                    return {
                        id: `V-${100 + index}`,
                        type: match[1].trim(),
                        severity: 'Critical',
                        file: originalName,
                        line: match[2]
                    };
                }
                return null;
            })
            .filter(item => item !== null);

        console.log(`Scan Complete: Found ${parsedResults.length} vulnerabilities.`);
        res.json({results: parsedResults});
    });
});

app.listen(5000, '0.0.0.0', () => {
    console.log("Sentinel-AI Backend is LIVE on Port 5000");
});