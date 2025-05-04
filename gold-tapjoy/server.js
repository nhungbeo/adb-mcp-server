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
      <TapPoints>${tapPoints}</TapPoints>
      <CurrencyName>Golden Credits</CurrencyName>
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
      <TapPoints>${tapPoints}</TapPoints>
      <CurrencyName>Golden Credits</CurrencyName>
      <PointsID>${pointsId}</PointsID>
    </UserAccountObject>
    <Success>true</Success>
</TapjoyConnectReturnObject>`;
}

// Hàm tính toán chia gold
function calculateGoldSplits(goldAmount) {
    const totalGold = goldAmount * 1000; // Convert K to actual gold amount
    const minPoints = 61;
    const maxPoints = 89;
    const avgPoints = Math.floor((minPoints + maxPoints) / 2);
    
    // Calculate approximate number of splits needed
    const splits = Math.ceil(totalGold / (avgPoints * 1000));
    const results = [];
    let remainingGold = totalGold;

    // Calculate splits
    for (let i = 0; i < splits && remainingGold > 0; i++) {
        let splitAmount;
        if (i === splits - 1) {
            // Last split - use remaining gold if it's within range
            splitAmount = remainingGold;
            if (splitAmount < minPoints * 1000 || splitAmount > maxPoints * 1000) {
                // If last amount is out of range, adjust previous splits
                return calculateGoldSplits(goldAmount);
            }
        } else {
            // Random amount between min and max
            const randomPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
            splitAmount = Math.min(randomPoints * 1000, remainingGold);
        }
        results.push(splitAmount/1000); // Convert back to K
        remainingGold -= splitAmount;
    }

    return results;
}

// Route xử lý tính toán chia gold
app.post('/calculate-splits', (req, res) => {
    try {
        const { goldAmount } = req.body;

        if (!goldAmount || goldAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Số lượng gold không hợp lệ'
            });
        }

        const splits = calculateGoldSplits(parseInt(goldAmount));
        res.json({
            success: true,
            data: {
                totalSplits: splits.length,
                splits: splits
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
