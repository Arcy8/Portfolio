import { Link } from "react-router-dom";
import styled from "styled-components";






//IMAGES

export const ImgCon = styled.div `
    width: 300px;
    height: 180px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

`;

export const Image = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 8px ;
   
    
`;

export const CompanyImg = styled.div`
    height: 160px;
    width: 280px;
    background-color: white;
    border-radius: 8px;
  
    

`;

export const ProfileNameCon = styled.div`
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

`;

export const ProfileName = styled.span`
    font-size: 20px;
    font-family: 'Roboto', sans-serif; 
    font-weight: 500;
    margin-top: 20px;
    color:  #292e32ff;

`;

export const ProfileImgCon = styled.div`
    height: 200px;
    width: 200px;
    

`;


export const ProfileImg = styled.img`
    border-radius: 50%;
    height: 100%;
    width: 100%;
    object-fit: cover;
    
`;


//<-------------LINKS------------------------------------->
export const HomeBtnLink = styled(Link)`
    text-decoration: none;
    
`;


//<----------------------------------------------->




//HEADER

export const HeaderContainer = styled.header`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 74px;
    z-index: 110;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: white;
    box-shadow: ${props => props.$shadow || "0 3px 2px rgba(222, 217, 217, 0.3)"};

 
    
  

`;

export const LogoutContainer = styled.div`
    width: 500px;
    height: 72px;
    display: flex;
    justify-content: space-evenly;
    align-items: center ;
`;

export const LogoutProfileCon = styled.div`
    height: 60px;
    width: 250px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    
  
`;

export const LogOutProfileName = styled.div`
    height: 60px;
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ApplyJobCon = styled.div`
    width: 150px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ButtonMain = styled.button`
    background-color:  #2c3d43;
    color:rgb(236, 239, 240);
    border: none;
    padding: 10px 20px;
    font-family: 'Roboto', sans-serif; 
    font-size: 14px;
    font-weight: 500;
    border-radius: 3px;
    cursor: pointer;


    &:hover{
        transform: translateY(-1px);
    }
`;

export const LogOutProfile = styled.img`
    height: 55px;
    width: 55px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;

    &:hover{
        border: 2px solid rgb(65, 69, 69);
    }
`;

export const LogOutProfileContent = styled.div`
    display: ${({ open }) => (open ? "block" : "none")};
    height: 250px;
    width: 240px;
    background-color: white;
    box-shadow: 1px 1px 5px gray;
    position: fixed;
    right: 5px;
    top: 77px;
    z-index: 500;
  
    
`;

export const LogOutProfileCon = styled.div`
    height: 250px;
    width: 235px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const LogOutContentCon = styled.div`
    width: 200px;
    height: 47px;
    border-bottom: 1px solid;
    margin-bottom: 10px;
    display: flex;
    justify-content: start;
    align-items: center;
    cursor: pointer;

    &:hover{
        transform: translateY(-2px);
        
    }
`;

export const LogOutNotifCon = styled.div`
    height: 55px;
    width: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Bell = styled.i`
    font-size: 25px;
    cursor: pointer;

    &:hover{
        font-size: 27px;
        
    }

`;


export const Headernav = styled.div`
    width: 600px;
    height: 72px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

export const LogoContainer = styled.div`
    width: 230px;
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;


`;

export const Logo = styled.img`
    width: 150px;
    height: 72px;
    object-fit: cover;
`;

export const HeaderLink = styled(Link)`
    text-decoration: none;
    color:  #2c3d43;  
    font-family: 'Roboto', sans-serif;
    font-size: 17px;
    font-weight: bold;

    &:hover{
        opacity: 0.8;
    }

`;
//<----------------------------------------------------------------------------------------------------------------->

export const ProfileContainer = styled.div`
    width: 200px;
    height: 200px;
    margin: 20px 0px;
    

`;




