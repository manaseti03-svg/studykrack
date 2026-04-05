document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(`${target}-tab`).classList.add('active');
        });
    });

    // File Upload logic
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadContent = document.querySelector('.upload-content');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const removeFileBtn = document.getElementById('remove-file');
    const analyzeBtn = document.getElementById('analyze-report-btn');
    let currentFile = null;

    // Trigger file select click on zone click
    dropZone.addEventListener('click', (e) => {
        if(e.target !== removeFileBtn && !removeFileBtn.contains(e.target)) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', handleFileSelect);

    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });

    function handleFileSelect() {
        if (fileInput.files.length > 0) {
            currentFile = fileInput.files[0];
            
            // Validate size (e.g. 5MB)
            if (currentFile.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                removeFile();
                return;
            }

            fileName.textContent = currentFile.name;
            uploadContent.classList.add('hidden');
            filePreview.classList.remove('hidden');
            analyzeBtn.disabled = false;
        }
    }

    removeFileBtn.addEventListener('click', removeFile);

    function removeFile() {
        fileInput.value = '';
        currentFile = null;
        uploadContent.classList.remove('hidden');
        filePreview.classList.add('hidden');
        analyzeBtn.disabled = true;
    }

    // Backend Interaction Logic
    const BACKEND_URL = "http://127.0.0.1:8000"; // Update this when deploying

    const checkSymptomsBtn = document.getElementById('check-symptoms-btn');
    const closeOutputBtn = document.getElementById('close-output');
    const outputPanel = document.getElementById('output-panel');
    const loadingDiv = document.getElementById('loading');
    const resultContent = document.getElementById('result-content');
    const langSelect = document.getElementById('language');

    closeOutputBtn.addEventListener('click', () => {
        outputPanel.classList.add('hidden');
    });

    // Handle Check Symptoms
    checkSymptomsBtn.addEventListener('click', async () => {
        const symptoms = document.getElementById('symptom-input').value.trim();
        if (!symptoms) {
            alert("Please describe your symptoms first.");
            return;
        }

        const lang = langSelect.value;
        showOutputLoading();

        try {
            const response = await fetch(`${BACKEND_URL}/api/predict_disease`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symptoms, language: lang })
            });

            const data = await response.json();
            if (response.ok) {
                displayResult(data.result || data.message);
            } else {
                displayResult(`**Error:** ${data.detail || 'Could not process request.'}`);
            }
        } catch (error) {
            displayResult(`**Connection Error:** Make sure the backend server is running.\n\nDetails: ${error.message}`);
        }
    });

    // Handle Analyze Report
    analyzeBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        const lang = langSelect.value;
        showOutputLoading();

        const formData = new FormData();
        formData.append('file', currentFile);
        formData.append('language', lang);

        try {
            const response = await fetch(`${BACKEND_URL}/api/analyze_report`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                displayResult(data.result);
            } else {
                displayResult(`**Error:** ${data.detail || 'Could not process report.'}`);
            }
        } catch (error) {
             displayResult(`**Connection Error:** Make sure the backend server is running.\n\nDetails: ${error.message}`);
        }
    });

    function showOutputLoading() {
        outputPanel.classList.remove('hidden');
        loadingDiv.classList.remove('hidden');
        resultContent.innerHTML = '';
        outputPanel.scrollIntoView({ behavior: 'smooth' });
    }

    function displayResult(markdownText) {
        loadingDiv.classList.add('hidden');
        // Simple fallback if marked is not loaded properly
        if (typeof marked !== 'undefined') {
            resultContent.innerHTML = marked.parse(markdownText);
        } else {
            resultContent.innerText = markdownText;
        }
    }
});
