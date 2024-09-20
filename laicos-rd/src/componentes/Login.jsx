import "../css/Login.css";
import pic from "../img/pic.avif";

const Login = () => {
  const bienvenida = () => {
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 12) {
      return "Good Morning";
    } else if (hora >= 12 && hora < 18) {
      return "Good Afternoon";
    } else if (hora >= 18 && hora < 22) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  return (
    <section className="login-contenedor d-flex justify-content-between shadow-lg rounded-3 overflow-hidden">

      <div className="imagen-login">
        
        <img src={pic} alt="" className="img-fluid" />

      </div>

      <div className="bg-white p-4">

        <p className="fs-5">Hello!</p>
        <p className="fs-5">{bienvenida()}</p>

        <form className="formulario-login d-flex flex-column px-5 py-4 ">
          <h2 className="text-center fs-5">Login your account</h2>

          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username"/>

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password"/>

          <p className="forget-password" id="forget-password">
            Forget password?
          </p>

          <button type="submit" className="mt-2 mb-3 btn btn-primary mx-4 fs-5">
            Login
          </button>

          <p className="text-center">Create Account</p>

        </form>

      </div>

    </section>
  );
};

export default Login;