export const AsideContainer = styled.aside`
    position: fixed;
    top: ${props => props.$top || "73px"} ;
    bottom: 0;
    ${(props) => (props.$position === 'right' ? 'right: 0;' : 'left: 0;' ) }
    width: ${(props) => props.$width || "300px"};
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1002;
    background-color: ${props => props.$backcolor || "white"};
    box-shadow: 0 2px 5px rgba(163, 161, 161, 0.1) ;
`;

export const SearchContainer = styled.div`
    position: fixed;
    left: 230px;
    top: 322px;
    right:300px;
    height: 74px;
    display: flex;
    justify-content: center;
    text-align: center;
    z-index: 2;
    background-color: rgb(255, 255, 255);
  
  
   

`;

export const FormContainer = styled.form`
    margin: 0px 100px;
    display: flex;
    justify-content: center;
    align-items: center;
`;


export const Input =  styled.input`
    padding: 10px 10px;
    width: 700px;
    border-radius: 10px;
    outline: none;
    border: none;
    box-shadow: 1px 1px 3px gray;
   
`;

export const MapContainer = styled.div`
    width: 250px;
    height: 300px;
    border: 1px solid gray;
    margin: 20px 0px 0px 0px;

`;





export const MainContainer = styled.main`
    position: absolute;
    top: ${({$mainTop}) => $mainTop || "74px"};
    right: 300px;
    bottom: auto;
    left: 230px;
 

    

`;

export const AlertMessage = styled.div`
     
    position: fixed; 
    top: 600px;
    left: 29px;
    background-color: #2c3d43; 
    color: white;
    padding: 10px 20px; 
    border: 5px;
    z-index: 2000;
    transition: all 1s ease-in-out;
    border-radius: 5px;
 

`;


export const MySelectinTextCon = styled.div`
    height: 50px;
    width: ${props => props.$width || "100%"};
    display: flex;
    justify-content: ${props => props.$justifyCon || "start"};
    align-items: center;
    background-color: white;
`;

export const Span = styled.span`
    font-size: ${props => props.$fSize || "15px"};
    font-family: 'Roboto', sans-serif;
    margin-left: ${props => props.$marginL || "0px"};
    font-weight: ${props => props.$fWeight || "500"};
    color: ${props => props.color || "rgb(244, 244, 244)"};
    
`;



export const CardContainer = styled.div`
    top: 200px;
    width: 600px;
    height: auto;
    background-color: #ffffffff;
    border-radius: 8px;
    transition: transform 0.3s ease;
     box-shadow: 0px 2px 4px #e5e5e7 ;

    

    &:hover {
        transform: translateY(-10px) scale(1.03);
        cursor: pointer;
        
    }

`;

export const CompanyInfoContainer =  styled.div`
    background-color: white;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    
    

   

`;






export const Hiring = styled.div`
    padding: 10px 10px;
    background-color: #2c3d43;
    color:rgb(251, 251, 255);
    position: absolute;
    border-radius: 8px;
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    font-weight: 600;
    margin: 5px 5px;
    
    

    ${CardContainer}:hover & {opacity: 0;}
    

`;

export const FavoriteBtn = styled.button`
    padding: 5px;
    position: absolute;
    margin: 10px 240px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: 15px;
    background-color:rgb(239, 242, 243);


    &:hover{
        transform: scale(1.2);
    }

    &:active{
        transform: scale(1.3);
        opacity: 0.9;
    }
`;

export const HeartIcon = styled.i`
    font-size: 15px;
    color: #2c3d43;
    

`;

export const CompanyInfo = styled.div`
    height: ${props => props.$height || "35px"};
    width: auto;
    display: flex;
    justify-content:start;
    align-items: center;
`;

export const SpanText = styled.span`
    font-size: ${(props) => props.size || "13px"};
    font-weight: ${(props) => props.fontWeight || '500'};
    font-family: 'Roboto', sans-serif;
    margin: 0px 14px;
    color: ${(props) => props.color || "grey"};

   
    
`;




