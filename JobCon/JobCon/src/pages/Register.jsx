import { useState } from "react";
import { useNavigate } from "react-router-dom";
import rlbg from "../assets/RegLogBg.jpg"
import { RegisterLoginCon, RegisterLoginContent, FormCon, RegLogCon, LabelInputCon, LabelInpContent, Label,
        FormInput, SpanText, ModalSubmit, SubmitbuttonCon, RegLogLink, RegLogLinkCon, RegisterLoginBg,
        RegisterLoginImg, TextSpanAlert, TextSpanAlertCon

 } from "../components/Css.style";
 import Header from "../components/Header";

function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    pnumber: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    let newErrors = { ...errors };
    if (name === "email") {
      if (value.length < 15) {
        newErrors.email = "Email must be at least 15 characters long.";
      } else if (!value.endsWith("@gmail.com")) {
        newErrors.email = "Email must end with @gmail.com.";
      } else {
        delete newErrors.email;
      }
    }
    if (name === "password") {
      if (value.length <= 8) {
        newErrors.password = "Password must be more than 8 characters.";
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    let newErrors = {};
    if (formData.email.length < 15) {
      newErrors.email = "Email must be at least 15 characters long.";
    } else if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must end with @gmail.com.";
    }
    if (formData.password.length <= 8) {
      newErrors.password = "Password must be more than 8 characters.";
    }
    if (!formData.pnumber.trim()) {
      newErrors.pnumber = "Phone number is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateForm()) {
      return;
    }

    fetch("http://localhost/reactphp/reactforphp/src/API/signup.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        if (data.success) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setMessage("Something went wrong.");
      });
  };


  return (
    <RegisterLoginCon >
      <Header/>
      
      <RegisterLoginBg>
        <RegisterLoginImg src={rlbg}/>
      </RegisterLoginBg>

      <RegisterLoginContent $width="450px" $height="500px">


      <RegLogCon>
        <SpanText size="23px" color="rgb(46, 44, 44)" fontWeight="700">Register</SpanText>
      </RegLogCon>
      
      <FormCon autoComplete="off" onSubmit={handleSubmit} >
        
        <LabelInputCon>
          <LabelInpContent>
            <Label>First Name</Label>
            <FormInput type="text" name="firstname" placeholder="First Name" value={formData.firstname} required onChange={handleChange} />
          </LabelInpContent>
          
          <LabelInpContent>
            <Label>Last Name</Label>
            <FormInput type="text" name="lastname" placeholder="Last Name" value={formData.lastname} required onChange={handleChange}   />
          </LabelInpContent>
        
        </LabelInputCon>

        <TextSpanAlertCon/>

        <LabelInputCon>


          <LabelInpContent>
            <Label>Phone Number</Label>
            <FormInput type="tel" name="pnumber" placeholder="Phone Number" value={formData.pnumber} required onChange={handleChange} />
          </LabelInpContent>

          <LabelInpContent>
            <Label>Email</Label>
            <FormInput  type="email" name="email" placeholder="Email" value={formData.email} required onChange={handleChange} />
          </LabelInpContent>
       
        </LabelInputCon>
        <TextSpanAlertCon>
        {errors.email && (
          <TextSpanAlert>{errors.email}</TextSpanAlert> 
          )}
        </TextSpanAlertCon>

       

        <LabelInputCon>
          <LabelInpContent>
            <Label>Password</Label>
            <FormInput type="password" name="password" placeholder="Password" value={formData.password} required onChange={handleChange} />
          </LabelInpContent>

          <LabelInpContent>
            <SubmitbuttonCon>
              <ModalSubmit $width="180px" type="submit">Sign Up</ModalSubmit>
            </SubmitbuttonCon>
            <RegLogLinkCon>
            <SpanText color='rgb(73, 73, 70)' fontWeight="500">Already have an account? <RegLogLink to={"/login"}>Login</RegLogLink></SpanText>
            </RegLogLinkCon>
          </LabelInpContent>
          
       
        </LabelInputCon>

        <TextSpanAlertCon>
          {errors.password && (
            <TextSpanAlert>{errors.password}</TextSpanAlert>
          )}
        </TextSpanAlertCon>
        

      </FormCon>

  
      
      </RegisterLoginContent>
    </RegisterLoginCon>
  );
}

export default Register;
