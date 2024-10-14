import { useState, useEffect } from "react";
import "./App.css";

function App() {
  //List item useState
  const [item, setItem] = useState({
    date: "",
    steps: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value !== "") {
      setItem((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  //List useState to hold all the items created
  const [list, setList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the fields are not empty
    if (item.date !== "" && item.steps !== "") {
      // Find the index of the existing item with the same date
      const existingItemIndex = list.findIndex(
        (listItem) => listItem.date === item.date
      );

      if (existingItemIndex !== -1) {
        // If the date exists, update the steps for that date
        setList((prevItems) => {
          const updatedItems = [...prevItems];
          console.log(updatedItems);

          // Ensure steps are valid numbers
          const currentSteps =
            parseInt(updatedItems[existingItemIndex].steps) || 0;
          const newSteps = parseInt(item.steps) || 0;

          console.log(currentSteps);
          console.log(newSteps);

          // Update the steps
          updatedItems[existingItemIndex].steps = currentSteps + newSteps;

          // Save updated item to localStorage
          localStorage.setItem(
            updatedItems[existingItemIndex].date,
            JSON.stringify(updatedItems[existingItemIndex])
          );

          return updatedItems;
        });
      } else {
        // If the date does not exist, add a new entry
        setList((prevItems) => {
          const updatedList = [...prevItems, item];

          // Save new item to localStorage
          localStorage.setItem(item.date, JSON.stringify(item));

          return updatedList;
        });
      }

      // Reset the state
      setItem({
        date: "",
        steps: "",
      });
    } else {
      // Optionally handle the case where values are empty
      alert("Please fill in all fields");
    }
  };

  // On component mount, retrieve items from localStorage if they exist
  useEffect(() => {
    const keys = Object.keys(localStorage);
    const storedList = [];

    keys.forEach((key) => {
      try {
        const listItem = JSON.parse(localStorage.getItem(key));
        if (listItem && listItem.date && listItem.steps) {
          storedList.push(listItem);
        }
      } catch (error) {
        console.error("Error parsing item from localStorage", error);
      }
    });

    setList(storedList);
  }, []);

  //Calculate total steps
  const totalSteps = list.reduce((accumulator, currentItem) => {
    return accumulator + (parseInt(currentItem.steps) || 0);
  }, 0);

  // console.log(totalSteps);

  return (
    <div className="App">
      <div className="main">
        {/* User Information */}
        <div className="info">
          <h1>Steptober Challenge</h1>
          <h3>Ishrak Karim</h3>
          <p>My steps</p>
        </div>

        {/* Form */}
        <div className="stepForm">
          <input
            type="date"
            id="date"
            name="date"
            placeholder="dd/mm/yyyy"
            value={item.date}
            onChange={handleChange}
          />

          <div className="steps-and-button">
            <input
              type="number"
              id="number"
              min="0"
              name="steps"
              placeholder="steps"
              value={item.steps}
              onChange={handleChange}
            />

            <button onClick={handleSubmit}>Add Steps</button>
          </div>
        </div>

        {/* User list to count steps*/}
        <ul>
          {list
            .slice() // Create a shallow copy of the list to avoid mutating the original
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date in descending order
            .map((listItem, index) => {
              const formattedDate = new Date(listItem.date).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );

              return (
                <li key={index} className="list-item">
                  <div>
                    {list.length - index} - {formattedDate}{" "}
                  </div>
                  <div>{listItem.steps}</div>
                </li>
              );
            })}
        </ul>

        {/* Total steps */}
        <hr className="hr-total"></hr>
        <div className="total">
          <div>
            TOTAL steps in{" "}
            {list.length === 1 ? `${list.length} day` : `${list.length} days`}
          </div>
          <div>{totalSteps}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
