import { Link } from "react-router-dom";
import styled from "styled-components";





export const JoblistContainer = styled.div`
    height: ${props => props.$height || "auto"};
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    border-top: ${props => props.$border || "none"};

    


`;



export const JoblistContentCon = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: ${props => props.$justify || "start"};
    align-items: center;
    padding: 5px 15px;
    background-color: ${props => props.$bgcolor  || "white"};
    border-radius: 5px;
    
 
    
`;



export const TextSpan = styled.span`
    font-family: 'Roboto', sans-serif;
    font-size: ${props => props.$size || "13px"};
    font-weight: ${props => props.$weight || "440"};
    color:${props => props.$textColor || "#312f2f"};
    margin-left: ${props => props.$margin || "none"};



`;

export const TextLabel = styled.label`
    font-family: 'Roboto', sans-serif;
    font-size: ${props => props.$size || "15px"};
    font-weight: ${props => props.$weight || "410"};
    color:${props => props.$labelColor || "#312f2f"};

`;

export const TextSpanDes = styled.span`
    font-family: 'Roboto', sans-serif;
    letter-spacing: 0.5px;           
    font-size: 13px;                  
    color: #333;                     
    white-space: pre-wrap;           

`;


export const JobListDesignCon = styled.div`
    padding: 5px 15px;
    background-color: ${props => props.$bgcolor || "rgba(214, 218, 219, 0.26)"};
    border-radius: 10px;
   
    margin-left: 5px;
`;


