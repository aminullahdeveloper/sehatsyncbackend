const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiContoller');

router.post('/healthstatus', apiController.generateHealthStatus);
router.post('/summarize', apiController.summarizeLab);
router.post('/summarizePrescription', apiController.summarizePresc);
router.post('/ocr', apiController.performOCR);

module.exports = router;
