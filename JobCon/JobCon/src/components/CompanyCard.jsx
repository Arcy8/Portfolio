import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContainer, CompanyImg, CompanyInfo, CompanyInfoContainer, SpanText, Image, Buttons, Hiring, FavoriteBtn, HeartIcon, ImgCon } from './Css.style';
import Modal from '../pages/Modal';

function CompanyCard({ props, MyFavorites }) {
  const [modal, setModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setIsLoggedIn(!!storedEmail);
  }, []);

  const openModal = () => {
    if (isLoggedIn) {
      setModal(true);
    } else {
      alert("Please log in to apply for this job");
      navigate("/login");
    }
  };

  const handleFavorite = () => {
    if (isLoggedIn) {
      MyFavorites(props);
    } else {
      alert("Please log in to add to favorites");
      navigate("/login");
    }
  };

  return (
    <>
      <CardContainer>
        <ImgCon>
          <CompanyImg>
            <Hiring>Now Hiring</Hiring>
            <Buttons onClick={openModal}>Apply Now</Buttons>
            <FavoriteBtn onClick={handleFavorite}>
              <HeartIcon className="fa fa-star" aria-hidden="true" />
            </FavoriteBtn>
            <Image src={props.images} />
          </CompanyImg>
        </ImgCon>
        <CompanyInfoContainer>
          <CompanyInfo><SpanText size="14px" color=" #2c3d43" fontWeight="700">{props.title}</SpanText></CompanyInfo>
          <CompanyInfo><SpanText color=' #2c3d43'>{props.type}</SpanText></CompanyInfo>
        </CompanyInfoContainer>
      </CardContainer>
      <Modal show={modal} close={closeModal} desc={props} />
    </>
  );
}

export default CompanyCard;