export const CompanyContainer = styled.div`
    position: absolute ;
    bottom: auto;
    left: 0;
    right: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
    height: auto;
    width: 151.5vh;
    z-index:3;
    background-color: #edeef0ff;
    padding-top: 100px;
   
  
    
   

  
    
`;

//SLIDER
export const RecommendedContainer = styled.div`
    position: fixed;
    left: 150px;
    top: 75px;
    right:300px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    background-color: white;
    z-index: 22222;
   
    
`;

export const RecommendedCard = styled.div`
    height: 210px;
    width: 500px;
    background-color: gray;
    border-radius: 8px ;
    box-shadow: 1px 1px 5px gray;
    border: 1px solid;

`;


export const Img = styled.img`
    width: 500px;
    height: 210px;
    border-radius: 8px ;
    object-fit: fill;

`;


//SIDEBAR NAVIGATION CSS

export const NavContainer = styled.div`
    margin-top: 50px;
    display: flex;
    justify-content: start;
    height: 250px;
    width: 200px;


`;

export const SidebarLink = styled(Link)`

    text-decoration: none;
    color:  ${props => props.$sidecolor || "#2c3d43"};
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: bold;
    height: 40px;
    display: flex;
    align-items: center;
    width: 199px;
    border-radius: 8px;


    &:hover{
        background-color: rgb(244, 242, 242);
        color: black;
    }

  

`;


export const SpanText2 = styled.span`
    font-size: ${(props) => props.size || "13px"};
    font-weight: ${(props) => props.fontWeight || '500'};
    font-family: 'Roboto', sans-serif;
    margin: 0px 10px;
    color:   ${props => props.$spancolor || "#2c3d43"};

    ${SidebarLink}:hover &{color: black;}

   
    
`;

export const Icon = styled.i`
    margin-left: 10px;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center ;
    align-items: center;

`;

export const SidebarNav = styled.nav`
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
`;


//Button


export const Buttons = styled.button`
    background-color: #2c3d43;
    color:rgb(255, 255, 255);
    position: absolute;
    padding: 10px 11px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    margin: 5px 5px;
    font-size: 13px;
    font-family: 'Roboto', sans-serif;
    opacity: 0;
    

    ${CardContainer}:hover & {opacity: 1;}

    &:hover{
        color:rgb(255, 255, 255);
        font-size: 13.3px;
        
       
    }

    &:active{
        background-color: #2c3d43;
        font-size: 13.7px;
       
    
        
    }
`;


//About us Css

export const AboutUsContainerMain = styled.div`
    position: absolute;
    top: 78px;
    height: 180vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

`;

export const AboutUsCon = styled.div`
    height: 100%;
    width: 130vh;
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: 1fr 1fr; 
  


`;

export const AboutUsContainer = styled.div`
    height: 300px;
    width: 500px;
`;


export const AboutUsTextCon = styled.div`
    height: 100px;
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const AboutUsText = styled.h1`
    font-family: 'Roboto', sans-serif;
    font-weight: 500px;
    color:  rgb(73, 65, 65);   
     
`;

export const AboutUsParaCon = styled.div`
    height: 150px;
    width: 500px;
    display: flex;
    align-items: center;
    justify-content: start;
   
    
    
`;

export const AboutUsParaText = styled.p`
    font-family: 'Roboto', sans-serif;
    color:  rgb(73, 65, 65);
    font-size: 16px;
    line-height: 1.6;
    text-align: justify ;
    max-width : 500px ;
    word-wrap: break-word;
    font-weight: 500;


`;

export const JobDescription = styled.p`
    font-family: 'Roboto', sans-serif;
    color:  rgb(73, 65, 65);
    font-size: 14px;
    line-height: 1.6;
    text-align: justify ;
    max-width : 100% ;
    word-wrap: break-word;
    font-weight: 500;
    max-height: 100%;
    overflow-y:auto ;
    scrollbar-width: none; 
    -ms-overflow-style: none;
   

    &::-webkit-scrollbar {
        display: none;
    }
    

