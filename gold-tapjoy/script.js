document.addEventListener('DOMContentLoaded', function() {
    const tapPointsInput = document.getElementById('tapPoints');
    const pointsIdInput = document.getElementById('pointsId');
    const submitButton = document.getElementById('submit');
    const output1 = document.getElementById('output1');
    const output2 = document.getElementById('output2');
    const copyButtons = document.querySelectorAll('.copy-btn');

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

    submitButton.addEventListener('click', function() {
        const inputValue = tapPointsInput.value.trim();
        const pointsId = pointsIdInput.value.trim();

        if (!inputValue || !pointsId) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Tính toán tapPoints: nhân với 1000 và thêm số ngẫu nhiên
        const basePoints = parseInt(inputValue) * 1000;
        const randomAddition = Math.floor(Math.random() * 1000);
        const tapPoints = basePoints + randomAddition;

        output1.textContent = generateVgSpentXml(tapPoints, pointsId);
        output2.textContent = generateVgXml(tapPoints, pointsId);
    });

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).textContent;
            
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    const originalText = this.textContent;
                    this.textContent = 'Đã copy!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Không thể copy: ', err);
                    alert('Không thể copy văn bản. Vui lòng thử lại.');
                });
        });
    });
});
