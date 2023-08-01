import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";

const LoginPage = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const { isAuth, login } = authContext;

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: null,
        password: null,
    });

    //check if the user is already loggedin
    useEffect(() => {
        if (isAuth) {
            navigate("/");
        }
    }, [isAuth, navigate]);

    const validateSubmit = (e) => {
        e.preventDefault();
        const tempErrors = {
            email: !formData.email ? "Email is required" : null,
            password: !formData.password ? "Password is required" : null,
        };
        setErrors(tempErrors);

        if (Object.values(tempErrors).filter((value) => value).length) {
            return;
        }
        submitHandler(e);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    return (
        <Container maxWidth="lg" className="h-[100vh] !flex items-center justify-center my-auto">
            <Card elevation={16} className="!p-5">
                <Box
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <img src="https://megasun.bestoerp.com/files/IMG-20230702-WA0007.jpg" alt="Logo" className="w-[100px] max-h-[100px]" />
                    <Typography color="textSecondary" sx={{ mt: 2 }} variant="h6">
                        Megasun Salon
                    </Typography>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        mt: 3,
                    }}
                >
                    <form noValidate onSubmit={validateSubmit}>
                        <TextField
                            fullWidth
                            type="text"
                            name="email"
                            label="Username"
                            autoFocus
                            id="email"
                            margin="normal"
                            value={formData.email}
                            autoComplete={false}
                            onChange={(e) => {
                                setErrors({ ...errors, email: null });
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                });
                            }}
                            error={errors.email}
                            helperText={errors.email}
                        />

                        <TextField
                            fullWidth
                            autoFocus
                            type="password"
                            label="Password"
                            name="password"
                            variant="outlined"
                            id="password"
                            margin="normal"
                            value={formData.password}
                            onChange={(e) => {
                                setErrors({ ...errors, password: null });
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                });
                            }}
                            error={errors.password}
                            helperText={errors.password}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button fullWidth size="large" type="submit" variant="contained">
                                Log In
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Card>
        </Container>
    );
};

export default LoginPage;
