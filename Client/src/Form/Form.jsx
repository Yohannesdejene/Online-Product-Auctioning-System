import React from "react";
import { useState } from "react";
import "./Form.css";

function Form() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    personType: "seller",
    region: "",
    city: "",
  });
  const [message, setMessage] = useState("");
  //   console.log(formData.favColor);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    if (formData.password !=formData.confirmPassword) {
      //console.log("password mismatch");
   
      setMessage("password mismatch");
      console.log(message);
    
    } else {
      setMessage("correct");
      console.log(message);
    }

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
  }
  return (
    <div className="formdiv">
      <form className="form"onSubmit={handleSubmit}>
        <h1 className="header">Create an account</h1>

        <div className="personType">
          <input
            type="radio"
            id="seller"
            name="personType"
            value="seller"
            checked={formData.personType === "seller"}
            onChange={handleChange}
          />
          <label htmlFor="seller">Seller account</label>

          <input
            type="radio"
            id="buyer"
            name="personType"
            value="buyer"
            checked={formData.personType === "buyer"}
            onChange={handleChange}
          />

          <label htmlFor="buyer">Buyer account</label>
        </div>
        <div className="totalForm">
          <div className="commonForm">
            <input
              type="text"
              placeholder="First Name"
              onChange={handleChange}
              name="firstName"
              value={formData.firstName}
              className="input"
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={handleChange}
              name="lastName"
              value={formData.lastName}
              className="input"
            />
            <input
              type="email"
              placeholder="Email"
              onChange={handleChange}
              name="email"
              value={formData.email}
              className="input"
            />
            <input
              type="number"
              placeholder="Phone number"
              onChange={handleChange}
              name="phone"
              value={formData.phone}
              className="input"
            />
            <input
              type="password"
              placeholder="password"
              onChange={handleChange}
              name="password"
              value={formData.password}
              className="input"
            />

            <input
              type="password"
              placeholder="Confirm password"
              onChange={handleChange}
              name="confirmPassword"
              value={formData.confirmPassword}
              className="input"
            />
            <label>{message} </label>
          </div>
          {formData.personType === "seller" && (
            <div className="additionalForm">
              <select
                id="region"
                value={formData.region}
                onChange={handleChange}
                name="region"
                className="input"
                placeholder="Region"
              >
                <option value="">-- Choose --</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Dire dawa">Dire dawa</option>
                <option value="Oromia">Oromia</option>
                <option value="Amhara">Amhara</option>
                <option value="Tigray">Tigray</option>
                <option value="Sidama">Sidama</option>
                <option value="Afar">Afar</option>
                <option value="Somali">Somali</option>
                <option value="Gambela"> Gambela </option>
                <option value="Harari">Harari</option>
                <option value="Benishangul-Gumuz">Benishangul-Gumuz</option>
                <option value="South West Ethiopia Peoples'">
                  South West Ethiopia Peoples'
                </option>
                <option value="Southern Nations, Nationalities, and Peoples'">
                  Southern Nations, Nationalities, and Peoples'
                </option>
              </select>

              <input
                type="text"
                placeholder="City"
                onChange={handleChange}
                name="city"
                value={formData.city}
                className="input"
              />
            </div>
          )}
        </div>

        <button className="submitButton"> Create account</button>
      </form>
    </div>
  );
}

export default Form;
