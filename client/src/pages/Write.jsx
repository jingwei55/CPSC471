import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

function PetTypeDropdown({ onSelectPetType, onSubmit }) {
  const [selectedPetType, setSelectedPetType] = useState('');
  const [petAge, setPetAge] = useState('');
  const [description, setDescription] = useState('');
  const [petName, setPetName] = useState('');

  const handlePetTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedPetType(selectedType);
    onSelectPetType(selectedType); // Notify the parent component about the selected pet type
  };

  const handlePetAgeChange = (event) => {
    setPetAge(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    // Limit the description to 100 characters
    const limitedDescription = event.target.value.slice(0, 100);
    setDescription(limitedDescription);
  };

  const handlePetNameChange = (event) => {
    setPetName(event.target.value);
  };

  const handleSubmit = () => {
    // Create an object with the form data
    const formData = {
      petName,
      selectedPetType,
      petAge,
      description,
    };

    // Call the onSubmit prop to handle the submission (e.g., send data to a database)
    onSubmit(formData);

    // Clear the form after submission
    setPetName('');
    setSelectedPetType('');
    setPetAge('');
    setDescription('');
  };

  // Generate an array of numbers from 0 to 100 for the pet age dropdown
  const ageOptions = Array.from({ length: 101 }, (_, index) => index);

  return (
    <div className="pet-type-dropdown">
      <div>
        <label htmlFor="petName">Pet Name: </label>
        <input
          type="text"
          id="petName"
          value={petName}
          onChange={handlePetNameChange}
          placeholder="Insert Name Here"
        />
      </div>

      <label htmlFor="petType">Select Pet Type: </label>
      <select id="petType" value={selectedPetType} onChange={handlePetTypeChange}>
        <option value="">Select an option</option>
        <option value="amphibian">Amphibian</option>
        <option value="reptile">Reptile</option>
        <option value="mammal">Mammal</option>
        <option value="other">Other</option>
      </select>

      <div>
        <label htmlFor="petAge">Pet Age: </label>
        <select
          id="petAge"
          value={petAge}
          onChange={handlePetAgeChange}
        >
          <option value="">Select an age</option>
          {ageOptions.map((age) => (
            <option key={age} value={age}>{age} years</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description">Description: </label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter description here (max 100 characters)"
          rows="4"
          cols="50"
        />
      </div>

      <button type="button" onClick={handleSubmit}>Submit</button>

      {selectedPetType && (
        <p>
          Pet Name: {petName || 'N/A'}. You selected: {selectedPetType} with age {petAge || 'N/A'}.
          Description: {description || 'N/A'}
        </p>
      )}
    </div>
  );
}

const Write = () => {
  const state = useLocation().state;
  const [value, setValue] = useState(state?.title || "");
  const [title, setTitle] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate()

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      state
        ? await axios.put(`/posts/${state.id}`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
          })
        : await axios.post(`/posts/`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          });
          navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <div>
          <PetTypeDropdown/>
        </div>
      </div>
    </div>
  );
};

export default Write;
