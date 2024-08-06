const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiContoller');

router.post('/healthstatus', apiController.generateHealthStatus);
router.post('/summarize', apiController.summarizeLab);
router.post('/summarizeRadiology', apiController.summarizeRad);
router.post('/summarizePrescription', apiController.summarizePresc);
router.post('/ocr', apiController.performOCR);
router.post('/ocrRad', apiController.performOCRRad);
router.post('/symptoms', apiController.analyzeSymptoms);
router.post('/openai-diagnose', apiController.openaiDiagnose);
router.post('/openai-workups', apiController.openaiWorkups);

module.exports = router;
