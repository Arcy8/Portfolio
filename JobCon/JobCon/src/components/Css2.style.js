import { Link } from "react-router-dom";
import styled from "styled-components";

export const AdminContainer = styled.div`
    position: absolute;
    background-color:rgb(24, 34, 53);
    top: 0;
    left: 0;
    right: 0;
    height: 700vh;

`;


export const ChartBar = styled.div`
    box-shadow: 0 2px 5px rgba(0,0,0,0.1) ;
    background-color: white;
    padding: 10px;
    height: ${props => props.$height || "100%"};
    width: 500px;
    border-radius: 3px;
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
`;


export const ChartBarContainer = styled.div`
    height: auto;
    max-height: 500px;
    width: 60%;
    overflow-x: auto;
    white-space: nowrap;
    cursor: pointer;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1) ;
  

`;

export const AcceptedJobCon = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: start;
    flex-direction: row;
    padding: 10px;
    background-color:#edeef0ff;
    

    ::-webkit-scrollbar {
    display: none; 


}   
    

`;




export const DoughChartCon = styled.div`
    display: flex;
    justify-content: start;
    align-items: start;
    flex-direction: column;
    height: 500px;


`;

export const  DescriptionCon = styled.div`
    border: 1px solid gray;
    height: ${props => props.$height || "auto"};
    width: 100%;
    display: flex;
    justify-content: ${props => props.$justify || "center"};
    align-items: ${props => props.$align || "center"};
`;


export const DescriptionText = styled.span`
    font-size: ${props => props.$size || "13px"};
    font-weight: ${props => props.$font || "500"};
    font-family: 'Roboto', sans-serif;
    line-height: 1.5;
    text-align: justify ;
    max-width : 100%;
    word-wrap: break-word;
    margin: 3px;

`;

export const DescriptionUl = styled.ul`

    margin: 0;
    display: flex;
    justify-content: start;
    align-items: start;
    flex-direction: column;
`;

export const DescriptionLi = styled.li`

    

`;

//========================Profile page======================================================
export const ProfileContainer = styled.div`
    position: absolute;
    left: 15%;
    top: 74px;
    height: 88vh;
    right: 0;
    
    padding: 10px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
    align-items: center;
    background-color: #edeef0ff;

`;

export const ScheduleContainer = styled.div`


`;

export const ProfileContent = styled.div`
    height: 86vh;
    width: ${props => props.$width || "500px"};
    margin: 5px;
    padding:5px;
    box-shadow: 0 0 0 1px #d7d6d6ff;
    background-color: white;
    border-radius: 5px;


`;



/////AADDDDMIIIINNNNNNNNNNNNNNNNN SCHEEDULEEEE

export const AdminScheduleCon = styled.div`
    height: 100vh;
    left: 289px;
    position: absolute;
    bottom: 60vh;
    width: 141vh;
    padding: 5px;

    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */


}  
  

`;

export const AdminCon = styled.div`
    position: absolute;
    top: 20px;
    left: 15.9%;
    height: auto;
    width: 155vh;
    overflow-x: hidden;
    white-space: nowrap;
    box-shadow: 0 0 0 1px #d7d6d6ff;
    cursor: pointer;
   

    
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */


}

`;

export const AdminContainerCon = styled.div`
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    background-color: #edeef0ff;
    height: 100vh;



`;


export const ScheduleInputContainer = styled.div`
    width: 100%;
    height: 50px;
    border: 1px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
    

`;

export const ScheduleForm = styled.form`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 47px;
    width: 100%;
    



`;


export const Select = styled.select`
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    font-size: 16px;
    color: #333;

`;

export const Input = styled.input`
    background-color: white;
    padding: 7px 2px;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 100px;


`;


export const UserScheduleCon = styled.div`
    height: auto;
    width: 100%;
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
    }


`;

export const UserScheduleContainer = styled.div`
    height: 100%;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    cursor: pointer;
    box-shadow: 0 0 0 1px #d7d6d6ff;
    border-radius: 5px;
`;



export const DescriptionJobs = styled.div`

    z-index: 303;
    background-color: white;
    width: 640px;
    position: fixed;
    left: 57.5%;
    background-color: white;
    box-shadow: 0px 2px 4px #e5e5e7 ;
    top: 96px;
    max-height: 700px; /* Adjust the height as needed */
    overflow-y: auto;
    &::-webkit-scrollbar {
    display: none;
  }