`;

export const AboutUsImgCon = styled.div`
    height: 400px;
    width: 500px;
    border-radius: 20%;

`;

export const AboutUsImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20%;

`;

export const MemberContainer = styled.div`
    height: 500px;
    width: 100%;
    border: 1px solid gray;
    position: absolute;
    top: 210vh;
    display: flex;
    grid-gap: 20px;
    justify-content: center;
    align-items: center;
  

`;

export const MemberCon = styled.div`
    height: 100%;
    width: 945px;
    border: 1px solid gray;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;


`;

export const MemberTitleCon = styled.div`
    height: 40px;
    width: 300px;
    display: flex;
    border: 1px solid;
    justify-content: center;
    align-items: center;
    margin: 5px 0px;

`;

export const MemberImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const MyTeam = styled.div`
    width: 100%;
    height: 100px;
    position: absolute;
    border: 1px solid;
    top: 194vh;
    display: flex;
    justify-content: center;
    align-items: center;

`;

export const MyTeamText = styled.span`
    font-size: 25px;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color:  rgb(73, 65, 65);

`;

//<------------------HomePAGE------------->
export const HomeMainContainer = styled.div`
    height: 90vh;
    width: 100%;
    position: absolute;
    top: 74px;
    
`;

export const HomeMain = styled.div`
    height: 400px;
    width: 500px;
    position: absolute;
    top: 220px;
    left: 50px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;

`;

export const HomeTextCon = styled.div`
    width: auto;
    height: ${(props) => props.$height || "100px"};
    display: flex;

    justify-content: center;
    align-items: ${(props) => props.$align || "center"};
  

   
`;

export const HomeSpan = styled.span`
    font-family: 'Roboto', sans-serif;
    color: ${(props) => props.$color || " #2c3d43"};
    font-size: ${(props) => props.$fontSize || "55px"};
    font-weight: 500;
    line-height: 1.6;
    text-align: justify;
    max-width : 500px ;
    word-wrap: break-word;
`;

export const HomeButton = styled.button`
    padding: 15px 30px;
    border: none;
    background-color: #2c3d43;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color:  rgb(249, 247, 247);
    cursor: pointer;
    border-radius: 5px;

    &:hover{
        opacity: 0.9;
        
        transform: scale(1.1);
      
    }
`;

export const HomeImg = styled.div`
    height: 700px;
    width: 800px;
    position: absolute;
    top: 40px;
    right: 80px;
    object-fit: cover;
`;
export const HomeImage = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
`;

export const Default = styled.div`

`;


//<-------------------------------------------------------->



//<---------MySelection-------------->




//<----------------------------------->



/* --------------------------MODAL CONTENT------------------------------ */

export const ModalMainCon= styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    
`;

export const ModalContent = styled.div`
    height: 400px;
    width: 700px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
    align-items: center;
    background-color: white;
    border-radius: 3px;


`;

export const ModalImgCon = styled.div`
    height: 400px;
    width: 300px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    background-color: white;
    border-radius: 3px;
    border: 1px solid;

`;

export const ModalInfoCon = styled.div`
    height: 400px;
    width: 400px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    align-items: center;
`;

export const AvailableJobCon = styled.div`
    height: ${props => props.$height || "40px"};
    width: 350px;
    display: flex;
    align-items: center;
    justify-content: ${props => props.$justifyCon || "start"};
    border: 1px solid;

`;


export const SelectBtnCon = styled.div`
    border: 1px solid gray;
    width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    height: auto;
    max-height: 300px;
`;


export const ModalImg = styled.img`
    height:100%;
    width: 100%;
    object-fit: cover;
    border-radius: 5px;
  

`;

