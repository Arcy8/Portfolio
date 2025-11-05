import { useState } from "react";
import { useNavigate } from "react-router-dom";
import rlbg from "../assets/RegLogBg.jpg";
import {
  RegisterLoginCon,
  RegisterLoginContent,
  FormCon,
  RegLogCon,
  LabelInputCon,
  LabelInpContent,
  Label,
  FormInput,
  SpanText,
  ModalSubmit,
  RegLogLinkCon,
  RegLogLink,
  SubmitbuttonCon,
  RegisterLoginBg,
  RegisterLoginImg,
} from "../components/Css.style";
import Header from "../components/Header";


function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();


  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }


  function handleSubmit(e) {
    e.preventDefault();


    fetch("http://localhost/JobCon/JobCon/src/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("firstname", data.firstname);
          localStorage.setItem("lastname", data.lastname);
          localStorage.setItem("email", data.email);
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert("Error during login");
        console.error("Error:", error);
      });
  }


  return (
    <RegisterLoginCon>
      <Header />
      <RegisterLoginBg>
        <RegisterLoginImg src={rlbg} />
      </RegisterLoginBg>
      <RegisterLoginContent $height="350px">
        <RegLogCon>
          <SpanText size="23px" color="rgb(46, 44, 44)" fontWeight="700">
            Login
          </SpanText>
        </RegLogCon>
        <FormCon autoComplete="off" onSubmit={handleSubmit}>
          <LabelInputCon $justify="center">
            <LabelInpContent $width="320px" $border="none">
              <Label>Email</Label>
              <FormInput
                width="310px"
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
              />
            </LabelInpContent>
          </LabelInputCon>
          <LabelInputCon $justify="center">
            <LabelInpContent $width="320px" $border="none">
              <Label>Password</Label>
              <FormInput
                width="310px"
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />
            </LabelInpContent>
          </LabelInputCon>
          <LabelInputCon>
            <LabelInpContent $border="none">
              <SubmitbuttonCon>
                <ModalSubmit $width="180px" type="submit">
                  Login
                </ModalSubmit>
              </SubmitbuttonCon>
              <RegLogLinkCon>
                <SpanText color="rgb(73, 73, 70)" fontWeight="500">
                  Don't have an account?{" "}
                  <RegLogLink to={"/register"}>Signup</RegLogLink>
                </SpanText>
              </RegLogLinkCon>
            </LabelInpContent>
          </LabelInputCon>
        </FormCon>
      </RegisterLoginContent>
    </RegisterLoginCon>
  );
}


export default Login;
