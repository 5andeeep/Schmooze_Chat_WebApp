import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {

    const [show, setShow] = useState(false); // to show the entered password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // show password function
    const showPassword = () => setShow(!show);

    // submit form btn function
    const submitHandler = async () => {
        setLoading(true);
        // email or password are not filled
        if (!email || !password) {
            toast({
                title: 'Please fill all details!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        // otherwise, call the login API..
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };

            const { data } = await axios.post("/api/user/login", { email, password }, config);

            toast({
                title: 'Login Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chat");
        }
        catch (err) {
            toast({
                title: 'Error Occured!',
                description: err.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }


    return (
        <div>
            <VStack spacing={"5px"}>
                <FormControl id='email-login' isRequired mb={"1rem"}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder='Enter your email'
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </FormControl>
                <FormControl id='password-login' isRequired mb={"1rem"}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            placeholder='Enter your password'
                            type={show ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <InputRightElement width={"4.5rem"}>
                            <Button h={"1.7rem"} size={"sm"} onClick={showPassword}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <Button
                    colorScheme='green'
                    width={"100%"}
                    mt={"20px"}
                    onClick={submitHandler}
                    isLoading={loading}
                >
                    Login
                </Button>
                <Button
                    variant={"solid"}
                    colorScheme='yellow'
                    width={"100%"}
                    mt={"20px"}
                    onClick={() => {
                        setEmail("guest@example.com")
                        setPassword("123456")
                    }}
                >
                    Guest Login
                </Button>
            </VStack>
        </div>
    )
}

export default Login