export const ModalImageCon = styled.div`
    width: 93%;
    height: 45%;
    display: flex;
    justify-content: start;
    align-items: center;
    border: 1px solid;
    flex-direction: column;
    max-height: 100%;
    overflow-y:auto ;
    scrollbar-width: none; 
    -ms-overflow-style: none;
   

    &::-webkit-scrollbar {
        display: none;
    }

`;


export const ModalImageDes = styled.div`
    width: 320px;
    height: 90px;
    
`;


export const ModalSubmit = styled.button`
    background-color: #2c3d43;
    color: white;
    width: ${props => props.$width || "100px"};
    position: absolute;
    padding: 10px 11px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    border-radius: 3px;
    margin-right: 15px;
    font-size: 13px;
    font-family: 'Roboto', sans-serif;

    &:hover{
        color:rgb(255, 255, 255);
        font-size: 13.3px;
        
       
    }

    &:active{
        background-color: #2c3d43;
        color: white;
        font-size: 13.7px;
       
    
        
    }
`;





//----------------------------Login Register----------------------->


export const RegisterLoginCon = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;

    
`;

export const RegisterLoginBg = styled.div`
    height: 600px;
    width: 800px;

`;

export const RegisterLoginImg = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
`;

export const RegisterLoginContent = styled.div`
    height: ${props => props.$height || "300px"};
    width: ${props => props.$width || "380px" };
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    box-shadow: 0px 1px 4px rgb(137, 137, 134);
    background-color: white;
    border-radius: 10px;

`;

export const FormCon = styled.form`
    height: 450px;
    width: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

`;

export const RegLogCon = styled.div`
    height: 50px;
    width: 450px;
    display: flex;
    align-items: center;
    justify-content: center;

`;

export const LabelInputCon = styled.div`
    height: 70px;
    width: 450px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    justify-content: ${props => props.$justify || "space-evenly"};
    flex-direction: row;
    margin: 20px 0px;
    
`;

export const LabelInpContent = styled.div`
    height: ${props => props.$height || "70px"};
    width: ${props => props.$width || "217px"};
    border:${props => props.$border || "0.5px solid rgb(170, 169, 165) "};
    display: flex;
    align-items: start;
    justify-content: space-evenly;
    flex-direction: column;
    
    
`;


export const Label = styled.label`
    font-size: 15px;
    font-family: 'Roboto', sans-serif;
    color:rgb(55, 54, 49);
    font-weight: bold;
    margin-left: 5px;
`;

export const FormInput = styled.input`
    height: ${props => props.height || "30px"};
    width: 170px;
    width: ${props => props.width || "200px" };
    margin-left: 5px;
    border: none;
    border-bottom: 2px solid gray;
    outline: none;
    background-color: white;
    border-color:rgb(182, 180, 176);

`;

export const RegisLogIconCon = styled.div `
    height: 30px;
    width: 30px;
    border: 1px solid;
`;

export const GenderCon = styled.div`
    height: 30px;
    width: 200px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
    align-items: center;
`;


export const SubmitbuttonCon = styled.div`
    height:40px;
    width: 215px;
    display: flex;
    justify-content: end;
    align-items: center;
   
`;

export const RegLogLinkCon = styled.div`
    height: 30px;
    width: 215px;
    display: flex;
    align-items: center;
    justify-content: center;
  
`;

export const RegLogLink = styled(Link)`
    font-family: 'Roboto', sans-serif;
    color:rgb(55, 54, 49);
    font-size: 14px;
`;


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<ADMIN>>>>>>>>>>>>>>>

export const TableContainer = styled.div`
    height: auto;
    position: absolute;
    left: 15.5%;
    top: 4;
    background-color: ${props => props.$bgcolor || "#edeef0ff"};
    width: 155vh;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1) ;
  
    
`;

export const Table = styled.table`
    border-collapse: collapse;
    background-color: ${props => props.bgcolor || "rgba(255, 255, 255, 1)"};
    width: 100%;
    height: 100%;
    border: 10px;
   
    
    
`;


