const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Hàm tạo XML cho spent.xml
function generateVgSpentXml(tapPoints, pointsId) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<TapjoyConnectReturnObject>
    <UserAccountObject>
      <TapPoints>
        ${tapPoints}
      </TapPoints>
      <CurrencyName>
        Golden Credits
      </CurrencyName>
      <PointsID>${pointsId}</PointsID>
    </UserAccountObject>
    <Success>true</Success>
    <Message>You successfully spent ${tapPoints} points</Message>
</TapjoyConnectReturnObject>`;
}

// Hàm tạo XML cho vg.xml
function generateVgXml(tapPoints, pointsId) {
    return `<?xml version="1.0" encoding="UTF-8"?>
  <TapjoyConnectReturnObject>
    <UserAccountObject>
      <TapPoints>
        ${tapPoints}
      </TapPoints>
      <CurrencyName>
        Golden Credits
      </CurrencyName>
      <PointsID>
        ${pointsId}
      </PointsID>
    </UserAccountObject>
    <Success>
      true
    </Success>
  </TapjoyConnectReturnObject>`;
}

// Route xử lý tạo và lưu XML
app.post('/generate-xml', (req, res) => {
    try {
        const { inputValue, pointsId } = req.body;

        if (!inputValue || !pointsId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Thiếu thông tin đầu vào' 
            });
        }

        // Tính toán tapPoints
        const basePoints = parseInt(inputValue) * 1000;
        const randomAddition = Math.floor(Math.random() * 1000);
        const tapPoints = basePoints + randomAddition;

        // Tạo nội dung XML
        const spentXml = generateVgSpentXml(tapPoints, pointsId);
        const vgXml = generateVgXml(tapPoints, pointsId);

        // Lưu files
        fs.writeFileSync(path.join(__dirname, 'spent.xml'), spentXml, 'utf8');
        fs.writeFileSync(path.join(__dirname, 'vg.xml'), vgXml, 'utf8');

        res.json({ 
            success: true,
            data: {
                spentXml,
                vgXml
            }
        });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
