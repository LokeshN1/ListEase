const List = require('../models/List');
const ListItem = require('../models/listItem');  // Import ListItem model
const { v4: uuidv4 } = require('uuid'); // to genrate list access key
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary');

// Create a new list
const createList = async (req, res) => {
    const { title,heading, about, columns, queryColumn } = req.body;
    const userId = req.user.id;  // Extract user ID from JWT
    const access_key = uuidv4(); // Generate a unique access key

    try {
      // Create a new List document with the authenticated user's ID
      const list = new List({
        title,
        user_id: userId,  // Use user_id for consistency with the model
        access_key,
        heading,
        about,
        columns,
        queryColumn
      });
  
      // Save the list to the database
      const savedList = await list.save();
  
      // Create a new ListItem document with the same list_id
      const listItem = new ListItem({
        list_id: savedList._id,  // Use the _id of the saved list
        data: []  // Initialize with an empty array
      });
  
      // Save the ListItem document
      await listItem.save();
  
      res.status(201).json({
        message: 'List created successfully',
        list: savedList,
        listItem
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Function to extract public_id from cloudnary file 
const extractPublicId = (url) => {
  // Find the part of the URL after /upload/
  const startIndex = url.indexOf('/upload/') + '/upload/'.length;

  // Find the extension to remove it
  const endIndex = url.lastIndexOf('.');

  // Extract the public_id
  const publicId = url.substring(startIndex, endIndex);

  return publicId;
};


  // upload excel file and extract column form it
  // upload excel file and extract columns from it
  const uploadAndExtractColumns = async (req, res) => {
    try {
      // Use the URL returned by the Cloudinary middleware
      const fileUrl = req.file.path;
      const FilePublicId = extractPublicId(fileUrl);

      console.log("fileUrl" + fileUrl);
      console.log("file public_id " + FilePublicId);

      // Fetch the file using its URL
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer bqz arraybuffer is suitable for binary data
  
      const workbook = xlsx.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const columns = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
  
      // Send back columns and file URL
      res.status(200).json({ columns, fileUrl, FilePublicId });
    } catch (error) {
      console.error('Error uploading and extracting columns:', error);
      res.status(500).json({ message: 'Error processing file', error: error.message });
    }
  };
  


// get excel file and extract data of it then store data in list
const createListFromExcelWithData = async (req, res) => {
  const { title, heading, about, queryColumn, columns } = req.body;
  const access_key = uuidv4();
  const userId = req.user.id;
  const fileUrl = req.body.fileUrl; // Retrieve the file URL from the request body
  const getPublicId = (fileUrl) => fileUrl.split("/").pop().split(".")[0];

  if (!fileUrl) {
    return res.status(400).json({ message: 'File URL is not provided' });
  }

  try {
    // Fetch the file from Cloudinary
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

    // Import xlsx here
    const xlsx = require('xlsx');

    // Read the Excel file
    const workbook = xlsx.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert sheet to JSON array of objects
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      throw new Error('Excel file is empty or data is not in correct format');
    }

    // Create the new list
    const formattedColumns = columns.map((col) => ({
      name: col,
      type: "String",
    }));

    const newList = new List({
      title,
      user_id: userId,
      access_key,
      heading,
      about,
      columns: formattedColumns,
      queryColumn,
    });

    await newList.save();
    const listId = newList._id;

    // Add data to the list
    await addDataToListThroughExcel(listId, data);

    // Delete the Excel file from Cloudinary
     await cloudinary.uploader.destroy(filePublicId);

    res.status(201).json({ message: 'List created and data added successfully' });
  } catch (error) {
    console.error('Error creating list and adding data from Excel:', error);
    res.status(500).json({ message: 'Error creating list and adding data from Excel', error: error.message });
  }
};

  
  
  // add data through excel
const addDataToListThroughExcel = async (list_id, data) => {
  console.log(list_id);
  console.log(data);
  try {
    // Find the List document to get the columns
    const list = await List.findById(list_id);
    if (!list) {
      throw new Error('List not found');
    }

    // Find the ListItem document by list_id
    let listItem = await ListItem.findOne({ list_id });
    if (!listItem) {
      // If not found, create a new ListItem document
      listItem = new ListItem({ list_id, data: [] });
    }

    const addEntry = (entry) => {
      if (entry && typeof entry === 'object') {
        const newDataEntry = {};
        list.columns.forEach(col => {
          if (entry.hasOwnProperty(col.name)) {
            newDataEntry[col.name] = entry[col.name];
          } else {
            throw new Error(`Missing required field: ${col.name}`);
          }
        });
        listItem.data.push(newDataEntry);
      } else {
        throw new Error('Invalid data entry');
      }
    };

    if (Array.isArray(data)) {
      // If `data` is an array, iterate and add each entry
      data.forEach(entry => addEntry(entry));
    } else {
      // If `data` is a single object, add it directly
      addEntry(data);
    }

    // Save the updated ListItem document
    await listItem.save();
    return { message: 'Data added successfully', listItem };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all lists for the authenticated user
const getLists = async (req, res) => {
    const userId = req.user.id;  // Extract user ID from JWT
  
    try {
      // Find lists by the authenticated user's ID
      const lists = await List.find({ user_id: userId });
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  };

  

// Get a single list by its ID
const getListById = async (req, res) => {
    try {
      const list = await List.findById(req.params.id);
      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }
  
      // Ensure the list belongs to the authenticated user
      // if (list.user_id.toString() !== req.user.id) {
      //   return res.status(403).json({ message: 'Access denied' });
      // }
  
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Add multiple data entries to a list
const addDataToList = async (req, res) => {
  console.log("OKK");
  const { list_id } = req.params;
  const { data } = req.body;  // `data` can be either an object (single row) or an array of objects (multiple rows)
    console.log(data);
  try {
    // Find the List document to get the columns
    const list = await List.findById(list_id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Find the ListItem document by list_id
    let listItem = await ListItem.findOne({ list_id });
    if (!listItem) {
      // If not found, create a new ListItem document
      listItem = new ListItem({ list_id, data: [] });
    }

    const addEntry = (entry) => {
      if (entry && typeof entry === 'object') {
        const newDataEntry = {};
        list.columns.forEach(col => {
          if (entry.hasOwnProperty(col.name)) {
            newDataEntry[col.name] = entry[col.name];
          } else {
            throw new Error(`Missing required field: ${col.name}`);
          }
        });
        listItem.data.push(newDataEntry);
      } else {
        throw new Error('Invalid data entry');
      }
    };

    if (Array.isArray(data)) {
      // If `data` is an array, iterate and add each entry
      data.forEach(entry => addEntry(entry));
    } else {
      // If `data` is a single object, add it directly
      addEntry(data);
    }

    // Save the updated ListItem document
    await listItem.save();
    res.status(200).json({
      message: 'Data added successfully',
      listItem,
    });
  } catch (error) {
    console.error('Error:', error); // Log the error
    res.status(500).json({ message: error.message });
  }
};



  
  
  // Fetch data from a list by a queryColumn

  
  const fetchRowByColumnValue = async (req, res) => {
    const { list_id } = req.params;  // Get list_id from URL params
    const { queryColumn, queryValue } = req.query;  // Get queryColumn and queryValue from URL query parameters
  
    try {
      // Find the List document to get column definitions
      const list = await List.findById(list_id);
      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }
  
      // Check if queryColumn is present in the list columns
      const column = list.columns.find(col => col.name == queryColumn);
      if (!column) {
        return res.status(400).json({ message: `Invalid query column ${queryColumn}` });
      }
  
      // Convert queryValue to string for comparison
      const stringQueryValue = String(queryValue);
  
      // Find ListItem document by list_id
      const listItem = await ListItem.findOne({ list_id });
      if (!listItem) {
        return res.status(404).json({ message: 'Data not found for this list' });
      }
  
      // Find all rows that match the queryColumn and queryValue, comparing as strings
      const matchingRows = listItem.data.filter(row => String(row[queryColumn]) === stringQueryValue);
  
      if (matchingRows.length === 0) {
        return res.status(404).json({ message: 'Rows not found' });
      }
  
      res.json({ rows: matchingRows });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  

// get data of a list

const getDataForList = async (req, res) => {
  const { list_id } = req.params;  // Get list_id from URL params

  try {
    // Find List document to get column definitions
    const list = await List.findById(list_id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Find ListItem document by list_id
    const listItem = await ListItem.findOne({ list_id });
    if (!listItem) {
      return res.status(404).json({ message: 'Data not found for this list' });
    }
    console.log(listItem.data);
    // Since data is already in the required format, we can directly return it
    res.json({
      list_id: listItem.list_id,
      data: listItem.data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific row in list
const updateRowInList = async (req, res) => {
  const { list_id, row_index } = req.params;
  const { updatedRow } = req.body;

  try {
    // Find the ListItem document by list_id
    let listItem = await ListItem.findOne({ list_id });
    if (!listItem) {
      return res.status(404).json({ message: 'ListItem not found' });
    }

    // Ensure the row_index is within bounds
    if (row_index < 0 || row_index >= listItem.data.length) {
      return res.status(404).json({ message: 'Row not found' });
    }

    // Update the specific row
    listItem.data[row_index] = updatedRow;

    // Save the updated ListItem document
    await listItem.save();
    res.status(200).json({
      message: 'Row updated successfully',
      listItem,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};


// Delete a specific row from list
const deleteRowFromListByIndex = async (req, res) => {
  const { list_id, row_index } = req.params;

  try {
    // Find the ListItem document by list_id
    let listItem = await ListItem.findOne({ list_id });
    if (!listItem) {
      return res.status(404).json({ message: 'ListItem not found' });
    }

    // Ensure the row_index is within bounds
    if (row_index < 0 || row_index >= listItem.data.length) {
      return res.status(404).json({ message: 'Row not found' });
    }

    // Remove the row from the data array
    listItem.data.splice(row_index, 1);

    // Save the updated ListItem document
    await listItem.save();
    res.status(200).json({
      message: 'Row deleted successfully',
      listItem,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update list details
const updateListDetails = async (req, res) => {
  const { list_id } = req.params;
  const { title, heading, about, queryColumn, data } = req.body;

  try {
    // Find the List document
    const list = await List.findById(list_id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Update the list details
    list.title = title;
    list.heading = heading;
    list.about = about;
    list.queryColumn = queryColumn;

    // Save the updated list
    await list.save();

    // Find the ListItem document
    let listItem = await ListItem.findOne({ list_id });
    if (listItem) {
      listItem.data = data;
      await listItem.save();
    }

    res.status(200).json({
      message: 'List updated successfully',
      list,
      listItem,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a list
const deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the list
    const list = await List.findByIdAndDelete(id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Also, delete all associated list items
    await ListItem.deleteMany({ list_id: id });

    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createList, getLists, getListById, addDataToList, getDataForList,
   fetchRowByColumnValue, updateRowInList, deleteRowFromListByIndex,
 updateListDetails, deleteList, uploadAndExtractColumns,
 createListFromExcelWithData, addDataToListThroughExcel};
