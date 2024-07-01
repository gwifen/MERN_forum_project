import styles from "./styles.module.css"
import axios from "axios";
import React, { useEffect, useState } from "react";
import Users from "./Users";

const Main = ()=>{

    const [dane, ustawDane] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [showDetails, setDetails] = useState(true);
    const [showUsers, setUsers] = useState(false);

    const handleLogout = ()=>{
        localStorage.removeItem("token")
        window.location.reload()
    }

    const handleGetUsers = async (e) =>{
        e.preventDefault()

        //pobierz token z localStorage:
        const token = localStorage.getItem("token")
        //jesli jest token w localStorage to:
        if(token){
            try{
                //konfiguracja zapytania asynchronicznego z tokenem w naglowku:
                const config = {
                    method: 'get',
                    url:'http://localhost:8080/api/users/allUsers',
                    headers:{'Content-Type':'application/json', 'x-access-token':token}
                }
                //wyslanie zadania o dane:
                const {data: res} = await axios(config)
                //ustaw dane w komponencie za pomoca hooka useState na liste z danymi przeslanymi z serwera - jesli zostal poprawnie zweryfikowany token 
                ustawDane(res.data)//'res.data' - zawiera sparsowane dane - liste
                setUsers(!showUsers)
            }
            catch(error){
                if(error.response && error.response.status >= 400 && error.response.status <= 500){
                    localStorage.removeItem("token")
                    window.location.reload()
                }
            }
        }
    }

    const handleGetAccountDetails = async () => {
        
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const config = {
                    method: "get",
                    url: "http://localhost:8080/api/users/account",
                    headers: { "Content-Type": "application/json", "x-access-token": token }
                };


                const { data: res } = await axios(config);
                setDetails(true);
                setUsers(false);

                setUserDetails(res.data);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                }
            }
        }
    };



    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (token) {
            

            if (window.confirm("Are you sure you want to delete your account?")) {
                try {

                    const config = {
                        method: "delete",
                        url: "http://localhost:8080/api/users/delete",
                    headers: { "Content-Type": "application/json", "x-access-token": token }
                    }; 
                    console.log("Config: ", config)

                    const { data: res } = await axios(config);
                    alert(res.message);
                    localStorage.removeItem("token");
                    window.location.reload();
                } catch (error) {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        localStorage.removeItem("token");
                    }
                }
            } else { console.log("No") }

        } else { console.log("Token hasn't been find") }
    };

    const handlePosts = async (e) => {
        e.preventDefault()
        try{
            window.location="/posts"
        }catch(error){
            if(
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ){
                localStorage.removeItem("token");
            }
        }
    }
    
    useEffect(()=>{
        handleGetAccountDetails()
    }, [])


    return (
        <div className={styles.main_container}>
        <h1 className={styles.SiteName}>MySite</h1>
            <nav className={styles.navbar}>
                <button className={styles.white_btn} onClick={handlePosts}>Posts</button>
                <button className={styles.white_btn} onClick={handleGetAccountDetails}>Account</button>
            </nav>

            {showDetails ? userDetails ?
                <div className={styles.account}>
                    <h2>Account Details</h2>
                    <p>First Name: {userDetails.firstName}</p>
                    <p>Last Name: {userDetails.lastName}</p>
                    <p>Email: {userDetails.email}</p>
                    <p>ID: {userDetails._id}</p>
                    <div className={styles.second_navbar}>
                        <button className={styles.green_btn} onClick={handleGetUsers}>Users</button>
                        <button className={styles.green_btn} onClick={handleDeleteAccount}>Delete Account</button>
                        <button className={styles.green_btn} onClick={handleLogout}>Logout</button>
                    </div>
                </div> : <p></p> : <p></p>
            }

            {showUsers ? dane.length > 0 ? <Users users={dane} /> : <p>Brak użytkowników</p> : <p></p>}

        </div>
    );
}

export default Main
