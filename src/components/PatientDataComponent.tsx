import React, { useEffect, useState } from 'react';
import { patientSlice } from '../store/patient.slice';
import { useAppSelector } from '../store/store';
import { useDispatch } from "react-redux"


const PatientDataComponent = () => {
    const patient = useAppSelector(patientSlice.selectors.selectAllPatient)
    const patientPhone = localStorage.getItem('login');
    const dispatch = useDispatch()
    const [clinic, setClinic] = useState("all");

    async function fetchData() {
    const response = await fetch(`http://localhost:8000/api/v1/getdata/${patientPhone}/`, 

    );
    const patientData = await response.json();
    dispatch(patientSlice.actions.storePatient({ patient: patientData }));
    }

    const handleClick = () => {
      localStorage.setItem('isAuthenticated', 'false');
      window.location.href = "/auth"
    }

    useEffect(() => {
    fetchData();
        }, []);


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClinic(event.target.value);
    };


    const uniqueClinics = Array.from(
    new Set(Object.values(patient).map((p) => p.clinic)));

    let filteredData = Object.values(patient)
    let pastAppointments = filteredData.filter(item => item.days_count > 0);
    let futureAppointments = filteredData.filter(item => item.days_count < 0);
    if (clinic !== "all") {
        filteredData = Object.values(patient)
              .filter((p) =>
                clinic
                  .toLowerCase()
                  .includes(p.clinic.toLowerCase())
              ) 
        pastAppointments = filteredData.filter(item => item.days_count > 0);
        futureAppointments = filteredData.filter(item => item.days_count < 0); 
        
    }

    function formateDate(date: string) {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit'
        };

        const dateFormatter = new Intl.DateTimeFormat('ru-RU', options);
        return dateFormatter.format(new Date(date));
        }
    function getEndTime(date: string) {
        const time = date.split('T');
        return time[1].slice(0, 5);
        }
       
    
    function handleButtonClick() {
        var result = confirm("Заказать звонок?");
        if (result) {
            window.location.href = 'https://www.google.com';
        } else {
            alert("Вы отменили действие");
        }
    } 

    function handleButtonClick2() {
        alert("Вы заказали справку");

    } 
    

    return (
        <div className='mt-10 ml-10'>
            <div className='w-1/2 flex justify-between items-center mb-10'>
            
            <button onClick={() => handleButtonClick()}>Заказать звонок</button>
            <button onClick={() => handleButtonClick2()}>Заказать справку</button>
            <button className="font-bold" onClick={() => handleClick()}>Выйти</button>

            </div>
            {patient &&
            <div>
            <label className="mr-2" >Выберите клинику</label>
            <select
                id="clinic"
                className="control mb-5"
                value={clinic}
                onChange={(event) => handleChange(event)}
                >
                <option value={"all"}>Все клиники</option>
                {uniqueClinics.map((clinic) => (
                    <option key={clinic} value={clinic.toLowerCase()}>
                        {clinic}
                    </option>
                ))}
                </select> 

                {pastAppointments.length > 0 &&
                    <div className='mb-5'>
                        <div className='mb-5'>  
                            <h1 className='text-xl mb-3'>Пациент: {pastAppointments[0].patient}</h1>
                            <p>Личный счет: {pastAppointments[0].personal_account} руб</p>
                            <p>Семейный счет: {pastAppointments[0].family_account} руб</p>
                        </div>
                        <h1 className='text-xl'>Прошедшие</h1>
                        {pastAppointments.map((p) => 
                            <div className='mb-3 ml-5'>
                                <div key={p.id} className='flex'>
                                    <p className='mr-5'>{formateDate(p.start_time)} - {getEndTime(p.end_time)}</p>
                                    {p.cancel_time && <p className='text-red-500'>Отменено: {formateDate(p.cancel_time)}</p>}
                                    
                                </div>
                                <p>{p.doctor_name}</p>
                                <p>{p.days_count} дней назад</p>
                            </div>)
                        }
                    </div>
                }

                {futureAppointments.length > 0 &&
                <div className='mb-5'>
                        <h1 className='text-xl'>Предстоящие</h1>
                        {futureAppointments.map((p) => 
                            <div className='mb-3 ml-5'>
                                <div key={p.id} className='flex'>
                                    <p className='mr-5'>{formateDate(p.start_time)} - {getEndTime(p.end_time)}</p>
                                    {p.cancel_time && <p className='text-red-500'>Отменено: {formateDate(p.cancel_time)}</p>}
                                    
                                </div>
                                <p>{p.doctor_name}</p>
                                <p>Через {p.days_count * -1} дней</p>
                            </div>)
                        }
                    </div>
                    }
                
            </div>}
        </div>
    );
};

export default PatientDataComponent;