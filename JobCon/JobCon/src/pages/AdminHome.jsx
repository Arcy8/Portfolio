import React from 'react'
import Applicant from '../admincomponents/Applicant'
import AdminSidebar from '../admincomponents/AdminSidebar'
import JobChart from '../admincomponents/JobChart'
import { AdminContainer } from '../components/Css2.style'
import AdminScheduleManager from '../admincomponents/AdminScheduleManager'
import { AdminScheduleCon } from '../components/Css2.style'


export default function AdminHome() {
  return (
    <AdminContainer>
        
        <AdminSidebar/>
        <JobChart/>
        <Applicant/>



        <AdminScheduleCon>
          <AdminScheduleManager/>

        </AdminScheduleCon>
   
      
        
    </AdminContainer>
  )
}
