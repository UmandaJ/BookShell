import React from 'react'
import {RxCross1} from 'react-icons/rx';

const SeeUserData = ({userDivData,userDiv,setuserDiv}) => {

  return (
    <>
    <div className={`${userDiv} fixed inset-0 bg-black/60 z-40`}></div>
    <div className={`${userDiv} fixed inset-0 z-50 flex items-center justify-center`}>
    <div className='bg-white rounded p-4 w-[80%] md:w-[50%] lg:w-[40%] text-zinc-800 max-h-[80vh] overflow-auto shadow-xl'>
        <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-semibold'>User Information</h1>
            <button onClick={() => setuserDiv("hidden")}>
                <RxCross1/>
            </button>
        </div>
        <div className='mt-2'>
            <label htmlFor=''>
                Username:{" "}
                <span className='font-semibold'>{userDivData.username}</span>
            </label>
        </div>
        <div className='mt-4'>
            <label htmlFor=''>
                Email:<span className='font-semibold'>{userDivData.email}</span>
            </label>
        </div>
        <div className='mt-4'>
            <label htmlFor=''>
                Address:{" "}
                <span className='font-semibold'>
                    {userDivData.address}
                </span>
            </label>
        </div>
    </div>
    </div>
    
    
    </>
  )
}
 export default SeeUserData