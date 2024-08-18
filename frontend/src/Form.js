import React from 'react';
import { gsap } from 'gsap';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      file: null,
      fileName: 'No file chosen',
      currentStep: 1,
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    this.setState({
      file: file,
      fileName: file ? file.name : 'No file chosen'
    });
  }

  nextformpart = (event) => {
    event.preventDefault();

    const tl = gsap.timeline({
      onComplete: () => {
        this.setState({
          currentStep: this.state.currentStep + 1
        });
        gsap.fromTo(".form-content *", {
          x: '20', // Start from the right side
          opacity: 0
        }, {
          x: '0',
          opacity: 1,
          duration: 0.1,
          stagger: 0.0,
          ease: "power1.out"
        });
      }
    });

    tl.to(".form-content *", {
      x: -20,
      opacity: 0,
      duration: 0.1,
      stagger: 0.0,
      ease: "power1.inOut"
    });
  }

  prevformpart = (event) => {
    event.preventDefault();

    const tl = gsap.timeline({
      onComplete: () => {
        this.setState({
          currentStep: this.state.currentStep - 1
        });
        gsap.fromTo(".form-content *", {
          x: '-20', // Start from the right side
          opacity: 0
        }, {
          x: '0',
          opacity: 1,
          duration: 0.1,
          stagger: 0.0,
          ease: "power1.out"
        });
      }
    });

    tl.to(".form-content *", {
      x: 20,
      opacity: 0,
      duration: 0.1,
      stagger: 0.0,
      ease: "power1.inOut"
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const token_options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: 'sepheiba@gmail.com',
        password: 'areon130'
      })
    };

    fetch('http://127.0.0.1:8000/api/token/', token_options)
      .then(response => response.json())
      .then(data => {
        const accessToken = data.access;
        console.log(accessToken);


        // Create a FormData object
        const form = new FormData();
        form.append("image", this.state.file);
        form.append("name", this.state.name);
        form.append("home_address", this.state.address);
        form.append("city", this.state.city);
        form.append("phone_number", this.state.phone);
        form.append("email", this.state.email);

        const models_options = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
          body: form
        };

        fetch('http://127.0.0.1:8000/api/commands/', models_options)
          .then(response => response.json())
          .then(response => console.log(response))
          .catch(err => console.error(err));


      })
      .catch(err => console.error(err));


    // Update state as needed
    this.setState({
      currentStep: 4
    });
  }

  render() {
    if (this.state.currentStep === 1) {
      return (
        <div className="form-content">
          <div className="mb-3">
            <input 
              className="form-control"
              type="text" 
              id="name" 
              name="name" 
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Full name"
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              className="form-control"
              type="text" 
              id="email" 
              name="email" 
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Email"
              required 
            />
          </div>
          <div className="d-flex justify-content-between">
            <button onClick={this.nextformpart} className="btn w-100 form-button btn-primary">Next</button>
          </div>
        </div>
      );
    } else if (this.state.currentStep === 2) {
      return (
        <div className="form-content">
          <div className="mb-3">
            <input 
              className="form-control"
              type="text" 
              id="phone" 
              name="phone" 
              value={this.state.phone}
              onChange={this.handleChange}
              placeholder="Phone Number"
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              className="form-control"
              type="text" 
              id="address" 
              name="address" 
              value={this.state.address}
              onChange={this.handleChange}
              placeholder="Home Address"
              required 
            />
          </div>
          <div className="d-flex justify-content-between">
            <button onClick={this.prevformpart} className="btn w-100 form-button btn-secondary me-3">Back</button>
            <button onClick={this.nextformpart} className="btn w-100 form-button btn-primary">Next</button>
          </div>
        </div>
      );
    } else if (this.state.currentStep === 3) {
      return (
        <div className="form-content">
          <div className="mb-3">
            <input 
              className="form-control"
              type="text" 
              id="city" 
              name="city" 
              value={this.state.city}
              onChange={this.handleChange}
              placeholder="City"
              required 
            />
          </div>
        <div className="mb-3">
          <div className="input-group custom-file-button">
            <label className="input-group-text" htmlFor="file" role="button">Chose File</label>
            <label className="form-control" id="file-label" htmlFor="file" role="button">{this.state.fileName}</label>
            <input 
              type="file" 
              className="d-none" 
              id="file" 
              name="file" 
              onChange={this.handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
          <div className="d-flex justify-content-between">
            <button onClick={this.prevformpart} className="btn w-100 form-button btn-secondary me-3">Back</button>
            <button onClick={this.handleSubmit} className="btn w-100 submit-button btn-primary">Submit</button>
          </div>
        </div>
      );
    } else if (this.state.currentStep === 4) {
      return (
        <div className="form-subbmitted text-center">
          <p>Thank you, form submitted.</p>
        </div>
      );
    }
  }
}

export default Form
