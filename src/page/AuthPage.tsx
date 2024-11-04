import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/fetchData";
import { useAlert } from '../context/AlertContext';
import CustomForm from "../component/CustomForm";
import backgroundImage from "../assets/image/movie/backdrop/veIyxxi5Gs8gvztLEW1Ysb8rrzs.jpg"

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const { setAlert } = useAlert();
  const [formData, setFormData] = useState<Record<string, string>>(
    isLogin
      ? { email: "", password: ""}
      : { email: "", password: "", username: "" }
  );
  const fields = isLogin
    ? [
        {
          name: "email",
          type: "email",
          placeholder: t("authPage.email"),
          validation: (value: string) => /^\S+@\S+\.\S+$/.test(value),
          errorMessage: t("authPage.invalidEmail"),
        },
        {
          name: "password",
          type: "password",
          placeholder: t("authPage.password"),
          validation: (value: string) => value.length > 5,
          errorMessage: t("authPage.passwordTooShort"),
        },
      ]
    : [
        {
          name: "username",
          type: "text",
          placeholder: t("authPage.username"),
          validation: (value: string) => value.length > 5,
          errorMessage: t("authPage.usernameTooShort"),
        },
        {
          name: "email",
          type: "email",
          placeholder: t("authPage.email"),
          validation: (value: string) => /^\S+@\S+\.\S+$/.test(value),
          errorMessage: t("authPage.invalidEmail"),
        },
        {
          name: "password",
          type: "password",
          placeholder: t("authPage.password"),
          validation: (value: string) => value.length > 5,
          errorMessage: t("authPage.passwordTooShort"),
        },
      ];

  const handleSubmit = async (data: Record<string, string>) => {
    setFormData(data);
    try {
      const userInfo = isLogin
        ? await loginUser({ email: data.email, password: data.password })
        : await registerUser({ username: data.username, email: data.email, password: data.password });

      sessionStorage.setItem("user", JSON.stringify(userInfo));
      setAlert({ message: isLogin ? t("authPage.loginSuccess") : t("authPage.registerSuccess"), type: "success"});
      navigate("/");
    } catch {
      setAlert({ message: isLogin ? t("authPage.loginFailed") : t("authPage.registerFailed"), type: "error" });
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/account");
    }
  }, [navigate]);

  return (
    <div className="relative h-screen w-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-black bg-opacity-90 p-8 rounded-md shadow-lg max-w-md w-full">
          <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          {isLogin ? t("authPage.login") : t("authPage.register")}
          </h2>
          <CustomForm
            fields={fields}
            onSubmit={handleSubmit}
            submitButtonText={isLogin ? t("authPage.login") : t("authPage.register")}
            formData={formData}
            setFormData={setFormData}
          />

          <div className="mt-4">
            <p className="text-white italic">
              {isLogin ? t("authPage.noAccount") : t("authPage.haveAccount")}
            </p>
            <Link to={isLogin ? "/register" : "/login"}>
              <button className="w-full border border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-md mt-4">
                {isLogin ? t("authPage.register") : t("authPage.login")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
