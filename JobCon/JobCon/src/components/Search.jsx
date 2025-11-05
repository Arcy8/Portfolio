import React, { useState } from 'react'
import { SearchContainer } from './Css.style'
import { FormContainer } from './Css.style'
import { Input } from './Css.style'


function Search({ setSearchQ }) {

    const [search, setSearch] = useState("")

    const handleSearch = (e)=> {
        const targetValue = e.target.value;
        e.preventDefault()
        setSearch(targetValue);
        setSearchQ(targetValue);
    }
    
  return (
    <>  

        <SearchContainer>
            <FormContainer>
               
                <Input  type="text" placeholder='Search' value={search} onChange={handleSearch}/>
                
            </FormContainer>

        </SearchContainer>

    </>
  )
}

export default Search