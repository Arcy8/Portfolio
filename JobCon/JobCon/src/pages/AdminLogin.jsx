import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterLoginCon, ModalSubmit, RegisterLoginBg, SubmitbuttonCon, RegisterLoginImg, RegisterLoginContent, RegLogCon, SpanText, FormCon, LabelInputCon, LabelInpContent, Label, FormInput } from "../components/Css.style";
import rlbg from "../assets/RegLogBg.jpg"
function AdminLogin() {
  const [formData, setFormData] = useState({
    admin_email: "",
    admin_password: "",
  });

  const navigate = useNavigate();

  const hChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost/JobCon/JobCon/src/API/loginAdmin.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTimeout(() => {
            navigate("/admin");
        }, 1500); 
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <RegisterLoginCon>
      <RegisterLoginBg>
        <RegisterLoginImg src={rlbg}/>
      </RegisterLoginBg>

      <RegisterLoginContent $height="350px">
        <RegLogCon>
        <SpanText size="23px" color="rgb(46, 44, 44)" fontWeight="700">Admin</SpanText>
        </RegLogCon>
      <FormCon onSubmit={hSubmit}>
        <LabelInputCon $justify="center">
          <LabelInpContent $width="320px" $border="none">
            <Label>Email</Label>
        <FormInput width="310px" type="text" name="admin_email" placeholder="Email" required onChange={hChange} />
        </LabelInpContent>
        </LabelInputCon>


        <LabelInputCon $justify="center">
          <LabelInpContent $width="320px" $border="none">
            <Label>Email</Label>
            <FormInput width="310px" type="password" name="admin_password" placeholder="Password" required onChange={hChange} />
            </LabelInpContent>
        </LabelInputCon>

        <LabelInputCon>
          <LabelInpContent $border="none">
            <SubmitbuttonCon>
              <ModalSubmit $width="180px" type="submit">Login</ModalSubmit> 
            </SubmitbuttonCon>
          </LabelInpContent>
        </LabelInputCon>
        
      </FormCon>
      </RegisterLoginContent>
    </RegisterLoginCon>
  );
}

export default AdminLogin;