`;



export const DescriptionContainer = styled.div`
    height: auto;
    width: auto;

    padding: 10px 10px;

`;


export const UlText = styled.span`
    list-style-type: none;
   

`;

export const LiText = styled.li`
    font-family: 'Roboto', sans-serif;
    font-size: ${props => props.$size || "13px"};
    font-weight: ${props => props.$weight || "440"};
    color:${props => props.$textColor || "#3f3f3fff"};
`;


export const LiContainer = styled.div`
    padding: 10px 20px;
    background-color: ${props => props.$bgcolor || "#eeeeeeff"};
    border-radius: 10px;
    margin-top: 5px;
    display: flex;
    justify-content: ${props => props.$justify || "start"};
    align-items: center;
 
`;



export const SubmitBtnContainer = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 10px 10px;

    background-color: white;

`;


export const SubmitBtn = styled.button`
    padding: 10px 20px;
    background-color: #2c3d43;
    color: white;
    border-radius: 3px;
    cursor: pointer;

    &:hover{
        opacity: 0.8;
    }

    &:active{opacity: 0.7;}
`;


export const InputBtn = styled.input`
    padding: 10px 20px;
    cursor: pointer;
    color: #000000ff;
`;


export const AddJobContainer = styled.div`
    display: flex;
    position: absolute;
    left: 15.2%;

    flex-direction: column;
    width: 156vh;
    background-color: #edeef0ff;
    box-shadow: 0 0 0 1px #d7d6d6ff;
    border-radius: 3px;
    top: 0;
    align-items: center;
    


`;


export const AddJobContentCon = styled.div`

    padding: 10px;
    width: ${props => props.$width || "145vh"};
   

`;


export const AddFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: start;


`;


export const FormContentCon = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: start;
    flex-direction: column;
    height: auto;
    padding: 5px;
    margin-top: 5px;
    box-shadow: 0 0 0 1px #d7d6d6ff;
    background-color: #ffffffff;
    border-radius: 3px;


`;



export const JobsContentCon = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: start;
    flex-direction: column;
    height: 50px;
    padding: 5px;
    margin-top: 5px;
    box-shadow: 0 0 0 1px #d7d6d6ff;
    background-color: #ffffffff;
    border-radius: 3px;
    width: 99%;


`;



export const FormContent = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;

`;  

export const TextArea = styled.textarea`
    max-height: 100px;
    height: 50px;
    max-width: 400px;
    width: 400px;

`;

export const InputContent = styled.input`
    padding: 5px 10px;
    width: 282px;
    font-family: 'Roboto', sans-serif;
    color: #312f2f;
    
    
 

`;


export const AddBtn = styled.button`

    background-color: #2c3d43;
    color: #e3ebeeff;
    margin-left: 20px;
    padding: ${props => props.$padding || "5px 20px"};
    border-radius: 3px;
    cursor: pointer;

    &:hover{
        opacity: 0.8;
    }


    &:active{
        opacity: 0.7;

    }

`;


export const UlForm = styled.ul`
    list-style: none;

`;

export const LiForm = styled.li`
    font-family: 'Roboto', sans-serif;
    font-size: ${props => props.$size || "15px"};
    font-weight: ${props => props.$weight || "400"};
    color:${props => props.$labelColor || "#312f2f"};
`;


export const LiCon = styled.div`

    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    width: 99%;
    box-shadow: 0 0 0 1px #e8e8e8ff;
    border-radius: 5px;
    margin-top: 5px;
    padding: 5px;
    background-color: #f3f3f3ff;


    
`;

export const SelectForm = styled.select`
    padding: 5px 10px;
    width: 305px;
    font-family: 'Roboto', sans-serif;
    color: #312f2f;
`;


export const LiContentCon =styled.div`
    

`;

export const SubmitAddJob = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin-top: 10px;
    
`;


export const ApplicantContainer = styled.div`
  
    padding: 10px 20px;
    margin-top: 30px;
    margin-top: 100px;

`;


export const ApplicantBtnContainer = styled.div`
  

`;



export const ApplicantMainContainer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color:red ;

`;