export const Thead = styled.thead`
    font-family: 'Roboto', sans-serif;
    color:rgb(55, 54, 49);
    font-size: 15px;
    text-align: left;
    background-color: rgba(255, 255, 255, 1);
    
`;

export const TrCell = styled.tr`
   
                
              
              
    &:nth-child(even) {
        background-color: rgba(255, 255, 255, 1);
    }
    
   
   

`;
export const JobCard = styled.div`
`;


export const JobCardContainer = styled.div``;

export const ThCell = styled.th`
    font-family: 'Roboto', sans-serif;
    color: ${props => props.$thColor || "rgba(33, 32, 32, 1)"};
    font-size: 15px;
    padding: 25px 5px;
    background-color: ${props => props.$thcolor || "white"};
    border-bottom: ${props => props.$border || "1px solid #2c3d43"} ;
    


`;

export const Tbody = styled.tbody`
    font-family: 'Roboto', sans-serif;
    color:rgb(55, 54, 49);
    font-size: 20px;
    
`;

export const TdCell = styled.td`
    font-family: 'Roboto', sans-serif;
    color: ${props => props.$tdColor || "#141414ff"};
    font-size: 14px;
    padding: 20px 8px;
    font-weight: 420;
    border: none;
    border-bottom: ${props => props.$border || "1px solid #2c3d43"} ;
    background-color: ${props => props.$tdcolor || "white"};

    &:first-child {
   
        color: ${props => props.$firstColor || "#141414ff"};
        font-weight: 500; 
    }

`;

export const UploadImage1 = styled.img`
    height: 50px;
    width: 100px;
    object-fit: cover;
`;

export const TableBtn = styled.button`
    padding: 10px 20px;
    background-color: #2c3d43;
    border: none;
    cursor: pointer;
    border: 1px solid #ffffffff;
    border-radius: 3px;
    font-size: 13px;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color:rgba(227, 231, 233, 1);
    width: ${props => props.$btnwidth || "140px"};
    margin-left: ${props => props.$margin || "none"};

    &:hover{
        opacity: 0.8;
    }

    &:active{opacity: 0.7}


`;


//------------------------------FOOTER---------------------------------------------------------->
export const FooterContainer = styled.div`
    height: 250px;
    border-top: 3px solid gray;
    position: absolute;
    top: 100vh;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
`;



export const FooterContentContainer = styled.div`
    height: 250px;
    width: 400px;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
   

  

`;

export const Footerboxes = styled.div`
    width: 400px;
    height: ${props => props.$height || "100px"};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  

`;

export const LinksContainer = styled.div`
    height: 100%;
    width: ${props => props.$width || "120px"};
    display: flex;
    justify-content: space-evenly;
    align-items: ${props => props.$align || "start"};
    flex-direction: column;

`;

export const TextContainer = styled.div`
    height: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
`;

export const FooterLogoImg = styled.img`
    height: 100px;
    width: 260px;
    object-fit: cover;
   


`;
export const JobconText = styled.div`
    height: 80px;
    width: 90%;

`;


export const FooterIconCon = styled.div`
    width: 150px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export const FooterIcon = styled.i`
    font-size: 21px;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color:rgb(253, 253, 253);
    background-color: #2c3d43;

`;





//<------------------------APPLYRESUME------------------->

export const DisplayResume = styled.div`
    max-height: 220px; 
    overflow-y: auto; 
    scrollbar-width: none; 
    -ms-overflow-style: none;
    height: 240px;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const UploadCon = styled.div`
    width: 350px;
    height: 290px;
    border: 1px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const UploadImage = styled.img `
    width: 340px;
    height: 100px;
    margin: 2px 0px;
    object-fit: cover;
  
`;

export const UploadBtn = styled.button `
    background-color: #2c3d43;
    color: white;
    width: ${props => props.$width || "380px"};
    position: absolute;
    padding: 12px 11px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    border-radius: 3px;
    font-size: 13px;
    font-family: 'Roboto', sans-serif;

    &:hover{
        color:rgb(226, 225, 221);
        font-size: 13.3px;
        
       
    }

    &:active{
        font-size: 13.7px;
       
    
        
    }


