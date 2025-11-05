import React from 'react'
import { CardContainer, FavoriteBtn } from '../components/Css.style'
import { CompanyImg } from '../components/Css.style'
import { CompanyInfo } from '../components/Css.style'
import { CompanyInfoContainer } from '../components/Css.style'
import { SpanText } from '../components/Css.style'
import { Image } from '../components/Css.style'
import { ImgCon } from '../components/Css.style'
import Sidebar from '../components/Sidebar'
import MapCon from '../components/MapCon'
import { Hiring } from '../components/Css.style'
import Button from '../components/Button'
import { MainContainer } from '../components/Css.style'
import { CompanyContainer, HeartIcon, MySelectinTextCon, Span } from '../components/Css.style'
import Header from '../components/Header'




export default function MySelection({ favoritesJob, setFavoritesJob })  {
    const removeFavorites = (favoritesId) => {
        setFavoritesJob((prevFavorites) => prevFavorites.filter((newCompanyList) => newCompanyList.id !== favoritesId) )

    }
  return (
    <>
        <Header/>

        <Sidebar/>
        <MainContainer $mainTop="100px">
            <MySelectinTextCon>
                <Span $marginL="30px">My Selection</Span>
            </MySelectinTextCon>
            <CompanyContainer>
                {favoritesJob.length > 0 ? (
                    favoritesJob.map((favorite) => (
                        <CardContainer key={favorite.id}>
                        <ImgCon>
                        <CompanyImg>
                        <Hiring>Now Hiring</Hiring>
                        <Button btn="Apply Now"/>
                        <FavoriteBtn onClick={() => removeFavorites(favorite.id)}>
                            <HeartIcon  className="fa fa-trash" aria-hidden="true"/>
                        </FavoriteBtn>
                        
                            <Image src={favorite.images}/>
                        </CompanyImg>
                        </ImgCon>
            
                        <CompanyInfoContainer>
            
                        <CompanyInfo><SpanText size="14px" color="rgb(46, 44, 44)" fontWeight="700">{favorite.title}</SpanText> </CompanyInfo>
                        <CompanyInfo><SpanText>{favorite.description}</SpanText></CompanyInfo>
                        <CompanyInfo><SpanText color='rgb(147, 141, 141)' fontWeight="650"> <i className='fas fa-map-marker-alt'></i> {favorite.location}</SpanText> </CompanyInfo>
            
                        </CompanyInfoContainer>
            
                    </CardContainer>
                    ))
                ) : (
                    <MySelectinTextCon $width="960px" $justifyCon="center">
                        <Span $fSize="30px" >No Item</Span>
                    </MySelectinTextCon>
                )}
             
            </CompanyContainer>
        </MainContainer>
        <MapCon />
    
    </>
  )
}
