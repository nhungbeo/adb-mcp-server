document.addEventListener('DOMContentLoaded', function() {
    // Elements for gold calculation form
    const goldAmountInput = document.getElementById('goldAmount');
    const calculateButton = document.getElementById('calculate');
    const recalculateButton = document.getElementById('recalculate');
    const totalSplitsSpan = document.getElementById('total-splits');
    const splitsList = document.getElementById('splits-list');
    
    // Elements for XML generation form
    const tapPointsInput = document.getElementById('tapPoints');
    const pointsIdInput = document.getElementById('pointsId');
    const submitButton = document.getElementById('submit');
    const output1 = document.getElementById('output1');
    const output2 = document.getElementById('output2');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // Function to calculate and display results
    function calculateAndDisplayResults(goldAmount) {
        fetch('/calculate-splits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goldAmount })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayResults(data.data.splits);
            } else {
                throw new Error(data.error || 'Lỗi không xác định');
            }
        })
        .catch(err => {
            console.error('Lỗi:', err);
            alert('Có lỗi xảy ra khi tính toán. Vui lòng thử lại.');
        });
    }

    // Function to display results
    function displayResults(splits) {
        totalSplitsSpan.textContent = splits.length;
        splitsList.innerHTML = ''; // Clear previous results

        splits.forEach((amount, index) => {
            const formattedAmount = Math.floor(amount).toLocaleString();
            const splitItem = document.createElement('div');
            splitItem.className = 'split-item';
            splitItem.innerHTML = `
                ${index + 1}. ${formattedAmount} gold 
                <button class="use-btn" data-amount="${amount}">Sử dụng</button>
            `;
            splitsList.appendChild(splitItem);
        });

        // Add click handlers for "Sử dụng" buttons
        document.querySelectorAll('.use-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const amount = this.getAttribute('data-amount');
                tapPointsInput.value = amount;
            });
        });

        // Show recalculate button
        calculateButton.style.display = 'none';
        recalculateButton.style.display = 'inline-block';
    }

    // Calculate button click handler
    calculateButton.addEventListener('click', function() {
        const goldAmount = parseInt(goldAmountInput.value);
        if (!goldAmount || goldAmount <= 0) {
            alert('Vui lòng nhập số vàng hợp lệ!');
            return;
        }
        calculateAndDisplayResults(goldAmount);
    });

    // Recalculate button click handler
    recalculateButton.addEventListener('click', function() {
        const goldAmount = parseInt(goldAmountInput.value);
        calculateAndDisplayResults(goldAmount);
    });

    submitButton.addEventListener('click', function() {
        const inputValue = tapPointsInput.value.trim();
        const pointsId = pointsIdInput.value.trim();

        if (!inputValue || !pointsId) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Gửi request để tạo và lưu XML
        fetch('/generate-xml', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputValue,
                pointsId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                output1.textContent = data.data.spentXml;
                output2.textContent = data.data.vgXml;
                console.log('Đã tạo và lưu file XML thành công');
            } else {
                throw new Error(data.error || 'Lỗi không xác định');
            }
        })
        .catch(err => {
            console.error('Lỗi:', err);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        });
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
                    console.error('Không thể copy:', err);
                    alert('Không thể copy văn bản. Vui lòng thử lại.');
                });
        });
    });
});
