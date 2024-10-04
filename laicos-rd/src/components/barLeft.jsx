import Cookies  from "js-cookie";
import { Link } from "react-router-dom";




export default function barLeft(){
    const userId = Cookies.get('IdUser');
    
    
    
    
    return (
        <>
        <div className="leftBar">
            <div className="left-container">
                <div className="menu">
                    <Link to='/perfil/id'>
                    <div className="user">
                        <img src=''/>
                        <h4>Soy el enlace</h4>
                    </div>
                    </Link>
                </div>
            </div>
        </div>
        </>
    );
}