const express = require('express');
const multer = require('multer');
const { uploadExcel} = require('../config/multerConfig');

const { createList, getLists, getListById,addDataToList, 
    getDataForList, fetchRowByColumnValue, deleteRowFromListByIndex,
    updateRowInList, updateListDetails, deleteList,
    uploadAndExtractColumns, createListFromExcelWithData} = require('../controllers/listController');

const auth = require('../middleware/auth');

const router = express.Router();

// create list manually
router.post('/manual', auth, createList);

// create list by uploading excel file
router.post('/excel-extract-column',auth, uploadExcel.single('file'), uploadAndExtractColumns);
router.post('/create-list-excel',auth, uploadExcel.single('file'), createListFromExcelWithData);

router.get('/', auth, getLists);
router.get('/:id', getListById);


// Get data for a specific list , 
router.get('/data/:list_id', auth, getDataForList);

// Fetch a specific row by a column value
router.get('/data/:list_id/query', fetchRowByColumnValue);


// Add data to a list
router.post('/add-data/:list_id', auth, addDataToList);


// Route to delete a specific row from a list by index
router.delete('/delete-row/:list_id/:row_index', auth, deleteRowFromListByIndex);

// Route to update a specific row in a list by index
router.put('/update-row/:list_id/:row_index', auth, updateRowInList);

// Route to update the list details
router.put('/:list_id',auth, updateListDetails);

// Route to delete a list
router.delete('/:id', deleteList);


module.exports = router;

