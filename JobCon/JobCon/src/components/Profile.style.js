import { Link } from "react-router-dom";
import styled from "styled-components";


export const ProfileDataContainer = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-evenly;
    align-items: center;
   

`;

export const ProfileDataForm = styled.form`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-evenly;
    align-items: center;

 


`;


export const Input = styled.input`
    border: none;
    width: 90%;
    height: 90%;
    outline: none;
    margin-top: ${props => props.$mar || "none"};
   

`;

export const Form = styled.form`
    width: 100%;
    height: 100%;
    
    
 
`;


export const DataContainer = styled.div`
    width: 95%;
    height: ${props => props.$height || "80px"};
    display: flex;
    justify-content: space-evenly;
    align-items: start;
    flex-direction: column;


`;

export const DataContent = styled.div`
    width: 96%;
    height: 40px;
    box-shadow: 0 0 0 1px #d7d6d6ff;
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 10px;
    border-radius: 5px;

`;


