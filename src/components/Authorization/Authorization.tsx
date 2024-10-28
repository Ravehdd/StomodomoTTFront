import classes from "./Authorization.module.css"
import { useDispatch } from "react-redux"
import { patientSlice } from "../../store/patient.slice"
import { useRef} from "react"
export default function Authorization() {
    
    const dispatch = useDispatch()

    const login = useRef<HTMLInputElement>(null)
    const pass = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const patientPhone =String(login.current?.value);
    const patientPass = pass.current?.value;

    if (!patientPhone || !patientPass) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/v1/login/${patientPhone}/${patientPass}/`, {
            method: "GET",
            headers: { "Accept": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        const data = await response.json();

        console.log(data);

        if (data.length === 0) {
            alert("Неверный логин или пароль.");
            return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('login', patientPhone);

        dispatch(patientSlice.actions.storePatient({ patient: data }));

        window.location.href = "/"


    } catch (error) {
        console.error("Error:", error);
        alert("Произошла ошибка при попытке входа.");
    }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-[5rem]">
            <form className={classes.loginForm} onSubmit={(e) => handleSubmit(e)}>
                <h1 className="text-[#f5f5f5] text-3xl" >Вход</h1>
                <input type="text" ref={login} placeholder="login" className="loginControl m-[1rem]"/>
                <input type="password" ref={pass} placeholder="password" className="loginControl m-[1rem]"/>
                <button className={classes.loginButton}>Войти</button>

            </form>
        </div>
    )
}       