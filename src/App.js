import React, { useState,useEffect } from 'react';
import axios from 'axios';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Renders a component with a specified title, background color, and children.
 *
 * @param {string} title - The title of the component
 * @param {string} backgroundColor - The background color of the component
 * @param {ReactNode} children - The children elements to be rendered within the component
 * @return {ReactNode} The rendered component element
 */
const MyComponent = ({ title, backgroundColor, children }) => {

  const [componentStyle, setComponentStyle] = useState({
    backgroundColor: backgroundColor,
    padding: '10px',
    borderRadius: '5px',
  });

  return (
    <div className="col-12" >
    <div className="component" style={componentStyle}>
      <h2>{title}</h2>
      <div className="resizable" style={{ width: '100%', height: '100%' }} onChange={() => setComponentStyle({ ...componentStyle })}>
        {children}
      </div>
    </div>
    </div>
  );
};

/**
 * Renders the main App component with a grid layout containing three MyComponent instances.
 *
 * @return {JSX.Element} The rendered main App component
 */
const App = () => {
  const [formData, setFormData] = useState({ fname: '', lname: '', mobile: '' }); // State variable to track form data
  const [formSubmitted, setFormSubmitted] = useState(false); // State variable to track form submission
  const [tableData, setTableData] = useState([]); // State variable to track table data
  const [editIndex, setEditIndex] = useState(null);


  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);


    /**
   * Asynchronous function to fetch data from 'API' using axios, 
   * and update the table data with the response. If an error occurs during the fetch, 
   * it is logged to the console.
   *
   * @return {Promise<void>} 
   */
  const fetchData = async () => {
    setTableData([{id:1,fname:"sam",lname:"kumar",mobile:"1234567890"},{id:2,fname:"jhon",lname:"m",mobile:"343434"}]);
    try {
      const response = await axios.get('http://localhost:8083/get_users');
      setTableData(response.data); // Assuming the API response is an array of objects
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  /**
 * Handle form submission asynchronously.
 *
 * @param {event} event - the form submission event
 * @return {Promise} a promise that resolves when the form is submitted successfully, and rejects with an error otherwise
 */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send the form data to the server
      const formData = {
        fname: event.target.fname.value,
        lname: event.target.lname.value,
        mobile: event.target.mobile.value
      };

      if (editIndex !== null) {
        // If editing, call the update API
        await axios.put(`http://localhost:8083/add_data/${editIndex}`, formData);
        // Update the data in the tableData state
        setFormSubmitted(true);
        fetchData();
        setEditIndex(null); // Reset edit index after update
      } else {
        const response = await axios.post('http://localhost:8083/add_data', formData);
        console.log('Form submitted successfully:', response.data);

        // Optionally, you can reset the form after successful submission
        setFormData({ fname: '', lname: '', mobile: '' });
        setFormSubmitted(true);
        fetchData();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  /**
 * Handles the input change event.
 *
 * @param {object} event - The input change event object
 * @return {void} 
 */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleEdit = (id) => {
    console.log("edit", id);
    // Find the index of the item with the given id in the tableData array
    const index = tableData.findIndex(item => item.id === id);
    if (index !== -1) {
      // If the item is found, set form data to the selected row's data for editing
      const selectedData = tableData[index];
      setFormData(selectedData);
      setEditIndex(index);
    } else {
      console.error("Item with id", id, "not found.");
    }
  };


  // Define the layout of the grid
  const layout = [
    { i: '1', x: 0, y: 0, w: 4, h: 10 },
    { i: '2', x: 4, y: 0, w: 4, h: 6 },
    { i: '3', x: 8, y: 0, w: 4, h: 6 },
  ];

  return (
    // Main App component
    <div className="container-fluid">
      <div className="row">
        
  
        <div className="app">
          {/* Grid layout component with specified layout, cols, and rowHeight */}
          <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
            {/* Three MyComponent instances with specified keys,titles,background colors, and children */}
            <div key="1">
              {/* MyComponent component with specified title, background color, and children */}
              <MyComponent title="Component 1" backgroundColor="#ffcccc" onResizeStop={() => console.log('Resize stopped')}>

                {formSubmitted && (
                  <div className="alert alert-success" role="alert">
                    Form submitted successfully!
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">First Name:</label>
                    <input type="text" className="form-control" id="name" name="fname" value={formData.fname} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lname" className="form-label">Last Name:</label>
                    <input type="text" className="form-control" id="lname" name="lname" value={formData.lname} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">Mobile:</label>
                    <input type="tel" className="form-control" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </MyComponent>
            </div>
            <div key="2">
              {/* MyComponent component with specified title, background color, and children */}
              <MyComponent title="Component 2" backgroundColor="#ccffcc">
                {/* Table component with specified className */}
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Mobile No</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Data to be dynamically populated */}
                    {tableData?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.fname}</td>
                        <td>{item.lname}</td>
                        <td>{item.mobile}</td>
                        <td>
                          <button type="button" className="btn btn-primary btn-sm" onMouseOver={() => handleEdit(item.id)}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </MyComponent>
            </div>
            <div key="3">
              <MyComponent title="Component 3" backgroundColor="#ccccff">
                <p>This is a paragraph inside Component 3.</p>
              </MyComponent>
            </div>
          </GridLayout>
        </div>

      </div>
    </div>

  );
};

export default App;
