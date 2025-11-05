import { Link } from "react-router-dom";
import styled from "styled-components";



export const ChatBotContainer = styled.div`
    height: ${props => props.$height || "50px"};
    width: 100%;
    display: flex;
    padding: 5px;
    justify-content: space-evenly;
    align-items: center;
    background-color: #f8f4f4ff;
    .no-scrollbar::-webkit-scrollbar {
        display: none;
        }


`;


export const ChatBotContent = styled.div`
    .no-scrollbar::-webkit-scrollbar {
        display: none;
        }

`;



export const Input = styled.input`
    width: 80%;
    border-radius: 20px;
    height: 20px;
    padding: 5px;
    outline: none;
    box-shadow: 0 0 0 1px #e8e8e8ff;
    border: none;
    background-color: #e8e8e8ff ;
    font-family: 'Roboto', sans-serif;


`;


export const Btn = styled.button`
    font-size: 13px;
    background-color: #f8f4f4ff;
    border: none;
    padding: 5px;

`;



export const ResponsesContainer = styled.div`
    height: auto;
    width: 99%;
    padding: 5px;

    margin-top: 10px;
    
    border-radius: 5px;
    background-color: #ffffffff;

`;


export const ContainerResponse = styled.div`
    height: auto;
    width: 99%;
    padding: 5px;

    margin-top: 10px;

    box-shadow: 0 0 0 1px #e8e8e8ff;
    background-color: #f4f0f0ff;


`;