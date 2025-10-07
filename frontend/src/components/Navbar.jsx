import React, { useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
const Navbar = () => {
    const navigate = useNavigate()
    
    const [showMenu, setShowmenu] = useState(false)
    const [token, setToken] =useState(true)
    const [showDropdown, setShowDropdown] = useState(false);


  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={()=>navigate('/')} className='w-44 cursor-pointer'src={assets.logo} alt="" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
            <li className='py-1'>Home</li>
            <hr className='hidden border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto' />
        </NavLink>
        <NavLink to={'/doctors'}>
            <li className='py-1'>All Doctors</li>
            <hr className='hidden border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto' />
        </NavLink>
        <NavLink to={'/about'}>
            <li className='py-1'>About</li>
            <hr className=' hidden border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto' />
        </NavLink>
        <NavLink to={'/contact'}>
            <li className='py-1'>Contact</li>
            <hr className='hidden border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-4'>
        {
            token ?
            <div className='flex items-center gap-2 cursor-pointer relative' onClick={() => setShowDropdown(!showDropdown)}>
                <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
                <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                {showDropdown && (
                  <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20'>
                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                      <p onClick={() => { setShowDropdown(false); navigate('my-profile'); }} className='hover:text-black cursor-pointer'>My Profile</p>
                      <p onClick={() => { setShowDropdown(false); navigate('my-appointments'); }} className='hover:text-black cursor-pointer'>My Appointments</p>
                      <p onClick={() => { setShowDropdown(false); setToken(false); }} className='hover:text-black cursor-pointer'>Logout</p>
                    </div>
                  </div>
                )}

            </div>
            :<button onClick={()=>navigate('/login')}className='bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
        <img onClick={()=>setShowmenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* mobile menu */}
        <div className={`${showMenu ? 'fixed w-full': 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={()=>setShowmenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-6 font-medium text-lg mt-5 px-5'>
            <li><NavLink  onClick={()=>setShowmenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink></li>
            <li><NavLink  onClick={()=>setShowmenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink></li>
            <li><NavLink  onClick={()=>setShowmenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink></li>
            <li><NavLink  onClick={()=>setShowmenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
