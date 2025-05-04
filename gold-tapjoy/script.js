document.addEventListener('DOMContentLoaded', function() {
    const tapPointsInput = document.getElementById('tapPoints');
    const pointsIdInput = document.getElementById('pointsId');
    const submitButton = document.getElementById('submit');
    const output1 = document.getElementById('output1');
    const output2 = document.getElementById('output2');
    const copyButtons = document.querySelectorAll('.copy-btn');

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