`;


export const TextSpanAlert = styled.span `
    color: red;
    font-family: 'Roboto', sans-serif;
    font-size: 13px;

    

`;

export const TextSpanAlertCon = styled.div`
    height: 10px;
`;

export const SubmitResumeCon = styled.div`
    height: 150px;
    width: 380px;
    margin: 7px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 2px solid gray;
    border-radius: 3px;

   
`;

export const JobSelectionCon = styled.div`
    width: 380px;
    height: 150px;
    border-top: 2px solid ;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    align-items: start;

`;


export const JobPosition = styled.input`
    display: none;
`;

export const JobPositionPick = styled.div` 
    padding: 8px 16px;
    border: 1px solid #2c3d43  ;
    border-radius: 4px;
    cursor: pointer;
    width: 180px;
    background-color: white ;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
`;

export const JobListedCon = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #ccc;
    border-top: none;
    background-color: white;
    max-height: 200px;
    overflow-y:auto ;
    z-index: 1000;
    scrollbar-width: none; 
    -ms-overflow-style: none;
    height: 100px;

    &::-webkit-scrollbar {
        display: none;
    }

`;



export const SelectCon = styled.div`
    position: relative;
    display: inline-block;
    
`;

export const JobListed = styled.div`
    padding: 8px 16px;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;

    &:hover{
        background-color: #2c3d43;
        color: white;
    }
`;


export const FileCon = styled.div`
    height: ${props => props.$height || "40px"};
    padding: 0px 5px;
    width: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
    
   
`;

export const FileSpan = styled.span`
    max-width: 350px;
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    margin-left: 10px; 
    color: ${props => props.$color || "#333"}; 
    display: inline-block; 
    vertical-align: middle; 
    font-size: 14px;
`;

export const FileLabel = styled.label`
    padding: 8px 10px;
    background-color:  #2c3d43;
    border: none;
    color:rgb(255, 255, 255);
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #2c3d43;
    
    font-family: 'Roboto', sans-serif;

    &:hover{
        opacity: 0.8;
    }

    &:active{
        opacity: 0.7;
    }

`;

export const SubmitCon = styled.div`
    width: 360px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
`;


export const BackgroundColor = styled.div`
    background-color:rgb(37, 42, 45);
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

`;
 


//CHART CONTAINER ----------------


export const ChartContainer = styled.div`
    position: absolute;
    left: 15.3%;
    width: 82%;
    height: auto;
    padding: 20px;
    background-color: #edeef0ff;
    top: 0;

`;

export const ChartCard = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 15px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1) ;
  
`;

export const ChartCards = styled.div`
    background-color:rgba(255, 255, 255, 1);
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1) ;
    text-align: center;
    padding: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
`;



export const UpperTextCon = styled.div`
    width: ${props => props.$width || "100%" };
    height: 40px;
    margin: 5px;
    border: 1px solid gray;
    display: flex;
    justify-content: center;
    align-items: center;
`;



export const UpperChartCon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100px;
    width: 120px;

`;





export const ChartBar = styled.div`
    width: 70vh;
    height: auto;
    padding: 10px;
    margin-top: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1) ;
    
`;

export const ChartHeadCards = styled.div`
    height: 10px;
    width: 100%;
    background-color: blue;
    
`;


export const DoughContainer =  styled.div`
    height: 100px;
    margin: 10px;
    display: flex;
    justify-content: space-evenly;
    align-items: center; 
    flex-direction: row;
`;


export const ApplicantCon = styled.div`
    border: 1px solid;
    width: 178vh;
    height: 160vh;
    padding: 20px;
    top: 0;
    display: flex;
    position: absolute;
    right: 0;
    background-color: #edeef0ff;

`;
